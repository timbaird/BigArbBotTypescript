"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// bring in required libraries etc.
const config_1 = require("hardhat/config");
// bring in my custom classes
const GracefulExit_1 = __importDefault(require("./classes/GracefulExit"));
const ArbPair_1 = __importDefault(require("./classes/ArbPair"));
const ArbFinder_1 = __importDefault(require("./classes/ArbFinder"));
const ArbUtilities_1 = __importDefault(require("./classes/ArbUtilities"));
const ArbExecutor_1 = __importDefault(require("./classes/ArbExecutor"));
const INFURA_API_KEY = config_1.vars.get("INFURA_API_KEY");
async function main(DATA) {
    const utils = new ArbUtilities_1.default(DATA["WEBSOCKET"], INFURA_API_KEY, DATA["MULTICALL_ADDR"], DATA["DEBUGMODE"], DATA["BLOCKCHAIN"]);
    utils.logger.log("info", `############## ${DATA["BLOCKCHAIN"]} APP STARTED ################`, true);
    // graceful exits sets up script so it can be exited gracefully witg CTRL^C
    GracefulExit_1.default.setUp(utils);
    const pairs = [];
    for (let i = 0; i < DATA["PAIRS"].length; i++) {
        pairs.push(new ArbPair_1.default(DATA["PAIRS"][i], utils));
        // initialise is done seperately here because it involves async
        // operations and need to be awaited, which it is simpler to do here
        // than in the ArbPair constructor
        await pairs[i].initialise(DATA["PAIRS"][i]);
    }
    // run arb search and arb execution processes based on events emitted, 
    // so don't need any direct calls here.
    const finder = new ArbFinder_1.default(pairs, utils);
    const executor = new ArbExecutor_1.default(utils);
}
exports.default = main;
