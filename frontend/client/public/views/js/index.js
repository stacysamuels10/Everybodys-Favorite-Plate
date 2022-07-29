const signUpSubmit = document.getElementById("sign-up-submit");
const signInSubmit = document.getElementById("sign-in-submit");

const sendData = async () => {
  const Email = document.getElementById("email").value;
  const Username = document.getElementById("username").value;
  const Password = document.getElementById("password").value;
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
    console.log("data", data);
    console.log(dataWeAreSending);
    const json = await dataWeAreSending.json();
    console.log(json);
  } else {
    console.log("enter things");
  }
};

signUpSubmit.onclick = () => {
  console.log("hello");
  sendData();
};
