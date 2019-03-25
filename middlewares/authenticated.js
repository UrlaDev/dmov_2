'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'este_es_un_secret_re_dificil_ja_ja_ja';


exports.ensureAuth = function(req,res,next){//hasta que no se invoca el método next() no sale de la función

    if(!req.headers.authorization){
      return  res.status(404).send({message: 'La petición no tiene la cabecera de autenticación'})
    }
    var token = req.headers.authorization.replace(/['"']+/g, ''); 
    
try{
    console.log(token)
    var payload = jwt.decode(token,secret);
    if(payload.exp <= moment().unix()){
        return res.status(401).send({
            message: 'El token ha expirado'
        });
    }

}catch(d){ 
      return res.status(404).send({message: 'El token no es válidod'});

}

     req.user = payload;
     next();
}