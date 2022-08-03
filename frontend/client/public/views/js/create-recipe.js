const createRecipeSubmit = document.getElementById("create-recipe-submit");

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
    const json = await dataWeAreSending.json();
    const status = dataWeAreSending.status;
    if (status === 200) {
      alert("Thank you for adding your recipe!");
    } else {
      alert("Your recipe could not be added at this time. Please try again.");
    }
  } else {
    alert("Please make sure all fields are completed");
    //need to make alerts to add something to missing spots
  }
};
createRecipeSubmit.onclick = () => {
  sendData();
};
