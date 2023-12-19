import { ethers } from 'hardhat'
import { deployProxy, DeployParams, singers, Config, getNetwork } from '../utils'
import * as config from '../Validator/_config.json'

async function main() {
    const net = getNetwork()
    const configData: Config = config

    const bridgeName = 'EntropyBridge'
    // const validatorCa: string = configData.networks[net]

    const signers = await singers()
    const contractName = __dirname.substring(__dirname.lastIndexOf('/') + 1)
    console.log(`contractName: ${contractName}`)
    const params: DeployParams = {
        contractName: contractName,
        deployParams: [bridgeName, '0x29B3AF9dD1B4F5302d371f2C4e8cA7c3df4a57fE'],
    }

    await deployProxy(params)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
