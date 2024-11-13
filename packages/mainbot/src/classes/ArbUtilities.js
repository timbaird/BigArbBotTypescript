"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const ListenerTracker_1 = __importDefault(require("./ListenerTracker"));
const ArbLogger_1 = __importDefault(require("./ArbLogger"));
const SwapEventEmitter_1 = __importDefault(require("./SwapEventEmitter"));
const MulticallABI_json_1 = __importDefault(require("../../../../../abis/MulticallABI.json"));
const ArbEventEmitter_1 = __importDefault(require("./ArbEventEmitter"));
class ArbUtilities {
    constructor(_webSocket, _apiKey, _multicall_addr, _debug, _logFileName) {
        this.provider = new ethers_1.WebSocketProvider(_webSocket + _apiKey);
        this.logger = new ArbLogger_1.default(_logFileName, "../../../logs/", _debug);
        this.tracker = new ListenerTracker_1.default(this.logger);
        this.swapEmitter = new SwapEventEmitter_1.default();
        this.arbEmitter = new ArbEventEmitter_1.default();
        this.multicall = new ethers_1.Contract(_multicall_addr, MulticallABI_json_1.default, this.provider);
        this.logger.log("info", "ArbUtilities: constructor executed");
    }
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.default = ArbUtilities;
