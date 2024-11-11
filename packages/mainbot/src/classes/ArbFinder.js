"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArbFinder {
    constructor(_utils) {
        this.searchQueue = [];
        this.currentlySearching = false;
        this.utils = _utils;
        this.utils.swapEmitter.on("internalSwapEvent", (data) => {
            this.searchQueue.push(data);
            if (!this.currentlySearching) {
                this.searchForArbs();
            }
        });
    }
    async searchForArbs() {
        this.currentlySearching = true;
        while (this.searchQueue.length > 0) {
            //console.log(`searchQueue length before : ${this.searchQueue.length}`);
            const currentPair = this.searchQueue.shift(); // takes the top element from the array to process it
            //console.log(`searchQueue length after : ${this.searchQueue.length}`);
            await this.utils.wait(1000);
            console.log(`ArbFinder is searching for arbs for ${currentPair.pairName}`);
            await this.utils.wait(5000);
            console.log(`No arbs found for ${currentPair.pairName}`);
        }
        this.currentlySearching = false;
    }
}
exports.default = ArbFinder;
