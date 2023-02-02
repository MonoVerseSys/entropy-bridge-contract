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
    uint256 private _fee;
    address private _ecoAddress;
    function initialize(string memory name, address validatorCa) public initializer {
        require(validatorCa != address(0), "zero address");

        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __BaseBridge_init(name, validatorCa);
        
    }

    function depositNative(address _receiver) override external payable whenNotPaused nonReentrant {
        require(_receiver != address(0), "zero address");
        require(msg.value > _fee, "amount not enough(1)");
        require(_ecoAddress != address(0), "Set up an ecosystem address");
        uint256 deposit = msg.value - _fee;
        require(deposit > 0, "amount not enough(2)");
        payable(_ecoAddress).sendValue(_fee);

        _transactionId.increment();

        bytes32 data = _createHash(block.number, 
                _transactionId.current(),
                getChainID(),
                _receiver,
                deposit);
        
        _transactions[data] = true;
        emit Deposit(data, _transactionId.current(), _receiver, deposit);
    }

    function depositToken(address _receiver, uint256 amount) override external {}


    function executeWithdrawal(bytes32 trHash, uint256 trId,  address to, uint256 amount) override internal {
        payable(to).sendValue(amount);
        emit Withdrawal(trHash, trId, to, amount);
    }

    function getFee() public view returns(uint256) {
        return _fee;
    }

    function setFee(uint256 fee) public onlyOwner {
        _fee = fee;
    }

    function getEcoAddress() public view returns(address) {
        return _ecoAddress;
    }

    function setEcoAddress(address ecoAddress) public onlyOwner {
        _ecoAddress = ecoAddress;
    }


}