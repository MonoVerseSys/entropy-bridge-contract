import { ethers } from 'hardhat'
import { deployProxy, DeployParams, singers } from '../utils'

async function main() {
    const contractName = __dirname.substring(__dirname.lastIndexOf('/') + 1)
    console.log(`contractName: ${contractName}`)
    const params: DeployParams = {
        contractName: contractName,
        deployParams: [],
    }

    await deployProxy(params)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
