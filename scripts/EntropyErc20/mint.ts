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
    const to = '0x31646d61bced8697C77AC4Fc8bb75C43eaae8b7F'
    const tx = await contract.mint(to, ethers.utils.parseEther('10000'))
    console.log(tx)
    const receipt = await tx.wait()
    console.log(receipt)

    const balance = ethers.utils.formatEther(await contract.balanceOf(to))
    console.log(s[0].address, ':', balance)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
