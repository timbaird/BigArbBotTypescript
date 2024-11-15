import IPool from "../../../mainbot/src/interfaces/IPool"
import IPriceData from "../../../mainbot/src/interfaces/IPriceData";
import { Contract, ethers, parseUnits } from "ethers";
import ListenerTracker from "../../../mainbot/src/classes/ListenerTracker";
import UniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import UniswapV2Router from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
import ISwapEventData from "../interfaces/ISwapEventData";
import IGetAmountsInParams from "../interfaces/IGetAmountsInParams";
import IGetAmountsOutParams from "../interfaces/IGetAmountsOutParams";
import ArbUtilities from "./ArbUtilities";
import ArbToken from "./ArbToken";
const { abi: UniswapV2PairABI } = UniswapV2Pair;

class PoolUV2 implements IPool{
    name: string;
    protocol: string = "UNISWAPV2";
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
        this.pool_addr = DATA["PAIR_ADDR"];
        this.fee = DATA["FEE"];
        this.factory_addr = DATA["FACTORY_ADDR"];
        this.router_addr = DATA["ROUTER_ADDR"];
        this.tokens = _tokens;
        this.arbInputSizes = _arbInputSizes;
        this.utils = _utils;
        const { abi: RouterABI } = UniswapV2Router;
        this.router = new Contract(this.router_addr, RouterABI, this.utils.provider);
        this.pool = new Contract(this.pool_addr, UniswapV2PairABI, _utils.provider);
        this.priceData = [];
        this.utils.logger.log("info", `POOLUV2.constructor : executed for ${this.name} - ${this.pairName}`);
    }

    async loadPrices(): Promise<void> {
        this.utils.logger.log("info", `POOLUV2.loadPrices called ${this.name}`);
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
                const encodedOut: any = this.router.interface.encodeFunctionData("getAmountsOut", [parsedAmt, [this.tokens[0].address, this.tokens[1].address]]);
                data.push(encodedOut);

                // set up for getAmountsIn - selling  token 1 price  (denominated in token0)
                targets.push(this.router_addr);
                const encodedIn: any = this.router.interface.encodeFunctionData("getAmountsIn", [parsedAmt, [this.tokens[1].address, this.tokens[0].address]]);
                data.push(encodedIn);

            }
        
            // this should get the price data in a single call
            const results = await this.utils.multicall.multicall.staticCall(targets, data);
        
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

                const decimalShift: bigint = 10n ** BigInt(this.tokens[1].decimals);
            
                const priceIn: number = (parseFloat(amt.toString()) / parseFloat(decodedIn[0][1].toString())) * parseFloat(decimalShift.toString());
                const priceOut: number = (parseFloat(amt.toString()) / parseFloat(decodedOut[0][0].toString())) * parseFloat(decimalShift.toString());

                this.priceData.push({ "direction": "BUY", "token0Amt": amt, "token0AmtWei": parsedAmt, "token1AmtWei": decodedIn[0][1], "price": priceIn });
                this.priceData.push({ "direction": "SELL", "token0Amt": amt, "token0AmtWei": parsedAmt, "token1AmtWei": decodedOut[0][0], "price": priceOut });
            }
        } catch (ex: any){
            
        } finally {
            this.currentlyLoadingPrices = false;
        }
        this.utils.logger.log("info", `POOLUV2.loadPrices completed - new price data loaded for ${this.name} priceData length: ${this.priceData.length}`);

        //just for validating price data has loaded correctly
        
        // console.log(`PoolUV2 ${this.name} RouterV2 price data loaded`);
        // for (let fuckyou = 0; fuckyou < this.priceData.length; fuckyou++){
        //     console.log(`${this.priceData[fuckyou].direction} ${this.priceData[fuckyou].amt}  ${this.priceData[fuckyou].price}`);
        // }

    }

    getPrices(): IPriceData[] {
        return this.priceData;        
    }

    startSwapListener(_tracker: ListenerTracker) {
        _tracker.addListener(this.pairName, this.name, this.pool, 'Swap', (sender, amount0In, amount1In, amount0Out, amount1Out, to) => { this.handleSwapEvent(); })
        this.utils.logger.log('info',`POOLUV2.startSwapListener : starting listener on ${this.name}`);
    }

    async handleSwapEvent(): Promise<void> {
        const aest = new Date().toLocaleString();
        this.utils.logger.log("info", `POOLUV2: SWAP event detected on ${this.name} at ${aest}`);
        if (!this.currentlyLoadingPrices)
            await this.loadPrices();
        const data: ISwapEventData = {pairName: this.pairName}
        this.utils.swapEmitter.emit("internalSwapEvent", data);
    }
}

export default PoolUV2;