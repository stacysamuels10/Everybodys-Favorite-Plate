const express = require("express");
const { SavedRecipe,Users,NewRecipes } = require("../../../database/models");
const router = express.Router();

router.get("/get_savedrecipe", (req, res) => {
  res.send("got saved recipe");
});

router.post("/create_savedrecipe", async (req, res) => {
  const{ UserId, RecipeId} = req.body
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
          NewRecipeId: RecipeId
        }
      }
    });
    //Add session to this if
    if (!FindRecipe) {
      const SavedRecipeInfo = {
        UserId: UserId,
        RecipeId: RecipeId
      }
      const AddSavedRecipe = await SavedRecipe.create(SavedRecipeInfo)
      res.status(200).send(AddSavedRecipe)
    } else {
      res.send("Recipe already saved")
    }
    

  } catch (error) {
    res.status(400).send(error)
  }
})
router.delete("/delete_savedrecipe", (req,res) => {
  //read Session to make sure the person is signed in
  //use session to get userid and recipeid will be selected
  // const stillsignedin
  const {UserId,Password,RecipeId} = req.body
  try{
    const findUser = await Users.findOne({
      where:{
        Id:UserId
      }
    });
    if (Password === findUser.Password) {
      const FindSavedRecipe = await SavedRecipe.findOne({
        where:{
          UserId:UserId,
          RecipeId:RecipeId
        }
      })
      if (!FindSavedRecipe) {
        res.send("Recipe not found")
      }
    }else {
      FindSavedRecipe.destroy();


    }
  } catch (error) {
    res.send(error)
  }
})
module.exports = router;
