const express = require("express");
const { SavedRecipe, Users, NewRecipes } = require("../../../database/models"); //we dont actually user Users since we are using session
const bcrypt = require("bcrypt"); //i dont think we use this here?
const session = require("express-session");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("home");
  }
};

router.get("/dashboard", async (req, res) => {
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
//what is this route supposed to do? Is this getting all saved recipes or one saved recipe?
//if it is for one recipe, we can use the get recipe by id in the new recipe js file so i dont think we need this. will leave it here just in case
router.post("/get_savedrecipe/:id", LoginCheck, async (req, res) => {
  const { RecipeId } = req.params.id;
  const sessionUserId = req.session.user.id;
  try {
    const findSaved = await SavedRecipe.findOne({
      where: {
        UserId: sessionUserId,
        NewRecipeId: RecipeId,
      },
    });
    console.log(findSaved);
    if (findSaved) {
      res.status(200).send(findSaved);
    }
  } catch (error) {
    res.status(400).send("Saved Recipe does not exist");
  }
});

router.get("/get_all_savedrecipe", LoginCheck, async (req, res) => {
  try {
    const findall = await SavedRecipe.findAll({
      where: { UserId: req.session.user.id },
    });
    console.log(findall);
    if (findall) {
      res.status(200).send(findall);
    } else {
      res.status(400).send("Cannot find Recie");
    }
  } catch (error) {
    res.status(400).send("Could not find any Saved Recipes");
  }
});

router.post("/add_savedrecipe/:id", async (req, res) => {
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

router.delete("/delete_savedrecipe/:id", LoginCheck, async (req, res) => {
  try {
    console.log("i am reading this route");
    const findRecipe = await SavedRecipe.findOne({
      where: {
        UserId: req.session.user.id,
        NewRecipeId: req.params.id,
      },
    });
    console.log(findRecipe);
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
