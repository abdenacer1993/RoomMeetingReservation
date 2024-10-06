const express = require("express");
const Salle = require("../models/Salle");

const isAuth = require("../middleweares/passport");
const router = express.Router();
const upload = require('../utils/multer'); // Assuming the upload middleware is defined in uploadMiddleware.js
const salleController = require("../controllers/salleController");

router.post("/addsalle", upload('salle').array('files'), (req, res, next) => {
  salleController.addSalle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
          // Gérer les erreurs Multer ici
          if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({ message: "Fichier trop volumineux" });
          }
          // Autres types d'erreurs Multer
          // ...
      } else if (err) {
          // Gérer d'autres erreurs
          return res.status(500).json({ message: "Erreur lors de l'ajout de la salle" });
      }
      // Si aucune erreur, continuer avec la prochaine étape
      next();
  });
});




  
router.get("/", async (req, res) => {
  try {
      const salles = await Salle.find({
        $and: [
          { roomLocalisation: { $gte: req.query.roomLocalisation || 0 } },
          { name: { $regex: req.query.name || "" } },
        ],
      }).populate("user","fullName");
      
      res.send({salles});
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});



// router.get("/sallesDisp", async (req, res) => {
//   try {
//     // Check if the query parameter q1 exists and its value
//     const q1 = req.query.q1 === 'false';

//     // Define the filter based on the query parameter
//     const filter = q1 ? { disponible: false } : {disponible: true};

//     // Find all salles based on the filter
//     const salles = await Salle.find(filter);

//     res.send(salles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });





// DELETE ONE Salle
router.delete("/:id", async (req, res) => {
  try {
    const result = await Salle.deleteOne({ _id: req.params.id });
    if (!result.deletedCount) {
      return res.status(400).send({ msg: "Salle already deleted" });
    }
    res.send({ msg: "Salle successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});


// //UPDATE ONE Salle
// router.put("/:id", async (req, res) => {
//   try {
//     const result = await Salle.updateOne(
//       { _id: req.params.id },
//       { $set: { ...req.body } }
//     );
//     if (!result.modifiedCount) 
//     {return res.status(400).send({msg:"no things to update"});}
//       res.send({msg:"Salle update"})
//   } catch (error) {
//     console.log(error);
//   }
// });

//UPDATE ONE Salle
router.put("/disp/:id", async (req, res) => {
  try {
    const salleId = req.params.id;
    const updatedFields = { disponible: false }; // Set the field you want to update
    
    const result = await Salle.updateOne(
      { _id: salleId },
      { $set: updatedFields }
    );

    if (!result.modifiedCount) {
      return res.status(400).send({ msg: "No changes to update" });
    }

    res.send({ msg: "Salle updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const oneSalle = await Salle.findOne({ _id: req.params.id });
    res.send(oneSalle);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
