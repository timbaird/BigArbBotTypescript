import IPool from "../interfaces/IPool"
import IPriceData from "../interfaces/IPriceData";
import { Contract, ethers, parseUnits } from "ethers";
import ListenerTracker from "./ListenerTracker";
import KyberswapDmmPoolAbi from '../../../../../abis/kyberDMMPoolABI.json';
import KyberswapDmmRouterAbi from '../../../../../abis/kyberDmmRouterABI.json';
import ISwapEventData from "../interfaces/ISwapEventData";
import IGetAmountsInParams from "../interfaces/IGetAmountsInParams";
import IGetAmountsOutParams from "../interfaces/IGetAmountsOutParams";
import ArbUtilities from "./ArbUtilities";
import ArbToken from "./ArbToken";

class PoolKyberClassic implements IPool{
    name: string;
    protocol: string = "KYBERCLASSIC";
    pairName: string;
    tokens: ArbToken[];
    factory_addr: string;
    router_addr: string;
    router: Contract;
    pool_addr: string;
    fee: number;
    arbInputSizes: number[];
    pool: Contract;
    priceData: IPriceData[];
    utils: ArbUtilities;
    currentlyLoadingPrices: Boolean = false;


    constructor(_pairName: string, DATA: any, _tokens: ArbToken[], _arbInputSizes: number[], _utils: ArbUtilities) {
        this.pairName = _pairName;
        this.name = DATA["NAME"];
        this.pool_addr = DATA["POOL_ADDR"];
        this.fee = DATA["FEE"];
        this.factory_addr = DATA["FACTORY_ADDR"];
        this.router_addr = DATA["ROUTER_ADDR"];
        this.tokens = _tokens;
        this.arbInputSizes = _arbInputSizes;
        this.utils = _utils;
        //

        this.router = new Contract(this.router_addr, KyberswapDmmRouterAbi, this.utils.provider);

        this.pool = new Contract(this.pool_addr, KyberswapDmmPoolAbi, _utils.provider);
        this.priceData = [];
    }

    async loadPrices(): Promise<void> {
        this.currentlyLoadingPrices = true;
        try {
            // reset existing priceData
            this.priceData.length = 0;

            // set up for the multicall
            const targets: string[] = [];  // the addresses the multicall functions are being directed to
            const data: any[] = []; // the necoded function data for each function
            let amt: number; // human readable - token0 amount in / out depending on whether see side ot buy side
            let parsedAmt: bigint; // bigint / wei - token0 amount in / out depending on whether see side ot buy side
            
            // for each of the arb Input Sizes we are tracking
            for (let i = 0; i < this.arbInputSizes.length; i++) {
                
                // get the amount
                amt = this.arbInputSizes[i];
                // parse the amount to wei
                parsedAmt = parseUnits(amt.toString(), this.tokens[0].decimals);

                // set up for getAmountsOut - purchase token 1 price  (denominated in token0)
                targets.push(this.router_addr);
                const encodedOut: any = this.router.interface.encodeFunctionData("getAmountsOut", [parsedAmt, [this.pool_addr], [this.tokens[0].address, this.tokens[1].address]]);
                data.push(encodedOut);
                
                // set up for getAmountsIn - selling  token 1 price  (denominated in token0)
                targets.push(this.router_addr);
                const encodedIn: any = this.router.interface.encodeFunctionData("getAmountsIn", [parsedAmt, [this.pool_addr], [this.tokens[1].address, this.tokens[0].address]]);
                data.push(encodedIn);

            }
            console.log(targets.length);
            console.log(data.length);

            console.log(4);
            // this should get the price data in a single call
            const results = await this.utils.multicall.multicall.staticCall(targets, data);
            console.log(5);
            console.log(`number of results: ${results.length}`);

            for (let i = 0; i < results.length; i += 2) {
                
                const decodedIn = this.router.interface.decodeFunctionResult("getAmountsOut", results[i]);
                const decodedOut = this.router.interface.decodeFunctionResult("getAmountsIn", results[i + 1]);
                let amt: number = 0;

                // find the correct arb input soze for the 
                if (i % 2 == 0) {
                    amt = this.arbInputSizes[i / 2];
                } else {
                    amt = this.arbInputSizes[(i - 1) / 2];
                }
                parsedAmt = parseUnits(amt.toString(), this.tokens[0].decimals);

                //console.log(`${typeof(10n)} - ${typeof (this.tokenDecimals[1])} `);
                const decimalShift: bigint = 10n ** BigInt(this.tokens[1].decimals);
                
                const priceIn: number = (parseFloat(amt.toString()) / parseFloat(decodedIn[0][1].toString())) * parseFloat(decimalShift.toString());
                const priceOut: number = (parseFloat(amt.toString()) / parseFloat(decodedOut[0][0].toString())) * parseFloat(decimalShift.toString());


                this.priceData.push({ "direction": "BUY", "token0Amt": amt, "token0AmtWei": parsedAmt, "token1AmtWei": decodedIn[0][1], "price": priceIn });
                this.priceData.push({ "direction": "SELL", "token0Amt": amt, "token0AmtWei": parsedAmt, "token1AmtWei": decodedOut[0][0], "price": priceOut });

            }
        } catch (ex: any) {
            console.log(`error pool in ${this.pairName} - ${this.name} : ${ex.message}`);
        } finally {
            this.currentlyLoadingPrices = false;
        }
        //just for validating price data has loaded correctly
        
        // console.log(`KyberClassic ${this.name} DmmRouter price data loaded`);
        // for (let fuckyou = 0; fuckyou < this.priceData.length; fuckyou++){
        //     console.log(`${this.priceData[fuckyou].direction} ${this.priceData[fuckyou].amt}  ${this.priceData[fuckyou].price}`);
        // }
    }

    getPrices(): IPriceData[] {
        return this.priceData;        
    }

    startSwapListener(_tracker: ListenerTracker) {
        _tracker.addListener(this.pairName, this.name, this.pool, 'Swap', (sender, amount0In, amount1In, amount0Out, amount1Out, to) => { this.handleSwapEvent(); })
        this.utils.logger.log('info',`starting listener on ${this.name}`);
    }

    async handleSwapEvent(): Promise<void> {
        const aest = new Date().toLocaleString();
        console.log(`SWAP event detected on ${this.name} at ${aest}`);
        this.utils.logger.log('info', `SWAP event detected on ${this.name} at ${aest}`);
        await this.loadPrices();
        const data: ISwapEventData = {pairName: this.pairName}
        this.utils.swapEmitter.emit("internalSwapEvent", data);
    }
}

export default PoolKyberClassic;