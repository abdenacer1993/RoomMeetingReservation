const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { registerRules, validator } = require("../middleweares/validator");
const isAuth = require("../middleweares/passport");

const router = express.Router();

// ===== Register New User =====
router.post("/register", registerRules(), validator, async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).send({ msg: "User already exists, please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();
    newUser.password = undefined; // mask password

    res.status(201).send({ user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// ===== Login User =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).send({ msg: "Bad credentials" });
    }

    const isMatched = await bcrypt.compare(password, existUser.password);
    if (!isMatched) {
      return res.status(400).send({ msg: "Bad credentials" });
    }

    const payload = { _id: existUser._id, role: existUser.role };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });

    existUser.password = undefined;
    res.send({ user: existUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// ===== Current Authenticated User =====
router.get("/current", isAuth(), (req, res) => {
  res.send(req.user);
});

// ===== Get All Users (Only Authenticated) =====
router.get("/allUsers", isAuth(), async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// ===== Update User by ID =====
router.put("/:id", isAuth(), async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// ===== Delete User by ID =====
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.send({ msg: "User successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// ===== Get User From Token =====
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No token provided");

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded._id).select("-password");
    res.send({ user });
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid token");
  }
});

module.exports = router;
