import * as config from '../Validator/_config.json'
import { Config, DeployParams, deployProxy, getNetwork, singers } from '../utils'

async function main() {
    const bridgeName = 'EntropyBridge'
    // const validatorCa: string = configData.networks[net]

    const contractName = __dirname.substring(__dirname.lastIndexOf('/') + 1)
    console.log(`contractName: ${contractName}`)
    const params: DeployParams = {
        contractName: contractName,
        deployParams: [bridgeName, '0x648b2e6537F1D280423566E3B7b1998eA9cD47AC', '0xE4CC992195b2d45d5A836f1584C90f0A478b3c8c'],
    }

    await deployProxy(params)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
