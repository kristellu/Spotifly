'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta'; 

exports.ensureAuth = function(req, res, next){
    //recojo autorizacion
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Petición sin cabecera de autenticación'})
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    //decodifico token
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'Token expirado'});
        }
    }catch(ex){
       // console.log(ex);
        return res.status(404).send({message: 'Token invalido'})

    }

    req.user = payload; 
    next();
};