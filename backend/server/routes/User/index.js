const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Users } = require("../../../database/models");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  //once things are tested, remove console logs
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

//This is for the account dashboard
router.get("/userinfo", LoginCheck, async (req, res) => {
  const { id, Email, Username, Password } = req.session.user;
  const userinfo = {
    id: id,
    Email: Email,
    Username: Username,
    //for the account dashboard, we do not need to send them their password, for security
    Password: Password,
  };
  res.send(userinfo);
});
//
//
//This is for homepage login
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

      res.status(200).send(finduser);
    } else {
      res.status(400).send("Username or Password Incorrect");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//
//
//This is for creating a new user
router.post("/create_user", async (req, res) => {
  const { Email, Username, Password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(Password, salt);
  //once things are tested, remove console logs
  console.log(`hashedpassword ${hashPassword}`);
  console.log("line 11");
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
      //once things are tested, remove console logs
      console.log(CreateUser);
      res.status(200).send(CreateUser);
    } else {
      res.status(400).send("Username or Email already exist.");
    }
  } catch (error) {
    //once things are tested, remove console logs
    console.log("no work");
    res.status(400).send(error);
  }
});
//
//
//This is for account dashboard to update an existing user
router.put("/update_user", LoginCheck, async (req, res) => {
  //once things are tested, remove console logs
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
      //this needs a status 400
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
    //once things are tested, remove console logs
    console.log(req.session.user);
    console.log(req.session.user.Password);
    const validatePassword = await bcrypt.compare(
      Password,
      req.session.user.Password
    );
    if (validatePassword) {
      FindUsername.destroy();
      req.session.destroy();
      res.status(200).send(`${Username}'s account has been deleted`);
    } else {
      //needs a status 400 error
      res.send("Password Incorrect.");
    }
  } catch (error) {
    res.status(400).send("Wrong Username or Password.");
  }
});
router.post("/logout", (req, res) => {
  req.session.destroy();
});
module.exports = router;
