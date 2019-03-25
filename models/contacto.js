'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactoSchema = Schema({
    name:String,
    email:String,
    tel:String,
    note: String
});

module.exports = mongoose.model('Contacto', ContactoSchema);