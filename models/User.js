const mongoose = require('mongoose');//pour importer mongoose//
const uniqueValidator = require('mongoose-unique-validator');//pour importer le package de validation  pour pré-valider les informations avant de les valider//

const userSchema = mongoose.Schema({//on utilise la methode schema de mongoose//
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);//pour ne pas avoir plusieurs utilisateurs avec la même addresse mail//

module.exports = mongoose.model('User', userSchema);
//on exporte ce schema en tant que modèle Mongoose//