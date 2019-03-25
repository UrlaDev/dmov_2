'use strict'
var Contacto = require('../models/contacto');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function saveContacto(req,res){
    var params = req.body;
    var contacto = new Contacto();
    contacto.name = params.name.trim();
    contacto.email = params.email.trim().toLowerCase();
    contacto.tel = params.tel.trim();
    contacto.note = params.note.trim();

    const guarda = new Promise((resolve,reject) => {
        resolve(contacto.save());
    });  
    guarda.then( guardado => {
        return res.status(200).send(guardado);
    }
      
      ).catch((er) =>{ return res.status(404).send({erro:'Ha ocurrido errore', err: er})});

};
// TODOS LOS CONTACTOS
async function getContactos(req,res){
    try{
        var ContactosTodos = await Contacto.find().sort('name');
        return res.status(200).send({ContactosTodos});
}catch(err){ return handleError(err);};
};
//GET UN SOLO COntacto
async function getContacto(req,res){
    var contactoID = req.params.id;
    try{
        var contacto = await Contacto.findById(contactoID);
        return res.status(200).send({contacto});
}catch(err){ return res.status(500).send({ err});};
};

function updateContacto(req,res){
    var contactoId = req.params.id;
    var contactoUpdate = req.body;

    Contacto.findByIdAndUpdate(contactoId,contactoUpdate, {new:true} , (err,contactoUpdated)=>{
        if(err){
            return res.status(500).send({message: 'Error en la petición'});
        }
        if(!contactoUpdated) return res.status(404).send({message: 'No se ha podido actualizar el contacto'});
        return res.status(200).send({contacto: contactoUpdated});
    });
 };

 function deleteContacto(req,res){
    var contactoId = req.params.id;
    const delet = new Promise(function(resolve,reject) {
                resolve(  Contacto.findByIdAndRemove(contactoId))
    }) 
    delet.then((respue)=> {
        return res.status(200).send({respue})

    }).catch((er) => { return res.status(404).send({err:'Error en borrar contacto', erro: er})})
};



module.exports = {
    saveContacto,
    getContactos,
    getContacto,
    updateContacto,
    deleteContacto
 }