'use strict'

var fs =  require('fs'); //para trabajar con sistma de ficheros
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//sacar informaciòn del artista de la db
function getArtist(req, res){
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});

        }else{
            if(!artist){
                res.status(404).send({message: 'Artista no existe.'});

            }else{
                res.status(200).send({artist});

            }
        }
    });
}

//LISTAR VARIOS ARTISTAS
function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    var itemsPerPage = 3; //cuantos artistas por pagina

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists,total){
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No hay artistas'});
            }else{
                res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    }); //ordenarlos por nombre

}

function saveArtist(req, res){
    var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

    artist.save((err,artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar astista.'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'Artista no guardado.'});

            }else{
                res.status(200).send({artist: artistStored});
            }
        }
        
    });
}

function updateArtist(req, res){
    var artistId= req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update,(err, artistUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al guardar astista.'});

        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'Artista no actualizado'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar astista.'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'Artista no eliminado'});
            }else{
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar el album.'});
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({message: 'Album no eliminado'});
                        }else{
                            Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error al eliminar la canción'});
                                }else{
                                    if(!albumRemoved){
                                        res.status(404).send({message: 'Canción no eliminada'});
                                    }else{
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				if(!artistId){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({artist: artistUpdated});
				}
			});

		}else{
			res.status(200).send({message: 'Extensión del archivo no valida'});
		}
		
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/'+imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
	getImageFile
}