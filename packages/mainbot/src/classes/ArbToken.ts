import { Contract } from "ethers";
import ERC20ABI from "../../../../../abis/ERC20_ABI.json";
import ArbUtilities from "./ArbUtilities";

class ArbToken{
    address: string;
    contract: Contract;
    symbol: string = "";
    decimals: number = 0;

    constructor(_address: string, _utils:ArbUtilities) {
        this.address = _address;
        this.contract = new Contract(_address, ERC20ABI, _utils.provider);
    }

    async initalise(): Promise<void> {
        try {
            return Promise.all([this.contract.symbol(), this.contract.decimals()]).then((data) => {
                return new Promise((resolve) => {
                    this.symbol = data[0];
                    this.decimals = data[1];
                    resolve();
                })
            })

        } catch (ex: any) {
            throw ex;
        }
    }

    toString(): string {
        return this.symbol;
    }
}

export default ArbToken;