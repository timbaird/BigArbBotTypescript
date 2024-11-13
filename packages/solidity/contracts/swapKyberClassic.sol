// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// transfer helper includes the ERC20 inerface too.
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

// reference : https://github.com/KyberNetwork/ks-classic-sc/blob/master/contracts/interfaces/IDMMExchangeRouter.sol

interface IDMMExchangeRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata poolsPath,
        IERC20[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    // may need to add function for flash swap
}

// designed to be inherrited by contracts that need to do swaps on uniswapv2
//abstract contract SwapperUniswapV3 {

abstract contract swapKyberClassic {

    constructor() {}

    function initiateKyberClassic() internal returns (uint256){
        // for first swap - get funds for free before swapping and paying them back
            // TransferHelper.safeApprove(_tokenIn, _router, _amtIn);
    }

    // executes a straight up swap between ERC20 tokens on a uniswap v2 exchange
    function middleSwapKyberClassic(   ) internal returns (uint256){
        // for middle swap - get funds for free before swapping and paying them back
            // TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

    }
}