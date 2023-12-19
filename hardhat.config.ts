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
            url: 'https://rpc.entropynetwork.io',
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
            url: 'https://eth-mainnet.g.alchemy.com/v2/ycjs_CKDw2fQNLzH-T7mzQt4W3p15LQD',
            accounts: { mnemonic: process.env.mnemonicEther, count: 40 },
            gas: 'auto',
            gasPrice: 'auto',
        },
        goerli: {
            url: 'https://eth-goerli.g.alchemy.com/v2/uxkc6yaKk4rfJJNLGOflwrL0g7dZ4QXA',
            accounts: { mnemonic: process.env.mnemonicEther, count: 40 },
            gas: 'auto',
            gasPrice: 'auto',
        },
        bnbtestnet: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
            accounts: { mnemonic: process.env.mnemonic },
            chainId: 97,
            gasPrice: 'auto',
        },
        bnb: {
            url: 'https://bsc-dataseed.binance.org/',
            accounts: { mnemonic: process.env.mnemonic },
            chainId: 56,
            gasPrice: 'auto',
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: 'USD',
    },
    etherscan: {
        apiKey: {
            bsc: '37WG8272Q3CIHWY4C1XXVR6RMSEK65GKRW',
        },
    },
}

export default config
