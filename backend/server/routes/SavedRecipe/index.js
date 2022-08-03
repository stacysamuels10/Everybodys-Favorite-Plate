const express = require("express");
const { SavedRecipe, Users, NewRecipes } = require("../../../database/models");
const bcrypt = require("bcrypt");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

router.post("/get_savedrecipe", async (req, res) => {
  const { UserId, RecipeId } = req.body;
  const find = await findOne({
    where: {
      UserId: UserId,
      RecipeId: RecipeId,
    },
  });
  if (find) {
    res.send(find);
  } else {
    res.send("Recipe not found");
  }
});

//doesnt this need a try catch? i.e. in case the user has zero saved recipes
//if try catch, please add 200 and 400 status
router.get("get_all_savedrecipe"),
  LoginCheck,
  async (req, res) => {
    const findall = await SavedRecipe.findAll({
      where: { Userid: req.session.user.id },
    });
    res.send(findall);
  };

router.post("/add_savedrecipe", async (req, res) => {
  const { RecipeId } = req.body;
  try {
    const FindRecipe = await SavedRecipe.findOne({
      where: {
        where: {
          UserId: req.session.user.id,
          NewRecipeId: RecipeId,
        },
      },
    });
    if (FindRecipe) {
      const SavedRecipeInfo = {
        UserId: req.session.users.id,
        RecipeId: RecipeId,
      };
      const AddSavedRecipe = await SavedRecipe.create(SavedRecipeInfo);
      const TimesSavedfind = await NewRecipes.findOne({
        where: {
          id: RecipeId,
        },
      });
      const currentTimesSaved = TimesSavedfind.TimesSaved;
      const addTimesSaved = currentTimesSaved + 1;
      TimesSavedfind.update({
        TimesSaved: addTimesSaved,
      });
      res.status(200).send(AddSavedRecipe);
    } else {
      //this needs a status 400 error
      res.send("Recipe already saved");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//personally, i dont think we need them to enter their password to unsave a recipe. i think it will be too cumbersome.
//just have them validate their session that they are still logged in
router.delete("/delete_savedrecipe", LoginCheck, async (req, res) => {
  const { Password, RecipeId } = req.body;
  try {
    const findRecipe = await SavedRecipe.findOne({
      where: {
        UserId: req.session.user.id,
        RecipeId: RecipeId,
      },
    });
    const validatePassword = await bcrypt.compare(
      Password,
      req.session.user.Password
    );
    if (!findRecipe) {
      //status 200 needed
      res.send("Recipe not found");
    }
    if (validatePassword) {
      FindSavedRecipe.destroy();
    } else {
      //status 400 needed
      res.send("Password incorrect");
    }
  } catch (error) {
    //status 400 needed
    res.send(error);
  }
});

module.exports = router;
