// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract WErc721 is Ownable, AccessControl, ERC721Enumerable {
    using Counters for Counters.Counter;
    event MintDino(address indexed to, uint256 indexed tokenId, string dinoId);

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIds;
    string private _baseUri;
    mapping(string => uint256) private _dinoIds;// key : dino, value : token id

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        setBaseURI("https://api.fruttidino.com/dino/");
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual
        override(AccessControl, ERC721Enumerable) returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
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


    function mintDino(address player, string memory dinoId)
        public onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        require(tokenIdFromDinoId(dinoId) == 0, "It already exists");
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _dinoIds[dinoId] = newItemId;
        emit MintDino(player, newItemId, dinoId);
        return newItemId;
    }

    uint256[47] private __gap;
}