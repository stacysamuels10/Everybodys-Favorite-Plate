const deleteAccount = document.getElementById("delete-account");
const deleteAccountDiv = document.getElementById("delete-account-div");

const accountEditRedirect = (id) => {
  window.location.href = `http://localhost:3000/user/update_user_render/${id}`;
};

const editRecipeRedirect = (id) => {
  window.location.href = `http://localhost:3000/new_recipe/update-recipe/${id}`;
};

deleteAccount.onclick = () => {
  deleteUser();
};

const deleteUser = () => {
  const EnterInfo = document.createElement("h2");
  EnterInfo.id = "enter-info";
  EnterInfo.innerText =
    "Please re-enter your username and password to confirm ";
  const Username = document.createElement("input");
  Username.id = "DEL-username";
  Username.placeholder = "Username";
  const Password = document.createElement("input");
  Password.setAttribute("type", "password");
  Password.id = "DEL-password";
  Password.placeholder = "Password";
  const deleteSubmit = document.createElement("button");
  deleteSubmit.innerHTML = "Delete Account";
  deleteAccountDiv.append(EnterInfo, Username, Password, deleteSubmit);
  deleteSubmit.onclick = async () => {
    const deleteMyAccount = confirm(
      "Are you sure you want to delete your account? This action cannot be undone"
    );
    if (deleteMyAccount) {
      if (Username.value.length !== 0 && Password.value.length !== 0) {
        const data = {
          Username: Username.value,
          Password: Password.value,
        };
        const dataWeAreSending = await fetch(
          "http://localhost:3000/user/delete_user",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const status = dataWeAreSending.status;
        if (status === 200) {
          alert("Your account has been deleted");
          window.location.href = "http://localhost:3000";
        }
      } else {
        alert("Information does not match, please try again.");
        window.location.href = "http://localhost:3000/user/account-info";
      }
    }
  };
};

const deleteRecipe = async (id) => {
  const dataWeAreSending = await fetch(
    `http://localhost:3000/new_recipe/delete_recipe/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const status = dataWeAreSending.status;
  if (status === 200) {
    window.location.href = "http://localhost:3000/user/account-info";
    alert("Your recipe has been removed");
  }
  if (status === 400) {
    alert("Recipe cannot be deleted at this time. Please try again later");
  }
};

const logout = async () => {
  console.log("function reading");
  const dataWeAreSending = await fetch(`http://localhost:3000/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const status = dataWeAreSending.status;
  console.log(status);
  if (status === 200) {
    alert("You have been logged out");
    window.location.href = "http://localhost:3000";
  }
  if (status === 400) {
    alert("Cannot log out at this time");
  }
};
