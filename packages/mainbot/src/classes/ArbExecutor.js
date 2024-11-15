"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArbExecutor {
    constructor(_utils) {
        this.arbQueue = [];
        this.currentlyExecuting = false;
        this.utils = _utils;
        this.utils.arbEmitter.on("arbitrageDetected", (data) => {
            this.utils.logger.log("info", `arbQueue length at EVENT : ${this.arbQueue.length}`);
            // only add arb searches to the queue if there is not already a search queued for that pair or item.
            // if multiple swaps come on the same arb pair come in in quick succession this stops duplicate checking
            if (!this.arbQueue.some(item => item.routers[0] === data.routers[0] &&
                item.routers[1] === data.routers[1] &&
                item.tokens[0].address === data.tokens[0].address &&
                item.tokens[1].address === data.tokens[1].address)) {
                // the push option put the next arb search at the bottom of the queue
                this.arbQueue.push(data);
                // an alternative is to use the unshift option to put the freshed arb check
                // at the top of the array?? test and see which give best results
                //this.searchQueue.unshift(data);
            }
            if (!this.currentlyExecuting) {
                this.executeArbs();
            }
        });
    }
    async executeArbs() {
        this.currentlyExecuting = true;
        while (this.arbQueue.length > 0) {
            const current = this.arbQueue.shift(); // takes the top element from the array to process it
            this.utils.logger.log("info", `****** DUMMY EXECUTING ARB for ${current.token0Amt} of ${current.tokens[0].symbol}-${current.tokens[1].symbol}`, true);
            this.utils.logger.log("info", `****** protocol0 ${current.protocols[0]} | protocol1 ${current.protocols[1]} | token0AmtInWeiBuy ${current.token0AmtInWeiBuy} | token1AmtOutWeiBuy ${current.token1AmtOutWeiBuy} | EST profit: ${current.estimatedProfit}`, true);
            // interface IArbExecutionParams {
            //     tokens: ArbToken[],
            //     protocols: string[],
            //     routers: string[],
            //     token0AmtIn: number,
            //     token0AmtInWeiBuy: bigint,
            //     token1AmtOutWeiBuy: bigint,
            //     estimatedProfit: number
            // }
            // simulating the arb execution taking some time
            await this.utils.wait(1000);
        } // end while loop
        this.currentlyExecuting = false;
    } // end function
} // end class
exports.default = ArbExecutor;
