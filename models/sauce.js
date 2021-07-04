//pour créer un schéma de données qui contient les champs souhaités pour chaque sauce//
const mongoose = require('mongoose');//pour importer mongoose//

const sauceSchema = mongoose.Schema({//on utilise la méthode Schema de Mongoose//
  userId : {type: String},
  name : { type : String},
  manufacturer : { type : String},
  description : { type : String},
  mainPepper : { type : String},
  imageUrl : { type : String},
  heat : { type : Number},
  likes : { type : Number},
  dislikes : { type : Number},
  usersLiked : { type : [String]},
  usersDisliked : { type : [String]},

});
//on exporte ce Schema en tant que modèle Mongoose//
module.exports = mongoose.model('Sauce', sauceSchema);