//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

/**
Check for errors (overflow or underflow) by compiler version.

`SafeMath` is generally not needed starting with Solidity 0.8, since the compiler
 now has built in overflow checking.
 */
contract OverflowUnderFlow {
    uint public zero = 0;
    uint public max = 2**256-1;
    
    // zero will end up at 2**256-1
    function underflow() public {
        zero -= 1;
    }
    // max will end up at 0
    function overflow() public {
        max += 1;
    }
}
