const Sauce = require('../models/Sauce');//pour importer le modèle de sauce//
const fs = require('fs');//importer le package fs de node//

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;//pour supprimer l'id envoyé par le frontend//
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes : 0,
      dislikes : 0,
      usersLiked : [],
      usersDisliked : []
    });
    console.log(sauce)
    sauce.save()//enregister la nouvelle sauce dans la base de donnée//
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({//on utilise la méthode findOne() pour trouver la Sauce unique ayant le même id que le paramètre de la requête//
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {//condition ternaire//
    const sauceObject = req.file ?//si req.file(fichier image) existe//
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//on modifie l'URL de l'image de manière dynamique//
      } : { ...req.body };//si req.file n'existe pas on fait une copie de req.body//
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//on passe en premier argument l'objet qu'on souhaite modifier et en deuxième argument la nouvelle version de l'objet
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];//on récupère le nom du fichier à supprimer//
        fs.unlink(`images/${filename}`, () => {//on utilise la fonction unlink du package fs pour supprimer le fichier//
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()//renvoie la liste complète des sauces//
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error }));
};
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id:req.params.id})//On utilise la méthode findOne() pour trouver la Sauce unique ayant le même id que le paramètre de la requête//  
      .then(sauce => {
        switch(req.body.like) {
          case 1: //si un utilisateur like la sauce//
            sauce.likes +=1;
            sauce.usersLiked.push(req.body.userId);
            break;
          case -1: //si un utilisateur dislike la sauce//
            sauce.dislikes +=1;
            sauce.usersDisliked.push(req.body.userId);
            break;
          case 0:
            //si un utilisateur enleve son like//
            if(sauce.usersLiked.some(userId => userId == req.body.userId)){
              sauce.likes -=1;
              sauce.usersLiked = sauce.usersLiked.filter(userId => userId != req.body.userId);
            }else {
              sauce.dislikes -=1;
              sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId != req.body.userId);                       
            }
            break;
        }
        sauce.save()//enregistrement//
      .then(() => res.status(201).json())
      .catch(error => res.status(400).json({ error }));
      })
}