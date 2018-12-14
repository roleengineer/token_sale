pragma solidity >=0.4.0 < 0.6.0;

contract RoleToken {
  //Constructor
  //Set the total number of tokens
  //Read the total number of tokens
  uint public totalSupply;
  
  constructor () public {
    totalSupply = 100000;
  }
}
