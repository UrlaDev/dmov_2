'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'este_es_un_secret_re_dificil_ja_ja_ja';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        image: user.image,
        iat: moment.unix(),
        exp: moment().add(30,'days').unix()
    };
    return jwt.encode(payload, secret)
}