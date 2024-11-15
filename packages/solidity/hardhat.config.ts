// SOLIDITY PACKAGE

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from 'hardhat/config';
const INFURA_API_KEY = vars.get('INFURA_API_KEY');

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
              version: "0.5.16",
            },
            {
              version: "0.8.20",
            },
            {
                version: "0.6.0",
              },
          ],
    },

  networks: {
    hardhat: {
        forking: {
            url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
        }
    }
}
};

export default config;
