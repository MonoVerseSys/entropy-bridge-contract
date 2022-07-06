import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Test', function () {
    it('Test ecdsa', async function () {
        const Test = await ethers.getContractFactory('Test')
        const test = await Test.deploy()
        await test.deployed()
        const signers = await ethers.getSigners()

        const a = 1
        const b = 2
        const address = signers[0].address
        const id = '1'

        // const abiCoder = new ethers.utils.AbiCoder()
        // const data = abiCoder.encode(['uint256', 'uint256', 'address', 'string'], [a, b, address, id])

        let message = ethers.utils.solidityPack(['uint256', 'uint256', 'address', 'string'], [a, b, address, id])
        message = ethers.utils.solidityKeccak256(['bytes'], [message])
        const signature = await signers[0].signMessage(ethers.utils.arrayify(message))

        console.log(`signature: ${signature}`)
        const result = await test.ecdsaTest(a, b, address, id, signature)
        console.log(`address: ${address}`)
        console.log(`result: `, result)
        expect(result[result.length - 1]).to.equal(address)
    })
})
