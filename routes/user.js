const express = require('express');//pour importer express//
const router = express.Router();//pour créer notre routeur avec la fonction router d'express//

const userCtrl = require('../controllers/user');//pour importer les controllers//

//je crée deux routes post parce que le frontend doit envoyer des informations( adresse mail et mot de passe)//
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;//pour exporter le routeur vers app.js//