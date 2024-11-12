"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const IUniswapV2Pair_json_1 = __importDefault(require("@uniswap/v2-core/build/IUniswapV2Pair.json"));
const { abi: UniswapV2PairABI } = IUniswapV2Pair_json_1.default;
class PoolUV2 {
    constructor(_pairName, DATA, _arbInputSizes, _tokenDecimals, _utils) {
        this.pairName = _pairName;
        this.name = DATA["NAME"];
        this.factory_addr = DATA["FACTORY_ADDR"];
        this.router_addr = DATA["ROUTER_ADDR"];
        this.pool_addr = DATA["PAIR_ADDR"];
        this.fee = DATA["FEE"];
        this.tokenDecimals = _tokenDecimals;
        this.arbInputSizes = _arbInputSizes;
        this.utils = _utils;
        this.pool = new ethers_1.Contract(this.pool_addr, UniswapV2PairABI, _utils.provider);
        this.priceData = [];
    }
    async loadPrices() {
        return new Promise((resolve) => {
            console.log(`${this.name} exchange load prices executing, no logic written yet`);
            setTimeout(() => { resolve(); }, 1000);
        });
    }
    getPrices() {
        return this.priceData;
    }
    startSwapListener(_tracker) {
        _tracker.addListener(this.name, this.pool, 'Swap', (sender, amount0In, amount1In, amount0Out, amount1Out, to) => { this.handleSwapEvent(); });
        this.utils.logger.log('info', `starting listener on ${this.name}`);
    }
    async handleSwapEvent() {
        const aest = new Date().toLocaleString();
        console.log(`SWAP event detected on ${this.name} at ${aest}`);
        this.utils.logger.log('info', `SWAP event detected on ${this.name} at ${aest}`);
        await this.loadPrices();
        const data = { pairName: this.name };
        this.utils.swapEmitter.emit("internalSwapEvent", data);
    }
}
exports.default = PoolUV2;
