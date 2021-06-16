const bcrypt = require('bcrypt');//pour importer le package bcrypt//
const jwt = require('jsonwebtoken');//pour importer le package jsonwebtoken//

const User = require('../models/User')//pour importer le schema  de données user//

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)//pour appeler la fonction de hachage de bcrypt et "saler" le mot de passe 10fois//
      .then(hash => {
        const user = new User({//on crée un nouvel utilisateur//
          email: req.body.email,
          password: hash
        });
        user.save()//on enregistre le nouvel utilisateur dans la base de données//
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {//on vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données//
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)//on utilise la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données//
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  { userId: user._id},
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};