App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 10000000000000000,
  tokensSold: 0,
  tokensAvailable: 75000,
  accountBalance: 0,

  init: function() {
    console.log("App initialized...");
    return App.initWeb3();
  },
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      //If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("RoleTokenSale.json", function(roleTokenSale) {
      App.contracts.RoleTokenSale = TruffleContract(roleTokenSale);
      App.contracts.RoleTokenSale.setProvider(App.web3Provider);
      App.contracts.RoleTokenSale.deployed().then(function(roleTokenSale) {
        console.log("Role Token Sale Address:", roleTokenSale.address);
      });
      }).done(function() {
        $.getJSON("RoleToken.json", function(roleToken) {
          App.contracts.RoleToken = TruffleContract(roleToken);
          App.contracts.RoleToken.setProvider(App.web3Provider);
          App.contracts.RoleToken.deployed().then(function(roleToken) {
            console.log("Role Token Address:", roleToken.address);
          });
          App.listenForEvents();
          return App.render();
        });
      });
    },

    //Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.RoleTokenSale.deployed().then(function(instance) {
        instance.Sell({}, { fromBlock: 0, toBlock: 'latest', }).watch(function(error, event) {
          console.log("event triggered", event);
          App.render();
        })
      })
    },

    render: function() {
      if (App.loading) {
        return;
      }
      App.loading = true;

      var loader = $('#loader');
      var content = $('#content');

      loader.show();
      content.hide();

      //Load account data
      web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
          App.account = account;
          $('#account-address').html('Your Account: ' + account);
        }
      });

      //Load token sale contract
      App.contracts.RoleTokenSale.deployed().then(function(instance) {
        roleTokenSaleInstance = instance;
        return roleTokenSaleInstance.tokenPrice();
      }).then(function(tokenPrice) {
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
        return roleTokenSaleInstance.tokensSold();
      }).then(function(tokensSold) {
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);

        var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');

        //Load token contract
        App.contracts.RoleToken.deployed().then(function(instance) {
          roleTokenInstance = instance;
          return roleTokenInstance.balanceOf(App.account);
        }).then(function(balance) {
          App.accountBalance = balance.toNumber();
          $('.rt-balance').html(App.accountBalance);

          App.loading = false;
          loader.hide();
          content.show();
        })
      });
    },

    buyTokens: function() {
      $('#content').hide();
      $('#loader').show();
      var numberOfTokens = $('#numberOfTokens').val();
      App.contracts.RoleTokenSale.deployed().then(function(instance) {
        return instance.buyTokens(numberOfTokens, { from: App.account, value: numberOfTokens * App.tokenPrice, gas: 500000 });
      }).then(function(result) {
        console.log("Tokens bought...");
        $('form').trigger('reset') // reset number of tokens in form
        //Wait for Sell event
      })
    }

}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
