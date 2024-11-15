"use strict";
// SOLIDITY PACKAGE
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
const config_1 = require("hardhat/config");
const INFURA_API_KEY = config_1.vars.get('INFURA_API_KEY');
const config = {
    solidity: {
        compilers: [
            {
                version: "0.5.16",
            },
            {
                version: "0.8.20",
            },
            {
                version: "0.6.0",
            },
        ],
    },
    networks: {
        hardhat: {
            forking: {
                url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
            }
        }
    }
};
exports.default = config;
