import * as dotenv from 'dotenv'

import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades'

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        const balance = await hre.ethers.provider.getBalance(account.address)

        console.log(account.address, ':', hre.ethers.utils.formatUnits(balance, 'ether'))
    }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
    solidity: '0.8.9',
    networks: {
        ropsten: {
            url: process.env.ROPSTEN_URL || '',
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        entropy: {
            url: 'http://alb-chain-stage-edge-1070023354.ap-southeast-1.elb.amazonaws.com',
            accounts: { mnemonic: process.env.mnemonic, count: 40 },
            gas: 'auto',
            gasPrice: 'auto',
        },
        deadcat: {
            url: 'http://52.78.81.195:16812',
            accounts: { mnemonic: process.env.mnemonicEther, count: 40 },
            gas: 'auto',
            gasPrice: 'auto',
        },
        eth: {
            url: 'https://mainnet.infura.io/v3/f46896f9ca304f76b63471fe298f8fba',
            accounts: { mnemonic: process.env.mnemonicEther, count: 40 },
            gas: 'auto',
            gasPrice: 'auto',
        },
        gorli: {
            url: 'https://goerli.infura.io/v3/f46896f9ca304f76b63471fe298f8fba',
            accounts: { mnemonic: process.env.mnemonicEther, count: 40 },
            gas: 'auto',
            gasPrice: 'auto',
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: 'USD',
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
}

export default config
