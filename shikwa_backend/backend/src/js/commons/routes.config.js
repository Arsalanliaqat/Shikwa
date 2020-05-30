const product = require('../api/products/controllers/products.controller');
const user = require('../api/user/controllers/user.controller');
const config = require('../commons/config/config');
const authenticate = require('../commons/services/jwt.service');
const feeds = require('../commons/services/feed.crawler.service');

exports.routeConfig = (app) => {

    var api = config.apiVersion;

    app.get(api + '/products', authenticate.authenticateJWT, product.search);
    app.post(api + '/product', authenticate.authenticateJWT, product.addProduct);
    app.get(api + '/product/:id', authenticate.authenticateJWT, product.getProduct);
    app.get(api + '/product', authenticate.authenticateJWT, product.getAllProducts);

    app.get(api + '/user/:userId/products', authenticate.authenticateJWT, product.searchInUserProducts);
    app.post(api + '/user/register', user.register);
    app.get(api + '/user', authenticate.authenticateJWT, user.getProfile);
    app.put(api + '/user/changepassword', authenticate.authenticateJWT, user.changePassword);
    app.put(api + "/user", authenticate.authenticateJWT, user.updateProfile);
    app.post(api + '/user/login', user.login);
    app.get(api + '/user/:userId/product', authenticate.authenticateJWT, product.getAllUserProducts);

    app.get(api + '/verify', product.verifyProduct);

    app.get(api + '/images/:image', (req, res) => {

        if (req.params && !req.params.image) {
            res.status(204).json({
                type: 'ERROR',
                msg: "Image Not Found"
            });
            return;
        }

        var imageName = req.params.image;
        var absolutePath = config.uploadDirectory + imageName;
        console.log(absolutePath);

        res.sendFile(absolutePath);
    });

    app.get(api + '/feeds', (req, res) => {
        feeds.feed();
    });
};