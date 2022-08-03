const express = require("express");
const { NewRecipes } = require("../../../database/models");
const router = express.Router();
const sequelize = require("sequelize");

router.get("/top5", async (req, res) => {
  const top5 = await NewRecipes.findAll({
    order: [["TimesSaved", "DESC"]],
    limit: 4,
  });

  res.send(top5);
});

router.get("/recently_uploaded", async (rec, res) => {
  const new5 = await NewRecipes.findAll({
    order: sequelize.col("createdAt"),
    limit: 4,
  });
  res.send(new5);
});

module.exports = router;
