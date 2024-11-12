"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const UniswapV3Pool_json_1 = __importDefault(require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"));
const Quoter_json_1 = __importDefault(require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"));
const { abi: QuoterABI } = Quoter_json_1.default;
const QuoterV2_json_1 = __importDefault(require("@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json"));
const { abi: Quoter2ABI } = QuoterV2_json_1.default;
const { abi: UniswapV3PoolABI } = UniswapV3Pool_json_1.default;
class PoolUV3 {
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
    constructor(_pairName, DATA, _arbInputSizes, _tokenDecimals, _utils) {
        this.pairName = _pairName;
        this.name = DATA["NAME"];
        this.factory_addr = DATA["FACTORY_ADDR"];
        this.utils = _utils;
        if (DATA["SWAP_ROUTER2_ADDR"] !== null) {
            this.router_addr = DATA["SWAP_ROUTER2_ADDR"];
            this.router_version = 2;
        }
        else {
            this.router_addr = DATA["SWAP_ROUTER_ADDR"];
            this.router_version = 1;
        }
        if (DATA["QUOTER2_ADDR"] !== null) {
            this.quoter_addr = DATA["QUOTER2_ADDR"];
            this.quoter_version = 2;
            this.quoter = new ethers_1.Contract(this.quoter_addr, Quoter2ABI, this.utils.provider);
        }
        else {
            this.quoter_addr = DATA["QUOTER_ADDR"];
            this.quoter_version = 1;
            this.quoter = new ethers_1.Contract(this.quoter_addr, QuoterABI, this.utils.provider);
        }
        this.pool_addr = DATA["POOL_ADDR"];
        this.fee = DATA["FEE"];
        this.tokenDecimals = _tokenDecimals;
        this.arbInputSizes = _arbInputSizes;
        this.pool = new ethers_1.Contract(this.pool_addr, UniswapV3PoolABI, _utils.provider);
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
        _tracker.addListener(this.name, this.pool, 'Swap', (sender, recipeint, amount0, amount1, sqrtPriceX96) => { this.handleSwapEvent(); });
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
exports.default = PoolUV3;
