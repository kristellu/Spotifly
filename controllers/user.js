'user strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
	});
}

//recibe: req, devuelve:res
function saveUser(req, res){
    var user = new User();

	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

    if(params.password){
        // Encriptar contraseña
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;

			if(user.name != null && user.surname != null && user.email != null){
				// Guardar el usuario
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				});

			}else{
			    res.status(200).send({message: 'Rellena todos los campos'});
			}
		});
	}else{
		res.status(200).send({message: 'Introduce la contraseña'});
	}

}

//verificar que el usuario que se logee exista en mi DB
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe.'});
			}else{
				//comprobar contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						//devolver los datos del usuario logeado
						if(params.gethash){
							//devolver un token de jwt
							//encripta información del usuario, cuando reciba este token puedo decodificarlo
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user}); //devolver el usuario
						}
					}else{
						//devolver error
						res.status(404).send({message: 'Contraseña incorrecta.'});
					}
				});
			}	
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id; //sacado de la url
	var update = req.body;


	User.findByIdAndUpdate(userId, update, (err, userUpdate) =>{
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdate){
				res.status(404).send({message: 'No se ha podido actualizar el usuario.'});

			}else{
				res.status(200).send({user: userUpdate});

			}
		}
	});

}


//Para usar el metodo, necesito exportar a modulo
module.exports = {
    pruebas,
	saveUser,
	loginUser,
	updateUser
};