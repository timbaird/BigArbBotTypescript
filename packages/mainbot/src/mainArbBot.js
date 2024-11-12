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
const INFURA_API_KEY = config_1.vars.get("INFURA_API_KEY");
async function main(DATA) {
    const utils = new ArbUtilities_1.default(DATA["WEBSOCKET"], INFURA_API_KEY, DATA["MULTICALL_ADDR"]);
    GracefulExit_1.default.setUp(utils);
    const pair = new ArbPair_1.default(DATA["PAIRS"][0], utils);
    // initialise is done seperately here because it involves async
    // operations and need to be awaited, which it is simpler to do here
    // than in the ArbPair constructor
    await pair.initialise(DATA["PAIRS"][0]);
    const finder = new ArbFinder_1.default(utils);
}
exports.default = main;
