import { WebSocketProvider } from "ethers";
import ListenerTracker from "./ListenerTracker";
import ArbLogger from "./ArbLogger";
import SwapEventEmitter from "./SwapEventEmitter";




class ArbUtilities{
    provider: WebSocketProvider;
    tracker: ListenerTracker;
    logger: ArbLogger;
    swapEmitter: SwapEventEmitter;

    constructor(_webSocket: string, _apiKey:string) {
        
        this.provider = new WebSocketProvider(_webSocket + _apiKey);
        this.logger = new ArbLogger("TEST_LOG xxxxxx", "../../../logs/");
        this.tracker = new ListenerTracker(this.logger);
        this.swapEmitter = new SwapEventEmitter();
    }

    wait (ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ArbUtilities;