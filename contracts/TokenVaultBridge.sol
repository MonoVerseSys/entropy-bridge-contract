//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./IErc20.sol";
import "./BaseBridge.sol";

contract TokenVaultBridge is BaseBridge {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using AddressUpgradeable for address payable;
    
    CountersUpgradeable.Counter private _transactionId;
    IErc20 private _erc20;


    function initialize(string memory name, address validatorCa, address tokenCa) public initializer {
        require(validatorCa != address(0), "zero address");

        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __BaseBridge_init(name, validatorCa);
        _erc20 = IErc20(tokenCa);

    }
    
    function deposit(address _receiver) override external payable {}

    function deposit(address _receiver, uint256 amount) override external  whenNotPaused nonReentrant {
        require(_receiver != address(0), "zero address");
        require(_erc20.allowance(msg.sender, address(this)) >= amount, "allowance not enough");
        _erc20.transferFrom(msg.sender, address(this), amount);

        _transactionId.increment();
        bytes32 data = _createHash(block.number, 
                _transactionId.current(),
                getChainID(),
                _receiver,
                amount);
        
        _transactions[data] = true;
        emit Depoist(data, _transactionId.current(), _receiver, amount);
    }

    function executeWithdrawal(bytes32 trHash, uint256 trId,  address to, uint256 amount) override internal {
        _erc20.transfer(to, amount);
        emit Withdrawal(trHash, trId, to, amount);
    }

}