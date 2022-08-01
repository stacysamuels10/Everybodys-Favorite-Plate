const createRecipeSubmit = document.getElementById("create-recipe-submit");

const sendData = async () => {
  const Name = document.getElementById("recipe-name").value;
  const Picture = document.getElementById("recipe-image").value;
  //const UserID = some sort of sessions id???? think this is on backend when button pressed
  const Ingredients = document.getElementById("ingredients").value;
  const Instructions = document.getElementById("instructions").value;
  if (
    Name.length !== 0 &&
    Ingredients.length !== 0 &&
    Instructions.length !== 0
  ) {
    const data = {
      Name: Name,
      Picture: Picture,
      Ingredients: Ingredients,
      Instructions: Instructions,
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
  } else {
    console.log("enter things");
    //need to make alerts to add something to missing spots
  }
};
createRecipeSubmit.onclick = () => {
  sendData();
};
