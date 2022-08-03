const express = require("express");
const { NewRecipes } = require("../../../database/models");
const router = express.Router();
const sequelize = require("sequelize");

//don't both of these need try catch? if so, status 200 and 400 needed
router.get("/top5", async (req, res) => {
  const top5 = await NewRecipes.findAll({
    order: [["TimesSaved", "DESC"]],
    limit: 4,
  });

  res.send(top5);
});
//
// try catch needed, status 200 and 400 needed
router.get("/recently_uploaded", async (rec, res) => {
  const new5 = await NewRecipes.findAll({
    order: sequelize.col("createdAt"),
    limit: 4,
  });
  res.send(new5);
});

module.exports = router;
