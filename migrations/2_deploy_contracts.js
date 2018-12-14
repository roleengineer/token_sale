var RoleToken = artifacts.require("./RoleToken.sol");

module.exports = function(deployer) {
  deployer.deploy(RoleToken, 100000);
};
