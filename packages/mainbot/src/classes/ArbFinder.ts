import IArbExecutionParams from "../interfaces/IArbExecutionParams";
import ISwapEventData from "../interfaces/ISwapEventData";
import ArbUtilities from "./ArbUtilities";
import ArbPair from "./ArbPair";
import IPriceData from "../interfaces/IPriceData";
import IGasEstimate from "../interfaces/IGasEstimate";

class ArbFinder{
    searchQueue: ISwapEventData[] = [];
    currentlySearching: boolean = false;
    utils: ArbUtilities;
    pairs: ArbPair[];
    gasEstimate: number = 0;  // denominated in wei

    constructor(_pairs: ArbPair[], _utils: ArbUtilities, ) {
        this.utils = _utils;
        this.pairs = _pairs;

        this.utils.swapEmitter.on("internalSwapEvent", (data: ISwapEventData) => {
            this.utils.logger.log("info", `searchQueue length at EVENT : ${this.searchQueue.length}`);
            // only add arb searches to the queue if there is not already a search queued for that pair or item.
            // if multiple swaps come on the same arb pair come in in quick succession this stops duplicate checking
            if(!this.searchQueue.some(item => item.pairName === data.pairName)){

                // the push option put the next arb search at the bottom of the queue
                this.searchQueue.push(data);
                // an alternative is to use the unshift option to put the freshed arb check
                // at the top of the array?? test and see which give best results
                //this.searchQueue.unshift(data);

            }

            if (!this.currentlySearching) {
                this.searchForArbs();
            } else {
                this.utils.logger.log("info", `ArbFinder : already searching, not re-initiated`);
            }
        });

        this.utils.gasEmitter.on("newGasEstimate", (data: IGasEstimate) => {
            // this functionality is in place for future development
            // for the moment on polygon the gas is so negligent that
            // it isn't worth inclduing in calculation

            //this.gasEstimate = data.estimate;

            // static for use on polygon which typically has < 1 cent gas cost on token transfer
            this.gasEstimate = 0.01;

            // USD - eth based pairs are used as gas oracles
            // any gas estimates coming in should only be based on a usd weth based pair
            //this.utils.logger.log("info", `ArbFinder : gasEstimate update event recieved`);
        })
    }

