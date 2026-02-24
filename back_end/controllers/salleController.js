const { populate } = require("../models/Salle");
const Salle = require("../models/Salle");

module.exports.addSalle = async function (req, res) {
  
  

  // Obtenir l'URL de base
  const url = `${req.protocol}://${req.get('host')}`;
  const { file } = req;
  try {
    const existSalle = await Salle.findOne({ name: req.body.name });
    if (existSalle) {
      return res.status(400).send({ msg: "La salle existe déjà" });
    } else {
      const newSalle = new Salle({
        name: req.body.name,
        user: req.body.user,
        roomSize: req.body.roomSize,
        roomLocalisation: req.body.roomLocalisation,
        roomPrice: req.body.roomPrice,
        roomDescription: req.body.roomDescription
      });
      console.log(newSalle,"salle")
      console.log(req.files,"files");
      // Si vous téléchargez plusieurs fichiers
      if (req.files && req.files.length > 0) {
        newSalle.files = req.files.map(file => `${url}/${file.path}`);
      }

      await newSalle.save();
      return res.send({ msg: "Salle ajoutée" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Erreur interne du serveur" });
  }
}