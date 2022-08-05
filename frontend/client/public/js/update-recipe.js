const submitButton = document.getElementById("update-recipe");
//function to update recipe
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
    updatedAt: new Date(),
  };
  const dataWeAreSending = await fetch(
    `http://localhost:3000/new_recipe/update_newrecipe/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const status = dataWeAreSending.status;
  if (status === 200) {
    alert("Your recipe has been updated");
    window.location.href = "http://localhost:3000/user/account-info";
  }
  if (status === 400) {
    alert("Recipe cannot be updated at this time. Please try again later");
  }
};
//preserve recipe id from template engine render
const bringOverId = async (id) => {
  updateRecipe(id);
};

const logout = async () => {
  const dataWeAreSending = await fetch(`http://localhost:3000/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const status = dataWeAreSending.status;
  if (status === 200) {
    alert("You have been logged out");
    window.location.href = "http://localhost:3000";
  }
  if (status === 400) {
    alert("Cannot log out at this time");
  }
};
