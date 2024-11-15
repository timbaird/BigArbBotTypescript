// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IQuoterV2} from "@uniswap/v3-periphery/contracts/interfaces/IQuoterV2.sol";
import {IUniswapV3Pool} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";


abstract contract SwapperUV3 {

    constructor() {}

    // returns the amount of token B to expect out of an exchange based on a given amount of token A in
     // Uniswap V3 pool fee tier (e.g., 3000 for 0.3%) + Slippage in basis points (100 = 1%)
    function getAmountOutMin( address _quoter2, address _tokenIn, address _tokenOut, uint24 _fee, uint256 _amtIn, uint256 _maxSlippage) internal returns (uint256 amountOutMin) {
        // set up the params for the quoterv2
        IQuoterV2.QuoteExactInputSingleParams memory params = IQuoterV2.QuoteExactInputSingleParams({
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            fee: _fee,
            amountIn: _amtIn,
            sqrtPriceLimitX96: 0 // No price limit for quoting
        });

        // Get the expected output amount from the Quoter ( the ,,, ignores the other return values)
        (uint256 amountOut,,,) = IQuoterV2(_quoter2).quoteExactInputSingle(params);
        // Apply slippage tolerance
        amountOutMin = amountOut - ((amountOut * _maxSlippage) / 10000);
        return amountOutMin;
    }


    // executes a straight up swap between ERC20 tokens on a uniswap v3 exchange
    function routerSwapUV3( address _router, address _quoter2, uint24 _fee, address _tokenIn, address _tokenOut, uint256 _amtIn, uint256 _maxSlippage) internal returns (uint256){

        TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

        uint256 amountOutMin = getAmountOutMin(_quoter2, _tokenIn, _tokenOut, _fee, _amtIn, _maxSlippage);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams ({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: _fee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amtIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        uint256 amountOut = ISwapRouter(_router).exactInputSingle(params);

        return amountOut;
    }

    function poolSwapUV3(address _pool, address _tokenIn, uint256 _amountIn, address _recipient) internal returns (uint256 amountOut) {

        // Interface for the Uniswap V3 pool
        IUniswapV3Pool pool = IUniswapV3Pool(_pool);

        // determine zero for one
        address token0 = pool.token0();
        bool zeroForOne = (_tokenIn == token0);

        // Approve the pool contract to spend the input tokens
        TransferHelper.safeApprove(_tokenIn, _pool, _amountIn);

        // placeholder for callback data
        bytes memory data = abi.encode(_recipient);

        // Call the swap function on the pool contract
        (int256 amount0, int256 amount1) = pool.swap(_recipient, zeroForOne, int256(_amountIn), 0, data);

        // Determine `amountOut` based on the direction of the swap
        if (zeroForOne) {
            amountOut = uint256(amount1 > 0 ? amount1 : -amount1);
        } else {
            amountOut = uint256(amount0 > 0 ? amount0 : -amount0);
        }
        return amountOut;
    }
}
