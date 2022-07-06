//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./BaseBridge.sol";


contract NativeBridge is BaseBridge {
    using AddressUpgradeable for address payable;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _transactionId;

    
    function initialize(string memory name, address validatorCa) public initializer {
        require(validatorCa != address(0), "zero address");

        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __BaseBridge_init(name, validatorCa);
        
        
    }

    function deposit(address _receiver) override external payable whenNotPaused nonReentrant {
        require(_receiver != address(0), "zero address");
        require(msg.value > 0, "zero value");
        _transactionId.increment();

        bytes32 data = _createHash(block.number, 
                _transactionId.current(),
                getChainID(),
                _receiver,
                msg.value);
        
        _transactions[data] = true;
        emit Deposit(data, _transactionId.current(), _receiver, msg.value);
    }

    function deposit(address _receiver, uint256 amount) override external {}


    function executeWithdrawal(bytes32 trHash, uint256 trId,  address to, uint256 amount) override internal {
        payable(to).sendValue(amount);
        emit Withdrawal(trHash, trId, to, amount);
    }


}