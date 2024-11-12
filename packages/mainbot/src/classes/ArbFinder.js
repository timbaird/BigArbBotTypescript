"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArbFinder {
    constructor(_utils) {
        this.searchQueue = [];
        this.currentlySearching = false;
        this.utils = _utils;
        this.utils.swapEmitter.on("internalSwapEvent", (data) => {
            console.log(`searchQueue length at EVENT : ${this.searchQueue.length}`);
            if (!this.searchQueue.some(item => item.pairName === data.pairName)) {
                //if (!this.searchQueue.includes(data)) {
                console.log(`XXXX queuing search for ${data.pairName}`);
                this.searchQueue.push(data);
            }
            else {
                console.log(`YYYY Arb search on ${data.pairName} pair already queued`);
            }
            if (!this.currentlySearching) {
                this.searchForArbs();
            }
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
            await this.utils.wait(5000);
            console.log(`No arbs found for ${currentPair.pairName}`);
        }
        this.currentlySearching = false;
    }
}
exports.default = ArbFinder;
