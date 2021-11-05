var GalloToken = artifacts.require("./GalloToken.sol");

contract('GalloToken', function(accounts) {
    it('sets the total supply upon deployments', function() {
        return GalloToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 56624, 'sets total supply to 56624');
        })
    })
})