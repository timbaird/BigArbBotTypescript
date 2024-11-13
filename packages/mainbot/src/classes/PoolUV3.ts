import IPool from "../interfaces/IPool"
import IPriceData from "../interfaces/IPriceData";
import { Contract, ethers, parseUnits, formatUnits, BlobLike } from "ethers";
import ListenerTracker from "./ListenerTracker";
import UniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import UniswapQuoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
const { abi: QuoterABI } = UniswapQuoter;
import UniswapQuoter2 from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json';
const { abi: Quoter2ABI } = UniswapQuoter2;
import ISwapEventData from "../interfaces/ISwapEventData";
import IQuoteExactInputSingleParams from "../interfaces/IQuoteExactInputSingleParams";
import IQuoteExactOutputSingleParams from "../interfaces/IQuoteExactOutputSingleParams";
import ArbUtilities from "./ArbUtilities";
import ArbToken from "./ArbToken";

const { abi: UniswapV3PoolABI } = UniswapV3Pool;

class PoolUV3 implements IPool{
    name: string;
    protocol: string = "UNISWAPV3";
    pairName: string;
    tokens: ArbToken[];
    factory_addr: string;
    router_addr: string;
    router_version: number;
    quoter_addr: string;
    quoter_version: number;
    quoter: Contract;
    pool_addr: string;
    pool: Contract;
    fee: number;
    arbInputSizes: number[];
    priceData: IPriceData[];
    utils: ArbUtilities;
    currentlyLoadingPrices: Boolean = false;

    constructor(_pairName: string, DATA: any, _tokens: ArbToken[], _arbInputSizes: number[], _utils:ArbUtilities) {
        this.pairName = _pairName;
        this.name = DATA["NAME"];
        this.factory_addr = DATA["FACTORY_ADDR"];
        this.tokens = _tokens;
        this.utils = _utils;

        if (DATA["SWAP_ROUTER2_ADDR"] !== null) {
            this.router_addr = DATA["SWAP_ROUTER2_ADDR"];
            this.router_version = 2;
        } else {
            this.router_addr = DATA["SWAP_ROUTER_ADDR"];
            this.router_version = 1;
        }

        if (DATA["QUOTER2_ADDR"] !== null) {
            this.quoter_addr = DATA["QUOTER2_ADDR"];
            this.quoter_version = 2;
            this.quoter = new Contract(this.quoter_addr, Quoter2ABI, this.utils.provider)
        } else {
            this.quoter_addr = DATA["QUOTER_ADDR"];
            this.quoter_version = 1;
            this.quoter = new Contract(this.quoter_addr, QuoterABI, this.utils.provider)
        }
        
        this.pool_addr = DATA["POOL_ADDR"];
        this.fee = DATA["FEE"];

        this.arbInputSizes = _arbInputSizes;

        this.pool = new Contract(this.pool_addr, UniswapV3PoolABI, _utils.provider);
        this.priceData = [];

        this.utils.logger.log("info", `POOLUV3 constructor executed for ${this.name} - ${this.pairName}`);
    }

    async loadPrices(): Promise<void> {
        this.utils.logger.log("info", `POOLUV3.loadPrices called ${this.name}`);
        this.currentlyLoadingPrices = true;
        try {
            if (this.quoter_version == 1) {
                await this.loadPricesQuoter1();
            } else if (this.quoter_version == 2) {
                await this.loadPricesQuoter2()
            } else {
                throw new Error(`POOLUV3.loadPrices: Invalid quoter version in ${this.name} - ${this.pairName}`)
            }
        } catch (ex: any) {
            this.utils.logger.log("info", ex.message, true);
        } finally {
            this.currentlyLoadingPrices = false;
        }
    }

    async loadPricesQuoter1(): Promise<void>{
        this.utils.logger.log("info", `POOLUV3.loadPricesQuoter1: called ${this.name}`);
        return new Promise((resolve) => { 
            this.utils.logger.log("info", `POOLUV3.loadPricesQuoter1 ${this.name} no logic written yet`);
            setTimeout(() => { resolve() }, 1000);
        })
    }

