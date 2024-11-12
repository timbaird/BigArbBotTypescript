"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArbToken_1 = __importDefault(require("./ArbToken"));
const PoolUV2_1 = __importDefault(require("./PoolUV2"));
const PoolUV3_1 = __importDefault(require("./PoolUV3"));
class ArbPair {
    constructor(PAIRDATA, _utils) {
        this.pools = [];
        this.pair_name = "";
        this.token0 = new ArbToken_1.default(PAIRDATA["TOKEN0"]["ADDRESS"], _utils);
        this.token1 = new ArbToken_1.default(PAIRDATA["TOKEN1"]["ADDRESS"], _utils);
        this.arbInputSizes = PAIRDATA["ARB_INPUT_SIZES"];
        this.utils = _utils;
    }
    async initialise(PAIRDATA) {
        await this.token0.initalise();
        await this.token1.initalise();
        for (let i = 0; i < PAIRDATA["POOLS"].length; i++) {
            let pool = null;
            switch (PAIRDATA["POOLS"][i]["PROTOCOL"]) {
                case "UNISWAPV2":
                    pool = new PoolUV2_1.default(this.toString(), PAIRDATA["POOLS"][i], this.arbInputSizes, [this.token0.decimals, this.token1.decimals], this.utils);
                    break;
                case "UNISWAPV3":
                    pool = new PoolUV3_1.default(this.toString(), PAIRDATA["POOLS"][i], this.arbInputSizes, [this.token0.decimals, this.token1.decimals], this.utils);
                    break;
                case "KYBERCLASSIC_STATIC":
                    console.log("kyber classic static fee pools not yet developed");
                    break;
                case "KYBERCLASSIC_DYNAMIC":
                    console.log("kyber classic dynamic fee pools not yet developed");
                    break;
                case "BALANCERV2":
                    console.log("balancer pools not yet developed");
                    break;
                default:
                    console.log(`pool protocol not recognised ${PAIRDATA["POOLS"][i]["NAME"]} ${PAIRDATA["POOLS"][i]["PROTOCOL"]}`);
            }
            if (pool !== null) {
                pool.startSwapListener(this.utils.tracker);
                await pool.loadPrices();
                this.pools.push(pool);
            }
        }
        console.log(`Finished initialising pools for ${this.toString()}`);
    }
    // this is what is treated as the pairname elsewhere
    toString() {
        return `${this.token0.symbol}-${this.token1.symbol}`;
    }
    pairName() {
        return this.toString();
    }
}
exports.default = ArbPair;
