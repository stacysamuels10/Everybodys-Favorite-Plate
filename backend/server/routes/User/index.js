const express = require("express");
const { Users } = require("../../../database/models");
const router = express.Router();

router.post("/get_user", async (req, res) => {
  const user = await Users.findOne({
    where: {
      Username: req.body.Username,
      Password: req.body.Password,
    },
  });
  if (user) {
    console.log(user);
    res.json({
      message: "Login Success",
      user: user,
    });
  } else {
    res.json({
      message: "Login Failed",
    });
  }
});

router.post("/create_user", async (req, res) => {
  const { Email, Username, Password } = req.body;
  console.log("line 11");
  try {
    const UserInfo = {
      Email: Email,
      Username: Username,
      Password: Password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("woork");

    const CreateUser = await Users.create(UserInfo);
    console.log(CreateUser);
    res.status(200).send(CreateUser);
  } catch (error) {
    console.log("no work");
    res.status(400).send(error);
  }
});
router.post("/update_password", async (req, res) => {
  const { Username, OldPassword, NewPassword } = req.body;
  try {
    const FindUsername = await Users.findOne({
      where: {
        Username: Username,
      },
    });
    if (OldPassword === FindUsername.Password) {
      FindUsername.update({
        Username: Username,
        Password: NewPassword,
        updatedAt: new Date(),
      });
      res.status(200).send("Password updated");
    } else {
      res.send("Old Password incorrect");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/delete_user", async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const FindUsername = await Users.findOne({
      where: {
        Username: Username,
      },
    });
    if (Password === FindUsername.Password) {
      FindUsername.destroy();
      res.status(200).send(`${Username}'s account has been deleted`);
    } else {
      res.send("Password Incorrect.");
    }
  } catch (error) {
    res.status(400).send("Wrong Username or Password.");
  }
});

module.exports = router;
