"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationBalancer__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
];
const _bytecode = "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea26469706673582212207c4e7532f2814d1e2ef96b01a236ba749a3dbd00202c9dd4607008cdf46bddb964736f6c63430008140033";
const isSuperArgs = (xs) => xs.length > 1;
class IntegrationBalancer__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static createInterface() {
        return new ethers_1.Interface(_abi);
    }
    static connect(address, runner) {
        return new ethers_1.Contract(address, _abi, runner);
    }
}
exports.IntegrationBalancer__factory = IntegrationBalancer__factory;
IntegrationBalancer__factory.bytecode = _bytecode;
IntegrationBalancer__factory.abi = _abi;
