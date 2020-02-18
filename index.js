'use strict'

var mongoose = require('mongoose'); //cargar libreria a mongo db
var app = require('./app'); //cargo fichero de otro file
var port = process.env.PORT || 3977; //puerto de mi servidor web en backend (arbitrario)

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("¡HEY! La conexión a la base de datos funciona..");


        //hacer que el servidor ecuche
        app.listen(port, function(){
            console.log("Servidor del APIrest escuchando en http://localhost:"+port); //dirección localhost
        });
    }
});