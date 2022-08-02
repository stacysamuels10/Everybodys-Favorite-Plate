const express = require("express");
const PORT = process.env.PORT || 3000;
const Carlos = "carlos";
const Stacy = "stacy";
const app = express();
const cors = require("cors");
const session = require("express-session");
const models = require("./backend/database/models");
const UserRoutes = require("./backend/server/routes/User");
const NewRecipe = require("./backend/server/routes/NewRecipe");
const SavedRecipe = require("./backend/server/routes/SavedRecipe");
const SortingRoutes = require("./backend/server/routes/Sorting");

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const store = new SequelizeStore({
  db: models.sequelize,
});

// app.use(express.static(""))
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
store.sync();

app.use(express.json());
app.use(cors());
app.use("/user", UserRoutes);
app.use("/new_recipe", NewRecipe);
app.use("/saved_recipe", SavedRecipe);
app.use("/sorting", SortingRoutes);

const CheckLogin = async (req, res, next) => {
  if (req.sesion.user) {
    next();
  } else {
    res.redirect;
  }
};

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
