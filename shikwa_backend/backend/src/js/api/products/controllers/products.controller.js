var config = require('../../../commons/config/config');
var web3 = require('../../../commons/services/ethereum.service');
var productDb = require('../products.dao');
var config = require('../../../commons/config/config');
var TruffleContarct = require("@truffle/contract");
var productDao = require("../../products/products.dao");
var blockchain = require('../../../commons/services/contract.service');
var fs = require('fs');
var axios = require('axios');

var ProductAbi = (() => {
    console.log(process.cwd());
    console.log(__dirname);
    const rawdata = fs.readFileSync(__dirname + '/ProductContract.json');
    return JSON.parse(rawdata);
})();

exports.searchInUserProducts = (req, res) => {
    var query = req.query.q;
    var userId = req.params.userId;

    var products = [];

    productDao.searchUserProducetsByName(userId, query, (error, results) => {

        if (results) {
            for (var result of results) {

                products.push({
                    productName: result.Product_Name,
                    productBrand: result.Product_Brand,
                    productCategory: result.Product_Category,
                    countryOrigin: result.Country_Origin,
                    cityOrigin: result.City_Origin,
                    riskType: result.Risk_Type,
                    description: result.Description,
                    imagePath: result.Image_Path,
                    transactionHash: result.transaction_hash,
                    productModel: result.Model,
                    valid: "dangerous"
                });
            }
        }
        if (products.length == 0) {
            res.status(204).json(products);
        } else {
            res.json(products);
        }
    });
}

exports.search = (req, res) => {
    var query = req.query.q;
    var products = [];

    axios.get(config.certificateOkServer + "?q=" + query).then((response) => {
        if (response) {
            if (response.data) {
                var data = response.data.results;
                return data;
            }
        }

        return [];
    }).then((result) => {

        if (result) {
            for (var s of result) {
                products.push({
                    "id": s.cbId,
                    "productName": s.product,
                    "productBrand": "",
                    "productCategory": "",
                    "countryOrigin": "",
                    "cityOrigin": "",
                    "riskType": "",
                    "description": "Product Number: " + s.number,
                    "imagePath": "",
                    "productModel": s.model,
                    "transactionHash": "",
                    "valid": s.valid ? "valid" : "invalid"
                });
            }
        }

        productDao.searchByName(query, (error, results) => {

            if (results) {
                for (var result of results) {

                    products.push({
                        productName: result.Product_Name,
                        productBrand: result.Product_Brand,
                        productCategory: result.Product_Category,
                        countryOrigin: result.Country_Origin,
                        cityOrigin: result.City_Origin,
                        riskType: result.Risk_Type,
                        description: result.Description,
                        imagePath: result.Image_Path,
                        transactionHash: result.transaction_hash,
                        productModel: result.Model,
                        valid: "dangerous"
                    });
                }
            }



            productDao.searchFromRASDataByName(query, (error, results) => {

                if (results) {
                    for (var result of results) {

                        products.push({
                            productName: result.Product_Name,
                            productBrand: result.Product_Brand,
                            productCategory: result.Product_Category,
                            countryOrigin: result.Country_Origin,
                            cityOrigin: result.City_Origin,
                            riskType: result.Risk_Type,
                            description: result.Description,
                            imagePath: result.Image_Path,
                            transactionHash: result.transaction_hash,
                            productModel: result.Model,
                            valid: "dangerous"
                        });
                    }
                }

                if (products.length == 0) {
                    res.status(204).json(products);
                } else {
                    res.json(products);
                }
            });




            // if (products.length == 0) {
            //     res.status(204).json(products);
            // } else {
            //     res.json(products);
            // }
        });

    }).catch((error) => {
        res.status(500).json({
            type: "ERROR",
            msg: "ERROR ON SERVER SIDE"
        })
    });
}

