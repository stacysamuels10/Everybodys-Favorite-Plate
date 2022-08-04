const submitButton = document.getElementById("update-recipe");

const updateRecipe = async (id) => {
  const Name = document.getElementById("recipe-name").value;
  const Picture = document.getElementById("recipe-image").value;
  const Ingredients = document.getElementById("ingredients").value;
  const Instructions = document.getElementById("instructions").value;
  const FamilyStory = document.getElementById("family-story").value;
  const data = {
    Name: Name,
    Picture: Picture,
    Ingredients: Ingredients,
    Instructions: Instructions,
    FamilyStory: FamilyStory,
  };
  console.log(data);
  const dataWeAreSending = await fetch(
    `http://localhost:3000/new_recipe/update_newrecipe/${id}`,
    {
      method: "PUT",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const json = await dataWeAreSending.json();
  console.log(json);
  const status = dataWeAreSending.status;
  if (status === 200) {
    //window.location.href = "http://localhost:3000/user/account-info";
    alert("Your recipe has been updated");
  }
  if (status === 400) {
    alert("Recipe cannot be updated at this time. Please try again later");
  }
};

// submitButton.onclick = () => {
//   setTimeout(() => {
//     console.log(submitButton.class);
//   }, "1000");
//   //updateRecipe();
// };

const bringOverId = async (id) => {
  updateRecipe(id);
  console.log("ran function");
};
