const express = require("express");
const session = require("express-session");
const { NewRecipes, Users, SavedRecipe } = require("../../../database/models");
const bcrypt = require("bcrypt"); //i dont think we use this here?
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("home");
  }
};
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

router.get("/create-recipe", (req, res) => {
  res.render("create-recipe");
});

router.get("/update-recipe", (req, res) => {
  res.render("update-recipe");
});

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
  console.log(req.session);
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

router.post("/create_newrecipe", LoginCheck, async (req, res) => {
  console.log("create rec");
  const { Name, Picture, Ingredients, Instructions, FamilyStory } = req.body;
  try {
    const userid = req.session.user.id;
    console.log(userid);
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
      const CreateRecipe = await NewRecipes.create(RecipeInfo); // need to user this variable in the .send
      console.log(CreateRecipe);
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

router.put("/update_newrecipe", LoginCheck, async (req, res) => {
  const { Name, id, Picture, Ingredients, Instructions, FamilyStory } =
    req.body;
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
        FamilyStory: FamilyStory,
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

  console.log(sessioncheck);
  try {
    const findrecipe = await NewRecipes.findOne({
      where: {
        id: id,
      },
    });
    const recipeuserid = findrecipe.UserId;

    if (sessioncheck === recipeuserid) {
      const findsavedrec = await SavedRecipe.findAll({
        where: {
          NewRecipeId: id,
        },
      });

      if (findsavedrec) {
        SavedRecipe.destroy({
          where: {
            NewRecipeId: id,
          },
        });
        findrecipe.destroy();
        res.status(200).send(`Recipe has been deleted`);
      } else {
        console.log(error);
        // res.status(400).send("Cant find recipe or not logged in");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.post("/test_columns", async (req, res) => {
  const { id } = req.body;
  console.log("afterid");
  try {
    console.log("try");
    const getrecipeinfo = await NewRecipes.findOne({
      where: {
        id: id,
      },
    });
    console.log(getrecipeinfo);
    res.staus(200).send(getrecipeinfo);
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
