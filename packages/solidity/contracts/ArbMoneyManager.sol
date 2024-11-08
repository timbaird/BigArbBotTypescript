// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
   
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ArbRoleManager} from "./ArbRoleManager.sol";

abstract contract ArbMoneyManager is ArbRoleManager{

    // owner and roles set up in ArbRoleManager
    constructor() ArbRoleManager(){}

   function getERC20Balance(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function withdrawERC20(address token, address recipient, uint256 amt) onlyAdmin external {
        IERC20 _token = IERC20(token);
        uint256 balance = _token.balanceOf(address(this));
        require(amt <= balance, "Not enough Tokens in the contract for that withdrawl");
        _token.approve(recipient, amt);
        _token.transfer(recipient, amt);
    }

      function getEthBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdrawEth(address recipient, uint256 amt) onlyAdmin external {
        uint256 balance = address(this).balance;
        require(amt <= balance, "Not enough ETH in the contract for that withdrawl");
        address payable to = payable(recipient);
        to.transfer(amt);
    }

    receive() external payable {}
}