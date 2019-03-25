'use strict'

var express = require('express');
var EnsayoController = require('../controllers/ensayo');
var api = express.Router(); //acceso a los metodos post get delete
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/ensayos'});
var md_uploadAudios = multipart({uploadDir: './uploads/ensayos/audios'});

api.post('/ensayo-register', EnsayoController.saveEnsayo);
api.get('/ensayo-get-all', EnsayoController.getEnsayos);
api.get('/ensayo-get-one/:id', EnsayoController.getEnsayo);
api.put('/ensayo-update/:id', EnsayoController.updateEnsayo);
api.delete('/ensayo-delete/:id', EnsayoController.deleteEnsayo );
api.post('/ensayo-upload-image/:id',md_upload, EnsayoController.uploadImage);
api.put('/ensayo-delete-image/:id', EnsayoController.deleteImage);
api.get('/ensayo-get-image/:imageFile', EnsayoController.getImageFile);
api.post('/ensayo-upload-audio/:id',md_uploadAudios, EnsayoController.uploadAudio);
api.get('/ensayo-get-audio/:audioFile', EnsayoController.getAudioFile);
api.delete('/ensayo-delete-audio/:id/:audio', EnsayoController.deleteAudio);
module.exports = api;