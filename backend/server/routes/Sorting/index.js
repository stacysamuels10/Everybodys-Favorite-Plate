const express = require("express");
const { NewRecipes } = require("../../../database/models");
const router = express.Router();
const sequelize = require("sequelize");

//don't both of these need try catch? if so, status 200 and 400 needed

//
// try catch needed, status 200 and 400 needed
router.get("/recently_uploaded", async (rec, res) => {
  try {
    const new5 = await NewRecipes.findAll({
      order: sequelize.col("createdAt"),
      limit: 4,
    });
    res.send(new5);
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
