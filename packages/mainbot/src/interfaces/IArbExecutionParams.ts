import ArbToken from "../classes/ArbToken";
import { Contract } from "ethers";

interface IArbExecutionParams {
    tokens: ArbToken[],
    protocols: string[],
    routers: string[],
    token0AmtIn: number,
    token0AmtInWeiBuy: bigint,
    token1AmtOutWeiBuy: bigint,
    estimatedProfit: number
}

export default IArbExecutionParams;