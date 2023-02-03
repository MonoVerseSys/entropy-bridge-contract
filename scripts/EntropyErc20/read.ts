import { ethers } from 'hardhat'
import { deployProxy, DeployParams, ContractAttach, singers, attach, getNetwork, Config } from '../utils'
import * as config from './_config.json'

async function main() {
    const net = getNetwork()
    const configData: Config = config

    const attachParams: ContractAttach = {
        deployedAddress: configData.networks[net],
        contractName: configData.contractName,
    }

    const contract = await attach(attachParams)
    const bal = await contract.balanceOf('0x41C6b8c24d40c361c867067ba091daF1829c4B90')
    console.log(`bal ${ethers.utils.formatEther(bal)}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
