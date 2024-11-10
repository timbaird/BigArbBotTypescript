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


// bring in the data from the relevant data files
import { TOKENS, RPC_URL, CHAIN_ID, WEBSOCKET } from '../../../../Utilities/dataFiles/polygon/polygon_erc20_token_addresses';
//import { EXCHANGES } from '../../../../Utilities/dataFiles/polygon/exchanges/polygon_uniswapv3_exchanges';
const INFURA_API_KEY: string = vars.get("INFURA_API_KEY");

// set up background services and infrastructure
const provider: WebSocketProvider = new ethers.WebSocketProvider(WEBSOCKET + INFURA_API_KEY);
const logger: ArbLogger = new ArbLogger("TEST_PAIR", "../../../logs/");
const tracker: ListenerTracker = new ListenerTracker(logger);
GracefulExit.setUp(tracker, provider, logger);


