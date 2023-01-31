import { ethers } from 'hardhat'
import { deploy, DeployParams, singers } from '../utils'

async function main() {
    const signers = await singers()
    const contractName = __dirname.substring(__dirname.lastIndexOf('/') + 1)
    console.log(`contractName: ${contractName}`)
    const params: DeployParams = {
        contractName: contractName,
        deployParams: [signers[0].address],
    }

    await deploy(params)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
