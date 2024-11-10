import { Contract, WebSocketProvider } from "ethers";
import ERC20ABI from "../../../../../abis/ERC20_ABI.json";
import ArbLogger from "./ArbLogger";

class ArbToken{
    address: string;
    contract: Contract;
    symbol: string = "";
    decimals: number = 0;

    constructor(_address: string, _provider: WebSocketProvider, _logger: ArbLogger) {
        this.address = _address;
        this.contract = new Contract(_address, ERC20ABI, _provider);
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
            console.log(ex.message);
            throw ex;
        }
    }

    toString(): string {
        return this.symbol;
    }
}

export default ArbToken;