// bring in required libraries etc.
import {
    ContractRunner, Contract, ethers, formatUnits, parseEther, TransactionResponse,
    TransactionDescription, Provider, BigNumberish, JsonRpcProvider, WebSocketProvider
} from "ethers";
import { vars } from "hardhat/config";
import hre from "hardhat";

// bring in my custom classes
import ArbLogger from "./classes/ArbLogger"
import GracefulExit from "./classes/GracefulExit";
import ListenerTracker from "./classes/ListenerTracker";
//import PoolUV2 from "./classes/PoolUV2";
//import IPool from "./interfaces/IPool";
//import ArbToken from './classes/ArbToken';
import ArbPair from './classes/ArbPair';
import SwapEventEmitter from "./classes/SwapEventEmitter";
import ISwapEventData from "./interfaces/ISwapEventData";
import ArbFinder from "./classes/ArbFinder";



// bring in the data from the relevant data files
const INFURA_API_KEY: string = vars.get("INFURA_API_KEY");

async function main(DATA: any): Promise<void>{
    
    // set up background services and infrastructure
    const provider: WebSocketProvider = new ethers.WebSocketProvider(DATA["WEBSOCKET"] + INFURA_API_KEY);
    const logger: ArbLogger = new ArbLogger("TEST_PAIR", "../../../logs/");
    const tracker: ListenerTracker = new ListenerTracker(logger);
    const emitter: SwapEventEmitter = new SwapEventEmitter();
    GracefulExit.setUp(tracker, provider, logger);

    const pair: ArbPair = new ArbPair(DATA["PAIRS"][0], provider, tracker, emitter, logger);

    await pair.initialise(DATA["PAIRS"][0]);

    const finder: ArbFinder = new ArbFinder(emitter);
}

export default main;



