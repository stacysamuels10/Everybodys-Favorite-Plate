const express = require("express");
const { NewRecipes } = require("../../../database/models");
const router = express.Router();
const sequelize = require("sequelize");

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("home");
  }
};

//This route is not used but will be kept in the code for future features that will be added soon!
router.get("/recently_uploaded", LoginCheck, async (rec, res) => {
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
