const createRecipeSubmit = document.getElementById("create-recipe-submit");
const signInSubmit = document.getElementById("sign-in-submit");
const changePasswordSubmit = document.getElementById("UP-submit");
const deleteSubmit = document.getElementById("DEL-submit");

const sendData = async () => {
  const Name = document.getElementById("recipe-name").value;
  const Picture = document.getElementById("recipe-image").value;
  //const UserID = some sort of sessions id???? think this is on backend when button pressed
  const Ingredients = document.getElementById("ingredients").value;
  const Instructions = document.getElementById("instructions").value;
  const UserId = 8;
  if (
    Name.length !== 0 &&
    Ingredients.length !== 0 &&
    Instructions.length !== 0
  ) {
    const data = {
      Name: Name,
      UserId: UserId,
      Picture: Picture,
      Ingredients: Ingredients,
      Instructions: Instructions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const dataWeAreSending = await fetch(
      "http://localhost:3000/new_recipe/create_newrecipe",
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

createRecipeSubmit.onclick = () => {
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
