const express = require("express");
const { NewRecipe, Users, SavedRecipe } = require("../../../database/models"); //is it NewRecipes or NewRecipe????
const bcrypt = require("bcrypt");
//const { reset } = require("nodemon"); *** What is this????????
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    //need a status error here 400
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
    //this does not return anything to front end...
    //once things are tested, remove console logs
    //need a status and to send an object to front end, i.e. the recipe
    console.log(newrec);
  } else {
    //there needs to be an error status 400 and message here
  }
  //this is written incorrectly
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
  //there is nothing sent here... there needs to be a try catch
  //status 200 and 400 are needed and things need to be sent
  //once things are tested, remove console logs
  console.log(findall);
});
//what is this route?
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
      //this should be a res.status error instead of json please
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
      const CreateRecipe = await NewRecipes.create(RecipeInfo); //is it NewRecipe or NewRecipes????
      res.status(200).send(CreateRecipe);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//if they are logged in and on their dashboard, i dont think they need to enter their password to edit
//a recipe so you can take the validate password out
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
        }); //send a status 200 also please
      } else {
        //need a status 400 error
        res.send("password incorrect");
      }
    } else {
      //need a status 400 error
      res.send("Recipe not found");
    }
  } catch (error) {
    //need a status 400
    res.send(error);
  }
});
// cheack and delete from saved table then delete newrecipe table
router.delete("/delete_recipe", LoginCheck, async (req, res) => {
  const { Password, RecipeId } = req.body;
  try {
    const findrecipe = await NewRecipes.findOne({
      //is it NewRecipes or NewRecipe???
      where: {
        id: RecipeId,
      },
    });
    const validatePassword = await bcrypt.compare(
      Password,
      req.session.user.Password
    );
    if (!findrecipe) {
      //res status 400 needed, can change to res.send
      res.json({
        message: "cant find recipe",
      });
    }
    if (validatePassword) {
      SavedRecipe.destroy({ where: { RecipeId: RecipeId } });
      NewRecipe.destroy(findrecipe);
      res.status(200).send(`${NewRecipe.Name} has been deleted`);
    } else {
      //status 400 needed
      res.send("Password Incorrect.");
    }
  } catch {
    res.status(400).send("Wrong Username or password");
  }
});

module.exports = router;
