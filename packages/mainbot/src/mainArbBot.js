"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// bring in required libraries etc.
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
// bring in my custom classes
const ArbLogger_1 = __importDefault(require("./classes/ArbLogger"));
const GracefulExit_1 = __importDefault(require("./classes/GracefulExit"));
const ListenerTracker_1 = __importDefault(require("./classes/ListenerTracker"));
//import PoolUV2 from "./classes/PoolUV2";
//import IPool from "./interfaces/IPool";
//import ArbToken from './classes/ArbToken';
const ArbPair_1 = __importDefault(require("./classes/ArbPair"));
const SwapEventEmitter_1 = __importDefault(require("./classes/SwapEventEmitter"));
const ArbFinder_1 = __importDefault(require("./classes/ArbFinder"));
// bring in the data from the relevant data files
const INFURA_API_KEY = config_1.vars.get("INFURA_API_KEY");
async function main(DATA) {
    // set up background services and infrastructure
    const provider = new ethers_1.ethers.WebSocketProvider(DATA["WEBSOCKET"] + INFURA_API_KEY);
    const logger = new ArbLogger_1.default("TEST_PAIR", "../../../logs/");
    const tracker = new ListenerTracker_1.default(logger);
    const emitter = new SwapEventEmitter_1.default();
    GracefulExit_1.default.setUp(tracker, provider, logger);
    const pair = new ArbPair_1.default(DATA["PAIRS"][0], provider, tracker, emitter, logger);
    await pair.initialise(DATA["PAIRS"][0]);
    const finder = new ArbFinder_1.default(emitter);
}
exports.default = main;
