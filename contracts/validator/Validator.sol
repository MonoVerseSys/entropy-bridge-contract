//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "./IValidator.sol";

contract Validator is IValidator, Initializable, AccessControlEnumerableUpgradeable {

    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    uint256 constant LIMIT = 30;

    function initialize(address admin) public initializer {
        require(admin != address(0), "zero address");
        __AccessControlEnumerable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function addValidator(address validator) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        require(validator != address(0), "zero address");
        uint256 count = getValidatorCount();
        require(count < LIMIT, "validator exceeded");
        _grantRole(VALIDATOR_ROLE, validator);
    }
    
    function removeValidator(address validator) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        require(validator != address(0), "zero address");
        _revokeRole(VALIDATOR_ROLE, validator);
    }

    function getValidatorCount() public view override returns(uint256) {
        return getRoleMemberCount(VALIDATOR_ROLE);
    }

    function isValidator(address user) public view override returns(bool) {
        return hasRole(VALIDATOR_ROLE, user);
    }

}