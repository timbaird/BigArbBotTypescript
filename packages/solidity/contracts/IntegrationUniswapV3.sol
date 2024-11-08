// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// transfer helper includes the ERC20 inerface too.
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";


// designed to be inherrited by contracts that need to do swaps on uniswapv2
//abstract contract SwapperUniswapV3 {

contract IntegrationUniswapV3 {

    constructor() {}

    // executes a straight up swap between ERC20 tokens on a uniswap v2 exchange
    function swapERC20UniswapV3(   ) internal returns (uint256){

       // TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

    }
}