'use strict'

var express = require('express');
var ContactoController = require('../controllers/contacto');
var api = express.Router(); //acceso a los metodos post get delete


api.post('/contacto-register', ContactoController.saveContacto);
api.get('/contacto-get-all/', ContactoController.getContactos);
api.get('/contacto-get-one/:id', ContactoController.getContacto);
api.put('/contacto-update/:id', ContactoController.updateContacto);
api.delete('/contacto-delete/:id', ContactoController.deleteContacto );
// api.post('/ensayo-upload-image/:id',md_upload, EnsayoController.uploadImage);
// api.put('/ensayo-delete-image/:id', EnsayoController.deleteImage);
// api.get('/ensayo-get-image/:imageFile', EnsayoController.getImageFile);
// api.post('/ensayo-upload-audio/:id',md_upload, EnsayoController.uploadAudio);
// api.get('/ensayo-get-audio/:audioFile', EnsayoController.getAudioFile);
// api.delete('/ensayo-delete-audio/:id', EnsayoController.deleteAudio);
module.exports = api;