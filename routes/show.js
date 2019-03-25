'use strict'

var express = require('express');
var ShowController = require('../controllers/show');
var api = express.Router(); //acceso a los metodos post get delete
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/shows'});
//rutas de SHOW
api.post('/show-register', ShowController.saveShow);
api.get('/show-get-all', ShowController.getShows);
api.get('/show-get-one/:id', ShowController.getShow);
api.put('/show-update/:id', ShowController.updateShow);
api.delete('/show-delete/:id', ShowController.deleteShow);
api.post('/show-upload-image/:id', md_upload, ShowController.uploadImage);
api.get('/show-get-image/:imageFile', ShowController.getImageFile);
module.exports = api;