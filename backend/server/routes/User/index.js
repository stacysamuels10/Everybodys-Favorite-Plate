const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { NewRecipes, Users } = require("../../../database/models");
const router = express.Router();
//making sure user is logged in
const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("home");
  }
};
//render home page
router.get("/home", LoginCheck, async (req, res) => {
  try {
    const top5 = await NewRecipes.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.render("home", {
      locals: { title: top5 },
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
//render account info page
router.get("/account-info", LoginCheck, async (req, res) => {
  try {
    let array = [];
    const user = {
      id: req.session.user.id,
      Email: req.session.user.Email,
      Username: req.session.user.Username,
      Password: req.session.user.Password,
    };
    const findall = await NewRecipes.findAll({
      where: {
        UserId: req.session.user.id,
      },
    });
    if (findall) {
      for (let i = 0; i < findall.length; i++) {
        const findRecipe = await NewRecipes.findOne({
          where: {
            id: findall[i].dataValues.id,
          },
        });
        array.push(findRecipe);
      }
      res.status(200).render("account-info", {
        locals: {
          title: user,
          recipe: array,
        },
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//render update account page
router.get("/update-account", (req, res) => {
  res.render("update-account");
});
//route to check user's login credentials match a current user
router.post("/login", async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const finduser = await Users.findOne({
      where: {
        Username: Username,
      },
    });
    const validatePassword = await bcrypt.compare(
      Password,
      finduser.dataValues.Password
    );
    if (validatePassword) {
      req.session.user = finduser;
      res.status(200).send("logged in and sessionfound");
    } else {
      res.status(400).send("Username or Password Incorrect");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//route to create new user if email and username do not exist
router.post("/create_user", async (req, res) => {
  const { Email, Username, Password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(Password, salt);
  try {
    const FindUsername = await Users.findOne({
      where: {
        Username: Username,
      },
    });
    const FindEmail = await Users.findOne({
      where: {
        Email: Email,
      },
    });
    if (!FindUsername && !FindEmail) {
      const UserInfo = {
        Email: Email,
        Username: Username,
        Password: hashPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const CreateUser = await Users.create(UserInfo);
      req.session.user = CreateUser;
      res.status(200).send(CreateUser);
    } else {
      res.status(500).send("Username or Email already exist.");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//renders preserved infomation into update account
router.get("/update_user_render/:id", LoginCheck, async (req, res) => {
  try {
    const findAccount = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (findAccount) {
      res.status(200).render("update-account", {
        locals: {
          updateAccount: findAccount,
        },
      });
    }
  } catch (error) {
    res.status(400).send("Account cannot be found");
  }
});
//updates user's information after form submission
router.put("/update_user/:id", LoginCheck, async (req, res) => {
  const { NewUsername, OldPassword, NewPassword, NewEmail } = req.body;
  try {
    const FindUsername = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    const validatePassword = await bcrypt.compare(
      OldPassword,
      FindUsername.Password
    );

    if (validatePassword) {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(NewPassword, salt);
      FindUsername.update({
        Username: NewUsername,
        Password: hashpassword,
        Email: NewEmail,
        updatedAt: new Date(),
      });
      req.session.user = FindUsername;
      res.status(200).send("Password updated");
    } else {
      res.status(500).send("Old Password incorrect");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//route for user to delete account
router.delete("/delete_user", LoginCheck, async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const FindUsername = await Users.findOne({
      where: {
        Username: Username,
      },
    });
    const validatePassword = await bcrypt.compare(
      Password,
      req.session.user.Password
    );
    if (validatePassword) {
      FindUsername.destroy();
      req.session.destroy();
      res.status(200).send(`${Username}'s account has been deleted`);
    } else {
      res.send("Password Incorrect.");
    }
  } catch (error) {
    res.status(400).send("Wrong Username or Password.");
  }
});
//route for user to end session and re-route to login page
router.post("/logout", LoginCheck, (req, res) => {
  try {
    req.session.destroy();
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
