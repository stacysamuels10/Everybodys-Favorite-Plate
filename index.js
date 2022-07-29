const express = require("express");
const PORT = process.env.PORT || 3000;
const Carlos = "carlos";
const Stacy = "stacy";
const app = express();
const cors = require("cors");
const UserRoutes = require("./backend/server/routes/User");

// app.use(express.static(""))
app.use(express.json());
app.use(cors());
app.use("/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
