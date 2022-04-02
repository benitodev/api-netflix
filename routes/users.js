const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");
//GET
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const user = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find();

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You aren't allowed to see all users!");
  }
});
//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = jwt.verify(req.body.password, process.env.SECRET);
    }

    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account");
  }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your account");
  }
});

module.exports = router;
