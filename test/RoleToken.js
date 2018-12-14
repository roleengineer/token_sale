var RoleToken = artifacts.require("./RoleToken.sol");

contract('RoleToken', function(accounts) {
    it('set the total supply upon deployment', function() {
      return RoleToken.deployed().then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      }).then(function(totalSupply) {
        assert.equal(totalSupply.toNumber(), 100000, 'sets the total supply to 100,000');
      });
    });
})
