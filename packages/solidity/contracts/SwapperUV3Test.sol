// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SwapperUV3} from "./SwapperUV3.sol";

contract SwapperUV3Test is SwapperUV3 {

    function testGetAmountOutMin(
        address _quoter2,
        address _tokenIn,
        address _tokenOut,
        uint24 _fee,
        uint256 _amtIn,
        uint256 _maxSlippage
    ) external returns (uint256) {
        return getAmountOutMin(_quoter2, _tokenIn, _tokenOut, _fee, _amtIn, _maxSlippage);
    }

    function testRouterSwapUV3(
        address _router,
        address _quoter2,
        uint24 _fee,
        address _tokenIn,
        address _tokenOut,
        uint256 _amtIn,
        uint256 _maxSlippage
    ) external returns (uint256) {
        return routerSwapUV3(_router, _quoter2, _fee, _tokenIn, _tokenOut, _amtIn, _maxSlippage);
    }

    function testPoolSwapUV3(
        address _pool,
        address _tokenIn,
        uint256 _amountIn,
        address _recipient
    ) external returns (uint256) {
        return poolSwapUV3(_pool, _tokenIn, _amountIn, _recipient);
    }
}