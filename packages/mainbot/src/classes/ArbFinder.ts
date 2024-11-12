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
            console.log(`searchQueue length at EVENT : ${this.searchQueue.length}`);
            // only add arb searches to the queue if there is not already a search queued for that pair or item.
            // if multiple swaps come on the same arb pair come in in quick succession this stops duplicate checking
            if(!this.searchQueue.some(item => item.pairName === data.pairName)){
            //if (!this.searchQueue.includes(data)) {
                //console.log(`XXXX queuing search for ${data.pairName}`);

                // the push option put the next arb search at the bottom of the queue
                this.searchQueue.push(data);
                // an alternative is to use the unshift option to put the freshed arb check
                // at the top of the array?? test and see which give best results
                //this.searchQueue.unshift(data);

            }

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