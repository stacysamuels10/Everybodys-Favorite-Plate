const createRecipeSubmit = document.getElementById("create-recipe-submit");
//function to create a new recipe
const sendData = async () => {
  const Name = document.getElementById("recipe-name").value;
  const Picture = document.getElementById("recipe-image").value;
  const Ingredients = document.getElementById("ingredients").value;
  const Instructions = document.getElementById("instructions").value;
  const FamilyStory = document.getElementById("family-story").value;
  if (
    Name.length !== 0 &&
    Ingredients.length !== 0 &&
    Instructions.length !== 0 &&
    FamilyStory.length !== 0
  ) {
    const data = {
      Name: Name,
      Picture: Picture,
      Ingredients: Ingredients,
      Instructions: Instructions,
      FamilyStory: FamilyStory,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const dataWeAreSending = await fetch(
      "http://localhost:3000/new_recipe/create_newrecipe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const status = dataWeAreSending.status;
    if (status === 200) {
      alert("Thank you for adding your recipe!");
      window.location.href = "http://localhost:3000/user/account-info";
    } else {
      alert("Your recipe could not be added at this time. Please try again.");
    }
  } else {
    alert("Please make sure all fields are completed");
  }
};
createRecipeSubmit.onclick = () => {
  sendData();
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
