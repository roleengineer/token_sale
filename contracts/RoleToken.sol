pragma solidity >=0.4.0 <0.6.0;

contract RoleToken {
  uint public totalSupply;
  mapping(address => uint) public balanceOf;
  string public name = 'Role Token';
  string public symbol = 'RT';
  //allowance
  mapping(address => mapping(address => uint)) public allowance;
  //transeffrom event
  event Transfer(address indexed _from, address indexed _to, uint _value);

  event Approval(address indexed _owner, address indexed _spender, uint _value);

  constructor (uint _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;

    totalSupply = _initialSupply;

  }

  function transfer(address _to, uint _value) public returns(bool success) {
    require(balanceOf[msg.sender] >= _value);

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  //approve
  function approve(address _spender, uint _value) public returns (bool success) {
    //allowance
    allowance[msg.sender][_spender] = _value;
    //approve event
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
  //transeffrom
  function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
    require(_value <= balanceOf[_from]);
    require(_value <= allowance[_from][msg.sender]);
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    //Update the allowance
    allowance[_from][msg.sender] -= _value;
    emit Transfer(_from, _to, _value);
    return true;

  }


}
