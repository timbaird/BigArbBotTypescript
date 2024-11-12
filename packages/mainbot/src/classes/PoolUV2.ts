import IPool from "../../../mainbot/src/interfaces/IPool"
import IPriceData from "../../../mainbot/src/interfaces/IPriceData";
import { Contract, ethers } from "ethers";
import ListenerTracker from "../../../mainbot/src/classes/ListenerTracker";
import UniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import ISwapEventData from "../interfaces/ISwapEventData";
import ArbUtilities from "./ArbUtilities";
const { abi: UniswapV2PairABI } = UniswapV2Pair;

class PoolUV2 implements IPool{
    name: string;
    pairName: string;
    factory_addr: string;
    router_addr: string;
    pool_addr: string;
    fee: number;
    arbInputSizes: number[];
    tokenDecimals: number[];
    pool: Contract;
    priceData: IPriceData[];
    utils: ArbUtilities;


    constructor(_pairName: string, DATA: any, _arbInputSizes: number[], _tokenDecimals: number[], _utils:ArbUtilities) {
        this.pairName = _pairName;
        this.name = DATA["NAME"];
        this.factory_addr = DATA["FACTORY_ADDR"];
        this.router_addr = DATA["ROUTER_ADDR"];
        this.pool_addr = DATA["PAIR_ADDR"];
        this.fee = DATA["FEE"];
        this.tokenDecimals = _tokenDecimals;
        this.arbInputSizes = _arbInputSizes;
        this.utils = _utils;
        this.pool = new Contract(this.pool_addr, UniswapV2PairABI, _utils.provider);
        this.priceData = [];
        
    }

    async loadPrices(): Promise<void> {
        return new Promise((resolve) => { 
            console.log(`${this.name} exchange load prices executing, no logic written yet`);
            setTimeout(() => { resolve() }, 1000);
        })
    }

    getPrices(): IPriceData[] {
        return this.priceData;        
    }

    startSwapListener(_tracker: ListenerTracker) {
        _tracker.addListener(this.name, this.pool, 'Swap', (sender, amount0In, amount1In, amount0Out, amount1Out, to) => { this.handleSwapEvent(); })
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

export default PoolUV2;