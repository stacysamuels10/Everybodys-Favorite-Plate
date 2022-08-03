const express = require("express");
const { SavedRecipe, Users, NewRecipes } = require("../../../database/models");
const bcrypt = require("bcrypt");
const session = require("express-session");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

//what is this route supposed to do?
router.post("/get_savedrecipe", async (req, res) => {
  const { RecipeId } = req.body;
  console.log(RecipeId);
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

router.post("/add_savedrecipe", async (req, res) => {
  const { id } = req.body;
  console.log(req.session.user);
  const SessionUser = req.session.user.id;
  console.log(SessionUser);
  try {
    console.log("try");
    const FindRecipe = await SavedRecipe.findOne({
      where: {
        UserId: SessionUser,
        NewRecipeId: id,
      },
    });
    console.log("before find recipe");
    console.log(FindRecipe);
    if (!FindRecipe) {
      const SavedRecipeInfo = {
        UserId: SessionUser,
        NewRecipeId: id,
        createAt: new Date(),
        updatedAt: new Date(),
      };
      console.log(SavedRecipeInfo);
      const AddSavedRecipe = await SavedRecipe.create(SavedRecipeInfo);
      const countTimesSaved = await SavedRecipe.count({
        where: {
          NewRecipeId: id,
        },
      });
      const findNewRec = await NewRecipes.findOne({
        where: {
          id: id,
        },
      });
      console.log(findNewRec);
      console.log("timessave");
      console.log(countTimesSaved);
      await findNewRec.update({
        where: {
          TimesSaved: countTimesSaved,
        },
      });
      console.log(findNewRec);
      res.status(200).send("Saved Recipe");
    } else {
      //this needs a status 400 error
      res.status(400).send("Recipe has already saved");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//personally, i dont think we need them to enter their password to unsave a recipe. i think it will be too cumbersome.
//just have them validate their session that they are still logged in
router.delete("/delete_savedrecipe", LoginCheck, async (req, res) => {
  const { NewRecipeId } = req.body;
  try {
    const findRecipe = await SavedRecipe.findOne({
      where: {
        UserId: req.session.user.id,
        NewRecipeId: NewRecipeId,
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
