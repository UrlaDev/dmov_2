'use strict'
var Ensayo = require('../models/ensayo');
var fs = require('fs');
var path = require('path');

function saveEnsayo(req,res){
    var params = req.body;
    var ensayo = new Ensayo();
    if(params.date){
        ensayo.date = params.date;
        ensayo.time = params.time.trim();
        ensayo.place = params.place.trim();
        ensayo.direccion = params.direccion.trim();
        console.log(ensayo)
        const dia = new Promise((resolve,reject)=>{
            resolve(Ensayo.find({date:ensayo.date}))
        });
        dia.then((ensa) => {
            
            if(ensa.length >= 1){
                return res.status(500).send({mens:'Existe un ensayo registrado para ese día'});
            }else{
              const guarda = new Promise((resolve,reject) => {
                  resolve(ensayo.save());
              });  
              guarda.then( guardado => {
                console.log(ensayo)
                  return res.status(200).send(guardado);
              }
                
                ).catch((er) =>{ return res.status(404).send({erro:'Ha ocurrido errore', err: er})});
            }
        }).catch((er) =>{ return res.status(404).send({erro:'Ha ocurrido erroro', err: er})});
    
    }else{ 
        res.status(200).send({message: 'Envía todos los campos necesarios'});
    }
}
// TODOS LOS ENSAYOS
 function getEnsayos(req,res){

     Ensayo.find().sort('-date').exec((err,EnsayosTodos)=>{
        if(err) res,status(404).send({message:'Problema al traer archivos'})
        return res.status(200).send({EnsayosTodos});
     });
         
        // //     try{
//         var EnsayosTodos = await Ensayo.find().sort({date: -1});
//         return res.status(200).send({EnsayosTodos});
// }catch(err){ return handleError(err);};
};
//UN SOLO ENSAYO
async function getEnsayo(req,res){
    var ensayoID = req.params.id;
    try{
        var ensayo = await Ensayo.findById(ensayoID);
        return res.status(200).send({ensayo});
}catch(err){ return handleError(err);};
};

function updateEnsayo(req,res){
    var ensayoId = req.params.id;
    var ensayoUpdate = req.body;

    Ensayo.findByIdAndUpdate(ensayoId,ensayoUpdate, {new:true} , (err,ensayoUpdated)=>{
        if(err){
            return res.status(500).send({message: 'Error en la petición'});
        }
        if(!ensayoUpdated) return res.status(404).send({message: 'No se ha podido actualizar el Chow'});
        return res.status(200).send({ensayo: ensayoUpdated});
    });
 }
 function deleteEnsayo(req,res){
    var ensayoId = req.params.id;
    const delet = new Promise(function(resolve,reject) {
                resolve(  Ensayo.findByIdAndRemove(ensayoId))
    }) 
    delet.then((respue)=> {
        return res.status(200).send({respue})

    }).catch((er) => { return res.status(404).send({err:'Error en la petición', erro: er})})
};


