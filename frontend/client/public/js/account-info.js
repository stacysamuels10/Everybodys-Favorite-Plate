const accountUpdate = document.getElementById("update-account");
const deleteAccount = document.getElementById("delete-account");
const deleteAccountDiv = document.getElementById("delete-account-div");

const accountEditRedirect = () => {
  window.location.href = "http://localhost:3000/user/update-account";
};
accountUpdate.onclick = () => {
  accountEditRedirect();
};

const accountDelete = () => {
  const deleteMyAccount = confirm(
    "Are you sure you want to delete your account? This action cannot be undone"
  );
  if (deleteMyAccount) {
    //will invoke deleteUser() function when back end session confirmed
    alert("Your account is deleted");
  }
};
const deleteUser = () => {
  const EnterInfo = document.createElement("h2");
  EnterInfo.id = "enter-info";
  EnterInfo.innerText =
    "Please re-enter your username and password to confirm ";
  const Username = document.createElement("input");
  Username.id = "DEL-username";
  const Password = document.createElement("input");
  Password.id = "DEL-password";
  const deleteSubmit = document.createElement("button");
  deleteSubmit.innerHTML = "Delete Account";
  deleteSubmit.onclick = async () => {
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
      const json = await dataWeAreSending.json();
    } else {
      console.log("enter");
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

deleteAccount.onclick = () => {
  accountDelete();
};
