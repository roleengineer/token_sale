pragma solidity >=0.4.0 <0.6.0;

import "./RoleToken.sol";

contract RoleTokenSale {
  address admin;
  RoleToken public tokenContract;
  uint public tokenPrice;
  uint public tokensSold;

  event Sell(address _buyer, uint _amount);

  constructor (RoleToken _tokenContract, uint _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
  //multiply
  function multiply(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x);
  }
  //Buy Tokens
  function buyTokens(uint _numberOfTokens) public payable {
    require(msg.value == multiply(_numberOfTokens, tokenPrice));
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
    require(tokenContract.transfer(msg.sender, _numberOfTokens));

    tokensSold += _numberOfTokens;

    emit Sell(msg.sender, _numberOfTokens);
  }

  // Ending Token RoleTokenSale
  function endSale() public {
    //Require admin
    require(msg.sender == admin);
    require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
    //Destroy contract
    selfdestruct(admin);
  }
}
