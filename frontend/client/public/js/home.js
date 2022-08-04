// saveRecipeButton.onclick = async () => {
//   console.log(saveRecipeButton.id);
//   const dataWeAreSending = await fetch(
//     `http://localhost:3000/saved_recipe/add_savedrecipe/${saveRecipeButton.id}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

const runPostRoute = async (id) => {
  console.log(id);
  const dataWeAreSending = await fetch(
    `http://localhost:3000/saved_recipe/add_savedrecipe/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
