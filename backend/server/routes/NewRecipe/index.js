const express = require("express");
const { NewRecipes, Users } = require("../../../database/models");
const router = express.Router();

router.get("/get_newrecipe", async (req, res) => {
  const newrec = await NewRecipes.findOne({
    where: {
      Name: req.body.Name,
    },
  });
  if (newrec) {
    console.log(newrec);
  } else {
  }
  res.json({
    message: "Recipe not found",
  });
});
router.post("/create_newrecipe", async (req, res) => {
  const { Name, UserId, Picture, Ingredients, Instructions } = req.body;
  try {
    const findusernameid = await Users.findOne({
      where: {
        id: UserId,
      },
    });

    if (!findusernameid) {
      res.json({
        message: "Have to be logged in to upload recipe",
      });
    } else {
      const RecipeInfo = {
        Name: Name,
        UserId: UserId,
        Picture: Picture,
        Ingredients: Ingredients,
        Instructions: Instructions,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const CreateRecipe = await NewRecipes.create(RecipeInfo);
      res.status(200).send(CreateRecipe);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/delete_recipe", async (req, res) => {
  const { Username, Password, RecipeId } = req.body;
  try {
    const findrecipe = await NewRecipes.findOne({
      where: {
        RecipeId: RecipeId,
      },
    });
    const findUsername = await Users.findOne({
      where: {
        Username: Username,
        Password: Password,
      },
    });
    if (!findrecipe) {
      res.json({
        message: "cant find recipe",
      });
    }
    if (!findUsername) {
      res.json({
        message: "cant find Username",
      });
    }
    if (Users.Password === Password) {
      res.status(200).send(`${NewRecipes.Name} has been deleted`);
    } else {
      res.send("Password Incorrect.");
    }
  } catch {
    res.status(400).send("Wrong Username or password");
  }
});

module.exports = router;