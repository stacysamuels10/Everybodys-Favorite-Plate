const express = require("express");
const session = require("express-session");
const { NewRecipes, Users, SavedRecipe } = require("../../../database/models"); //is it NewRecipes or NewRecipe????
const bcrypt = require("bcrypt");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

router.post("/get_newrecipe", async (req, res) => {
  const { id } = req.body;
  const newrec = await NewRecipes.findOne({
    where: {
      id: id,
    },
  });
  console.log(newrec);
  if (newrec) {
    console.log(newrec);
    res.status(200).send(newrec);
  } else {
    res.status(400).send("Recipe not found");
  }
});
router.get("/get_all_id_recipe", LoginCheck, async (req, res) => {
  const sessionid = req.session.user.id;
  const findall = await NewRecipes.findAll({
    where: {
      UserId: sessionid,
    },
  });
  if (findall) {
    res.status(200).send(findall);
  } else {
    res.status(400).send("No Recipes Found");
  }
});

router.post("/create_newrecipe", async (req, res) => {
  console.log("create rec");
  const { Name, Picture, Ingredients, Instructions } = req.body;
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
        createdAt: new Date(),
        updatedAt: new Date(),
        TimesSaved: 0,
      };
      const CreateRecipe = await NewRecipes.create(RecipeInfo); //is it NewRecipe or NewRecipes????
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

router.put("/update_newrecipe", async (req, res) => {
  const { Name, id, Picture, Ingredients, Instructions } = req.body;
  const findrecipe = await NewRecipes.findOne({
    where: {
      id: id,
    },
  });
  try {
    if (findrecipe) {
      findrecipe.update({
        Name: Name,
        Picture: Picture,
        Ingredients: Ingredients,
        Instructions: Instructions,
        updateAt: new Date(),
      });
      res.status(200).send("Recipe update");
    } else {
      res.status(400).send("Recipe not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/delete_recipe", async (req, res) => {
  const { id } = req.body;
  const sessioncheck = req.session.user.id;
  console.log("sesson check");
  console.log(sessioncheck);
  try {
    const findrecipe = await NewRecipes.findOne({
      //is it NewRecipes or NewRecipe???
      where: {
        id: id,
      },
    });
    const recipeuserid = findrecipe.UserId;
    console.log(recipeuserid);
    console.log("findrecioe");
    console.log(findrecipe);
    console.log(sessioncheck);
    console.log(id);
    if (sessioncheck === recipeuserid) {
      const findsavedrec = await SavedRecipe.findOne({
        where: {
          UserId: sessioncheck,
          NewRecipeId: id,
        },
      });
      if (findsavedrec) {
        SavedRecipe.destroy(findsavedrec);
      }
      findrecipe.destroy();
      res.status(200).send(`Recipe has been deleted`);
    } else {
      res.status(400).send("Cant find recipe or not logged in");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Wrong Username or password");
  }
});

module.exports = router;