exports.addProduct = (req, res) => {

    var data = req.fields;
    var file = req.files.file;

    if (!fs.exists(config.uploadDirectory, (error) => {
            if (error) {
                console.log("FILE RENAME: " + error);
            }
        })) {
        fs.mkdir(config.uploadDirectory, null, (error) => {
            if (error) {
                console.log("FILE RENAME: " + error);
            }
        });
    }

    // config.uploadDirectory = file.path.substring(0, file.path.lastIndexOf('\\') + 1);
    var imageName = Date.now() + "_" + file.name;
    var imagePath = config.uploadDirectory + imageName;
    fs.rename(file.path, imagePath, (error) => {
        if (error) {
            console.log("FILE MOVE: " + error);
        }
    });

    data.imagePath = req.protocol + '://' + req.get('host') + "/api/v1.0/images/" + imageName;

    console.log("++++++++++++++++++++++++++++++++++++++ PATH:" + data.imagePath);

    // productDao.insert(data, (error) => {
    //     var response = {
    //         type: "OK",
    //         msg: "Saved"
    //     };

    //     if (error && error.code == 'ER_DUP_ENTRY') {
    //         response.type = "ERROR";
    //         response.msg = "Duplicate Product Found";
    //     } else if (error) {
    //         console.log(error);
    //         response.type = "ERROR";
    //         response.msg = "Can't Save Report At This Time!";
    //     }

    //     res.json(response);
    // });

    web3.eth.getAccounts((error, accounts) => {

        var account = accounts[0];
        // var account = web3.eth.accounts.wallet[0].address;
        var productContract = TruffleContarct(ProductAbi);

        productContract.setProvider(web3.currentProvider);
        productContract.deployed().then(function(instance) {

            var result = instance.addProduct(
                "\"" + data.userId + "\"",
                "\"" + data.productName + "\"",
                "\"" + data.productBrand + "\"",
                "\"" + data.productCategory + "\"",
                "\"" + data.countryOrigin + "\"",
                "\"" + data.cityOrigin + "\"",
                "\"" + data.ristType + "\"",
                "\"" + data.description + "\"", { from: account });
            console.log(result);
            result.then(function(result) {
                data.transactionHash = result.tx;

                productDao.insert(data, (error) => {
                    var response = {
                        type: "OK",
                        msg: "Saved"
                    };

                    if (error && error.code == 'ER_DUP_ENTRY') {
                        response.type = "ERROR";
                        response.msg = "Duplicate Product Found";
                    } else if (error) {
                        console.log(error);
                        response.type = "ERROR";
                        response.msg = "Can't Save Report At This Time!";
                    }

                    res.json(response);
                });


                // productDao.insert(data, (error) => {
                //     var response = {
                //         type: "OK",
                //         msg: "Saved"
                //     };

                //     if (error && error.code == 'ER_DUP_ENTRY') {
                //         response.type = "ERROR";
                //         response.msg = "Duplicate Product Found";
                //     } else if (error) {
                //         console.log(error);
                //         response.type = "ERROR";
                //         response.msg = "Can't Save Report At This Time!";
                //     }

                //     res.json(response);
                // });
                return data;
            }).catch(function(error) {
                res.status(500);
                res.json({ type: "ERROR", msg: "Error on server side" });
                console.log(error);
            });

        }).catch(function(error) {
            res.status(500);
            res.send({ type: "ERROR", msg: "Error on server side" });
            console.log(error);
        });
    });

}

exports.getAllProducts = (req, res) => {
    productDao.selectAllProducts((error, results) => {

        console.log(results);

        var products = [];
        if (results) {
            for (var result of results) {
                products.push({
                    id: result.Id,
                    productName: result.Product_Name,
                    productBrand: result.Product_Brand,
                    productCategory: result.Product_Category,
                    countryOrigin: result.Country_Origin,
                    cityOrigin: result.City_Origin,
                    riskType: result.Risk_Type,
                    description: result.Description,
                    imagePath: result.Image_Path,
                    transactionHash: result.transaction_hash,
                    productModel: result.Model
                });
            }
        }
        productDao.selectAllFromRASData((err, reslt) => {

            if (reslt) {
                for (var r of reslt) {
                    products.push({
                        id: r.Id,
                        productName: r.Product_Name,
                        productBrand: r.Product_Brand,
                        productCategory: r.Product_Category,
                        countryOrigin: r.Country_Origin,
                        cityOrigin: r.City_Origin,
                        riskType: r.Risk_Type,
                        description: r.Description,
                        imagePath: r.Image_Path,
                        transactionHash: r.transaction_hash,
                        productModel: r.Model
                    });
                }
            }
            res.json(products);
        });

    });
}

