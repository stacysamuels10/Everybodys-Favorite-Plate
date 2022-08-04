const editAccount = document.getElementById("edit-profile");

const accountEditRedirect = () => {
  window.location.href = "http://localhost:3000/user/update-account";
};

editAccount.onclick = () => {
  accountEditRedirect();
};
