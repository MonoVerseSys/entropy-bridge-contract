//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

interface IValidator {

    function addValidator(address validator)  external;
    
    function removeValidator(address validator)  external;

    function getValidatorCount()  external view returns(uint256);

    function isValiator(address user) external view returns(bool);

}