// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// initially based on this : https://youtu.be/MxTgk-kvtRM?si=geGqQS92G5SewZ3X

import {TransferHelper} from "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "@uniswap/v2-core/contracts/UniswapV2Factory.sol";
import {IUniswapV2Pair} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

// designed to be inherited by contracts that need to do swaps on uniswapv2{
abstract contract swapUniswapV2 {

    constructor() {}

    function initiateUV2( address _pair, address[] memory _tokenPath, uint256 _amountBorrow) internal {
        require(_pair == address(0), "not from pair address");

        



    }

    // executes a straight up swap between ERC20 tokens on a uniswap v2 router
    function middleSwapV2( address _router, address _tokenIn, address _tokenOut, uint256 _amtIn) internal returns (uint256){

        // approve the transfer
        TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

        // put together the path variable for the swap
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        // get the router
        IUniswapV2Router02 router = IUniswapV2Router02(_router);
        
        // make the trade
        uint[] memory amounts = router.swapExactTokensForTokens(_amtIn, 0, path, address(this), block.timestamp);
        // this should be the amount returned from the trade
        return amounts[1];
    }


}
