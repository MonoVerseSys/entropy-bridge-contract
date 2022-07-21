//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../validator/IValidator.sol";



abstract contract BaseBridge is Initializable, PausableUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
    using ECDSAUpgradeable for bytes32;
    
    // storage
    mapping(bytes32 => bool) internal _transactions;
    mapping(bytes32 => bool) internal _confirmations;
    IValidator internal _validator;
    string internal _name;


    event Deposit(bytes32 indexed trHash, uint256 indexed trId, address owner, uint256 amount);
    event Validated(bytes32 indexed trHash, uint256 indexed trId, uint256 validCount);
    event Failed(bytes32 indexed trHash, uint256 indexed trId, uint256 validCount);
    event Withdrawal(bytes32 indexed trHash, uint256 indexed trId, address owner, uint256 amount);
    
    function __BaseBridge_init(string memory name, address validatorCa) internal onlyInitializing {
        __BaseBridge_init_unchained(name, validatorCa);
    }

    function __BaseBridge_init_unchained(string memory name, address validatorCa) internal onlyInitializing {
        _name = name;
        _validator = IValidator(validatorCa);
    }
    function getName() public view returns(string memory) {
        return _name;
    }

    function getChainID() public view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function _createHash(uint256 blockNumber, uint256 trId, uint256  chainId,  address owner, uint256 amount) internal pure returns(bytes32) {
        
         bytes32 data = keccak256(
            abi.encodePacked(
                blockNumber, 
                trId,
                chainId,
                owner,
                amount
        ));
        return data;
    }


    function confirmWithdrawal(
                        uint256 blockNumber, uint256 trId, uint256 chainID, 
                        address owner, uint256 amount, bytes[] memory signatures) public whenNotPaused nonReentrant {
        uint256 totalMember = _validator.getValidatorCount();
        require(totalMember >= 3, "Lack of validators");
        require(signatures.length <= 20, "Too many signatures");

        bytes32 data = _createHash(
                blockNumber,
                trId,
                chainID,
                owner,
                amount);
        
        bool isExecuted = _confirmations[data];
        require(!isExecuted, "Already processed");
        
        uint validCounter = 0;
        for(uint i=0; i<signatures.length; i++) {
            bytes memory signature = signatures[i];
            address recoverAddress = data.toEthSignedMessageHash().recover(signature);
            if(recoverAddress != address(0) && _validator.isValidator(recoverAddress)) {
                validCounter += 1;
            }
        }
        if(validCounter >= totalMember / 2 + 1) {
            emit Validated(data, trId, validCounter);
            _confirmations[data] = true;
            executeWithdrawal(
                data, 
                trId,
                owner,
                amount);
        } else {
            emit Failed(data, trId, validCounter);
        }
    }

    

    function isExistTransaction(uint256 blockNumber, uint256 trId, uint256 chainID, address owner, uint256 amount) public view returns(bool) {
        bytes32 data = _createHash(blockNumber,
                trId,
                chainID,
                owner,
                amount);
        
        return _transactions[data];
    }

    function setPause(bool isPause) public onlyOwner {
        if(isPause) {
            _pause();
        } else {
            _unpause();
        }
    }

    function depositNative(address _receiver) external payable virtual;
    function depositToken(address _receiver, uint256 amount) external virtual;
    function executeWithdrawal(bytes32 trHash, uint256 trId,  address to, uint256 amount) internal virtual;

    uint256[46] private __gap; // 50 - 4
}