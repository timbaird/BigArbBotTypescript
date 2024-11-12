import ArbToken from "../classes/ArbToken";
import { Contract } from "ethers";

interface IArbExecutionParams {
    token0: ArbToken,
    token1: ArbToken,
    protocol0: string,
    router0_addr: string,
    protocol1: string,
    router1_addr: string,
    amountIn: number;
    estimatedProfit: number
}

export default IArbExecutionParams;