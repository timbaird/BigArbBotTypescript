// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Multicall {
    function multicall(address[] calldata targets, bytes[] calldata data) external returns (bytes[] memory results) {
        require(targets.length == data.length, "Targets and data length mismatch");
        results = new bytes[](data.length);
        for (uint i = 0; i < targets.length; i++) {
            (bool success, bytes memory result) = targets[i].call(data[i]);
            require(success, "Call failed");
            results[i] = result;
        }
    }
}