//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "../erc721/IFruttiDinoNFT.sol";
import "./BaseBridge.sol";

contract NFTBridge is BaseBridge {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using AddressUpgradeable for address payable;

    CountersUpgradeable.Counter private _transactionId;
    IFruttiDinoNFT private _fruttiDinoNFT;


    function initialize(string memory name, address tokenCa, address validatorCa) public initializer {
        require(validatorCa != address(0), "zero address");

        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __BaseBridge_init(name, validatorCa);
        _fruttiDinoNFT = IFruttiDinoNFT(tokenCa);

    }

    function depositNative(address _receiver) override external payable {}

    function depositToken(address _receiver, uint256 tokenId) override external  whenNotPaused nonReentrant {
        require(_receiver != address(0), "zero address");
        require(_fruttiDinoNFT.ownerOf(tokenId) == msg.sender, "sender is not owner of token");
        require(_fruttiDinoNFT.isApprovedForAll(msg.sender, address(this)) || _fruttiDinoNFT.getApproved(tokenId) == address(this), "token is not allowed for bridge contract");

        _transactionId.increment();
        bytes32 data = _createHash(block.number,
            _transactionId.current(),
            getChainID(),
            _receiver,
            tokenId);

        _transactions[data] = true;

        _fruttiDinoNFT.burn(tokenId);
        emit Deposit(data, _transactionId.current(), _receiver, tokenId);
    }

    function executeWithdrawal(bytes32 trHash, uint256 trId,  address to, uint256 tokenId) override internal {
        _fruttiDinoNFT.mintDino(to, tokenId);
        emit Withdrawal(trHash, trId, to, tokenId);
    }

}