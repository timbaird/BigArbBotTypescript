import { Contract } from "ethers";
import PriceData from "./IPriceData";
import ListenerTracker from "../classes/ListenerTracker";


interface IPool {
    pool_addr: string;
    pool: Contract;

    loadPrices(): Promise<void>;
    getPrices(): PriceData[];
    startSwapListener(_tracker: ListenerTracker): void;
    handleSwapEvent(): Promise<void>;
}

export default IPool;