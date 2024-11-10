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

    function getAmountsOut(
        uint256 amountIn,
        address[] calldata poolsPath,
        IERC20[] calldata path
    ) external view returns (uint256[] memory amounts);
}

// designed to be inherrited by contracts that need to do swaps on uniswapv2
//abstract contract SwapperUniswapV3 {

contract IntegrationKyberClassic {

    constructor() {}

    // returns the amount of token B to expect out of an exchange based on a given amount of token A in
    function getAmountOutMinKyberClassic(address _router, uint256 _amtIn, address[] memory _poolPath, IERC20[] memory _tokenPath) public view returns(uint256){
        
        uint256[] memory amounts = IDMMExchangeRouter(_router).getAmountsOut(_amtIn, _poolPath, _tokenPath);
        return amounts[_tokenPath.length - 1];
    }


    // executes a straight up swap between ERC20 tokens on a Kyberswap exchange
    function swapERC20KyberClassic( address _router, address _tokenIn, address _tokenOut, address[] memory _poolPath, uint256 _amtIn) internal returns (uint256){

        TransferHelper.safeApprove(_tokenIn, _router, _amtIn);

        // put together the path variable for the swap
        IERC20[] memory tokenPath = new IERC20[](2);
        tokenPath[0] = IERC20(_tokenIn);
        tokenPath[1] = IERC20(_tokenOut);

        // get the router
        IDMMExchangeRouter  router = IDMMExchangeRouter (_router);

        // calculate amounts out min
        uint256 amtOutMin = getAmountOutMinKyberClassic(_router, _amtIn, _poolPath, tokenPath);
        
        // make the trade
        uint[] memory amounts = router.swapExactTokensForTokens(_amtIn, amtOutMin, _poolPath, tokenPath, address(this), block.timestamp);
        // this should be the amount returned from the trade
        return amounts[1];
    }
}