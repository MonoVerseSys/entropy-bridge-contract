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
    const tx = await contract.setEcoAddress(signers[0].address)
    console.log(tx)
    const receipt = await tx.wait()
    console.log(receipt)

    const tx2 = await contract.setFee(ethers.utils.parseEther('1'))
    console.log(tx2)
    const receipt2 = await tx2.wait()
    console.log(receipt2)

    const ecoAddress = await contract.getEcoAddress()
    const fee = ethers.utils.formatEther(await contract.getFee())

    console.log(`ecoAddress: ${ecoAddress}, fee: ${fee}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
