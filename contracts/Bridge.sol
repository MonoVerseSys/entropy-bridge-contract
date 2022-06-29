//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;


import "./openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "./openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./IValidator.sol";


contract Bridge is Initializable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using ECDSAUpgradeable for bytes32;
    using AddressUpgradeable for address payable;
    
    struct ConfirmData {
        address[] validators;
        bool isExecute;
    }


    mapping(bytes32 => bool) private _transactions;
    mapping(bytes32 => ConfirmData) private _confirmations;
    CountersUpgradeable.Counter private _transactionId;
    IValidator private _validator;


    event DepoistNative(bytes32 trHash, uint256 trId, address from, address to, uint256 amount);
    event WithdrawalNative(bytes32 trHash, uint256 trId, address from, address to, uint256 amount);

    function initialize(address validatorCa) public initializer {
        require(validatorCa != address(0), "zero address");
        _validator = IValidator(validatorCa);
    }

    function getChainID() public view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function deposit(address _receiver) external payable whenNotPaused nonReentrant {
        require(_receiver != address(0), "zero address");
        require(msg.value > 0, "zero value");
        _transactionId.increment();

        bytes32 data = keccak256(
            abi.encode(
                block.number, 
                _transactionId.current(),
                getChainID(),
                msg.sender,
                _receiver,
                msg.value
        ));
        
        _transactions[data] = true;
        emit DepoistNative(data, _transactionId.current(), msg.sender, _receiver, msg.value);
    }

    function confirmWithdrawal(
                        uint256 blockNumber, uint256 trId, uint256 chainID, 
                        address from, address to, uint256 amount, bytes memory signature) public whenNotPaused nonReentrant {
        uint256 totalMember = _validator.getValidatorCount();
        require(totalMember < 3, "Lack of validators");

        bytes32 data = keccak256(
            abi.encode(
                blockNumber,
                trId,
                chainID,
                from,
                to,
                amount
        ));
        
        address recoverAddress = data.toEthSignedMessageHash().recover(signature);
        require(recoverAddress != address(0), "Fail recover");
        require(_validator.isValiator(recoverAddress), "Permission Error");
        ConfirmData storage confirmData = _confirmations[data];
        require(!confirmData.isExecute, "Already processed");
        bool checker = false;
        uint len = confirmData.validators.length;

        for(uint i=0; i<len; i++)  {
            if(confirmData.validators[i] == recoverAddress) {
                checker = true;
                break;
            }
        }
        require(!checker, "Already confirmation");


        confirmData.validators.push(recoverAddress);

        if(confirmData.validators.length >= totalMember / 2 + 1) {
            confirmData.isExecute = true;
            executeWithdrawal(
                data, 
                trId,
                from,
                to,
                amount);
        }

    }

    function executeWithdrawal(bytes32 trHash, uint256 trId, address from, address to, uint256 amount) internal whenNotPaused nonReentrant {
        payable(to).sendValue(amount);
        emit WithdrawalNative(trHash, trId, from, to, amount);
    }

    function isValidTransaction(uint256 blockNumber, uint256 trId, uint256 chainID, address from, address to, uint256 amount) public view returns(bool) {
        bytes32 data = keccak256(
            abi.encode(
                blockNumber,
                trId,
                chainID,
                from,
                to,
                amount
        ));
        return _transactions[data];
    }



}