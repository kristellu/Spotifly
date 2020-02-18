'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
//var artist_routes = require('./routes/artist');
//var album_routes = require('./routes/album');
//var song_routes = require('./routes/song');


//Configurar body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configurar cabeceras http

//Carga de rutas base
app.use('/api', user_routes); //antes de ejecutar el servidor, cada ruta tendrá api delante
//app.use('/api', artist_routes);
//app.use('/api', album_routes);
//app.use('/api', song_routes);
 

//Exportar modulo a otro ficheros que también usen express
module.exports =app;