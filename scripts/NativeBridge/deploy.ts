import { ethers } from 'hardhat'
import { deployProxy, DeployParams, singers, Config, getNetwork } from '../utils'
import * as config from '../Validator/_config.json'

async function main() {
    const net = getNetwork()
    const configData: Config = config

    const bridgeName = 'bridgeName1'
    const validatorCa: string = configData.networks[net]

    const signers = await singers()
    const contractName = __dirname.substring(__dirname.lastIndexOf('/') + 1)
    console.log(`contractName: ${contractName}`)
    const params: DeployParams = {
        contractName: contractName,
        deployParams: [bridgeName, validatorCa],
    }

    await deployProxy(params)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
