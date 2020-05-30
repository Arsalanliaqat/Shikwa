var Product = artifacts.require("ProductContract");

module.exports = function(deployer) {
    deployer.deploy(Product);
};