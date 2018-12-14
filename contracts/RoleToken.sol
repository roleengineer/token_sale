pragma solidity >=0.4.0 < 0.6.0;

contract RoleToken {
  uint public totalSupply;
  mapping(address => uint) public balanceOf;
  string public name = 'Role Token';
  string public symbol = 'RT';
  event Transfer(address indexed _from, address indexed _to, uint _value);

  constructor (uint _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;

    totalSupply = _initialSupply;

  }

  function transfer(address _to, uint _value) public returns(bool success) {
    require(balanceOf[msg.sender] >= _value);
    require(_to != 0x0);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }
}
