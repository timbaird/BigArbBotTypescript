// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
   
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract ArbRoleManager is AccessControl{

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ARB_EXECUTOR_ROLE = keccak256("ARB_EXECUTOR_ROLE");
    address private owner;

    constructor() AccessControl()
    {
        // owner has all admin rights and can set other admins and arb executors
        owner = msg.sender;
    }

    // ACCESS CONTROL STUFF
    function ownerGrantRole(bytes32 role, address grantee) public onlyOwner{
        _grantRole(role, grantee);
    }

    function changeOwner(address newOwner) onlyOwner external {
        owner = newOwner;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    // modifiers

    modifier onlyArbExecutor {
        require(hasRole(ARB_EXECUTOR_ROLE, msg.sender) || msg.sender == owner, "You are not authorised");
        _;
    }

    modifier onlyAdmin {
        require(hasRole(ADMIN_ROLE, msg.sender) || msg.sender == owner, "You are not authorised");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not authorised");
        _;
    }
}