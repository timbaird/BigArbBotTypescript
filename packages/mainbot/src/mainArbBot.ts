// bring in required libraries etc.
import { vars } from "hardhat/config";

// bring in my custom classes
import GracefulExit from "./classes/GracefulExit";
import ArbPair from './classes/ArbPair';
import ArbFinder from "./classes/ArbFinder";
import ArbUtilities from "./classes/ArbUtilities";

const INFURA_API_KEY: string = vars.get("INFURA_API_KEY");

async function main(DATA: any): Promise<void>{
    
    const utils = new ArbUtilities(DATA["WEBSOCKET"], INFURA_API_KEY);
    GracefulExit.setUp(utils);
    const pair: ArbPair = new ArbPair(DATA["PAIRS"][0], utils);
    // initialise is done seperately here because it involves async
    // operations and need to be awaited, which it is simpler to do here
    // than in the ArbPair constructor
    await pair.initialise(DATA["PAIRS"][0]);

    const finder: ArbFinder = new ArbFinder(utils);
}

export default main;



