"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const IUniswapV2Pair_json_1 = __importDefault(require("@uniswap/v2-core/build/IUniswapV2Pair.json"));
const UniswapV2Router02_json_1 = __importDefault(require("@uniswap/v2-periphery/build/UniswapV2Router02.json"));
const { abi: UniswapV2PairABI } = IUniswapV2Pair_json_1.default;
class PoolUV2 {
    constructor(_pairName, DATA, _tokens, _arbInputSizes, _utils) {
        this.protocol = "UNISWAPV2";
        this.currentlyLoadingPrices = false;
        this.pairName = _pairName;
        this.name = DATA["NAME"];
        this.pool_addr = DATA["PAIR_ADDR"];
        this.fee = DATA["FEE"];
        this.factory_addr = DATA["FACTORY_ADDR"];
        this.router_addr = DATA["ROUTER_ADDR"];
        this.tokens = _tokens;
        this.arbInputSizes = _arbInputSizes;
        this.utils = _utils;
        const { abi: RouterABI } = UniswapV2Router02_json_1.default;
        this.router = new ethers_1.Contract(this.router_addr, RouterABI, this.utils.provider);
        this.pool = new ethers_1.Contract(this.pool_addr, UniswapV2PairABI, _utils.provider);
        this.priceData = [];
        this.utils.logger.log("info", `POOLUV2.constructor : executed for ${this.name} - ${this.pairName}`);
    }
    async loadPrices() {
        this.utils.logger.log("info", `POOLUV2.loadPrices called ${this.name}`);
        this.currentlyLoadingPrices = true;
        try {
            // reset existing priceData
            this.priceData.length = 0;
            // set up for the multicall
            const data = [];
            const targets = [];
            let amt;
            // for each of the arb Input Sizes we are tracking
            for (let i = 0; i < this.arbInputSizes.length; i++) {
                // denominated in token0's
                amt = (0, ethers_1.parseUnits)(this.arbInputSizes[i].toString(), this.tokens[0].decimals);
                // set up for getAmountsOut - purchase token 1 price  (denominated in token0)
                targets.push(this.router_addr);
                const encodedOut = this.router.interface.encodeFunctionData("getAmountsOut", [amt, [this.tokens[0].address, this.tokens[1].address]]);
                data.push(encodedOut);
                // set up for getAmountsIn - selling  token 1 price  (denominated in token0)
                targets.push(this.router_addr);
                const encodedIn = this.router.interface.encodeFunctionData("getAmountsIn", [amt, [this.tokens[1].address, this.tokens[0].address]]);
                data.push(encodedIn);
            }
            // this should get the price data in a single call
            const results = await this.utils.multicall.multicall.staticCall(targets, data);
            for (let i = 0; i < results.length; i += 2) {
                const decodedIn = this.router.interface.decodeFunctionResult("getAmountsOut", results[i]);
                const decodedOut = this.router.interface.decodeFunctionResult("getAmountsIn", results[i + 1]);
                let amt = 0;
                // find the correct arb input soze for the 
                if (i % 2 == 0) {
                    amt = this.arbInputSizes[i / 2];
                }
                else {
                    amt = this.arbInputSizes[(i - 1) / 2];
                }
                const decimalShift = 10n ** BigInt(this.tokens[1].decimals);
                const priceIn = (parseFloat(amt.toString()) / parseFloat(decodedIn[0][1].toString())) * parseFloat(decimalShift.toString());
                const priceOut = (parseFloat(amt.toString()) / parseFloat(decodedOut[0][0].toString())) * parseFloat(decimalShift.toString());
                this.priceData.push({ "direction": "BUY", "amt": amt, "price": priceIn });
                this.priceData.push({ "direction": "SELL", "amt": amt, "price": priceOut });
            }
        }
        catch (ex) {
        }
        finally {
            this.currentlyLoadingPrices = false;
        }
        this.utils.logger.log("info", `POOLUV2.loadPrices completed - new price data loaded for ${this.name} priceData length: ${this.priceData.length}`);
        //just for validating price data has loaded correctly
        // console.log(`PoolUV2 ${this.name} RouterV2 price data loaded`);
        // for (let fuckyou = 0; fuckyou < this.priceData.length; fuckyou++){
        //     console.log(`${this.priceData[fuckyou].direction} ${this.priceData[fuckyou].amt}  ${this.priceData[fuckyou].price}`);
        // }
    }
    getPrices() {
        return this.priceData;
    }
    startSwapListener(_tracker) {
        _tracker.addListener(this.name, this.pool, 'Swap', (sender, amount0In, amount1In, amount0Out, amount1Out, to) => { this.handleSwapEvent(); });
        this.utils.logger.log('info', `POOLUV2.startSwapListener : starting listener on ${this.name}`);
    }
    async handleSwapEvent() {
        const aest = new Date().toLocaleString();
        this.utils.logger.log("info", `POOLUV2: SWAP event detected on ${this.name} at ${aest}`);
        if (!this.currentlyLoadingPrices)
            await this.loadPrices();
        const data = { pairName: this.pairName };
        this.utils.swapEmitter.emit("internalSwapEvent", data);
    }
}
exports.default = PoolUV2;
