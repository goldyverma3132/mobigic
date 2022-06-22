//import user model
const User = require("../model/user");
// var mongoose = require('mongoose');

var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";

//upload image send image_url
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/uploadFile')
    },
    filename: function (req, file, callback) {
        Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        callback(null, Filename);
    }
});

var upload = multer({ storage: storage }).single('avatar');

//upload image and get file name
module.exports.upload_report = function (req, res) {
    Filename = "";
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.json({ status: false, err: err, message: ' error uploading file ' });
        }
        else {
            return res.json({ status: true, image: Filename });
        }
    });

};
//delete image file
module.exports.deleteFile = (imglink, res) => {
    fs.stat('/uploadFile' + imglink, function (err, stats) {
        //here we got all information of file in stats variable
        console.log(stats);
        if (err) {
            return res.json({ error: err });
        }
        fs.unlink('/uploadFile' + imglink, function (err) {
            if (err) return res.json({ error: err });
            //if no error , file has been deleted successfully
            console.log('file deleted !');
           

        })
    })
}


// user register
module.exports.register = (req, res) => {
    let username = req.body.username;
    let password = req.body.email;

    //validation 
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();

    var errors = req.validationError();
    if (errors) {
        return res.json({ status: false, error: errors });
    }
    else {
        let userObj = {
            username: username,
            password: password
        };
        User.userRegister(userObj, (err, result) => {
            if (err) return res.json({ status: false, error: err });
            else return res.json({ status: true, response: result });
        });
    }
}

//user login
module.exports.login = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    User.getSingleUser({ username: username }, function (err, user) {
        if (err) return res.json({ status: false, error: err });
        if (user) {
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (isMatch) {
                    const data = {
                        _id: user._id,
                        username: user.username,
                        userType: "user"
                    }
                    jwt.sign(data, 'secret', (err, token) => {
                        return res.json({ status: true, token: 'JWT' + token, response: data });
                    })
                }
                else {
                    return res.json({ status: false, message: "invalid password" })
                }
            })
        }
        else {
            return res.json({ status: false, message: " User not found" });
        }
    })
}
