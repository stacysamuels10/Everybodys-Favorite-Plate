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

router.post("/get_savedrecipe", (req, res) => {
  const {UserId, RecipeId} = req.body
  const find = await findOne({
    where:{
      UserId: UserId,
      RecipeId: RecipeId

    }
  })
  if (find) {
    res.send(find);
  }
  else{
  res.send("Recipe not found");
  }
});

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
    // const FindUser = await SavedRecipe.findOne({
    //   where: {
    //     // change to session
    //     Userid: Userid

    //   },
    // });
    const FindRecipe = await SavedRecipe.findOne({
      where: {
        where: {
          UserId: req.session.user.id,
          NewRecipeId: RecipeId,
        },
      },
    });
    //Add session to this if
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
      res.send("Recipe already saved");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/delete_savedrecipe", LoginCheck, async (req, res) => {
  //read Session to make sure the person is signed in
  //use session to get userid and recipeid will be selected
  // const stillsignedin
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
      res.send("Recipe not found");
    }
    if (validatePassword) {
      FindSavedRecipe.destroy();
    } else {
      res.send("Password incorrect");
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
