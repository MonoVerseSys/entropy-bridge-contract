import { Config, ContractAttach, attach, getNetwork } from '../utils'
import * as config from './_config.json'
async function main() {
    const net = getNetwork()
    const configData: Config = config

    const attachParams: ContractAttach = {
        deployedAddress: configData.networks[net],
        contractName: configData.contractName,
    }

    const contract = await attach(attachParams)

    // contract.estimateGas.addValidator()
    const validators = []
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
        case 'bnbtestnet':
            validators.push('0x9Af5ff499AAd50efAAF47DE1D1eE51c0cF9230f1')
            validators.push('0x389a7E737eE3c4253AFE0148CDB42D91D6A13061')
            validators.push('0x84d969db58e3F08a4A2284Dca06eA21543EC1c0D')
            break
        case 'bnb':
            validators.push('0x2609e28Bd90e0c948389Fdc3e220CeE639e7dC1d')
            validators.push('0x40daec704066F16750018060be21652e7a9aB80a')
            validators.push('0x0e09A6d0707Bea7EbB196a4E01fAC6BD2c94DC32')
            break
        case 'entropy':
            validators.push('0x2609e28Bd90e0c948389Fdc3e220CeE639e7dC1d')
            validators.push('0x40daec704066F16750018060be21652e7a9aB80a')
            validators.push('0x0e09A6d0707Bea7EbB196a4E01fAC6BD2c94DC32')
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
