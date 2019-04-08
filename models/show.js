'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShowSchema = Schema({
    date:Number,
    time: String,
    place: String,
    direccion: String,
    image: String,
    confirmed: [String],
    note:[]
});

module.exports = mongoose.model('Show', ShowSchema);