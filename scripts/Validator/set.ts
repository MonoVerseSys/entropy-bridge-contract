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
    // const result = await contract.addValidator(signers[2].address)
    // console.log(result)

    const count = await contract.getValidatorCount()
    console.log(count)

    console.log(1, await contract.isValiator(signers[1].address))
    console.log(2, await contract.isValiator(signers[2].address))
    console.log(3, await contract.isValiator(signers[3].address))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
