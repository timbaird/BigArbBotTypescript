import IArbSearchParams from "../interfaces/IArbSearchParams"
import IArbExecutionParams from "../interfaces/IArbExecutionParams";
import SwapEventEmitter from "./SwapEventEmitter";
import ISwapEventData from "../interfaces/ISwapEventData";
import ArbUtilities from "./ArbUtilities";

class ArbFinder{
    searchQueue: ISwapEventData[] = [];
    currentlySearching: boolean = false;
    utils: ArbUtilities;

    constructor(_utils: ArbUtilities) {
        this.utils = _utils;

        this.utils.swapEmitter.on("internalSwapEvent", (data: ISwapEventData) => {
            this.searchQueue.push(data);
            if (!this.currentlySearching) {
                this.searchForArbs();
            }
        });
    }

    async searchForArbs(): Promise<void>{
        this.currentlySearching = true;
        
        while (this.searchQueue.length > 0) {
            //console.log(`searchQueue length before : ${this.searchQueue.length}`);
            const currentPair: any = this.searchQueue.shift(); // takes the top element from the array to process it
            //console.log(`searchQueue length after : ${this.searchQueue.length}`);
            await this.utils.wait(1000);
            console.log(`ArbFinder is searching for arbs for ${currentPair.pairName}`);
            await this.utils.wait(5000);
            console.log(`No arbs found for ${currentPair.pairName}`);
        }

        this.currentlySearching = false;
    }
}

export default ArbFinder;