'use strict'
var Show = require('../models/show');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');




function handleError(err){
    if(err) return res.status(404).send({m:'Se ha producido un error '});
    
}


function saveShow(req,res){
    var params = req.body; //recibe el objeto show desde el frontEnd
    var show = new Show();
    if(params.date&&params.place){//hace comprobación y asigna
        show.date = params.date;
        show.time = params.time.trim();
        show.place = params.place.trim();
        show.direccion = params.direccion.trim();
        //image tiene su propio controlador
        //confirmed usa el controlador de update
        Show.find({$and: [{date: show.date},{time: show.time}]}).exec((err,showFind) => { 
            if(err) return res.status(500).send({message: 'Error en la petición de show'});                   
            if( showFind.length >= 1){
                return res.status(200).send({message: 'Ya hay un show registrado para ese día y horario', dup: true});
            }else{
              Show.find({date: show.date}).exec( (err,showFinde) => {
                  if(err) return res.status(404).send({message: 'error en la petición de find por date'});
                  if( showFinde.length >= 1)  return res.status(200).send({message: 'Atención: hay un show registrado para la misma fecha', dup: true});
                  show.save((err,showStored) => {
                    if(err) return res.status(500).send({message:'Error alguardar el show'});
                    if(showStored){
                        return res.status(200).send({
                            showGuardado: showStored
                        });
                    }else{
                       return res.status(404).send({message: 'No se guardó el show'})
                    }
    
                });
              });

            }
        });

    }else{
        return res.status(200).send({message: 'Envía todos los campos necesarios'});
    }

};

function getShows(req,res){
    Show.find().sort('date').exec((err,ShowsTodos) => { 
        if(err) res.status(404).send({message:'Error al traer los shows'})
        return res.status(200).send({ShowsTodos});
    });

}
//GET UN SOLO SHOW
async function getShow(req,res){
    var showID = req.params.id;
    try{
        var show = await Show.findById(showID);
        return res.status(200).send({show});
}catch(err){ return res.status(500).send({ err});};
};



function updateShow(req,res){
    var showId = req.params.id;
    var update = req.body;
    if(update.confirmed){
    
    Show.findByIdAndUpdate(showId,update, {new:true} , (err,showUpdated)=>{
        if(err){
            return res.status(500).send({message: 'Error en la petición'});
        }
        if(!showUpdated) return res.status(404).send({message: 'No se ha podido actualizar el Chow'});
        return res.status(200).send({show: showUpdated});
    });

        

    }else{//ver como no repetir esta linea de codigo
    Show.findByIdAndUpdate(showId,update, {new:true} , (err,showUpdated)=>{
            if(err){
                return res.status(500).send({message: 'Error en la petición'});
            }
            if(!showUpdated) return res.status(404).send({message: 'No se ha podido actualizar el Chow'});
            return res.status(200).send({show: showUpdated});
        });
    }
    
};
function deleteShow(req,res){
    var showId = req.params.id;
    const delet = new Promise(function(resolve,reject) {
                resolve(  Show.findByIdAndRemove(showId))
    }) 
    delet.then((respue)=> {
        console.log(respue.image, 'HOLA SOY EL SHOW DELETADO')
        let file_path = respue.image;
        let message = 'Show borrado'
        removeFilesOfUploads(res,file_path, message)
        // return res.status(200).send({respue})

    }).catch((er) => { return res.status(404).send({err:'Error en la petición', erro: er})})
};

function uploadImage(req,res){
    var showId = req.params.id;
      
     if(req.files){
         console.log(req.files);
         var file_path = req.files.image.path;
         console.log(file_path);
         var file_split = file_path.split('/');
         var file_name = file_split[2];
        var file_ext = path.extname(file_path); //usamos extname de la librería path de Nodejs
     

         if(file_ext == '.png' || file_ext == '.jpg' || file_ext == '.jpeg' || file_ext == '.gif'){
           //actualizar documento de usuario logueado
          Show.findByIdAndUpdate(showId, {image: file_name}, {new:true}, (err,showUpdated) => {
            if(err) return res.status(404).send({message: 'Error en la búsqueda en la Bd'});
            if(!showUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            return res.status(200).send({show: showUpdated});

          });
         }else{
           removeFilesOfUploads(res,file_path, 'extensión no válida');
         }
        }else{
            return res.status(200).send({message: 'no se han subido imágenes'});
        }   

};
function removeFilesOfUploads(res,file_path, message){
    var path_file = './uploads/shows/'+file_path;
    fs.unlink(path_file,(err) => {
        
        if(err) return res.status(404).send({message: 'error al borrar archivo'});
        return res.status(200).send({message:message})
    });
};
function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/shows/'+image_file;
    fs.exists(path_file, (exist) => {
        if(exist){
            res.sendFile(path.resolve(path_file));
        }else{
            return res.status(404).send({message: 'No existe la imágen...'});
        }
    });
};




module.exports = {
    saveShow,
    getShows,
    getShow,
    updateShow,
    deleteShow,
    uploadImage,
    getImageFile
 }