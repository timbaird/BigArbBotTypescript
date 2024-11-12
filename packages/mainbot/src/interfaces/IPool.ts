import { Contract } from "ethers";
import PriceData from "./IPriceData";
import ListenerTracker from "../classes/ListenerTracker";
import IPriceData from "./IPriceData";
import ArbToken from "../classes/ArbToken";



interface IPool {
    name: string;
    pool_addr: string;
    pool: Contract;
    priceData: IPriceData[];
    tokens: ArbToken[];
    protocol: string;
    router_addr: string

    loadPrices(): Promise<void>;
    getPrices(): PriceData[];
    startSwapListener(_tracker: ListenerTracker): void;
    handleSwapEvent(): Promise<void>;
    currentlyLoadingPrices: Boolean;
}

export default IPool;