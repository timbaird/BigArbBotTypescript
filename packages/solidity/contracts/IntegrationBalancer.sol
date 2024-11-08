// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// transfer helper includes the ERC20 inerface too.
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";


// designed to be inherrited by contracts that need to do swaps on uniswapv2
//abstract contract SwapperUniswapV3 {

contract IntegrationBalancer {

    constructor() {}

    // executes a straight up swap between ERC20 tokens on a uniswap v2 exchange
    function swapERC20Balancer(   ) internal returns (uint256){

        //Balancer | Building on Balancer v2
        //  https://www.youtube.com/live/ABbtYtMDhFA?si=zbnr0Q5SaoZZHwhH

        // Balancer Finance Tutorial (Pools, Trading, Solidity Integration)
        // https://youtu.be/4aDPZZ7LnQc?si=K3mYChzXMEYp8y0l

        // balancer git hub
        //https://github.com/balancer

       // TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

    }
}