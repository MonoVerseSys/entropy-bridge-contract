//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";


contract BridgeStorage is Initializable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    struct ConfirmData {
        address[] validators;
        bool isExecuted;
    }

    mapping(bytes32 => bool) public _transactions;
    mapping(bytes32 => ConfirmData) public _confirmations;
    CountersUpgradeable.Counter public _transactionId;

    uint256[47] private __gap;
}