const signUpSubmit = document.getElementById("sign-up-submit");
const signInSubmit = document.getElementById("sign-in-submit");
const changePasswordSubmit = document.getElementById("UP-submit");
const deleteSubmit = document.getElementById("DEL-submit");

const sendData = async () => {
  const Email = document.getElementById("SU-email").value;
  const Username = document.getElementById("SU-username").value;
  const Password = document.getElementById("SU-password").value;
  if (Email.length !== 0 && Username.length !== 0 && Password.length !== 0) {
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
    const json = await dataWeAreSending.json();
    console.log(json);
  } else {
    console.log("enter things");
  }
};

const findUser = async () => {
  const Username = document.getElementById("SI-username").value;
  const Password = document.getElementById("SI-password").value;
  if (Username.length !== 0 && Password.length !== 0) {
    const data = {
      Username: Username,
      Password: Password,
    };
    const dataWeAreSending = await fetch(
      "http://localhost:3000/user/get_user",
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
    console.log("enter");
  }
};

const updatePassword = async () => {
  const Username = document.getElementById("UP-username").value;
  const OldPassword = document.getElementById("UP-password").value;
  const NewPassword = document.getElementById("UP-new-password").value;
  if (
    Username.length !== 0 &&
    OldPassword.length !== 0 &&
    NewPassword.length !== 0
  ) {
    const data = {
      Username: Username,
      OldPassword: OldPassword,
      NewPassword: NewPassword,
    };
    const dataWeAreSending = await fetch(
      "http://localhost:3000/user/update_password",
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
    console.log("passwords didnt change");
  }
};

const deleteUser = async () => {
  const Username = document.getElementById("DEL-username").value;
  const Password = document.getElementById("DEL-password").value;
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

signUpSubmit.onclick = () => {
  console.log("hello");
  sendData();
};

signInSubmit.onclick = () => {
  console.log("i work now");
  findUser();
};

changePasswordSubmit.onclick = () => {
  console.log("hello I am working");
  updatePassword();
};

deleteSubmit.onclick = () => {
  console.log("delete is working");
  deleteUser();
};
