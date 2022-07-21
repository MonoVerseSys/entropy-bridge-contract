//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract WErc20 is ERC20Burnable, AccessControlEnumerable {
    bytes32 private BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

    constructor(address owner, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
    }

    function setBridge(address bridgeAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(BRIDGE_ROLE, bridgeAddress);
    }

    function burn(uint256 amount) public override onlyRole(BRIDGE_ROLE) {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public override onlyRole(BRIDGE_ROLE) {
        _spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
    }

    function mint(address account, uint256 amount) public onlyRole(BRIDGE_ROLE) {
        _mint(account, amount);
    }
}