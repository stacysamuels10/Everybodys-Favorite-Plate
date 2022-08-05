const editAccount = document.getElementById("edit-profile");

editAccount.onclick = () => {
  accountEditRedirect();
};

const unsaveRecipe = async (id) => {
  const dataWeAreSending = await fetch(
    `http://localhost:3000/saved_recipe/delete_savedrecipe/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const status = dataWeAreSending.status;
  if (status === 200) {
    window.location.href = "http://localhost:3000/saved_recipe/dashboard";
    alert("Your recipe has been removed");
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
