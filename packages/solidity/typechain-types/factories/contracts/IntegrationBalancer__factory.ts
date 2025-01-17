/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  IntegrationBalancer,
  IntegrationBalancerInterface,
} from "../../contracts/IntegrationBalancer";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea26469706673582212207c4e7532f2814d1e2ef96b01a236ba749a3dbd00202c9dd4607008cdf46bddb964736f6c63430008140033";

type IntegrationBalancerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: IntegrationBalancerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class IntegrationBalancer__factory extends ContractFactory {
  constructor(...args: IntegrationBalancerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      IntegrationBalancer & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): IntegrationBalancer__factory {
    return super.connect(runner) as IntegrationBalancer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): IntegrationBalancerInterface {
    return new Interface(_abi) as IntegrationBalancerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IntegrationBalancer {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IntegrationBalancer;
  }
}
