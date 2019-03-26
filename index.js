//Carga principal del proyecto//Conexión a Mongo DB desde Nodejs
'use strict'

var mongoose = require('mongoose');
var app = require('./app'); //importamos todo lo de express
var port = process.env.PORT || 3800; //     ¿variable de entorno?averiguar

//conexión a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dmob', {useNewUrlParser: true })
                 .then(()=> {
                     console.log('La conexión a la base de datos Dmob se ha realizado correctamente');
                     //crear servidor
                     app.listen(port, ()=>{
                         console.log('servidor corriendo en http://localhost:380');
                     })
                 })
                 .catch(err => console.log(err));