    async loadPricesQuoter2(): Promise<void>{
        this.utils.logger.log("info", `POOLUV3.loadPricesQuoter2 called ${this.name}`);
        // reset existing priceData
        this.priceData.length = 0;

        // set up for the multicall
        const data: any[] = [];
        const targets: string[] = [];
        let amt: bigint;

        // for each of the arb Input Sizes we are tracking
        for (let i = 0; i < this.arbInputSizes.length; i++){

            amt = parseUnits(this.arbInputSizes[i].toString(), this.tokens[0].decimals);

            // set up params for getting the price to buy token 1 (denominated in token0)
            const paramsIn: IQuoteExactInputSingleParams = {
                tokenIn: this.tokens[0].address,
                tokenOut: this.tokens[1].address,
                amountIn: amt,
                fee: this.fee.toString(),
                sqrtPriceLimitX96: '0'
            }

            targets.push(this.quoter_addr);
            const encodedIn: any = this.quoter.interface.encodeFunctionData("quoteExactInputSingle", [paramsIn]);
            data.push(encodedIn);

            // set up params for getting the price to sell token 1 (denominated in token0)
            const paramsOut: IQuoteExactOutputSingleParams = {
                tokenIn: this.tokens[1].address,
                tokenOut: this.tokens[0].address,
                amount: amt,
                fee: this.fee.toString(),
                sqrtPriceLimitX96: '0'
            }

            targets.push(this.quoter_addr);
            const encodedOut: any = this.quoter.interface.encodeFunctionData("quoteExactOutputSingle", [paramsOut]);
            data.push(encodedOut);

        }

        // this should get the price data in a single call
        const results = await this.utils.multicall.multicall.staticCall(targets, data);

        for (let i = 0; i < results.length; i += 2){
            
            const decodedIn = this.quoter.interface.decodeFunctionResult("quoteExactInputSingle", results[i]);
            const decodedOut = this.quoter.interface.decodeFunctionResult("quoteExactOutputSingle", results[i + 1]);

            let amt: number = 0;

            // find the correct arb input soze for the 
            if (i % 2 == 0) {
                amt = this.arbInputSizes[i/2];
            } else {
                amt = this.arbInputSizes[(i-1)/2];
            }

            // data comes out in following format
            // index 0 => uint256 either amountIn or AmountOut depending on which funciton was called
            // index 1 => uint160 sqrtPriceX96After
            // index 2 => initializedTicksCrossedList
            // index 3 => gas estimate

            const decimalShift: bigint = 10n ** BigInt(this.tokens[1].decimals);
            
            const priceIn: number = (parseFloat(amt.toString()) / parseFloat(decodedIn[0].toString())) * parseFloat(decimalShift.toString());
            const priceOut: number = (parseFloat(amt.toString()) / parseFloat(decodedOut[0].toString())) * parseFloat(decimalShift.toString());

            this.priceData.push({ "direction": "BUY", "amt": amt, "price": priceIn });
            this.priceData.push({ "direction": "SELL", "amt": amt, "price": priceOut });

        }

        this.utils.logger.log("info", `POOLUV3.loadPricesQuoter2 completed - new price data loaded for ${this.name}`);
        
        //just for validating price data has loaded correctly

        // console.log(`PoolUV3 ${this.name} Quoter 2 price data loaded`);
        // for (let fuckyou = 0; fuckyou < this.priceData.length; fuckyou++){
        //     console.log(`${this.priceData[fuckyou].direction} ${this.priceData[fuckyou].amt}  ${this.priceData[fuckyou].price}`);
        // }  
    }

    getPrices(): IPriceData[] {
        return this.priceData;        
    }

    startSwapListener(_tracker: ListenerTracker) {
        
        _tracker.addListener(this.name, this.pool, 'Swap', (sender, recipeint, amount0, amount1, sqrtPriceX96) => { this.handleSwapEvent(); })
        this.utils.logger.log('info',`POOLUV3.startSwapListener : starting listener on ${this.name}`);
       
    }

    async handleSwapEvent(): Promise<void> {
        const aest = new Date().toLocaleString();
        this.utils.logger.log("info", `POOLUV3: SWAP event detected on ${this.name} at ${aest}`);
        if (!this.currentlyLoadingPrices)
            await this.loadPrices();
        else
            this.utils.logger.log("info", `POOLUV3: new price data already currently loading for  ${this.name}`);

        const data: ISwapEventData = {pairName: this.pairName}
        this.utils.swapEmitter.emit("internalSwapEvent", data);
    }
}

export default PoolUV3;