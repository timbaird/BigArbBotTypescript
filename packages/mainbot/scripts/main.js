"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const ArbLogger_1 = __importDefault(require("./classes/ArbLogger"));
const GracefulExit_1 = __importDefault(require("./classes/GracefulExit"));
const ListenerTracker_1 = __importDefault(require("./classes/ListenerTracker"));
const polygon_erc20_token_addresses_1 = require("../../../../Utilities/dataFiles/polygon/polygon_erc20_token_addresses");
//import { EXCHANGES } from '../../../../Utilities/dataFiles/polygon/exchanges/polygon_uniswapv3_exchanges';
const INFURA_API_KEY = config_1.vars.get("INFURA_API_KEY");
const logger = new ArbLogger_1.default("TEST_PAIR", "../../../logs/");
logger.log('info', 'Halelujah');
const tracker = new ListenerTracker_1.default(logger);
const provider = new ethers_1.ethers.WebSocketProvider(polygon_erc20_token_addresses_1.WEBSOCKET + INFURA_API_KEY);
GracefulExit_1.default.setUp(tracker, provider, logger);
