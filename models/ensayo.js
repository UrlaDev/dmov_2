'use strict'
var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EnsayoSchema = Schema({
    date: Number,
    time:String,
    place: String,
    direccion: String,
    img: [],
    audio:[],
    confirmed:[],
    note:[]

});
module.exports = mongoose.model('Ensayo', EnsayoSchema);