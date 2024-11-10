"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArbLogger_1 = __importDefault(require("./classes/ArbLogger"));
const logger = new ArbLogger_1.default("TEST_PAIR", "../../../logs/");
logger.log('info', 'Halelujah');
