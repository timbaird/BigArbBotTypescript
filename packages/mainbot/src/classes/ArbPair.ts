import { Contract, WebSocketProvider } from "ethers";
import ERC20ABI from "../../../../../abis/ERC20_ABI.json";
import ArbLogger from "./ArbLogger";
import ArbToken from "./ArbToken";
import IPool from "../interfaces/IPool";
import PoolUV2 from "./PoolUV2";
import PoolUV3 from "./PoolUV3";
import ListenerTracker from "./ListenerTracker";
import SwapEventEmitter from "./SwapEventEmitter";
import ArbUtilities from "./ArbUtilities";


class ArbPair{
    token0: ArbToken;
    token1: ArbToken;
    arbInputSizes: number[];
    pools: IPool[] = [];
    utils: ArbUtilities;
    pair_name: string = "";

    constructor(PAIRDATA: any, _utils:ArbUtilities) {
        this.token0 = new ArbToken(PAIRDATA["TOKEN0"]["ADDRESS"], _utils);
        this.token1 = new ArbToken(PAIRDATA["TOKEN1"]["ADDRESS"], _utils);
        this.arbInputSizes = PAIRDATA["ARB_INPUT_SIZES"];
        this.utils = _utils;
    }

    async initialise(PAIRDATA: any): Promise<void>{
        
        await this.token0.initalise();
        await this.token1.initalise();

        

        for (let i = 0; i < PAIRDATA["POOLS"].length; i++) {
            let pool: IPool | null = null;
            switch (PAIRDATA["POOLS"][i]["PROTOCOL"]) {
                case "UNISWAPV2":
                    pool = new PoolUV2(this.toString(), PAIRDATA["POOLS"][i], this.arbInputSizes, [this.token0.decimals , this.token1.decimals] ,this.utils);
                    break;
                case "UNISWAPV3":
                    pool = new PoolUV3(this.toString(), PAIRDATA["POOLS"][i], this.arbInputSizes, [this.token0.decimals , this.token1.decimals] ,this.utils);
                    break;
                case "KYBERCLASSIC_STATIC":
                    console.log("kyber classic static fee pools not yet developed");
                    break;
                case "KYBERCLASSIC_DYNAMIC":
                        console.log("kyber classic dynamic fee pools not yet developed");
                        break;
                case "BALANCERV2":
                    console.log("balancer pools not yet developed");
                    break;
                default:
                    console.log(`pool protocol not recognised ${PAIRDATA["POOLS"][i]["NAME"]} ${PAIRDATA["POOLS"][i]["PROTOCOL"]}`);
            }

            if (pool !== null) {
                pool.startSwapListener(this.utils.tracker);
                await pool.loadPrices();
                this.pools.push(pool);
            }
        }
        console.log(`Finished initialising pools for ${this.toString()}`);
    }

    // this is what is treated as the pairname elsewhere
    toString() {
        return `${this.token0.symbol}-${this.token1.symbol}`;
    }

    pairName() {
        return this.toString();
    }

}

export default ArbPair;