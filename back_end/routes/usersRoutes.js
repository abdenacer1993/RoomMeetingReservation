const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { registerRules, validator } = require("../middleweares/validator");
const isAuth = require("../middleweares/passport");
// const isSuperAdmin=require("../middleweares/isSuperAdmin")
const router = express.Router();

//register new user

router.post("/register", registerRules(), validator, async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).send({ msg: "user already exist , please login" });
    }
    const newUser = new User({ ...req.body });
    const hashedPassword = await bcrypt.hash(password, 10);
    //&newUser={...newUser,password:hashedPassword}==>>erroooooooooooooooooooor
    //console.log(hashedPassword)
    newUser.password = hashedPassword;
    //console.log(newUser instanceof User) ==>true
    await newUser.save();
    newUser.password=undefined
    res.send({ user: newUser });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).send({ msg: "bad credential" });
    }
    const isMatched = await bcrypt.compare(password, existUser.password);
    if (!isMatched) {
      return res.status(400).send({ msg: "bad credential" });
    }
    const payload = { _id: existUser._id };
    const token = await jwt.sign(payload, process.env.privateKey);
    existUser.password=undefined
    res.send({ user: existUser, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/current", isAuth(), (req, res) => {
  res.send(req.user);
});
//get all users only for superAmin

router.get("/allUsers", isAuth(), async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

// Update a specific user by ID
router.put("/:id", isAuth(), async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body; // Assuming the request body contains updated user data

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



// Delete a specific user by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Use findByIdAndDelete to remove the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    // Check if the user exists and has been successfully deleted
    if (!deletedUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    // If the user has been successfully deleted, send a success message
    res.send({ msg: "User successfully deleted" });
  } catch (error) {
    // If an error occurs during the deletion process, log the error and send an error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



router.get("/me", async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Assuming token is in the authorization header
  try {
      const decoded = jwt.verify(token, process.env.privateKey);
      const user = await User.findById(decoded._id).select('-password');
      res.send({ user });
  } catch (error) {
      console.error(error);
      res.status(401).send("Invalid token");
  }
});





module.exports = router;
