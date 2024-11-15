// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";


// designed to be inherrited by contracts that need to do swaps on uniswapv2
abstract contract SwapperUV2 {

    constructor() {}

    // returns the amount of token B to expect out of an exchange based on a given amount of token A in
    function getAmountOutMinUV2(address router, address[] memory path, uint256 amtIn, uint256 _maxSlippage) public view returns(uint256){
        
        uint256[] memory amountsOut = IUniswapV2Router02(router).getAmountsOut(amtIn, path);
        uint256 amountOut = amountsOut[amountsOut.length - 1]; // Expected amount out

        // Calculate `amountOutMin` by applying the slippage tolerance
        uint256 amountOutMin = amountOut - ((amountOut * _maxSlippage) / 10000);

        return amountOutMin;
    }


    // executes a straight up swap between ERC20 tokens on a uniswap v2 exchange
    function swapUV2( address _router, address _tokenIn, address _tokenOut, uint256 _amtIn, uint256 _maxSlippage) internal returns (uint256[] memory){

        TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

        // put together the path variable for the swap
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        // calculate amounts out min
        uint256 amtOutMin = getAmountOutMinUV2(_router, path, _amtIn, _maxSlippage);
        
        // make the trade
        uint[] memory amounts = IUniswapV2Router02(_router).swapExactTokensForTokens(_amtIn, amtOutMin, path, address(this), block.timestamp);
        // this should be the amount returned from the trade
        return amounts;
    }
}
