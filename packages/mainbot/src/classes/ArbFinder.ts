import IArbSearchParams from "../interfaces/IArbSearchParams"
import IArbExecutionParams from "../interfaces/IArbExecutionParams";
import SwapEventEmitter from "./SwapEventEmitter";
import ISwapEventData from "../interfaces/ISwapEventData";

class ArbFinder{
    emitter: SwapEventEmitter;
    searchQueue: ISwapEventData[] = [];
    currentlySearching: boolean = false;

    constructor(_emitter: SwapEventEmitter) {
        this.emitter = _emitter;

        this.emitter.on("internalSwapEvent", (data: ISwapEventData) => {
            console.log("Yipee MUTHA PLUCKERS from inside the arb searcher", data);
            this.searchQueue.push(data);
            console.log(`currently searching ${this.currentlySearching}`);
            if (!this.currentlySearching) {
                this.searchForArbs();
            }
            
            // Additional processing logic here
        });
    }

    searchForArbs(): void{
        this.currentlySearching = true;
        
        while (this.searchQueue.length > 0) {
            console.log(`searchQueue length before : ${this.searchQueue.length}`);
            const currentPair: any = this.searchQueue.shift(); // takes the top element from the array to process it
            console.log(`searchQueue length after : ${this.searchQueue.length}`);
            setTimeout(() => console.log(`ArbFinder is searching for arbs for ${currentPair.pairName}`), 2000);
        }
        this.currentlySearching = false;
    }
}

export default ArbFinder;