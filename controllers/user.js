'use strict'
var User = require('../models/user');
// var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function saveUser(req,res){
    var params = req.body;
    var user = new User();
    if(params.name&&params.password){
        user.name = params.name.trim();
        user.password = params.password.trim();
        user.image = params.image;

        User.find({name: user.name}).exec((err,userFind) => { //el método find de mongoose devuelve un array con los documentos de la base de datos que cumplen la condición
            if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});                   
            if( userFind.length >= 1){
                return res.status(200).send({message: 'Ya hay alguien usando ese nombre. Elegí otro', dup: true});
            }else{
               
                    //Aquí iba bcryp pero lo sacamos
                   
                    //guardar en la base de datos   // ¿cláusulas de guarda ? 
                    user.save((err,userStored) => {
                        if(err) return res.status(500).send({message:'Error alguardar el usuario'});
                        if(userStored){
                            return res.status(200).send({
                                userGuardado: userStored
                            });
                        }else{
                            res.status(404).send({message: 'No se ha podido registrar el usuario'})
                        }
        
                    })
        


            }
        })//fin de find
    }else{
        res.status(200).send({message: 'Envía todos los campos necesarios'});
    }

};
function loginUser(req,res){
    var check = false;
    var params = req.body;
    var name = params.name.trim();
    var password = params.password.trim();
    User.findOne({name: name}, (err,user) => {
        if(err) return res.status(500).send({message: 'error en la búsqueda de la base de datos'});
        if(user){ //comparar password guardada con la que llega del body de la req
          if(password == user.password){ 
              check = true;
              console.log(password, user.password,check)
              if(err) return res.status(500).send({message: 'Surgió un error. Por favor, intentalo de nuevo'});
              if(check){
                  if(params.gettoken){
                    //generar y   devolver token
                    return res.status(200).send({
                        token: jwt.createToken(user) 
                    });
                  }else{
                  //devolver datos de usuario
                  user.password = undefined;
                  return res.status(200).send({user});
                  }

              } 
            }else{
                  return res.status(403).send({message: 'contraseña incorrecta', contraseniaNo: true});
              } 
          //fin bcrypt
        }else{
            return res.status(403).send({message: 'no estás aún registrado',noReistradoAun: true});
        }

    });

}
function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;
   

    if(userId != req.user.sub){//user comprobation
        return res.status(500).send({
            message: 'No tienes permiso para actualizar los datos del usuario'
        });
    }
    //comprobar que el nuevo name no esté ya registrado
    User.find({name: update.name}).exec((err,userFind) => { //el método find de mongoose devuelve un array con los documentos de la base de datos que cumplen la condición
        if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});                   
        if( userFind.length >= 1){
            return res.status(200).send({message: 'Ya hay alguien usando ese nombre.', dup: true});
        }else{
           
            User.findByIdAndUpdate(userId,update, {new:true}, (err,userUpdated) => {
                if(err) return res.status(404).send({message: 'Error en la búsqueda en la Bd'});
                if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                return res.status(200).send({user: userUpdated, message: 'Cambios realizados con éxito!'});
            })
        


        }

  
   

  
})
};
// Subir archivos de imágen/avatar de usuario
function uploadImage(req,res){
    var userId = req.params.id;
      
     if(req.files){
         var file_path = req.files.image.path;
         console.log(file_path);
         var file_split = file_path.split('/');
         var file_name = file_split[2];
         var ext_split = file_name.split('\.');
        //  var file_ext = ext_split[1];
        var file_ext = path.extname(file_path); //usamos extname de la librería path de Nodejs
     
        //  if(userId != req.user.sub){
        //         removeFilesOfUploads(res,file_path, 'usuario incorrecto');
        //            } 
         if(file_ext == '.png' || file_ext == '.jpg' || file_ext == '.jpeg' || file_ext == '.gif'){
         //actualizar documento de usuario logueado
          User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err,userUpdated) => {
            if(err) return res.status(404).send({message: 'Error en la búsqueda en la Bd'});
            if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            return res.status(200).send({user: userUpdated});

          })
         }else{
           removeFilesOfUploads(res,file_path, 'extensión no válida');
         }
        }else{
            return res.status(200).send({message: 'no se han subido imágenes'});
        }   

};
 function removeFilesOfUploads(res,file_path, message){

    console.log(file_path)
    fs.unlink(file_path,(err) => {
        if(err) return res.status(404).send({message: 'error al borrar archivo'});
        return res.status(200).send({message:message})
    });
};


function removeFilesOfUploadsSinReturn(fileName){
let filePath = './uploads/users/'+fileName;
    console.log(filePath, 'SOY FILEPATH')
    fs.unlink(filePath,(err) => {
        if(err) console.log('ERORRRREEE')
        // return res.status(200).send({message:message})
    });
};



function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;
    fs.exists(path_file, (exist) => {
        if(exist){
            res.sendFile(path.resolve(path_file));
        }else{
            return res.status(404).send({message: 'No existe la imágen...'});
        }
    });
};
function updateImage(req,res){
    var userId = req.params.id;
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    console.log(file_name);
    User.findById(userId).exec((err,user)=>{
        if(err) return res.status(202).send({message: 'error en base de datos', er:err});
        if( User.image != file_name){
            //hay que 
            removeFilesOfUploadsSinReturn(user.image);
            //guarda imagen
            console.log('DESPUES DE BORARREE')
         User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err,userUpdated) => {
                if(err) return res.status(404).send({message: 'Error en la búsqueda en la Bd'});
                if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
               
                return res.status(200).send({user: userUpdated});
    
               })
           //borra imágen anterior con el fin de no acumular archivos en upload
            

        }else{ 
            return res.status(200).send({message: 'La imágen seleccionada es igual a la actual', igual: true})
    }
    })
}



function getUsers(req,res){  
    User.find().sort('_id').exec((err,users)=>{
        if(err){
            return res.status(500).send({message: 'Error en la petición'});
        }
        if(!users){
            return res.status(404).send({message: 'No hay usuarios disponibles'});
        }
       return res.status(200).send({
                users             
            });
    })
}


module.exports = {
   saveUser,
   loginUser,
   updateUser,
   uploadImage,
   updateImage,
   getImageFile,
   getUsers
}