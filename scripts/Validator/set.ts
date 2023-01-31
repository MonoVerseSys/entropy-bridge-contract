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

    // contract.estimateGas.addValidator()
    let validators = []
    switch (net) {
        case 'gorli':
            validators.push('0x9Af5ff499AAd50efAAF47DE1D1eE51c0cF9230f1')
            validators.push('0x389a7E737eE3c4253AFE0148CDB42D91D6A13061')
            validators.push('0x84d969db58e3F08a4A2284Dca06eA21543EC1c0D')
            break
        case 'deadcat':
            validators.push('0x9Af5ff499AAd50efAAF47DE1D1eE51c0cF9230f1')
            validators.push('0x389a7E737eE3c4253AFE0148CDB42D91D6A13061')
            validators.push('0x84d969db58e3F08a4A2284Dca06eA21543EC1c0D')
            break
    }
    // run add validator
    for (let i = 0; i < validators.length; i++) {
        const tx = await contract.addValidator(validators[i])
        console.log(tx)
        const receipt = await tx.wait()
        console.log(receipt)
    }

    // console.log(result)

    const count = await contract.getValidatorCount()
    console.log(count)

    for (let i = 0; i < validators.length; i++) {
        console.log(i, await contract.isValidator(validators[i]))
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
