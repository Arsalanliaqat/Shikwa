const express = require('express');
const jwt = require('jsonwebtoken');
const formidableMiddleware = require('express-formidable');

const config = require('./commons/config/config');
const routes = require('./commons/routes.config');

const fs = require('fs');

const app = express();


delete process.env['http_proxy'];
delete process.env['HTTP_PROXY'];
delete process.env['https_proxy'];
delete process.env['HTTPS_PROXY'];

app.use(formidableMiddleware({
    uploadDir: config.uploadDirectory,
    encoding: 'utf-8',
    multiples: true
}));

const PORT = config.server.port;
// const PORT = process.env.PORT;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

routes.routeConfig(app);

app.listen(PORT, () => console.log("server is listening on port " + PORT + "!"));