const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Users } = require("../../../database/models");
const router = express.Router();

const LoginCheck = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

// router.post("/login", async (req, res) => {
//   const user = await Users.findOne({
//     where: {
//       Username: req.body.Username,
//       Password: req.body.Password,
//     },
//   });
//   if (user) {
//     req.session.user = user;
//     console.log(user);
//     // res.redirect("/new_recipe/test");
//     res.json({
//       message: "Login Success",
//       user: user,
//     });
//   } else {
//     res.json({
//       message: "Login Failed",
//     });
//   }
// });
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
    const validatePassword = await bcrypt.compare(Password, finduser.password);
    if (validatePassword) {
      req.session.user = finduser;
      // res.redirect
    } else {
      res.status(400).send("Username or Password Incorrect");
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/create_user", async (req, res) => {
  const { Email, Username, Password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(Password, salt);
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
      console.log(CreateUser);
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
      FindUsername.password
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
      res.status(200).send(`${Username}'s account has been deleted`);
    } else {
      res.send("Password Incorrect.");
    }
  } catch (error) {
    res.status(400).send("Wrong Username or Password.");
  }
});

module.exports = router;
