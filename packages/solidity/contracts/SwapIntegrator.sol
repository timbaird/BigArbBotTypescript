// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {swapUniswapV2} from "./swapUniswapV2.sol";
import {swapUniswapV3} from "./swapUniswapV3.sol";
import {swapKyberClassic} from "./swapKyberClassic.sol";
import {swapBalancer} from "./swapBalancer.sol";

// designed to be inherrited by contracts that need to do swaps on uniswapv2
abstract contract SwapIntegrator is swapUniswapV2, swapUniswapV3, swapKyberClassic, swapBalancer {

    constructor() swapUniswapV2() swapUniswapV3() swapKyberClassic() swapBalancer() {}

    function swapERC20 ( ) public returns (uint256){

        uint256 returnVal =1;
        /*
        if(_protocol == "UNISWAPV2"){
            returnVal = swapERC20UniswapV2(_router, _tokenIn, _tokenOut, _amtIn);
        } else if (_protocol == "UNISWAPV3"){
            returnVal = swapERC20UniswapV3(  XXXXXXX_router, _tokenIn, _tokenOut, _amtIn);
        } else if (_protocol == "KYBERCLASSIC"){
            returnVal = swapERC20KyberClassic(  XXXXXXX_router, _tokenIn, _tokenOut, _amtIn);
        } else if (_protocol == "BALANCER"){
            returnVal = swapERC20Balancer(  XXXXXXX_router, _tokenIn, _tokenOut, _amtIn);
        } else {
            revert(abi.encodedPacked("Swapper.swapERC20 function - invalid protocol passed: ", _protocol));
        }
        */
        return returnVal;
    }
}
