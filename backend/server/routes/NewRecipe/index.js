const express = require("express");
const { NewRecipe, Users, SavedRecipe } = require("../../../database/models");
const bcrypt = require("bcrypt");
const { reset } = require("nodemon");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

router.get("/get_newrecipe", LoginCheck, async (req, res) => {
  const newrec = await NewRecipe.findOne({
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
router.get("/get_all_id_recipe", LoginCheck, async (req, res) => {
  const findall = await NewRecipe.findAll({
    where: {
      UserId: req.session.user.id,
    },
  });
  console.log(findall);
});
router.get("/test", (req, res) => {
  res.send("test worked");
});
router.post("/create_newrecipe", LoginCheck, async (req, res) => {
  const { Name, Picture, Ingredients, Instructions } = req.body;
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
        UserId: req.session.user.id,
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

router.put("/update_newrecipe", LoginCheck, async (req, res) => {
  const { Name, Password, RecipeId, Picture, Ingredients, Instructions } =
    req.body;
  const findrecipe = await NewRecipe.findOne({
    where: {
      id: RecipeId,
    },
  });
  try {
    if (findrecipe) {
      const validatePassword = await bcrypt.compare(
        Password,
        req.session.user.Password
      );
      if (validatePassword) {
        findrecipe.update({
          Name: Name,
          Picture: Picture,
          Ingredients: Ingredients,
          Instructions: Instructions,
        });
      } else {
        res.send("password incorrect");
      }
    } else {
      res.send("Recipe not found");
    }
  } catch (error) {
    res.send(error);
  }
});
// cheack and delete from saved table then delete newrecipe table
router.delete("/delete_recipe", LoginCheck, async (req, res) => {
  const { Password, RecipeId } = req.body;
  try {
    const findrecipe = await NewRecipes.findOne({
      where: {
        id: RecipeId,
      },
    });
    const validatePassword = await bcrypt.compare(
      Password,
      req.session.user.Password
    );
    if (!findrecipe) {
      res.json({
        message: "cant find recipe",
      });
    }
    if (validatePassword) {
      SavedRecipe.destroy({ where: { RecipeId: RecipeId } });
      NewRecipe.destroy(findrecipe);
      res.status(200).send(`${NewRecipe.Name} has been deleted`);
    } else {
      res.send("Password Incorrect.");
    }
  } catch {
    res.status(400).send("Wrong Username or password");
  }
});

module.exports = router;
