
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

interface IWErc20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
    function mint(address account, uint256 amount) external;

}