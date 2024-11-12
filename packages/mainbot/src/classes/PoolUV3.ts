import IPool from "../interfaces/IPool"
import IPriceData from "../interfaces/IPriceData";
import { Contract, ethers } from "ethers";
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

const { abi: UniswapV3PoolABI } = UniswapV3Pool;

class PoolUV3 implements IPool{
    name: string;
    pairName: string;
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
    tokenDecimals: number[];
    priceData: IPriceData[];
    utils: ArbUtilities;

/*

                {
                    "PROTOCOL": "UNISWAPV3",
                    "NAME": "UNISWAP_V3_500",
                    "FACTORY_ADDR": "0x1F98431c8aD98523631AE4a59f267346ea31F984",
                    "SWAP_ROUTER2_ADDR": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
                    "QUOTER2_ADDR":"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
                    "POOL_ADDR": "0x45dDa9cb7c25131DF268515131f647d726f50608",
                    "FEE": 500
                },
                {
                    "NAME": "SUSHISWAP_3000",
                    "FACTORY_ADDR": "0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2",
                    "SWAP_ROUTER2_ADDR": null
                    "SWAP_ROUTER_ADDR": "0x0aF89E1620b96170e2a9D0b68fEebb767eD044c3",
                    "QUOTER2_ADDR":"0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
                    "POOL_ADDR": "0x1b0585Fc8195fc04a46A365E670024Dfb63a960C",
                    "FEE": 3000
                }

*/



    constructor(_pairName: string, DATA: any, _arbInputSizes: number[], _tokenDecimals: number[], _utils:ArbUtilities) {
        this.pairName = _pairName;
        this.name = DATA["NAME"];
        this.factory_addr = DATA["FACTORY_ADDR"];
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

        this.tokenDecimals = _tokenDecimals;
        this.arbInputSizes = _arbInputSizes;

       
        this.pool = new Contract(this.pool_addr, UniswapV3PoolABI, _utils.provider);
        this.priceData = [];
        
    }

    async loadPrices(): Promise<void> {
        try {
            if (this.quoter_version == 1) {
                await this.loadPricesQuoter1();
            } else if (this.quoter_version == 2) {
                await this.loadPricesQuoter2()
            } else {
                throw new Error(`Invalid quoter version in ${this.name} - ${this.pairName}`)
            }
        } catch (ex: any) {
            console.log(ex.message);
        }

        // return new Promise((resolve) => { 
        //     console.log(`${this.name} exchange load prices executing, no logic written yet`);
        //     setTimeout(() => { resolve() }, 1000);
        // })
    }

    async loadPricesQuoter1(): Promise<void>{
        return new Promise((resolve) => { 
            console.log(`${this.name} exchange load prices executing, no logic written yet`);
            setTimeout(() => { resolve() }, 1000);
        })

    }

    async loadPricesQuoter2(): Promise<void>{
        return new Promise((resolve) => { 
            console.log(`${this.name} exchange load prices executing, no logic written yet`);
            setTimeout(() => { resolve() }, 1000);
        })
        
    }





    getPrices(): IPriceData[] {
        return this.priceData;        
    }

    startSwapListener(_tracker: ListenerTracker) {
        
        _tracker.addListener(this.name, this.pool, 'Swap', (sender, recipeint, amount0, amount1, sqrtPriceX96) => { this.handleSwapEvent(); })
        this.utils.logger.log('info',`starting listener on ${this.name}`);
       
    }

    async handleSwapEvent(): Promise<void> {
        const aest = new Date().toLocaleString();
        console.log(`SWAP event detected on ${this.name} at ${aest}`);
        this.utils.logger.log('info', `SWAP event detected on ${this.name} at ${aest}`);
        await this.loadPrices();
        const data: ISwapEventData = {pairName: this.name}
        this.utils.swapEmitter.emit("internalSwapEvent", data);
    }
}

export default PoolUV3;