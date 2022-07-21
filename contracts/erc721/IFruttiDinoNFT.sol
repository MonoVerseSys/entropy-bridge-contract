// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./IErc721.sol";

interface IFruttiDinoNFT is IErc721 {
    event MintDino(address indexed to, uint256 indexed tokenId, string dinoId);
    function setBaseURI(string memory base) external;
    function tokenIdFromDinoId(string memory dinoId) external view returns(uint256);
    function getLatestTokenId() external view returns(uint256);
    function mintDino(address player, uint256 nftId, string memory dinoId) external;
    function batchMintDino(address[] memory players, uint256[] memory nftIds, string[] memory dinoIds) external;
}