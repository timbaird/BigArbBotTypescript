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
        this.isGasOracle = PAIRDATA["GASORACLE"];
        this.utils.logger.log("info", `ArbPair.constructor : executed for ${PAIRDATA["TOKEN0"]["NAME"]}-${PAIRDATA["TOKEN1"]["NAME"]}`);
    }
    async initialise(PAIRDATA) {
        await this.token0.initalise();
        await this.token1.initalise();
        for (let i = 0; i < PAIRDATA["POOLS"].length; i++) {
            let pool = null;
            switch (PAIRDATA["POOLS"][i]["PROTOCOL"]) {
                case "UNISWAPV2":
                    pool = new PoolUV2_1.default(this.toString(), PAIRDATA["POOLS"][i], [this.token0, this.token1], this.arbInputSizes, this.utils);
                    break;
                case "UNISWAPV3":
                    pool = new PoolUV3_1.default(this.toString(), PAIRDATA["POOLS"][i], [this.token0, this.token1], this.arbInputSizes, this.isGasOracle, this.utils);
                    break;
                case "KYBERCLASSIC":
                    //pool = new PoolKyberClassic(this.toString(), PAIRDATA["POOLS"][i], [this.token0, this.token1], this.arbInputSizes, this.utils);
                    this.utils.logger.log("info", "ArbPair.initialise: kyber classic pools not yet finished");
                    break;
                case "BALANCERV2":
                    this.utils.logger.log("info", "ArbPair.initialise: balancer pools not yet developed");
                    break;
                default:
                    this.utils.logger.log("info", `ArbPair.initialise: pool protocol not recognised ${PAIRDATA["POOLS"][i]["NAME"]} ${PAIRDATA["POOLS"][i]["PROTOCOL"]}`, true);
            }
            if (pool !== null) {
                pool.startSwapListener(this.utils.tracker);
                await pool.loadPrices();
                this.pools.push(pool);
            }
        }
        this.utils.logger.log("info", `ArbPair.initialise: Finished initialising pools for ${this.toString()}`, true);
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
