const express = require("express");
const { Users } = require("../../../database/models");
const router = express.Router();

router.get("/get_user", (req, res) => {
  res.send("Got User");
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

module.exports = router;
