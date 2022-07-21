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
    it('over flow safe test', async () => {
        const OverflowUnderFlow = await ethers.getContractFactory('OverflowUnderFlow')
        const overflowUnderFlow = await OverflowUnderFlow.deploy()
        await overflowUnderFlow.deployed()
        let r1 = true
        let r2 = true
        try {
            await overflowUnderFlow.underflow()
        } catch (e) {
            console.error(e)
            r1 = false
        }
        try {
            await overflowUnderFlow.overflow()
        } catch (e) {
            console.error(e)
            r2 = false
        }

        expect(r1).to.equal(false)
        expect(r2).to.equal(false)
    })
})
