"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SavedRecipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SavedRecipe.belongsTo(models.Users, {
        foreignKey: "id",
        as: "users",
      });
      SavedRecipe.belongsTo(models.NewRecipes, {
        foreignKey: "id",
        as: "newrecipes",
      });
    }
  }
  SavedRecipe.init(
    {
      UserId: DataTypes.INTEGER,
      NewRecipeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SavedRecipe",
    }
  );
  return SavedRecipe;
};
