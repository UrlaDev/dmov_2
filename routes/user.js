'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router(); //acceso a los metodos post get delete
var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'})
api.post('/user-register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/user-update/:id', mdAuth.ensureAuth, UserController.updateUser);
api.post('/user-upload-image/:id',md_upload, UserController.uploadImage);
api.post('/user-update-image/:id',[mdAuth.ensureAuth,md_upload], UserController.updateImage);
api.get('/user-get-image/:imageFile', UserController.getImageFile);
api.get('/user-get-all', UserController.getUsers);
module.exports = api;