var GalloToken = artifacts.require("./GalloToken.sol");

contract('GalloToken', function(accounts) {
    it('sets the total supply upon deployments', function() {
        return GalloToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 56624, 'sets total supply to 56624');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 56624, 'it allocates the initial supply to admin account');
        });
    })
})