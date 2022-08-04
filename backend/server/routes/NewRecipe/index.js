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
  console.log(req.params.id);
  try {
    const findRecipe = await NewRecipes.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(findRecipe);
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

router.get("");

router.get("/update-recipe/:id", async (req, res) => {
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

router.get("/get_all_id_recipe", LoginCheck, async (req, res) => {
  const findall = await NewRecipes.findAll({
    where: {
      UserId: req.session.user.id,
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

router.put("/update_newrecipe/:id", async (req, res) => {
  console.log("req", req.params.id);
  const { Name, Picture, Ingredients, Instructions, FamilyStory } = req.body;
  console.log("body ", req.body);
  const findrecipe = await NewRecipes.findOne({
    where: {
      id: req.params.id,
    },
  });
  try {
    const recipeuserid = findrecipe.UserId;
    //if (req.session.user.id === recipeuserid) {
    if (findrecipe) {
      findrecipe.update({
        Name: Name,
        Picture: Picture,
        Ingredients: Ingredients,
        Instructions: Instructions,
        updateAt: new Date(),
        FamilyStory: FamilyStory,
      });
      console.log(findrecipe.Name);
      res.status(200).send("this is working");
    }
    //}
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/delete_recipe/:id", async (req, res) => {
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
