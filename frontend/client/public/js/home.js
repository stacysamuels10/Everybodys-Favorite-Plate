//function to save a recipe onto their dashboard
const runPostRoute = async (id) => {
  const dataWeAreSending = await fetch(
    `http://localhost:3000/saved_recipe/add_savedrecipe/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const status = dataWeAreSending.status;
  if (status === 200) {
    alert("Your recipe has been saved");
  }
  if (status === 500) {
    alert("You have already saved this recipe");
  }
  if (status === 400) {
    alert("Recipe not able to be added. Please try again later");
  }
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
