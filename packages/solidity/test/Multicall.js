"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const chai_1 = require("chai");
const hardhat_1 = __importDefault(require("hardhat"));
const config_1 = require("hardhat/config");
const polygon_erc20_token_addresses_1 = require("../../../../Utilities/dataFiles/polygon/polygon_erc20_token_addresses");
const polygon_uniswapv3_exchanges_1 = require("../../../../Utilities/dataFiles/polygon/exchanges/polygon_uniswapv3_exchanges");
const INFURA_API_KEY = config_1.vars.get("INFURA_API_KEY");
const UniswapV3PoolABI_json_1 = __importDefault(require("../../../../abis/UniswapV3PoolABI.json"));
const UniswapV3QuoterV2ABI_json_1 = __importDefault(require("../../../../abis/UniswapV3QuoterV2ABI.json"));
describe("Multicall", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function testFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hardhat_1.default.ethers.getSigners();
        const provider = new hardhat_1.default.ethers.WebSocketProvider(polygon_erc20_token_addresses_1.WEBSOCKET + INFURA_API_KEY);
        const Contract = await hardhat_1.default.ethers.getContractFactory("Multicall");
        const Multicall = await Contract.deploy();
        const ARB_INPUT_SIZES = [10000];
        const quoter2Addr = hardhat_1.default.ethers.getAddress(polygon_uniswapv3_exchanges_1.EXCHANGES[0]["QUOTER2_ADDR"]);
        const quoter2Contract = new hardhat_1.default.ethers.Contract(quoter2Addr, UniswapV3QuoterV2ABI_json_1.default, provider);
        // POSUSDCE - WETH 0.05% POOL ON UNISWAP V3 POLYGON MAINNET
        const POOL_ADDRESS = hardhat_1.default.ethers.getAddress("0x45dDa9cb7c25131DF268515131f647d726f50608");
        // POSUSDCE ON POLYGON MAINNET
        const POSUSDCE = hardhat_1.default.ethers.getAddress("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174");
        // WETH ON POLYGON MAINNET
        const WETH = hardhat_1.default.ethers.getAddress("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619");
        const poolContract = new hardhat_1.default.ethers.Contract(POOL_ADDRESS, UniswapV3PoolABI_json_1.default, provider);
        return { Multicall, provider, POOL_ADDRESS, poolContract, quoter2Addr, quoter2Contract, POSUSDCE, WETH, ARB_INPUT_SIZES, owner, otherAccount };
    }
    describe("multicall", function () {
        /*
        it("Calls Pools", async function () {
            const { Multicall, provider, POOL_ADDRESS, poolContract, quoter2Addr, quoter2Contract, owner, otherAccount } = await loadFixture(testFixture);
            
            const encoded1: any = poolContract.interface.encodeFunctionData("liquidity");
            const encoded2: string = poolContract.interface.encodeFunctionData("slot0");

            const targets: string[] = [POOL_ADDRESS, POOL_ADDRESS];
            const data: any[] = [encoded1, encoded2];

            const result: string[] = await Multicall.multicall.staticCall(targets, data);

            const decodedLiq = poolContract.interface.decodeFunctionResult("liquidity", result[0]);
            const decodedSlot0 = poolContract.interface.decodeFunctionResult("slot0", result[1]);
            
            //console.log("=========");
            //console.log(decodedSlot0);
            //console.log("=========");
            //console.log(decodedLiq);

            expect(result.length).to.equal(2);
        });
        */
        it("Loads Price Data", async function () {
            const { Multicall, provider, poolContract, quoter2Addr, quoter2Contract, POSUSDCE, WETH, ARB_INPUT_SIZES, owner, otherAccount } = await (0, network_helpers_1.loadFixture)(testFixture);
            const data = [];
            const targets = [];
            const amts = [];
            for (let i = 0; i < ARB_INPUT_SIZES.length; i++) {
                amts.push(ARB_INPUT_SIZES[i].toString());
                const amt = hardhat_1.default.ethers.parseUnits(amts[i], 6);
                console.log(`${ARB_INPUT_SIZES[i]}  -  ${amt}`);
                const paramsIn = {
                    tokenIn: POSUSDCE,
                    tokenOut: WETH,
                    amountIn: amt,
                    fee: '500',
                    sqrtPriceLimitX96: '0'
                };
                const encodedIn = quoter2Contract.interface.encodeFunctionData("quoteExactInputSingle", [paramsIn]);
                targets.push(quoter2Addr);
                data.push(encodedIn);
                const paramsOut = {
                    tokenIn: WETH,
                    tokenOut: POSUSDCE,
                    fee: '500',
                    amount: amt,
                    sqrtPriceLimitX96: '0'
                };
                const encodedOut = quoter2Contract.interface.encodeFunctionData("quoteExactOutputSingle", [paramsOut]);
                targets.push(quoter2Addr);
                data.push(encodedOut);
            }
            (0, chai_1.expect)(targets.length).to.equal(data.length);
            // each arb input size had a target for selling (in) and buying (out)
            //expect(targets.length).to.equal(ARB_INPUT_SIZES.length * 2);
            const results = await Multicall.multicall.staticCall(targets, data);
            //console.log(result.length);
            for (let i = 0; i < results.length; i += 2) {
                const decodedIn = quoter2Contract.interface.decodeFunctionResult("quoteExactInputSingle", results[i]);
                const decodedOut = quoter2Contract.interface.decodeFunctionResult("quoteExactOutputSingle", results[i + 1]);
                let amt = "";
                if (i % 2 == 0) {
                    amt = amts[i / 2];
                }
                else {
                    amt = amts[(i - 1) / 2];
                }
                // data comes out in following format
                // index 0 => uint256 either amountIn or AmountOut depending on which funciton was called
                // index 1 => uint160 sqrtPriceX96After
                // index 2 => initializedTicksCrossedList
                // index 3 => gas estimate
                const decimalShift = 10 ** 18;
                const priceIn = (parseFloat(amt) / parseFloat(decodedIn[0].toString())) * decimalShift;
                const priceOut = (parseFloat(amt) / parseFloat(decodedOut[0].toString())) * decimalShift;
                console.log(`${i} BUYING ${amt} UDSC worth of WETH price - ${priceIn.toFixed(3)}`);
                console.log(`${i + 1} SELLING ${amt} UDSC worth of WETH price - ${priceOut.toFixed(3)}`);
            }
            console.log('finitto');
        });
    });
});
