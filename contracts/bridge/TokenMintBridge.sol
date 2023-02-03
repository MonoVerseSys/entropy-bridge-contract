//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "../erc20/IWErc20.sol";
import "./BaseBridge.sol";
import "../interface/IERC1363Receiver.sol";
import "../interface/IERC1363Spender.sol";


contract TokenMintBridge is BaseBridge, ERC1363Receiver, ERC1363Spender {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using AddressUpgradeable for address payable;
    
    CountersUpgradeable.Counter private _transactionId;
    IWErc20 private _erc20;
    address private _erc20Address;
    


    function initialize(string memory _bridgeName, address tokenCa, address validatorCa) public initializer {
        require(validatorCa != address(0), "zero address");

        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __BaseBridge_init(_bridgeName, validatorCa);
        _erc20Address = tokenCa;
        _erc20 = IWErc20(_erc20Address);
    }

    function depositNative(address _receiver) override external payable {}    

    function _deposit(address _receiver, uint256 amount) internal {
        require(_receiver != address(0), "zero address");
        
        _transactionId.increment();
        bytes32 data = _createHash(block.number, 
                _transactionId.current(),
                getChainID(),
                _receiver,
                amount);
        
        _transactions[data] = true;
        emit Deposit(data, _transactionId.current(), _receiver, amount);
    }

    function onTransferReceived(address operator, address from, uint256 value, bytes calldata data) external override whenNotPaused nonReentrant returns (bytes4) {
        if(data.length > 0 && _msgSender() == _erc20Address) {
            (address _receiver) = abi.decode(data, (address));
            // _erc20.burnFrom(address(this), value);
            _deposit(_receiver, value);
        }
        return this.onTransferReceived.selector;
    }

    function onApprovalReceived(address sender, uint256 amount, bytes memory data) external override nonReentrant() returns (bytes4) {
        return this.onApprovalReceived.selector;
    }


    function depositToken(address _receiver, uint256 amount) override external whenNotPaused nonReentrant {}


    function executeWithdrawal(bytes32 trHash, uint256 trId,  address to, uint256 amount) override internal {
        _erc20.mint(to, amount);
        emit Withdrawal(trHash, trId, to, amount);
    }

    function burn() public nonReentrant() {
        uint256 balance = _erc20.balanceOf(address(this));
        _erc20.burn(balance);
    }

}