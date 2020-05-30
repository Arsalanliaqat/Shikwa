const db = require('../../commons/services/mysql.service');

exports.insert = (report, callback) => {
    console.log("INSERT PRODUCT: " + JSON.stringify(report));

    var values = "'" + report.productName + "','" + report.productBrand + "','" + report.productCategory + "','" + report.countryOrigin + "','" + report.cityOrigin + "','" + report.riskType + "','" + report.description + "','" + report.imagePath + "','" + report.transactionHash + "'," + report.userId + ", '" + report.productModel + "'";
    var query = "INSERT INTO tbl_report (product_name, product_brand, product_category, country_origin, city_origin, risk_type, description, image_path, transaction_hash, user_id, Model ) VALUES(" + values + ")";
    console.log("QUERY: " + query);

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error);
            connection.release();
        });
    });
}


exports.insertBatch = (reports, callback) => {

    var query = "INSERT INTO tbl_ras_data (product_name, product_brand, product_category, country_origin, city_origin, risk_type, description, image_path ) VALUES ?";

    db.getConnection((err, connection) => {
        connection.query(query, [reports], (error, results, fields) => {
            callback(error, results);
            // connection.release();
        });
    });

}

exports.selectAllProducts = (callback) => {
    var query = "SELECT * FROM tbl_report";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });

}

exports.selectAllFromRASData = (callback) => {
    var query = "SELECT * FROM tbl_ras_data";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });

}

exports.selectProduct = (productId, callback) => {
    var query = "SELECT * FROM tbl_report WHERE id = " + productId;

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });
}

exports.selectAllUserProducts = (userId, callback) => {
    var query = "SELECT * FROM tbl_report WHERE user_id = " + userId;

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });

}

exports.searchByName = (productName, callback) => {
    var query = "SELECT * FROM tbl_report WHERE product_name LIKE '%" + productName + "%'";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });
};

exports.searchFromRASDataByName = (productName, callback) => {
    var query = "SELECT * FROM tbl_ras_data WHERE product_name LIKE '%" + productName + "%'";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });
};

exports.searchUserProducetsByName = (userId, productName, callback) => {
    var query = "SELECT * FROM tbl_report WHERE product_name LIKE '%" + productName + "%' AND user_id = " + userId;

    console.log(query);
    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });

};

exports.searchByModel = (model, callback) => {
    var query = "SELECT * FROM tbl_report WHERE model LIKE '%" + model + "%'";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });

}