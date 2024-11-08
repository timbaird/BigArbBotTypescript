// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";


// designed to be inherrited by contracts that need to do swaps on uniswapv2
//abstract contract SwapperUniswapV2 {

contract IntegrationUniswapV2 {

    constructor() {}

    // returns the amount of token B to expect out of an exchange based on a given amount of token A in
    function getAmountOutMinUniswapV2(address router, address[] memory path, uint256 amtIn) public view returns(uint256){
        
        uint256[] memory amounts = IUniswapV2Router02(router).getAmountsOut(amtIn, path);
        return amounts[path.length - 1];
    }


    // executes a straight up swap between ERC20 tokens on a uniswap v2 router
    function swapERC20UniswapV2( address _router, address _tokenIn, address _tokenOut, uint256 _amtIn) internal returns (uint256){

        TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

        // put together the path variable for the swap
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        // get the router
        IUniswapV2Router02 router = IUniswapV2Router02(_router);

        // calculate amounts out min
        uint256 amtOutMin = getAmountOutMinUniswapV2(_router, path, _amtIn);
        
        // make the trade
        uint[] memory amounts = router.swapExactTokensForTokens(_amtIn, amtOutMin, path, address(this), block.timestamp);
        // this should be the amount returned from the trade
        return amounts[1];
    }
}
