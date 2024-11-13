// bring in required libraries etc.
import { vars } from "hardhat/config";

// bring in my custom classes
import GracefulExit from "./classes/GracefulExit";
import ArbPair from './classes/ArbPair';
import ArbFinder from "./classes/ArbFinder";
import ArbUtilities from "./classes/ArbUtilities";
import ArbExecutor from "./classes/ArbExecutor";

const INFURA_API_KEY: string = vars.get("INFURA_API_KEY");

async function main(DATA: any): Promise<void>{
    
    const utils = new ArbUtilities(DATA["WEBSOCKET"], INFURA_API_KEY, DATA["MULTICALL_ADDR"], DATA["DEBUGMODE"], DATA["BLOCKCHAIN"]);
    utils.logger.log("info", `############## ${DATA["BLOCKCHAIN"]} APP STARTED ################`, true);
    
    // graceful exits sets up script so it can be exited gracefully witg CTRL^C
    GracefulExit.setUp(utils);

    const pairs: ArbPair[] = [];

    for (let i = 0; i < DATA["PAIRS"].length; i++){
        pairs.push(new ArbPair(DATA["PAIRS"][i], utils));
        // initialise is done seperately here because it involves async
        // operations and need to be awaited, which it is simpler to do here
        // than in the ArbPair constructor
        await pairs[i].initialise(DATA["PAIRS"][i]);
    }
    
    // run arb search and arb execution processes based on events emitted, 
    // so don't need any direct calls here.
    const finder: ArbFinder = new ArbFinder(pairs, utils);
    const executor: ArbExecutor = new ArbExecutor(utils);

}

export default main;
