import { ethers } from 'hardhat'

ethers.provider.getNetwork().then((network) => {
    console.log(network)
})
