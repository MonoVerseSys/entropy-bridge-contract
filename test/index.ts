import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'
import { attach } from '../scripts/utils'
const waitTransaction = async (func: any) => {
    const receipt = await func()
    const result = await receipt.wait()
    console.log(result)
    return result
}
describe('Test', function () {
    // it('Test ecdsa', async function () {
    //     const Test = await ethers.getContractFactory('Test')
    //     const test = await Test.deploy()
    //     await test.deployed()
    //     const signers = await ethers.getSigners()

    //     const a = 1
    //     const b = 2
    //     const address = signers[0].address
    //     const id = '1'

    //     let message = ethers.utils.solidityPack(['uint256', 'uint256', 'address', 'string'], [a, b, address, id])
    //     message = ethers.utils.solidityKeccak256(['bytes'], [message])
    //     console.log(`message: ${message}`)
    //     const signature = await signers[0].signMessage(ethers.utils.arrayify(message))

    //     console.log(`signature: ${signature}`)
    //     const result = await test.ecdsaTest(a, b, address, id, signature)
    //     console.log(`address: ${address}`)
    //     console.log(`result: `, result)
    //     expect(result[result.length - 1]).to.equal(address)
    // })

    it('Message Sign Test', async function () {
        this.timeout(1000 * 60 * 10)
        console.log(process.env)
        const Validator = await ethers.getContractFactory('Validator')
        const signers = await ethers.getSigners()

        const admin = signers[0].address
        const validator = await upgrades.deployProxy(Validator, [admin])
        const validatorAddress = (await validator.deployed()).address
        console.log(validatorAddress)

        expect(ethers.utils.isAddress(validatorAddress)).to.be.true
        await waitTransaction(() => {
            return validator.addValidator(signers[1].address)
        })
        await waitTransaction(() => {
            return validator.addValidator(signers[2].address)
        })
        await waitTransaction(() => {
            return validator.addValidator(signers[3].address)
        })
        await waitTransaction(() => {
            return validator.addValidator(signers[4].address)
        })

        const validatorCnt = await validator.getValidatorCount()
        console.log(`validatorCnt.toString() =====> ${validatorCnt.toString()}`)
        expect(validatorCnt.toString()).to.equal('4')

        const NativeBridge = await ethers.getContractFactory('NativeBridge')
        const nativeBridge = await upgrades.deployProxy(NativeBridge, ['test bridge', validatorAddress])
        const nativeBridgeAddress = (await nativeBridge.deployed()).address
        console.log(`nativeBridgeAddress: ${nativeBridgeAddress}`)
        const depositer = signers[10]

        const _nativeBridge = await nativeBridge.connect(depositer)
        const sendValue = ethers.utils.parseUnits('0.001', 'ether')
        const receipt = await _nativeBridge.depositNative(depositer.address, { value: sendValue })
        const result = await receipt.wait()
        console.log(JSON.stringify(result))
        console.log(result.blockNumber)

        const balance = await ethers.provider.getBalance(nativeBridgeAddress)
        expect(balance.toString()).to.equal(sendValue)

        console.log(`balance.toString(): ${balance.toString()}`)

        const blockNumber = result.blockNumber
        const hash = result.events[0].topics[1]
        const trId = parseInt(ethers.utils.hexStripZeros(result.events[0].topics[2]))
        const { chainId } = await ethers.provider.getNetwork()

        const owner = depositer.address

        for (let i = 1; i <= 3; i++) {
            const signature = await signers[i].signMessage(ethers.utils.arrayify(hash))
            console.log(`============ ${i} ============`)
            console.log(blockNumber, trId, chainId, owner, sendValue, signature)
        }
    })

    it('Confirm test', async function () {
        this.timeout(1000 * 60 * 10)
        console.log(process.env)
        // const Validator = await ethers.getContractFactory('Validator')
        const signers = await ethers.getSigners()

        // const admin = signers[0].address
        // const validator = await upgrades.deployProxy(Validator, [admin])
        // const validatorAddress = (await validator.deployed()).address
        // console.log(validatorAddress)

        // expect(ethers.utils.isAddress(validatorAddress)).to.be.true
        // await waitTransaction(() => {
        //     return validator.addValidator(signers[1].address)
        // })
        // await waitTransaction(() => {
        //     return validator.addValidator(signers[2].address)
        // })
        // await waitTransaction(() => {
        //     return validator.addValidator(signers[3].address)
        // })
        // await waitTransaction(() => {
        //     return validator.addValidator(signers[4].address)
        // })
        const validatorAddress = '0x5cc113a2B041Fcf13b3239469c3a542773F8fb33'
        const tokenAddress = '0xa0441FDA22A6bCf29C991A0506ba579058795b97'
        const validator = await attach({ deployedAddress: validatorAddress, contractName: 'Validator' })

        const validatorCnt = await validator.getValidatorCount()
        console.log(`validatorCnt.toString() =====> ${validatorCnt.toString()}`)
        expect(validatorCnt.toString()).to.equal('4')

        // const TokenMintBridge = await ethers.getContractFactory('TokenMintBridge')
        // const tokenMintBridge = await upgrades.deployProxy(TokenMintBridge, ['token bridge', tokenAddress, validatorAddress])
        // const tokenMintBridgeAddress = (await tokenMintBridge.deployed()).address

        const tokenMintBridgeAddress = '0xf566ead3b7B4bfC8155b109079e6ff84d3bdD33E'
        const tokenMintBridge = await attach({ deployedAddress: tokenMintBridgeAddress, contractName: 'TokenMintBridge' })
        // console.log(`tokenMintBridgeAddress: ${tokenMintBridgeAddress}`)
        // const depositer = signers[10]

        // const _tokenMintBridge = await tokenMintBridge.connect(depositer)
        const signatures = [
            '',
            '0xecd7982dd16d6db07a22e3a049f4c71f1f1dec8c2affb2230b8101b6c421741351c2ac748ca53f92b5a71cdc559910104c30eb738bf01996b46c51c6e108cfeb1b',
            '0x07f987fe6c83301394f0c6cf3c4b742ee1826f5a01e352be623609a87f51eafb1abb395faee7e923941118c4bbe8b668930a6ae3c4f34d74a5b07243a81168ec1b',
            '0x51057476aad48e5ae1a291522eb144fb46175cf8e33b10e9c881be5feb7ba7931b8d08521b2d3f2e7d44d951649d1c734492db2d7562affae51e058ff97a8eee1c',
        ]
        for (let i = 1; i <= 3; i++) {
            const blockNumber = 20957200
            const trId = 1
            const chainId = 97
            const owner = '0xF08870B06c57f63c7929A784B218b8980297fA46'
            const sendValue = '1000000000000000'
            const signature = signatures[i]

            const result2 = await waitTransaction(() => {
                return tokenMintBridge.confirmWithdrawal(blockNumber, trId, chainId, owner, sendValue, signature)
            })
            console.log(i, ':', result2.events.length)
        }
    })
})
