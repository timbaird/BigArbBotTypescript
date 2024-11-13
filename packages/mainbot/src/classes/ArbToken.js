"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const ERC20_ABI_json_1 = __importDefault(require("../../../../../abis/ERC20_ABI.json"));
class ArbToken {
    constructor(_address, _utils) {
        this.symbol = "";
        this.decimals = 0;
        this.address = _address;
        this.contract = new ethers_1.Contract(_address, ERC20_ABI_json_1.default, _utils.provider);
    }
    async initalise() {
        try {
            return Promise.all([this.contract.symbol(), this.contract.decimals()]).then((data) => {
                return new Promise((resolve) => {
                    this.symbol = data[0];
                    this.decimals = data[1];
                    resolve();
                });
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    toString() {
        return this.symbol;
    }
}
exports.default = ArbToken;
