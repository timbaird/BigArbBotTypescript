/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface IntegrationUniswapV2Interface extends Interface {
  getFunction(nameOrSignature: "getAmountOutMinUniswapV2"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getAmountOutMinUniswapV2",
    values: [AddressLike, AddressLike[], BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getAmountOutMinUniswapV2",
    data: BytesLike
  ): Result;
}

export interface IntegrationUniswapV2 extends BaseContract {
  connect(runner?: ContractRunner | null): IntegrationUniswapV2;
  waitForDeployment(): Promise<this>;

  interface: IntegrationUniswapV2Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getAmountOutMinUniswapV2: TypedContractMethod<
    [router: AddressLike, path: AddressLike[], amtIn: BigNumberish],
    [bigint],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getAmountOutMinUniswapV2"
  ): TypedContractMethod<
    [router: AddressLike, path: AddressLike[], amtIn: BigNumberish],
    [bigint],
    "view"
  >;

  filters: {};
}
