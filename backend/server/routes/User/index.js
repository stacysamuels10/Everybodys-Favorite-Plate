const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { NewRecipes, Users } = require("../../../database/models");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  console.log(req.session);
  if (req.session.user) {
    next();
  } else {
    res.render("home");
  }
};
router.get("/home", async (req, res) => {
  try {
    const top5 = await NewRecipes.findAll({
      order: [["TimesSaved", "DESC"]],
      limit: 5,
    });
    res.render("home", {
      locals: { title: top5 },
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/account-info", (req, res) => {
  try {
    const { id, Email, Username, Password } = req.session.user;
    const user = {
      id: id,
      Email: Email,
      Username: Username,
      Password: Password,
    };
    res.render("account-info", {
      locals: { title: user },
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/update-account", (req, res) => {
  res.render("update-account");
});

router.get("/userinfo", LoginCheck, async (req, res) => {
  const { id, Email, Username, Password } = req.session.user;
  const userinfo = {
    id: id,
    Email: Email,
    Username: Username,
    Password: Password,
  };
  res.send(userinfo);
});
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
      res.status(200).send(CreateUser);
    } else {
      res.status(400).send("Username or Email already exist.");
    }
  } catch (error) {
    console.log("no work");
    res.status(400).send(error);
  }
});
router.put("/update_user", LoginCheck, async (req, res) => {
  console.log(req.session);
  const { Username, NewUsername, OldPassword, NewPassword, NewEmail } =
    req.body;
  try {
    const FindUsername = await Users.findOne({
      where: {
        Username: Username,
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
      req.session.destroy();
      req.session.user = FindUsername;
      res.status(200).send("Password updated");
    } else {
      res.send("Old Password incorrect");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
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
router.post("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.status(200).send("logged out");
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
