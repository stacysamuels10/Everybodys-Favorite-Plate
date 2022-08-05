const signUpSubmit = document.getElementById("sign-up-submit");
const signInSubmit = document.getElementById("sign-in-submit");
const guestSignIn = document.getElementById("guest");
//lets the user know their email is not valid
const validateEmail = () => {
  const validationField1 = document.getElementById("validation-email-txt");
  const emailError = [];
  const validEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const Email = document.getElementById("SU-email").value;
  if (!validEmail.test(Email)) {
    emailError.push("Please enter a valid email address.");
  }
  if (emailError.length > 0) {
    validationField1.innerHTML = emailError.join(" ");
  }
  validationField1.innerHTML = emailError.join(" ");
};
//lets the user know the requirements that their password is not valid
const validatePassword = () => {
  const validationField2 = document.getElementById("validation-txt");
  const Password = document.getElementById("SU-password").value;
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
//lets the user know their passwords do not match
const passwordMatch = () => {
  const match = [];
  const validationField3 = document.getElementById("validation-pwd-txt");
  const Password = document.getElementById("SU-password").value;
  const PasswordRe = document.getElementById("SU-password2").value;
  if (Password !== PasswordRe) {
    match.push("Please make sure you passwords match");
  }
  validationField3.innerHTML = match.join("");
};
//function to create user
const signUp = async () => {
  const Email = document.getElementById("SU-email").value;
  const Username = document.getElementById("SU-username").value;
  const Password = document.getElementById("SU-password").value;
  const PasswordRe = document.getElementById("SU-password2").value;
  if (
    Email.length !== 0 &&
    Username.length !== 0 &&
    Password.length !== 0 &&
    PasswordRe.length !== 0
  ) {
    const validEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validEmail.test(Email)) {
      const specialChars = /[~`!@#$%&*+=';/{}|:<>?()_]/;
      const capitalLetter = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
      const lowercaseLetter = /[abcdefghijklmnopqrstuvwxyz]/;
      const number = /[123456780]/;
      if (
        Password.length > 8 &&
        specialChars.test(Password) &&
        capitalLetter.test(Password) &&
        lowercaseLetter.test(Password) &&
        number.test(Password)
      ) {
        const data = {
          Email: Email,
          Username: Username,
          Password: Password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const dataWeAreSending = await fetch(
          "http://localhost:3000/user/create_user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const status = dataWeAreSending.status;
        if (status === 200) {
          window.location.href = "http://localhost:3000/user/home";
        }
        if (status === 500) {
          alert("Username or Password already exists");
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
//function to sign in
const signIn = async () => {
  const Username = document.getElementById("SI-username").value;
  const Password = document.getElementById("SI-password").value;
  if (Username.length !== 0 && Password.length !== 0) {
    const data = {
      Username: Username,
      Password: Password,
    };
    const dataWeAreSending = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const status = dataWeAreSending.status;
    if (status === 200) {
      window.location.href = "http://localhost:3000/user/home";
    }
    if (status === 400) {
      alert("Username or password is incorrect, please try again");
    }
  }
};
//function to sign in as guest
const signInGuest = async () => {
  const Username = "Guest";
  const Password = "Password1!";

  const data = {
    Username: Username,
    Password: Password,
  };
  const dataWeAreSending = await fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const status = dataWeAreSending.status;
  if (status === 200) {
    window.location.href = "http://localhost:3000/user/home";
  }
  if (status === 400) {
    alert("Username or password is incorrect, please try again");
  }
};

signUpSubmit.onclick = () => {
  signUp();
};

signInSubmit.onclick = () => {
  signIn();
};

guestSignIn.onclick = () => {
  signInGuest();
};
