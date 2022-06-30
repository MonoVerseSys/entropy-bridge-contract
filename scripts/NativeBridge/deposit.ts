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
    const amount = ethers.utils.parseUnits('0.01', 'ether')
    // const result = await contract.deposit(signers[0].address, { value: amount })
    // console.log(result)

    const contractBalance = await ethers.provider.getBalance(attachParams.deployedAddress)
    console.log(`contractBalance:`, ethers.utils.formatUnits(contractBalance, 'ether'))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
