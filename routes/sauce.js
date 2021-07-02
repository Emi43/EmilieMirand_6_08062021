//le fichier routes permet de voir toutes les routes disponibles de notre application//
//le nom des fonctions permet de voir de quelle route il s'agit//
const express = require('express');//pour importer l'application express//
const router = express.Router();//pour créer un routeur express//

const sauceCtrl = require('../controllers/sauce');//pour importer le controlleur//
const auth = require('../middleware/auth');//pour importer le middleware qui protège mes routes//
const multer = require('../middleware/multer-config');//pour importer le middleware qui permet de télecharger des fichiers images depuis le frontend//

//pour protéger mes routes j'ajoute le middleware 'auth' avant le controlleur//
//j'ajoute le middleware 'multer' pour avoir un fichier image avec la requête post//
router.get('/', auth, sauceCtrl.getAllSauce);//pour afficher toutes les sauces//
router.post('/', auth, multer, sauceCtrl.createSauce);//pour enregistrer des sauces dans la BDD//
router.get('/:id', auth, sauceCtrl.getOneSauce);//pour afficher une sauce//
router.post('/:id/like', auth, sauceCtrl.likeSauce);//pour liker une sauce//
router.put('/:id', auth, multer, sauceCtrl.modifySauce);//pour modifier une sauce//
router.delete('/:id', auth,  sauceCtrl.deleteSauce);//pour supprimer une sauce//

module.exports = router;//je réexporte le routeur//