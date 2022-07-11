import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'

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

    it('Confirm Test', async function () {
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

            const result2 = await waitTransaction(() => {
                return nativeBridge.confirmWithdrawal(blockNumber, trId, chainId, owner, sendValue, signature)
            })
            console.log(i, ':', result2.events.length)

            // const receipt2 = await nativeBridge.confirmWithdrawal(blockNumber, trId, chainId, owner, sendValue, signature)
            // const result2 = await receipt2.wait()
            // console.log(i, ':', result2.events.length)
        }
        const balance2 = await ethers.provider.getBalance(nativeBridgeAddress)
        expect(balance2.toString()).to.equal('0')
    })
})
