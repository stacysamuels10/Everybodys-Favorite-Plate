"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NewRecipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NewRecipes.belongsTo(models.Users, {
        foreignKey: "id",
        as: "users",
      });
    }
  }
  NewRecipes.init(
    {
      Name: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      Picture: DataTypes.STRING,
      Ingredients: DataTypes.STRING,
      Instructions: DataTypes.STRING,
      TimesSaved: DataTypes.INTEGER,
      FamilyStory: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "NewRecipes",
    }
  );
  return NewRecipes;
};
