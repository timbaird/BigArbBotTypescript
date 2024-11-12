"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArbFinder {
    constructor(_pairs, _utils) {
        this.searchQueue = [];
        this.currentlySearching = false;
        this.utils = _utils;
        this.pairs = _pairs;
        this.utils.swapEmitter.on("internalSwapEvent", (data) => {
            //console.log(`searchQueue length at EVENT : ${this.searchQueue.length}`);
            // only add arb searches to the queue if there is not already a search queued for that pair or item.
            // if multiple swaps come on the same arb pair come in in quick succession this stops duplicate checking
            if (!this.searchQueue.some(item => item.pairName === data.pairName)) {
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
    async searchForArbs() {
        this.currentlySearching = true;
        while (this.searchQueue.length > 0) {
            try {
                const current = this.searchQueue.shift(); // takes the top element from the array to process it
                const pairToCheck = this.pairs.find(pair => pair.toString() == current.pairName);
                if (pairToCheck == null || pairToCheck == undefined) {
                    throw new Error(`ArbFinder.searchForArbs : ${current.pairName} pair not found`);
                }
                else {
                    const aest = new Date().toLocaleString();
                    //console.log(`checking for arbs on ${pairToCheck.toString()} at ${aest}`);
                    let possibleArbs = [];
                    // for each combination of pools in the pair
                    for (let i = 0; i < pairToCheck.pools.length - 1; i++) {
                        for (let j = i + 1; j < pairToCheck.pools.length; j++) {
                            // this check that priceData isn't in the middle of loading and if it is, gives it a moment to contnue loading
                            while (pairToCheck.pools[i].currentlyLoadingPrices || pairToCheck.pools[j].currentlyLoadingPrices) {
                                await new Promise(resolve => setTimeout(resolve, 250)); // Poll every 100ms
                            }
                            let prices_i = pairToCheck.pools[i].getPrices();
                            let prices_j = pairToCheck.pools[j].getPrices();
                            if (prices_i.length !== prices_j.length) {
                                throw new Error(`ArbFinder.searchForArbs : Invalid price data LENGTHs - pair ${current.pairName} : pools ${pairToCheck.pools[i].name} | ${prices_i.length} | ${pairToCheck.pools[j].name} | ${prices_j.length}`);
                            }
                            let mostProfitableArb = null;
                            // this should start with the lowest priced input size and work up
                            for (let k = 0; k < pairToCheck.arbInputSizes.length; k++) {
                                const arbSize = pairToCheck.arbInputSizes[k];
                                const i_buy = prices_i.find(p => p.amt == arbSize && p.direction == "BUY");
                                const i_sell = prices_i.find(p => p.amt == arbSize && p.direction == "SELL");
                                const j_buy = prices_j.find(p => p.amt == arbSize && p.direction == "BUY");
                                const j_sell = prices_j.find(p => p.amt == arbSize && p.direction == "SELL");
                                if (i_buy == null || j_buy == null || i_sell == null || j_sell == null ||
                                    i_buy == undefined || j_buy == undefined || i_sell == undefined || j_sell == undefined) {
                                    throw new Error(`ArbFinder.searchForArbs : Invalid price data BUY_SELL - pair ${current.pairName} : pools ${pairToCheck.pools[i].name} | ${pairToCheck.pools[j].name}| ${prices_i.length} | ${prices_j.length}`);
                                }
                                if (i_buy.price < j_sell.price) {
                                    console.log(`potential_arb found for ${arbSize} | ${current.pairName} | ${pairToCheck.pools[i].name} | ${i_buy.price} => ${pairToCheck.pools[j].name} | ${j_sell.price}`);
                                    const estimatedProfit = this.estimateProfit(i_buy.price, j_sell.price, arbSize);
                                    if (mostProfitableArb === null || mostProfitableArb["estimatedProfit"] < estimatedProfit) {
                                        mostProfitableArb = {
                                            token0: pairToCheck.pools[i].tokens[0],
                                            token1: pairToCheck.pools[i].tokens[1],
                                            protocol0: pairToCheck.pools[i].protocol,
                                            router0_addr: pairToCheck.pools[i].router_addr,
                                            protocol1: pairToCheck.pools[j].protocol,
                                            router1_addr: pairToCheck.pools[j].router_addr,
                                            amountIn: arbSize,
                                            estimatedProfit: estimatedProfit
                                        };
                                    }
                                }
                                else if (j_buy.price < i_sell.price) {
                                    console.log(`potential_arb found for ${arbSize} | ${current.pairName} | ${pairToCheck.pools[j].name} | ${j_buy.price} => ${pairToCheck.pools[i].name} | ${i_sell.price}`);
                                    const estimatedProfit = this.estimateProfit(i_buy.price, j_sell.price, arbSize);
                                    if (mostProfitableArb === null || mostProfitableArb["estimatedProfit"] < estimatedProfit) {
                                        mostProfitableArb = {
                                            token0: pairToCheck.pools[i].tokens[0],
                                            token1: pairToCheck.pools[i].tokens[1],
                                            protocol0: pairToCheck.pools[j].protocol,
                                            router0_addr: pairToCheck.pools[j].router_addr,
                                            protocol1: pairToCheck.pools[i].protocol,
                                            router1_addr: pairToCheck.pools[i].router_addr,
                                            amountIn: arbSize,
                                            estimatedProfit: estimatedProfit
                                        };
                                    }
                                }
                                else {
                                    //console.log(`No arb found for ${current.pairName} | ${pairToCheck.pools[i].name} | ${pairToCheck.pools[j].name} at ${arbSize}`);
                                    // this process/loop should start with the lowest priced input sizes and work up
                                    // it is assumed that if there is no arb at the lowest input size, then there will be nor arbs at higher input prices
                                    if (mostProfitableArb !== null)
                                        this.utils.arbEmitter.emit('arbitrageDetected', mostProfitableArb);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        } // end while loop
        this.currentlySearching = false;
    } // end function
    estimateProfit(buyPrice, sellPrice, amount) {
        const buyAmount = amount / buyPrice;
        const sellAmount = buyAmount * sellPrice;
        const profit = sellAmount - amount;
        //console.log(amount, buyPrice, buyAmount, sellPrice, sellAmount, profit);
        return profit;
    }
} // end class
exports.default = ArbFinder;
