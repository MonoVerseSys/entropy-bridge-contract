// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./IFruttiDinoNFT.sol";
/**
 * @title FruttiDinoNFT
 * @author Ho Dong Kim (monoverse.io)
 * @dev frutti dino nft v1
 */
contract FruttiDinoNFT is IFruttiDinoNFT,  Initializable, OwnableUpgradeable, AccessControlUpgradeable, ERC721EnumerableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    CountersUpgradeable.Counter private _tokenIds; // deprecated
    string private _baseUri;
    mapping(string => uint256) private _dinoIds;// key : dino, value : token id
    uint256 private  _latestTokenId;

    function initialize() public initializer {
        __Ownable_init();
        __ERC721Enumerable_init();
        __ERC721_init("FruttiDino NFT", "FTDT");
        setBaseURI("https://api.fruttidino.com/dino/");
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual
        override(AccessControlUpgradeable, ERC721EnumerableUpgradeable) returns (bool) {
        return interfaceId == type(IERC165Upgradeable).interfaceId;
    }

    function setBaseURI(string memory base) public onlyOwner {
        _baseUri = base;
    }

    function _baseURI() internal override view returns(string memory) {
        return _baseUri;
    }

    function tokenIdFromDinoId(string memory dinoId) public view returns(uint256) {
        return _dinoIds[dinoId];
    }

    function getLatestTokenId() public view returns(uint256) {
        return _latestTokenId;
    }


    function mintDino(address player, uint256 nftId, string memory dinoId)
        public onlyRole(MINTER_ROLE)
    {
        require(!_exists(nftId), "It already exists (nft id)");
        require(tokenIdFromDinoId(dinoId) == 0, "It already exists (dino id)");
        // _tokenIds.increment();

        // uint256 newItemId = _tokenIds.current();
        _mint(player, nftId);
        _dinoIds[dinoId] = nftId;
        _latestTokenId = nftId;
        emit MintDino(player, nftId, dinoId);
    }

    function batchMintDino(address[] memory players, uint256[] memory nftIds, string[] memory dinoIds) public {
        uint256 dataLen = players.length;
        require(dataLen > 0, "data length must be greater than zero");
        require(dataLen == nftIds.length && nftIds.length == dinoIds.length, "invalid params");
        for(uint256 i=0; i<dataLen; i++) {
            mintDino(players[i], nftIds[i], dinoIds[i]);
        }
    }
}