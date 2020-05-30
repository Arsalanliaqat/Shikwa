var Web3 = require('web3');
var config = require('../config/config');

var web3 = new Web3(config.server.ethereumServer);
// web3.eth.defaultAccount = "0x82A1553742e6d11eaaE73D9cddc85bf64117616E";
// web3.eth.accounts.wallet.add("0x82A1553742e6d11eaaE73D9cddc85bf64117616E");
// web3.eth.accounts.wallet.add("a0f0e28dba9649acb1bfb14e6383a674");

module.exports = web3;