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
    const s = await singers()
    const contract = await attach(attachParams)

    const balance = ethers.utils.formatEther(await contract.balanceOf(s[0].address))
    console.log(s[0].address, ':', balance)

    const data = ethers.utils.defaultAbiCoder.encode(['address'], [s[0].address])
    const bridge = '0x41C6b8c24d40c361c867067ba091daF1829c4B90'
    // const tx = await contract.transferAndCall(bridge, ethers.utils.parseEther('1'), data)
    console.log(contract)
    const tx = await contract['transferAndCall(address,uint256,bytes)'](bridge, ethers.utils.parseEther('0.0002'), data)
    console.log(tx)
    const receipt = await tx.wait()
    console.log(receipt)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
