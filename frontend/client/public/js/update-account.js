const submitButton = document.getElementById("update-account");
//lets user know if their email is valid
const validateEmail = () => {
  const validationField1 = document.getElementById("validation-email-txt");
  const emailError = [];
  const validEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const Email = document.getElementById("email").value;
  if (!validEmail.test(Email)) {
    emailError.push("Please enter a valid email address.");
  }
  if (emailError.length > 0) {
    validationField1.innerHTML = emailError.join(" ");
  }
  validationField1.innerHTML = emailError.join(" ");
};
//lets user know if their password is valid
const validatePassword = () => {
  const validationField2 = document.getElementById("validation-txt");
  const Password = document.getElementById("NewPassword").value;
  const errors = [];
  const specialChars = /[~`!@#$%&*+=';/{}|:<>?()_]/;
  const capitalLetter = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
  const lowercaseLetter = /[abcdefghijklmnopqrstuvwxyz]/;
  const number = /[123456780]/;
  if (Password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!specialChars.test(Password)) {
    errors.push(
      "Please use at least one special character /[~`!@#$%&*+=';/{}|:<>?()_]"
    );
  }
  if (!capitalLetter.test(Password)) {
    errors.push("Please use at least 1 capital letter");
  }
  if (!lowercaseLetter.test(Password)) {
    errors.push("Please use at least 1 lowercase letter");
  }
  if (!number.test(Password)) {
    errors.push("Please user at least 1 number");
  }
  if (errors.length > 0) {
    validationField2.innerHTML = errors.join(" ");
    return false;
  }
  validationField2.innerHTML = errors.join(" ");
  return true;
};
//checks validity and updates account
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
//preserves id from template engine in html
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
