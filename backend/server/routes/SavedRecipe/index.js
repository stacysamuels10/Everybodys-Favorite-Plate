const express = require("express");
const { SavedRecipe } = require("../../../database/models");
const router = express.Router();

router.get("/get_savedrecipe", (req, res) => {
  res.send("got saved recipe");
});

module.exports = router;
