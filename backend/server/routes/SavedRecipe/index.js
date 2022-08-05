const express = require("express");
const { SavedRecipe, Users, NewRecipes } = require("../../../database/models"); //we dont actually user Users since we are using session
const bcrypt = require("bcrypt"); //i dont think we use this here?
const session = require("express-session");
const router = express.Router();

//checks current session
const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("home");
  }
};
//renders user's saved recipes
router.get("/dashboard", LoginCheck, async (req, res) => {
  try {
    let array = [];
    const { Email, Username, id } = req.session.user;
    const finduser = await Users.findOne({
      where: {
        Username: Username,
        Email: Email,
        id: id,
      },
    });
    const findall = await SavedRecipe.findAll({
      where: { UserId: finduser.id },
    });
    if (findall) {
      for (let i = 0; i < findall.length; i++) {
        const findRecipe = await NewRecipes.findOne({
          where: {
            id: findall[i].dataValues.NewRecipeId,
          },
        });
        array.push(findRecipe);
      }
      res.render("dashboard", {
        locals: {
          title: finduser,
          saverecipe: findall,
          recipe: array,
        },
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//route saved here for future feature
router.get("/get_all_savedrecipe", LoginCheck, async (req, res) => {
  try {
    const findall = await SavedRecipe.findAll({
      where: { UserId: req.session.user.id },
    });
    if (findall) {
      res.status(200).send(findall);
    } else {
      res.status(400).send("Cannot find Recie");
    }
  } catch (error) {
    res.status(400).send("Could not find any Saved Recipes");
  }
});
//add a saved recipe to user's dashboard
router.post("/add_savedrecipe/:id", LoginCheck, async (req, res) => {
  try {
    const FindRecipe = await SavedRecipe.findOne({
      where: {
        UserId: req.session.user.id,
        NewRecipeId: req.params.id,
      },
    });
    if (!FindRecipe) {
      const SavedRecipeInfo = {
        UserId: req.session.user.id,
        NewRecipeId: req.params.id,
        createAt: new Date(),
        updatedAt: new Date(),
      };
      const AddSavedRecipe = await SavedRecipe.create(SavedRecipeInfo);
      res.status(200).send("Saved Recipe");
    } else {
      res.status(500).send("Recipe has already saved");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//us-save a recipe
router.delete("/delete_savedrecipe/:id", LoginCheck, async (req, res) => {
  try {
    const findRecipe = await SavedRecipe.findOne({
      where: {
        UserId: req.session.user.id,
        NewRecipeId: req.params.id,
      },
    });
    if (!findRecipe) {
      res.status(400).send("Recipe not found");
    }
    if (findRecipe) {
      findRecipe.destroy();
      res.status(200).send("Saved Recipe Deleted");
    } else {
      res.status(400).send("User is not signed in");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
