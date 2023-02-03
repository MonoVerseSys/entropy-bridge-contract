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
    const signers = await singers()

    const tx = await contract.burn()
    const receipt = await tx.wait()
    console.log(receipt)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
