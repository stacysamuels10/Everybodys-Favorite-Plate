const express = require("express");
const PORT = process.env.PORT || 3000;
const Carlos = "carlos";
const Stacy = "stacy";
const app = express();
const cors = require("cors");
const UserRoutes = require("./backend/server/routes/User");
const NewRecipe = require("./backend/server/routes/NewRecipe");
const SavedRecipe = require("./backend/server/routes/SavedRecipe");

// app.use(express.static(""))
app.use(express.json());
app.use(cors());
app.use("/user", UserRoutes);
app.use("/new_recipe", NewRecipe);
app.use("/saved_recipe", SavedRecipe);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
