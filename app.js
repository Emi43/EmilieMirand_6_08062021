const express = require('express');//pour importer l'application express//
const bodyParser = require('body-parser');//pour importer le package body-parser//
const mongoose = require('mongoose');//pour importer mongoose//
//j'importe path de Node pour donner accès  au chemin de notre système de fichier//
const path = require('path');
const helmet = require("helmet");//pour importer helmet//
const rateLimit = require("express-rate-limit");//pour limiter le nombre d'appels fait à l'API//

//j'importe mes routes sauce et user//
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes//
    max: 100 // limiter à 100 requêtes toutes les 15minutes//
  });

require('dotenv').config();
 //pour connecter l'API à la base de données mongoDB//
mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.f0qrc.mongodb.net/${process.env.DATA_BASE_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//la constante app est mon application express//  
const app = express();

//middleware appliqué à toutes les routes,requêtes envoyées au serveur//
//afin d'éviter que le système de sécurité "CORS" ne bloque les appels http entre les deux serveurs differents//
//ajout de headers sur l'objet reponse pour permettre à l'application d'accéder à l'API//
app.use((req, res, next) => {//middleware général appliqué à toutes les routes//
    res.setHeader('Access-Control-Allow-Origin', '*');//pour accéder à l'API depuis nimporte quelle origine//
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//pour ajouter les headers mentionnés aux requêtes envoyés vers l'API//
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//pour envoyer des requêtes avec les methodes mentionnées//
    next();//next permet d'envoyer le réponse et de passer au middleware suivant//
  });

app.use(bodyParser.json());//pour transformer le corps de la requête en json//
app.use(helmet());//helmet (module de Node)pour sécuriser les en-têtes http//
app.use(limiter);

//je crée un middleware qui va répondre aux requêtes faites à /images et servir le dossier static image//
app.use('/images', express.static(path.join(__dirname, 'images')));

//j'enregistre les routes attendues par le frontend//
app.use('/api/sauces', sauceRoutes);//pour enregistrer le routeur pour toutes les demandes effectuées vers /api/sauces//
app.use('/api/auth', userRoutes);//pour enregistrer le router pour toutes les demandes effectuées vers /api/auth//

module.exports = app;//j'exporte l'application pour y accéder depuis les autres fichiers//
