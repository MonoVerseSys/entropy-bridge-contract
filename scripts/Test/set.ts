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
    const name = 'hdhhdhdhdhd11'
    const contract = await attach(attachParams)
    const gas = await contract.estimateGas.setName(name)
    console.log('gas:', gas)
    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = gasPrice.mul(ethers.BigNumber.from(2))
    console.log('gasPrice:', gasPrice)

    const receipt = await contract.setName(name, { gasPrice: gasPrice.toString(), gasLimit: gas.toString() })
    console.log('receipt:', receipt)
    const result = await receipt.wait()
    console.log(result)
    const r = await contract.getName()
    console.log(r)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
