import IArbSearchParams from "../interfaces/IArbSearchParams"
import IArbExecutionParams from "../interfaces/IArbExecutionParams";
import ISwapEventData from "../interfaces/ISwapEventData";
import ArbUtilities from "./ArbUtilities";
import ArbPair from "./ArbPair";
import IPriceData from "../interfaces/IPriceData";
import IPool from "../interfaces/IPool";

class ArbExecutor{
    arbQueue: IArbExecutionParams[] = [];
    currentlyExecutiing: boolean = false;
    utils: ArbUtilities;

    constructor(_utils: ArbUtilities, ) {
        this.utils = _utils;


        this.utils.arbEmitter.on("arbitrageDetected", (data: IArbExecutionParams) => {
            //console.log(`searchQueue length at EVENT : ${this.searchQueue.length}`);
            // only add arb searches to the queue if there is not already a search queued for that pair or item.
            // if multiple swaps come on the same arb pair come in in quick succession this stops duplicate checking
            if (!this.arbQueue.some(item => item.router0_addr === data.router0_addr &&
                                            item.router1_addr === data.router1_addr &&
                                            item.token0.address === data.token0.address &&
                                            item.token1.address === data.token1.address)) {

                // the push option put the next arb search at the bottom of the queue
                this.arbQueue.push(data);
                // an alternative is to use the unshift option to put the freshed arb check
                // at the top of the array?? test and see which give best results
                //this.searchQueue.unshift(data);

            }

            if (!this.currentlyExecutiing) {
                this.executeArbs();
            }
        });
    }

    async executeArbs(): Promise<void> {
        this.currentlyExecutiing = true;

        while (this.arbQueue.length > 0) {
            const current: any = this.arbQueue.shift(); // takes the top element from the array to process it
            console.log(`Executing Arb for ${current.amount} of ${current.token0.name}-${current.token1.name} on ${current.router0_addr} and ${current.router1_addr}`);
            console.log(`NOT YET IMPLEMENTED OT LIVE`);
        }// end while loop

        this.currentlyExecutiing = false;
    } // end function




} // end class

export default ArbExecutor;