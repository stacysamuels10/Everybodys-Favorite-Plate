const submitButton = document.getElementById("update-account");

const updateAccount = async (id) => {
  const NewEmail = document.getElementById("email").value;
  const NewUsername = document.getElementById("username").value;
  const OldPassword = document.getElementById("OldPassword").value;
  const NewPassword = document.getElementById("NewPassword").value;
  if (
    NewEmail.length !== 0 &&
    NewUsername.length !== 0 &&
    OldPassword.length !== 0 &&
    NewPassword.length !== 0
  ) {
    const validEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validEmail.test(NewEmail)) {
      const specialChars = /[~`!@#$%&*+=';/{}|:<>?()_]/;
      const capitalLetter = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
      const lowercaseLetter = /[abcdefghijklmnopqrstuvwxyz]/;
      const number = /[123456780]/;
      if (
        NewPassword.length > 8 &&
        specialChars.test(NewPassword) &&
        capitalLetter.test(NewPassword) &&
        lowercaseLetter.test(NewPassword) &&
        number.test(NewPassword)
      ) {
        const data = {
          Email: NewEmail,
          Username: NewUsername,
          OldPassword: OldPassword,
          NewPassword: NewPassword,
        };
        const dataWeAreSending = await fetch(
          `http://localhost:3000/user/update_user/${id}`,
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
          alert("Your account has been updated");
          window.location.href = "http://localhost:3000/user/account-info";
        }
        if (status === 500) {
          alert("Current Password incorrect, please try again.");
        }
        if (status === 400) {
          alert(
            "Account cannot be updated at this time. Please try again later"
          );
        }
      } else {
        alert("Please use a valid email and password");
      }
    } else {
      alert("Please use a valid email and password");
    }
  } else {
    alert("Please enter information in all fields");
  }
};

const bringOverId = async (id) => {
  updateAccount(id);
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
