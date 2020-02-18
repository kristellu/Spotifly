'use strict'

var express = require ('express');
var UserController = require('../controllers/user'); //carga ruta de fichero
var api = express.Router(); //permite crear ruta para la api 
var md_auth = require('../middleware/authenticate');

api.get('/probando-controlador', md_auth.ensureAuth ,UserController.pruebas); //cargar api
api.post('/register', UserController.saveUser); 
api.post('/login', UserController.loginUser); 
api.put('/update-user/:id', md_auth.ensureAuth,UserController.updateUser ); 

module.exports = api;