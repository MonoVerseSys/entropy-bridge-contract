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
    const tx = await contract.setBridge('0x21f0Edd7831A51d1e1930128450786c0dfF05Ec0')
    // const tx = await contract.setBridge(s[0].address) // 테스트로 현재 singer를 브릿지에 추가. 테스트 토큰 mint 하기 위함.
    console.log(tx)
    const receipt = await tx.wait()
    console.log(receipt)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
