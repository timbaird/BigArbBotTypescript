"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const kyberDMMPoolABI_json_1 = __importDefault(require("../../../../../abis/kyberDMMPoolABI.json"));
const kyberDmmRouterABI_json_1 = __importDefault(require("../../../../../abis/kyberDmmRouterABI.json"));
class PoolKyberClassic {
    constructor(_pairName, DATA, _tokens, _arbInputSizes, _utils) {
        this.protocol = "KYBERCLASSIC";
        this.currentlyLoadingPrices = false;
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
        this.router = new ethers_1.Contract(this.router_addr, kyberDmmRouterABI_json_1.default, this.utils.provider);
        this.pool = new ethers_1.Contract(this.pool_addr, kyberDMMPoolABI_json_1.default, _utils.provider);
        this.priceData = [];
    }
    async loadPrices() {
        this.currentlyLoadingPrices = true;
        try {
            // reset existing priceData
            this.priceData = [];
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
                const encodedOut = this.router.interface.encodeFunctionData("getAmountsOut", [amt, [this.pool_addr], [this.tokens[0].address, this.tokens[1].address]]);
                data.push(encodedOut);
                // set up for getAmountsIn - selling  token 1 price  (denominated in token0)
                targets.push(this.router_addr);
                const encodedIn = this.router.interface.encodeFunctionData("getAmountsIn", [amt, [this.pool_addr], [this.tokens[1].address, this.tokens[0].address]]);
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
                let amt = 0;
                // find the correct arb input soze for the 
                if (i % 2 == 0) {
                    amt = this.arbInputSizes[i / 2];
                }
                else {
                    amt = this.arbInputSizes[(i - 1) / 2];
                }
                //console.log(`${typeof(10n)} - ${typeof (this.tokenDecimals[1])} `);
                const decimalShift = 10n ** BigInt(this.tokens[1].decimals);
                const priceIn = (parseFloat(amt.toString()) / parseFloat(decodedIn[0][1].toString())) * parseFloat(decimalShift.toString());
                const priceOut = (parseFloat(amt.toString()) / parseFloat(decodedOut[0][0].toString())) * parseFloat(decimalShift.toString());
                this.priceData.push({ "direction": "BUY", "amt": amt, "price": priceIn });
                this.priceData.push({ "direction": "SELL", "amt": amt, "price": priceOut });
            }
        }
        catch (ex) {
            console.log(`error pool in ${this.pairName} - ${this.name} : ${ex.message}`);
        }
        finally {
            this.currentlyLoadingPrices = false;
        }
        //just for validating price data has loaded correctly
        // console.log(`KyberClassic ${this.name} DmmRouter price data loaded`);
        // for (let fuckyou = 0; fuckyou < this.priceData.length; fuckyou++){
        //     console.log(`${this.priceData[fuckyou].direction} ${this.priceData[fuckyou].amt}  ${this.priceData[fuckyou].price}`);
        // }
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
        const data = { pairName: this.pairName };
        this.utils.swapEmitter.emit("internalSwapEvent", data);
    }
}
exports.default = PoolKyberClassic;
