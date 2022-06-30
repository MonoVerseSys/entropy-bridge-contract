//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./IValidator.sol";



contract NativeBridge is Initializable, PausableUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using ECDSAUpgradeable for bytes32;
    using AddressUpgradeable for address payable;
    
    struct ConfirmData {
        address[] validators;
        bool isExecuted;
    }


    mapping(bytes32 => bool) private _transactions;
    mapping(bytes32 => ConfirmData) private _confirmations;
    CountersUpgradeable.Counter private _transactionId;
    IValidator private _validator;
    string private _name;


    event Depoist(bytes32 indexed trHash, uint256 indexed trId, address from, address to, uint256 amount);
    event Confirm(bytes32 indexed trHash, uint256 indexed trId, address validatorAddress);
    event Withdrawal(bytes32 indexed trHash, uint256 indexed trId, address from, address to, uint256 amount);

    function initialize(string memory name, address validatorCa) public initializer {
        require(validatorCa != address(0), "zero address");

        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        _name = name;
        _validator = IValidator(validatorCa);
    }
    function getName() public view returns (string memory) {
        return _name;
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
        emit Depoist(data, _transactionId.current(), msg.sender, _receiver, msg.value);
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
        require(!confirmData.isExecuted, "Already processed");
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

        emit Confirm(data, trId, recoverAddress);

        if(confirmData.validators.length >= totalMember / 2 + 1) {
            confirmData.isExecuted = true;
            executeWithdrawal(
                data, 
                trId,
                from,
                to,
                amount);
        }
    }

    function executeWithdrawal(bytes32 trHash, uint256 trId, address from, address to, uint256 amount) internal {
        payable(to).sendValue(amount);
        emit Withdrawal(trHash, trId, from, to, amount);
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

    function setPause(bool isPause) public onlyOwner {
        if(isPause) {
            _pause();
        } else {
            _unpause();
        }
    }

}