"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArbFinder {
    constructor(_emitter) {
        this.searchQueue = [];
        this.currentlySearching = false;
        this.emitter = _emitter;
        this.emitter.on("internalSwapEvent", (data) => {
            console.log("Yipee MUTHA PLUCKERS from inside the arb searcher", data);
            this.searchQueue.push(data);
            console.log(`currently searching ${this.currentlySearching}`);
            if (!this.currentlySearching) {
                this.searchForArbs();
            }
            // Additional processing logic here
        });
    }
    searchForArbs() {
        this.currentlySearching = true;
        while (this.searchQueue.length > 0) {
            console.log(`searchQueue length before : ${this.searchQueue.length}`);
            const currentPair = this.searchQueue.shift(); // takes the top element from the array to process it
            console.log(`searchQueue length after : ${this.searchQueue.length}`);
            setTimeout(() => console.log(`ArbFinder is searching for arbs for ${currentPair.pairName}`), 2000);
        }
        this.currentlySearching = false;
    }
}
exports.default = ArbFinder;
