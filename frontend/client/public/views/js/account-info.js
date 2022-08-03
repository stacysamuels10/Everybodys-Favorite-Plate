const accountUpdate = document.getElementById("update-account");
const deleteAccount = document.getElementById("delete-account");

const accountEditRedirect = () => {
  window.location.href =
    "http://127.0.0.1:5500/frontend/client/public/views/html/update-account.html";
};
accountUpdate.onclick = () => {
  accountEditRedirect();
};

const accountDelete = () => {
  const deleteMyAccount = confirm(
    "Are you sure you want to delete your account? This action cannot be undone"
  );
  if (deleteMyAccount){
  }
};
const deleteUser = async () => {
        const 
      const Username = document.createElement("input")
      Username.id = "DEL-username";
      const Password = document.createElement("input")
      Password.id = ("DEL-password");
      const deletesubmit
      if (Username.length !== 0 && Password.length !== 0) {
        const data = {
          Username: Username,
          Password: Password,
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
deleteAccount.onclick = () => {
  accountDelete();
};
