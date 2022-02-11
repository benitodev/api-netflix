const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    !user && res.status(401).json("Wrong password or username");
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      res.status(401).json({
        err: "invalidate user or password",
      });
    }

    const userForToken = {
      name: user.username,
      id: user._id,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    res.send({
      name: user.username,
      email: user.email,
      id: user.id,
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