exports.getProduct = (req, res) => {
    var productId = req.params.id;
    console.log(productId);

    productDao.selectProduct(productId, (error, results) => {

        // product_name, product_brand, product_category, country_origin, city_origin, risk_type, description, image_path, transaction_hash, user_id
        if (error) {
            res.status(500).json({
                type: "ERROR",
                msg: "ERROR ON SERVER SIDE"
            });
            return;
            ``
        }

        if (results && results.length <= 0) {
            res.status(204).json({
                type: "OK",
                msg: "NO CONTENT"
            });
            return;
        }

        var result = results[0];
        var product = {
            id: result.Id,
            productName: result.Product_Name,
            productBrand: result.Product_Brand,
            productCategory: result.Product_Category,
            countryOrigin: result.Country_Origin,
            cityOrigin: result.City_Origin,
            riskType: result.Risk_Type,
            description: result.Description,
            imagePath: result.Image_Path,
            transactionHash: result.transaction_hash,
            productModel: result.Model
        };

        res.json(product);
    });
}

exports.getAllUserProducts = (req, res) => {
    var userId = req.params.userId;

    productDao.selectAllUserProducts(userId, (error, results) => {

        console.log(results);

        var products = [];

        for (var result of results) {
            products.push({
                id: result.Id,
                productName: result.Product_Name,
                productBrand: result.Product_Brand,
                productCategory: result.Product_Category,
                countryOrigin: result.Country_Origin,
                cityOrigin: result.City_Origin,
                riskType: result.Risk_Type,
                description: result.Description,
                imagePath: result.Image_Path,
                transactionHash: result.transaction_hash,
                productModel: result.Model,
            });
        }

        if (products.length == 0) {
            res.status(204).json(products);
        } else {
            res.json(products);
        }

    });
}

exports.verifyProduct = (req, res) => {
    var query = req.query.q;
    var type = req.query.t;
    var products = [];

    var valid = (error, results) => {

        for (var s of results) {
            products.push({
                "id": s.Id,
                "productName": s.Product_Name,
                "productBrand": s.Product_Brand,
                "productCategory": s.Product_Category,
                "countryOrigin": s.Country_Origin,
                "cityOrigin": s.City_Origin,
                "riskType": s.Risk_Type,
                "description": s.Description,
                "imagePath": s.Image_Path,
                "productModel": s.Model,
                "transactionHash": s.transaction_hash,
                "valid": "dangerous"
            });
        }

        res.json(products);
    };

    axios.get(config.certificateOkServer + "?q=" + query).then((response) => {
        if (response) {
            if (response.data) {
                var data = response.data.results;
                return data;
            }
        }

        return [];
    }).then((result) => {

        if (result) {
            for (var s of result) {
                products.push({
                    "id": s.cbId,
                    "productName": s.product,
                    "productBrand": "",
                    "productCategory": "",
                    "countryOrigin": "",
                    "cityOrigin": "",
                    "riskType": "",
                    "description": "Product Number: " + s.number,
                    "imagePath": "",
                    "productModel": s.model,
                    "transactionHash": "",
                    "valid": s.valid ? "valid" : "invalid"
                });
            }
        }


        if (type && type == "NAME") {
            productDao.searchByName(query, valid);
        } else if (type && type == "MODEL") {
            productDao.searchByModel(query, valid);
        }
    });
};