    async searchForArbs(): Promise<void> {

        this.currentlySearching = true;

        while (this.searchQueue.length > 0) {
            
            try {
                this.utils.logger.log("info", `searchQueue length at PRIOR to SHIFT : ${this.searchQueue.length}`);
                const current: any = this.searchQueue.shift(); // takes the top element from the array to process it
                this.utils.logger.log("info", `searchQueue length at AFTER SHIFT : ${this.searchQueue.length}`);
                
                const pairToCheck = this.pairs.find(pair => pair.toString() == current.pairName);

                if (pairToCheck == null || pairToCheck == undefined) {
                    throw new Error(`ArbFinder.searchForArbs : ${current.pairName} pair not found`);
                } else {

                    const aest = new Date().toLocaleString();
                    this.utils.logger.log("info", `checking for arbs on ${pairToCheck.toString()} at ${aest}`);

                    let mostProfitableArb: IArbExecutionParams | null = null;

                    // for each combination of pools in the pair
                    for (let i: number = 0; i < pairToCheck.pools.length - 1; i++) {
                        for (let j:number = i + 1; j < pairToCheck.pools.length; j++) {

                            // this check that priceData isn't in the middle of loading and if it is, gives it a moment to contnue loading
                            while (pairToCheck.pools[i].currentlyLoadingPrices || pairToCheck.pools[j].currentlyLoadingPrices) {
                                    await new Promise(resolve => setTimeout(resolve, 250)); // Poll every 100ms
                            }

                            let prices_i: IPriceData[] = pairToCheck.pools[i].getPrices();
                            let prices_j: IPriceData[] = pairToCheck.pools[j].getPrices();

                            if (prices_i.length !== prices_j.length) {
                                throw new Error(`ArbFinder.searchForArbs : Invalid price data LENGTHs - pair ${current.pairName} : pools ${pairToCheck.pools[i].name} | ${prices_i.length} | ${pairToCheck.pools[j].name} | ${prices_j.length}`);
                            }
                            
                            // this should start with the lowest priced input size and work up
                            for (let k = 0; k < pairToCheck.arbInputSizes.length; k++) {

                                const arbSize: number = pairToCheck.arbInputSizes[k];
                                const i_buy = prices_i.find(p => p.amt == arbSize && p.direction == "BUY");
                                const i_sell = prices_i.find(p => p.amt == arbSize && p.direction == "SELL");
                                const j_buy = prices_j.find(p => p.amt == arbSize && p.direction == "BUY");
                                const j_sell = prices_j.find(p => p.amt == arbSize && p.direction == "SELL");
                                
                                if (i_buy == null || j_buy == null || i_sell == null || j_sell == null ||
                                    i_buy == undefined || j_buy == undefined || i_sell == undefined || j_sell == undefined) {
                                    throw new Error(`ArbFinder.searchForArbs : Invalid price data BUY_SELL - pair ${current.pairName} : pools ${pairToCheck.pools[i].name} | ${pairToCheck.pools[j].name}| ${prices_i.length} | ${prices_j.length}`)
                                }

                                if (i_buy.price < j_sell.price) {
                                    // estimated profit take gas into consideration
                                    const estimatedProfit = this.estimateProfit(i_buy.price, j_sell.price, arbSize);
                                    
                                    if (estimatedProfit > 0 && (mostProfitableArb === null || mostProfitableArb["estimatedProfit"] < estimatedProfit)) {
                                        this.utils.logger.log("info", `ArbFinder.searchForArbs:(first or better) arb found for ${arbSize} | ${current.pairName} | ${pairToCheck.pools[i].name} | ${i_buy.price} => ${pairToCheck.pools[j].name} | ${j_sell.price} | est profit: ${estimatedProfit}`);
                                        mostProfitableArb = {
                                            token0: pairToCheck.pools[i].tokens[0],
                                            token1: pairToCheck.pools[i].tokens[1],
                                            protocol0: pairToCheck.pools[i].protocol,
                                            router0_addr: pairToCheck.pools[i].router_addr,
                                            protocol1: pairToCheck.pools[j].protocol,
                                            router1_addr: pairToCheck.pools[j].router_addr,
                                            amountIn: arbSize,
                                            estimatedProfit: estimatedProfit
                                        }
                                    }
                                } else if (j_buy.price < i_sell.price) {

                                    // estimated profit take gas into consideration
                                    const estimatedProfit = this.estimateProfit(j_buy.price, i_sell.price, arbSize);
                                    
                                    // possibly change the etimated profit condition to a data base parameter rather than 0 in the future
                                    if (estimatedProfit > 0 && (mostProfitableArb === null || mostProfitableArb["estimatedProfit"] < estimatedProfit)) {
                                        this.utils.logger.log("info", `ArbFinder.searchForArbs: (first or better) arb found for ${arbSize} | ${current.pairName} | ${pairToCheck.pools[j].name} | ${j_buy.price} => ${pairToCheck.pools[i].name} | ${i_sell.price}| est profit: ${estimatedProfit}`);
                                        mostProfitableArb = {
                                            token0: pairToCheck.pools[i].tokens[0],
                                            token1: pairToCheck.pools[i].tokens[1],
                                            protocol0: pairToCheck.pools[j].protocol,
                                            router0_addr: pairToCheck.pools[j].router_addr,
                                            protocol1: pairToCheck.pools[i].protocol,
                                            router1_addr: pairToCheck.pools[i].router_addr,
                                            amountIn: arbSize,
                                            estimatedProfit: estimatedProfit
                                        }
                                    }
                                } else {
                                    this.utils.logger.log("info", `No arb found for ${current.pairName} | ${pairToCheck.pools[i].name} | ${pairToCheck.pools[j].name} at ${arbSize}`);
                                    // this inner loop should start with the lowest priced input sizes and work up
                                    // it is assumed that if there is no arb at the lowest input size, then there will be nor arbs at higher input prices
                                    // trying implementation of this for ALL pools in pair (2 loops out), not just between 2 pools
                                    break;
                                }
                            }
                        }
                    }
                    // end of checking all pools in the pair
                    if (mostProfitableArb !== null)
                        this.utils.arbEmitter.emit('arbitrageDetected', mostProfitableArb);
                }
            } catch (ex: any) {
                this.utils.logger.log("info", `ArbFinder.searchForArbs : ${ex.message}`, true);
            }

        }// end while loop
        this.currentlySearching = false;
    } // end function

    estimateProfit(buyPrice: number, sellPrice: number, amount: number) {
        const buyAmount = amount / buyPrice;
        const sellAmount = buyAmount * sellPrice;
        const profit = sellAmount - (amount + (2 * this.gasEstimate));
        this.utils.logger.log("info", `ArbFinder.estimateProfit : amountIn: ${amount}, buyPrice : ${buyPrice}, amountBought: ${buyAmount}, sellPrice: ${sellPrice}, Amount returned from sale: ${sellAmount}, estProfit ${profit}`);
        return profit
    }

} // end class

export default ArbFinder;