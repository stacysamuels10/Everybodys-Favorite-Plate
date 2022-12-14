const express = require("express");
const session = require("express-session");
const { NewRecipes, Users, SavedRecipe } = require("../../../database/models");
const router = express.Router();

//route used to protect our other routes checking for active session
const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("home");
  }
};
//rendering page
router.get("/create-recipe", (req, res) => {
  res.render("create-recipe");
});
//a render recipe route when a recipe picture is clicked on
router.get("/view-recipe/:id", LoginCheck, async (req, res) => {
  try {
    const findRecipe = await NewRecipes.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (findRecipe) {
      res.status(200).render("view-recipe", {
        locals: {
          title: findRecipe,
        },
      });
    }
  } catch (error) {
    res.status(400).send("Saved Recipe does not exist");
  }
});
//renders the edit recipe page. preserves the data so the user
//has text area with the current recipe already loaded
router.get("/update-recipe/:id", LoginCheck, async (req, res) => {
  try {
    const findRecipe = await NewRecipes.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (findRecipe) {
      res.status(200).render("update-recipe", {
        locals: {
          update: findRecipe,
        },
      });
    }
  } catch (error) {
    res.status(400).send("Recipe does not exist");
  }
});
//route to create a new recipe
router.post("/create_newrecipe", LoginCheck, async (req, res) => {
  const { Name, Picture, Ingredients, Instructions, FamilyStory } = req.body;
  try {
    const userid = req.session.user.id;
    const findusernameid = await Users.findOne({
      where: {
        id: userid,
      },
    });

    if (findusernameid) {
      const RecipeInfo = {
        Name: Name,
        UserId: userid,
        Picture: Picture,
        Ingredients: Ingredients,
        Instructions: Instructions,
        FamilyStory: FamilyStory,
        createdAt: new Date(),
        updatedAt: new Date(),
        TimesSaved: 0,
      };
      const CreateRecipe = await NewRecipes.create(RecipeInfo);
      res.status(200).send("Recipe created");
    } else {
      res.status(400).send("have to be logged in to upload recipe")({
        message: "Have to be logged in to upload recipe",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//update a recipe that user has created
router.put("/update_newrecipe/:id", LoginCheck, async (req, res) => {
  const { Name, Picture, Ingredients, Instructions, FamilyStory } = req.body;
  const findrecipe = await NewRecipes.findOne({
    where: {
      id: req.params.id,
    },
  });
  try {
    const recipeuserid = findrecipe.UserId;
    if (req.session.user.id === recipeuserid) {
      if (findrecipe) {
        findrecipe.update({
          Name: Name,
          Picture: Picture,
          Ingredients: Ingredients,
          Instructions: Instructions,
          updateAt: new Date(),
          FamilyStory: FamilyStory,
        });
        res.status(200).send();
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//delete a recipe that user has created
router.delete("/delete_recipe/:id", LoginCheck, async (req, res) => {
  try {
    const findrecipe = await NewRecipes.findOne({
      where: {
        id: req.params.id,
      },
    });
    const recipeuserid = findrecipe.UserId;
    if (req.session.user.id === recipeuserid) {
      const findsavedrec = await SavedRecipe.findAll({
        where: {
          NewRecipeId: findrecipe.id,
        },
      });

      if (findsavedrec) {
        SavedRecipe.destroy({
          where: {
            NewRecipeId: findrecipe.id,
          },
        });
        findrecipe.destroy();
        res.status(200).send(`Recipe has been deleted`);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
