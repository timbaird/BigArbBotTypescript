// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// transfer helper includes the ERC20 inerface too.
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";


// designed to be inherrited by contracts that need to do swaps on uniswapv2
//abstract contract SwapperUniswapV3 {

abstract contract swapUniswapV3 {

    constructor() {}

    function initiateUV3() internal returns (uint256){
        // for first swap - get funds for free before swapping and paying them back
            // TransferHelper.safeApprove(_tokenIn, _router, _amtIn);
    }

    // executes a straight up swap between ERC20 tokens on a uniswap v2 exchange
    function middleSwapUV3(   ) internal returns (uint256){
        // for middle swap - get funds for free before swapping and paying them back
            // TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

    }


}