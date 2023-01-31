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
        deployParams: [bridgeName, '0x67F98dF891D0699fD0BF6B24c641d323ac73828a', '0xaF4A691bd0C3aE0D8eda81243035EBc8b5E92437'],
    }

    await deployProxy(params)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
