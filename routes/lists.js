const router = require("express").Router();
const List = require("../models/List");

const verify = require("../verifyToken");
//CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);

    try {
      const savedList = await newList.save();

      res.status(201).json(savedList);
    } catch (error) {
      res.status(500).json("error in create");
    }
  } else {
    res.status(403).json("You aren't allowed");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);

      res.status(200).json("The list has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You aren't allowed");
  }
});

//GET
router.get("/", verify, async (req, res) => {
  let typeQuery = req.query.type;
  let genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery && !genreQuery) {
      list = await List.aggregate([
        { $sample: { size: 5 } },
        { $match: { type: typeQuery } },
      ]);
      typeQuery = "";
    } else if (genreQuery && !typeQuery) {
      list = await List.aggregate([
        { $sample: { size: 5 } },
        { $match: { genre: genreQuery } },
      ]);
      genreQuery = "";
    } else if (genreQuery && typeQuery) {
      list = await List.aggregate([
        { $sample: { size: 5 } },
        { $match: { type: typeQuery, genre: genreQuery } },
      ]);
      typeQuery = "";
      genreQuery = "";
    } else {
      list = await List.aggregate([{ $sample: { size: 5 } }]);
    }

    if (list.length > 0) {
      res.status(200).json(list);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//categories
router.get("/categories", async (req, res) => {
  try {
    const list = await List.aggregate([{ $project: { genre: 1 } }]);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
