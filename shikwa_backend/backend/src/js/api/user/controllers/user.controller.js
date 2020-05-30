const usreDb = require('../user.dao');
const jwt = require('jsonwebtoken');
const config = require('../../../commons/config/config');

exports.login = (req, res) => {
    const params = req.fields;

    var user = {};
    user.email = params.email;
    user.password = params.password;

    usreDb.login(user, (error, results) => {
        var response = {
            type: "OK",
            msg: ""
        };

        if (error) {
            console.log(error);
            res.status(500);
            response.type = "ERROR";
            response.msg = "Can't login at this time";
        } else if (results && results.length <= 0) {
            res.status(200);
            response.type = "ERROR";
            response.msg = "User not found";
        } else if (results && results.length > 0) {
            var password = results[0].password;

            if (user.password != password) {
                response.type = "ERROR";
                response.msg = "Password is not right";

            } else {
                response.msg = "Login Successfull";
                var secret = config.accessTokenSecret;
                response.userId = results[0].id;
                var token = jwt.sign({ user: user.email }, secret);

                response.token = token;
            }

        }

        res.json(response);

    });
}

exports.register = (req, res) => {
    const params = req.fields;

    var user = {};
    user.firstName = params.firstName;
    user.lastName = params.lastName;
    user.email = params.email;
    user.street = params.street;
    user.city = params.city;
    user.zip = params.zip;
    user.country = params.country;
    user.password = params.password;

    usreDb.register(user, (error) => {
        var response = {
            type: "OK",
            msg: "Registered"
        };

        if (error && error.code == 'ER_DUP_ENTRY') {
            response.type = "ERROR";
            response.msg = "User Already Exists";
        } else if (error) {
            response.type = "ERROR";
            response.msg = "Can't Register User At this time!";
        }

        res.send(response);
    });
}

exports.changePassword = (req, res) => {
    var data = req.fields;

    if (!data || !data.oldPassword || !data.newPassword) {
        res.status(409).json({
            type: "ERROR",
            msg: "Make sure that old password and new password is not empty"
        });
        return;
    }

    usreDb.changePassword(data, req.user.user, (error, result) => {
        if (result && result.affectedRows > 0) {
            res.json({
                type: "OK",
                msg: "changed successfully"
            });
            return;
        }

        res.json({
            type: "OK",
            msg: "Old Password is not correct"
        });
        // affectedRows
    });
}

exports.getProfile = (req, res) => {
    var user = req.user;

    usreDb.selectProfile(user, (error, results) => {
        var profile = {};
        if (results && results.length > 0) {
            var result = results[0];

            profile.firstName = result.First_Name;
            profile.lastName = result.Last_Name;
            profile.email = result.Email;
            profile.street = result.Street;
            profile.city = result.City;
            profile.zip = result.Zip;
            profile.country = result.Country;
            profile.userName = result.User_Name
            profile.phoneNumber = result.Phone_Number;
            profile.landlineNumber = result.Landline_number;
            profile.gender = result.Gender;
            profile.description = result.Description;
        }

        res.json(profile);
    });
}

exports.updateProfile = (req, res) => {
    var auth = req.user;
    var userNewData = req.fields;

    usreDb.updateProfile(auth, userNewData, (error, results) => {
        var response = {
            type: "OK",
            msg: "UPDATE"
        };

        if (error) {
            response.type = "ERROR";
            response.msg = "Can't update profile at this time";
        }
        console.log(results);

        res.json(response);
    });
}