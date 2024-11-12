import { WebSocketProvider, Contract } from "ethers";
import ListenerTracker from "./ListenerTracker";
import ArbLogger from "./ArbLogger";
import SwapEventEmitter from "./SwapEventEmitter";
import MulticallABI from '../../../../../abis/MulticallABI.json';
import ArbEventEmitter from "./ArbEventEmitter";



class ArbUtilities{
    provider: WebSocketProvider;
    tracker: ListenerTracker;
    logger: ArbLogger;
    swapEmitter: SwapEventEmitter;
    arbEmitter: ArbEventEmitter;
    multicall: Contract; 

    constructor(_webSocket: string, _apiKey:string, _multicall_addr: string) {
        
        this.provider = new WebSocketProvider(_webSocket + _apiKey);
        this.logger = new ArbLogger("TEST_LOG xxxxxx", "../../../logs/");
        this.tracker = new ListenerTracker(this.logger);
        this.swapEmitter = new SwapEventEmitter();
        this.arbEmitter = new ArbEventEmitter();
        this.multicall = new Contract(_multicall_addr, MulticallABI, this.provider);
    }

    wait (ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ArbUtilities;