function uploadImage(req,res){
    var ensayoId = req.params.id;
      
     if(req.files){
         var file_path = req.files.img.path;
         console.log(file_path);
         var file_split = file_path.split('/');
         var file_name = file_split[2];
         var ext_split = file_name.split('\.');
        //  var file_ext = ext_split[1];
        var file_ext = path.extname(file_path); //usamos extname de la librería path de Nodejs
        Ensayo.findById(ensayoId,(er,ensayu) => {
            if(er) return res.send(404).send({mens:'Error en la búsqueda'});
            ensayu.img.push(file_name);

     
            if(file_ext == '.png' || file_ext == '.jpg' || file_ext == '.jpeg' || file_ext == '.gif'){
                //actualizar documento de usuario logueado
               Ensayo.findByIdAndUpdate(ensayoId, {img: ensayu.img}, {new:true}, (err,ensayoUpdated) => {
                 if(err) return res.status(404).send({message: 'Error en la búsqueda en la Bd'});
                 if(!ensayoUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                 return res.status(200).send({ensayo: ensayoUpdated});
     
               })
              }else{
                removeFilesOfUploads(res,file_path, 'extensión no válida');
              }        
        })
       }else{
            return res.status(200).send({message: 'no se han subido imágenes'});
        }   
};




function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/ensayos/'+image_file;
    fs.exists(path_file, (exist) => {
        if(exist){
           return res.sendFile(path.resolve(path_file));
        }else{
            return res.status(404).send({message: 'No existe la imágen...'});
        }
    });
};
function deleteImage(req,res){
    
    var ensayoID = req.params.id;
    var imgName = req.body.img;
    var path_file = './uploads/ensayos/'+imgName;
    // removeFilesOfUploads(res,imgName,'Imágen borrada con éxito!')
    //buscar el ensayo
    Ensayo.findById(ensayoID, (er,ensayin) => {
        if(er) return res.status(404).send({message: 'error al buscar para borrar'});
         //buscar la imagen en el campo imagen
       var indexToRemove =  ensayin.img.indexOf(imgName);
       ensayin.img.splice(indexToRemove,1);
        //updatear el ensayo sin la imagen
        Ensayo.findByIdAndUpdate(ensayoID,ensayin,{new:true},(er,updated) => {
            if(er) return res.status(404).send({msg:'error', e: er});
             
             removeFilesOfUploads(res,path_file, 'imagen borrada', updated);
        })
    })
   
};
function uploadAudio(req,res){
    var ensayoId = req.params.id;
      
    if(req.files){
        var file_path = req.files.audio.path;
        console.log(file_path);
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
       var file_ext = path.extname(file_path); //usamos extname de la librería path de Nodejs
       Ensayo.findById(ensayoId,(er,ensayu) => {
           if(er) return res.send(404).send({mens:'Error en la búsqueda'});
           ensayu.audio.push(file_name);

    
           if(file_ext == '.mp3' || file_ext == '.wav' || file_ext == '.MP3'){
               //actualizar documento de usuario logueado
              Ensayo.findByIdAndUpdate(ensayoId, {audio: ensayu.audio}, {new:true}, (err,ensayoUpdated) => {
                if(err) return res.status(404).send({message: 'Error en la búsqueda en la Bd'});
                if(!ensayoUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                return res.status(200).send({ensayo: ensayoUpdated});
    
              })
             }else{
               removeFilesOfUploads(res,file_path, 'extensión no válida');
             }        
       })
      }else{
           return res.status(200).send({message: 'no se ha subido audio'});
       }   
};
function getAudioFile(req,res){
    var audio_file = req.params.audioFile;
    var path_file = './uploads/ensayos/audios/'+audio_file;
    fs.exists(path_file, (exist) => {
        if(exist){
           return res.sendFile(path.resolve(path_file));
        }else{
            return res.status(404).send({message: 'No existe el audio...'});
        }
    });
};

function deleteAudio(req,res){
    
    var ensayoID = req.params.id;
    var audioName = req.params.audio;
    console.log( ensayoID, audioName);
    var path_file = './uploads/ensayos/audios/'+audioName;
    console.log(path_file)
    // removeFilesOfUploads(res,imgName,'Imágen borrada con éxito!')
    //buscar el ensayo
    Ensayo.findById(ensayoID, (er,ensayin) => {
        if(er) return res.status(404).send({message: 'error al buscar para borrar'});
         //buscar la imagen en el campo imagen
       var indexToRemove =  ensayin.audio.indexOf(audioName);
       console.log(indexToRemove)
       ensayin.audio.splice(indexToRemove,1);
        //updatear el ensayo sin la imagen
        Ensayo.findByIdAndUpdate(ensayoID,ensayin,{new:true},(er,updated) => {
            if(er) return res.status(404).send({msg:'error', e: er});
             
             removeFilesOfUploads(res,path_file, ' audio borrado', updated);
        })
    })
   
};
function removeFilesOfUploads(res,path_file, message, updated){
    fs.unlink(path_file,() => {
      
         return res.status(200).send({message:message, updated})
    });
};
module.exports = {
    saveEnsayo,
    getEnsayos,
    getEnsayo,
    updateEnsayo,
    deleteEnsayo,
    uploadImage,
    getImageFile,
    deleteImage,
    uploadAudio,
    getAudioFile,
    deleteAudio
 }