//express
'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');


//cargar rutas
var user_routes = require('./routes/user');
var show_routes = require('./routes/show');
var ensayo_routes = require('./routes/ensayo');
var contacto_routes = require('./routes/contacto');

//cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //convierte el body en un json en cada una de las peticiones que hagamos al backend;

//Cors y cabeceras
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//rutas // el . use ejecuta la acción antes de llegar al controlador

 app.use('/', express.static('client', {redirect:false}));
app.use('/api', user_routes);
app.use('/api', show_routes);
app.use('/api', ensayo_routes);
app.use('/api', contacto_routes);
app.get('*',function(req,res,next){
    res.sendFile(path.resolve('client/index.html'));

})

//exportar
module.exports = app;