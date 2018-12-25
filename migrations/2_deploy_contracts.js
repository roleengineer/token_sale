var RoleToken = artifacts.require("./RoleToken.sol");
var RoleTokenSale = artifacts.require("./RoleTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(RoleToken, 100000).then(function() {
    //Token price is 0.01 Ether
    var tokenPrice = 10000000000000000;
    return deployer.deploy(RoleTokenSale, RoleToken.address, tokenPrice);
  });

};
