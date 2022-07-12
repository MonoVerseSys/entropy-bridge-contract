import { Deferrable } from 'ethers/lib/utils'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { ConnectionInfo } from '@ethersproject/web'
import { ethers } from 'ethers'
import { abi } from '../../artifacts/contracts/Test.sol/Test.json'
async function main() {
    const connectInfo: ConnectionInfo = {
        url: 'http://alb-chain-stage-edge-1070023354.ap-southeast-1.elb.amazonaws.com',
    }
    const provider = new ethers.providers.JsonRpcProvider(connectInfo)
    // const network = await provider.getNetwork()
    // console.log(network)
    // const transaction = await provider.getTransaction('0x2fcbc2064d4811db90dd99802ba2bf5aa72c01cb48ab18222305731a1e9e7078')
    // const blockNumber = transaction.blockNumber
    // const transactionRequest = transaction as Deferrable<TransactionRequest>
    // try {
    //     let code = await provider.call(transactionRequest, blockNumber)
    //     console.log(code)
    //     let reason = ethers.utils.toUtf8String('0x' + code.substring(138))
    //     console.log(`reason:${reason}`)
    // } catch (err) {
    //     console.log(err)
    // }

    const mnemonic = process.env.mnemonic || ''

    const name = '2312312'
    const contract = new ethers.Contract('0x622d49B32F52DFbEC3FEE2b257BA0FDF682CDfE1', abi, provider)
    const gas = await contract.estimateGas.setName(name)

    let gasPrice = await provider.getGasPrice()
    gasPrice = gasPrice.mul(ethers.BigNumber.from(2))

    const _wallet = ethers.Wallet.fromMnemonic(mnemonic)
    console.log(_wallet.privateKey)

    const wallet = new ethers.Wallet(_wallet.privateKey, provider)

    const _contract = contract.connect(wallet)
    const receipt = await _contract.setName(name, { gasPrice: gasPrice.toString(), gasLimit: gas.toString() })
    const result = await receipt.wait()
    console.log(result)
    const r = await _contract.getName()
    console.log(r)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
