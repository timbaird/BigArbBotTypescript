"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const polygon_POSUSDCE_WETH_arb_data_json_1 = __importDefault(require("../../../data/polygon/polygon_POSUSDCE_WETH_arb_data.json"));
// ################################
// ################################
const mainArbBot_1 = __importDefault(require("./mainArbBot"));
(0, mainArbBot_1.default)(polygon_POSUSDCE_WETH_arb_data_json_1.default);
