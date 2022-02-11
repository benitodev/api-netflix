const bcrypt = require("bcrypt");
const router = require("express").Router();

const User = require("../models/User");

//Register

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username: username,
    email: email,
    password: passwordHash,
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
    console.log(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("error to create user");
  }
});

module.exports = router;
