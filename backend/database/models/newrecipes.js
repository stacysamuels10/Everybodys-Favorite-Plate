'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewRecipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewRecipes.init({
    Name: DataTypes.STRING,
    Picture: DataTypes.STRING,
    Ingredients: DataTypes.STRING,
    Instructions: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NewRecipes',
  });
  return NewRecipes;
};