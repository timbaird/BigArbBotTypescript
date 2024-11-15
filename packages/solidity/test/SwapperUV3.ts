import path from 'path';
import {time,loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { network } from "hardhat";
import { vars } from 'hardhat/config';
import { ethers, Contract, WebSocketProvider, Signer, getBigInt } from 'ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import ERC20_ABI from '../../../../abis/ERC20_ABI.json';
import poolABI from '../../../../abis/UniswapV3PoolABI.json';
import quoter2ABI from '../../../../abis/UniswapV3QuoterV2ABI.json';
import { SwapperUV3Test } from '../typechain-types';

describe("SwapperUV3Test", function () {

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function testFixture() {
        let quoter2_addr: string, router_addr: string, pool_addr: string, weth_addr: string, usdc_addr: string, weth_whale: string, usdc_whale: string;
        const fee = 500; // 0.05% pool fee tier on Uniswap V3
        const maxSlippage = 25; // 0.25% slippage tolerance
        const Contract = await hre.ethers.getContractFactory("SwapperUV3Test");
        const swapper = await Contract.deploy();
        //Polygon mainnet addresses for testinggainst hradhat fork
        quoter2_addr = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"; // Uniswap V3 Quoterv2
        router_addr  = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"; // Uniswap V3 SwapRouterV2
        weth_addr  = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // WETH on Polygon
        usdc_addr  = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC on Polygon
        pool_addr = "0x45dda9cb7c25131df268515131f647d726f50608"; // WETH/USDC Uniswap V3 Pool on Polygon
        weth_whale = "0xdeD8C5159CA3673f543D0F72043E4c655b35b96A";
        usdc_whale = "0x3A3BD7bb9528E159577F7C2e685CC81A765002E2";
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        // //============================
        // // this chunk works but it not needed
        // const balance1 = await hre.ethers.provider.getBalance(weth_whale);
        // console.log(balance1);

        // //   create  transaction
        // const tx = {
        //     to: weth_whale,
        //     value: ethers.parseEther("1"),
        // };
        // await owner.sendTransaction(tx);
        
        // const balance2 = await hre.ethers.provider.getBalance(weth_whale);
        // console.log(balance2);
        // //===============================

        const wethContract = new hre.ethers.Contract(weth_addr, ERC20_ABI, hre.ethers.provider);
        const wethWhaleWETHBalance = await wethContract.balanceOf(weth_whale);
        //console.log(wethWhaleWETHBalance);

        // Impersonate the account
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [usdc_whale],
        });
        const usdcSigner = await hre.ethers.getSigner(usdc_whale);
        
        const usdcContract = new hre.ethers.Contract(usdc_addr, ERC20_ABI, usdcSigner);
        console.log(await usdcContract.balanceOf(weth_whale));
        await usdcContract.transfer(weth_whale, ethers.parseUnits("10000", 6));
        console.log(await usdcContract.balanceOf(weth_whale));


        // Get a signer for the impersonated account

        return { swapper, quoter2_addr, router_addr, weth_addr, usdc_addr, pool_addr, fee, maxSlippage, owner, otherAccount};
    }


    it("should get the minimum output amount with slippage applied", async function () {
        const { swapper, quoter2_addr, router_addr, weth_addr, usdc_addr, pool_addr, fee, maxSlippage, owner, otherAccount } = await loadFixture(testFixture);
        const amountIn = ethers.parseUnits("100", 6); // 100 USDC
        const amountOutMin = await swapper.testGetAmountOutMin.staticCall(quoter2_addr, usdc_addr, weth_addr, fee, amountIn, maxSlippage);
        expect(amountOutMin).to.be.gt(0);
        console.log("Minimum output amount with slippage:", amountOutMin.toString());
    });

    it("should execute a router swap and return the output amount", async function () {
        const { swapper, quoter2_addr, router_addr, weth_addr, usdc_addr, pool_addr, fee, maxSlippage, owner, otherAccount } = await loadFixture(testFixture);

        // const amountIn = ethers.parseEther("1"); // 1 WETH
        // const amountOut = await swapper.testRouterSwapUV3(router_addr, quoter2_addr, fee, usdc_addr, weth_addr, amountIn, maxSlippage);
        // expect(amountOut).to.be.gt(0);
        // console.log("Router swap output amount:", amountOut.toString());
    });

    // it("should execute a pool swap and return the output amount", async function () {
    //     const { swapper, quoter_addr, router_addr, weth_addr, usdc_addr, pool_addr, fee, maxSlippage} = await loadFixture(testFixture);
    //     const amountIn = ethers.utils.parseEther("1"); // 1 WETH
    //     const recipient = swapper.address;
    //     const amountOut = await swapper.testPoolSwapUV3(pool, tokenIn, amountIn, recipient);
    //     expect(amountOut).to.be.gt(0);
    //     console.log("Pool swap output amount:", amountOut.toString());
    // });
    
});