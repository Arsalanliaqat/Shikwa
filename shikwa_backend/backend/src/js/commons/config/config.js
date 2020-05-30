config = {
    server: {
        ethereumServer: "http://ganachecli:8545",
        // ethereumServer: "https://ropsten.infura.io/v3/a0f0e28dba9649acb1bfb14e6383a674",
        port: 3000
    },
    // database: {
    //     host: process.env.MYSQL_HOST || '127.0.0.1',
    //     user: 'root',
    //     password: 'ghaffar',
    //     database: 'shikwa_db',
    //     connectionLimit: 100,
    //     waitForConnection: true,
    //     multipleStatements: true,
    //     port: process.env.MYSQL_PORT
    // },
    database: {
        host: 'mysql1008.mochahost.com',
        user: 'abdulgha_ghaffar',
        password: 'ghaffar!@#$%',
        database: 'abdulgha_shikwa_db',
        connectionLimit: 100,
        waitForConnection: true,
        multipleStatements: true
    },
    apiVersion: "/api/v1.0",
    accessTokenSecret: "mynameisghaffar",
    // uploadDirectory: "/tmp/",
    uploadDirectory: "/backend/uploads/",
    certificateOkServer: "https://app.certificateok.de/api/certificate"
};

module.exports = config;