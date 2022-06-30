import { ethers } from 'hardhat'
import { deployProxy, DeployParams, singers } from '../utils'

async function main() {
    const signers = await singers()
    const contractName = __dirname.substring(__dirname.lastIndexOf('/') + 1)
    console.log(`contractName: ${contractName}`)
    const params: DeployParams = {
        contractName: contractName,
        deployParams: [signers[0].address],
    }

    await deployProxy(params)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
