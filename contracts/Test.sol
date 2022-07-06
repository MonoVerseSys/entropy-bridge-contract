
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract Test {
    using ECDSA for bytes32;

    function ecdsaTest(uint256 a, 
        uint256 b, 
        address c, 
        string memory id, 
        bytes memory signatgure) 
    public pure returns(bytes32, bytes32, address) {

        bytes32 data = keccak256(
            abi.encodePacked(
                a, 
                b,
                c,
                id
        ));
        bytes32 ethSign = data.toEthSignedMessageHash();
        address recoverAddress = ethSign.recover(signatgure);
        return (data, ethSign, recoverAddress);
    }
}