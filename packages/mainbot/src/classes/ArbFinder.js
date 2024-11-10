"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArbFinder {
    constructor(_utils) {
        this.searchQueue = [];
        this.currentlySearching = false;
        this.utils = _utils;
        this.utils.swapEmitter.on("internalSwapEvent", (data) => {
            console.log("Yipee MUTHA PLUCKERS from inside the arb searcher", data);
            this.searchQueue.push(data);
            console.log(`currently searching ${this.currentlySearching}`);
            if (!this.currentlySearching) {
                console.log("calling searchForArbs function");
                this.searchForArbs();
            }
            else {
                console.log("not calling searchForArbs function - already running");
            }
            // Additional processing logic here
        });
    }
    async searchForArbs() {
        this.currentlySearching = true;
        while (this.searchQueue.length > 0) {
            console.log(`searchQueue length before : ${this.searchQueue.length}`);
            const currentPair = this.searchQueue.shift(); // takes the top element from the array to process it
            console.log(`searchQueue length after : ${this.searchQueue.length}`);
            await this.utils.wait(1000);
            console.log(`ArbFinder is searching for arbs for ${currentPair.pairName}`);
            await this.utils.wait(30000);
            console.log(`No arbs found for ${currentPair.pairName}`);
        }
        this.currentlySearching = false;
    }
}
exports.default = ArbFinder;
