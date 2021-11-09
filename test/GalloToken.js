var GalloToken = artifacts.require("./GalloToken.sol");

contract('GalloToken', function(accounts) {
    var tokenInstance;

    it('initializes the contract with the correct values', function(){
        return GalloToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'Gallo Token', 'has correct name');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'CAM', 'has correct symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'Gallo Token v1.0', 'has correct standard');
        });
    });

    it('sets the initial supply upon deployments', function() {
        return GalloToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 56624, 'sets total supply to 56624');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 56624, 'it allocates the initial supply to admin account');
        });
    });

    it('transfers tokens', function(){
        return GalloToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 1000000);
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250, {from: accounts[0]});
        }).then(function(success){
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250, {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value, 250, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250, 'adds the amount to receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 56374, 'deducts the amount from sending account');
        });
    });

    it('aporoves tokens from delegated transfer', function() {
        return GalloToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
            assert.equal(success, true, 'returns true');
            return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
        });
    });

    it('handles delegated tokens transfers', function() {
        return GalloToken.deployed().then(function(instance) {
            tokenInstance =instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(function(receipt) {
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function(receipt){
            return tokenInstance.transferFrom(fromAccount, toAccount, 1000, {from: spendingAccount});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 5, {from: spendingAccount});
        }).then(function(success) {
            assert.equal(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 5, {from: spendingAccount});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value, 5, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 95, 'deducts the amount from sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 5, 'adds the amount from receiving account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 5, 'stores the allowance for delegated transfer');
        });
    });
})