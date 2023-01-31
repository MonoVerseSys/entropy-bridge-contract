import { ethers } from 'hardhat'
import { upgradeProxy, getNetwork, Config, ContractAttach } from '../utils'
import * as config from './_config.json'
async function main() {
    const net = getNetwork()
    const configData: Config = config

    const attachParams: ContractAttach = {
        deployedAddress: configData.networks[net],
        contractName: configData.contractName,
    }
    console.log(attachParams)
    await upgradeProxy(attachParams)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
