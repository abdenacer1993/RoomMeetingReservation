const express = require( 'express' );
const Reservation = require('../models/reservation');
var router = express.Router();


router.post("/addReservation", async (req, res) => {
    try {
        const existReservation = await Reservation.findOne({ name: req.body.name, user: req.body.user ,dateReservation: req.body.dateReservation});
        if (existReservation) {
            return res.status(400).send({ msg: "Reservation already exists" });
        } else {
            const newReservation = new Reservation({
                name: req.body.name,
                dateReservation: req.body.dateReservation,
                idSalle: req.body.idSalle,
                user: req.body.user //no9sed id user
                
            });
  
            await newReservation.save();
            res.send({ res: newReservation });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
  });


  

  router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.find({
          $and: [
            
            { name: { $regex: req.query.name || "" } },
          ],
        }).populate("user","fullName");
        
        res.send({reservations});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  });

  router.get("/:id", async (req, res) => {
    try {
        const reservations = await Reservation.find({ idSalle: req.params.id }).populate("user", "fullName");
        res.send({ reservations });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



  module.exports = router;