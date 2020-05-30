const db = require('../../commons/services/mysql.service');

exports.register = (user, callback) => {

    if (!user.gender) {
        user.gender = "";
    }

    const values = "'" + user.firstName + "','" + user.lastName + "','" + user.email + "','" + user.street + "','" + user.city + "','" + user.zip + "','" + user.country + "','" + user.password + "','" + user.gender + "','" + user.description + "','" + user.phoneNumber + "','" + user.landlineNumber + "','" + user.userName + "'";

    const query = 'INSERT INTO tbl_user (First_Name, Last_Name, Email, Street, City, Zip, Country, Password, gender, description, phone_number, landline_number, user_name) VALUES(' + values + ')';

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            console.log(error);
            callback(error);
            connection.release();
        });

    });

}

exports.login = (user, callback) => {

    const query = "SELECT id, email, password FROM tbl_user WHERE email = '" + user.email + "'";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });

    });


}

exports.selectProfile = (user, callback) => {
    const query = "SELECT * FROM tbl_user WHERE email = '" + user.user + "'";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });

    });


}

exports.updateProfile = (auth, user, callback) => {
    if (!user.gender) {
        user.gender = "";
    }
    const query = "UPDATE tbl_user SET user_name = '" + user.userName + "', landline_number = '" + user.landlineNumber + "', phone_number = '" + user.phoneNumber + "',description ='" + user.description + "',First_Name='" + user.firstName + "',Last_Name='" + user.lastName + "',Street='" + user.street + "',City='" + user.city + "',Zip='" + user.zip + "',Country='" + user.country + "', gender ='" + user.gender + "' WHERE email = '" + auth.user + "'";

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });

    });

}

exports.changePassword = (data, email, callback) => {
    const query = "UPDATE tbl_user SET password = '" + data.newPassword + "' WHERE email = '" + email + "' AND password = '" + data.oldPassword + "'";
    console.log(query);

    db.getConnection((err, connection) => {
        connection.query(query, (error, results, fields) => {
            callback(error, results);
            connection.release();
        });
    });
}