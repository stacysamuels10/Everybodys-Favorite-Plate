"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "NewRecipes",
      [
        {
          Name: "Recipe1",
          UserId: 7,
          Picture:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          Ingredients:
            "Ingridient1, Ingredient 1.2, Ingredient 1.3, Ingredient 1.4",
          Instructions: "step one, step two, step 3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Name: "Recipe2",
          UserId: 8,
          Picture:
            "Sehttps://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
          Ingredients:
            "Ingridient2, Ingredient 2.2, Ingredient 2.3, Ingredient 2.4",
          Instructions: "step one, step two, step 3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("NewRecipes", null, {});
  },
};
