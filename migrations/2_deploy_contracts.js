const GalloToken = artifacts.require("./GalloToken.sol");

module.exports = function (deployer) {
  deployer.deploy(GalloToken, 56624);
};
