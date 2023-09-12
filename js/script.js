function onChangeEmail() {
  toggleBtnDisabled();
  toggleEmailErrors();
}

function onChangeSenha() {
  toggleBtnDisabled();
  toggleSenhaErrors();
}

function isEmailValid() {
  const email = form.email().value;
  if (!email) {
    return false;
  }
  return validateEmail(email);
}

function isPasswordValid() {
  const password = form.senha().value;
  if (!password) {
    return false;
  }
  return true;
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function toggleEmailErrors() {
  const email = form.email().value;
  form.erroEmailRequired().style.display = email ? "none" : "block";
  form.erroEmailInvalid().style.display = email ? "none" : "block";
}

function toggleSenhaErrors() {
  const password = form.senha().value;
  form.erroSenhaRequired().style.display = password ? "none" : "block";
}

function toggleBtnDisabled() {
  const emailValid = isEmailValid();
  form.btnRecuperarSenha().disabled = !emailValid;

  const passwordValid = isPasswordValid();
  form.btnLogin().disabled = !emailValid || !isPasswordValid;
}

const form = {
  email: () => document.getElementById("email"),
  erroEmailInvalid: () => document.getElementById("erroEmailInvalid"),
  erroEmailRequired: () => document.getElementById("erroEmailRequired"),
  senha: () => document.getElementById("senha"),
  erroSenhaRequired: () => document.getElementById("erroSenhaRequired"),
  btnRecuperarSenha: () => document.getElementById("btnRecuperarSenha"),
  btnLogin: () => document.getElementById("btnLogin"),
};

function login() {
  firebase
    .auth()
    .signInWithEmailAndPassword(form.email().value, form.senha().value)
    .then((response) => {
      window.location.href = "tela-inicio.html";
    })
    .catch((error) => {
      alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
  if (error.code == "auth/user-not-found") {
    return "Usuário não encontrado";
  } else if (error.code == "auth/wrong-password") {
    return "Senha Incorreta";
  }
  return error.message;
}

function recoverPassword() {
  firebase
    .auth()
    .sendPasswordResetEmail(form.email().value)
    .then(() => {
      alert("E-mail enviado com sucesso");
      window.location.href = "tela-login.html";
    })
    .catch((error) => {
      alert(getErrorMessage(error));
    });
}

// cadastro com banco
const newForm = {
  newEmail: () => document.getElementById('newEmail'),
  newSenha: () => document.getElementById('newSenha'),
  btnCadastro: () => document.getElementById("btnCadastro"),
}

function cadastro() {
  const email = newForm.newEmail().value;

  if (comparePassword()) {  
    var password = newForm.newSenha().value;
  } else {
    console.log('erro');
  }
  
    firebase.auth().createUserWithEmailAndPassword (
        email, password
    ).then (() => {
      window.location.href = "../html/tela-inicio.html"
    }).catch (error => {
      alert (getErrorMessage (error));
    })
  }

  function getErrorMessage(error) {
    return error.message;
  
  }
  
// validação cadastro

const formEMailCadastro = document.getElementById("formEmail");
const campos = document.querySelectorAll(".required");
const spans = document.querySelectorAll(".span-required");
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function setError(index) {
  campos[index].style.border = "2px solid #e63636";
  spans[index].style.display = "block";
}

function removeError(index) {
  campos[index].style.border = "2px solid #5af25f";
  spans[index].style.display = "none";
}

function emailValidateCadastro() {
  if (!emailRegex.test(campos[0].value)) {
    setError(0);
  } else {
    removeError(0);
  }
}

function mainPasswordValidate() {
  if (campos[1].value.length < 8) {
    setError(1);
  } else {
    removeError(1);
    comparePassword();
  }
}

function comparePassword() {
  if (campos[1].value == campos[2].value && campos[2].value.length >= 8) {
    removeError(2);
  } else {
    setError(2);
  }
}

const campoInfo = document.querySelectorAll(".requiredInfo");
const span = document.querySelectorAll(".span-info");

function setErrorInfo (index) {
  campoInfo[index].style.border = "2px solid #e63636";
  span[index].style.display = "block";
}

function removeErrorInfo (index) {
  campoInfo[index].style.border = "2px solid #5af25f";
  span[index].style.display = "none";
}

function nomeValidation () {
  if (campoInfo[0].value.length > 100) {
    setErrorInfo(0)
  } else {
    removeErrorInfo(0);
  }
}

function dataValidation () {
  let date = document.getElementById('dataNascimento').value;
  date = date.replace(/\//g, "-");
  let dataArray = date.split("-");

  if (dataArray[0] < 1900) {
    setErrorInfo(1);
  } else {
    removeErrorInfo(1);
  }
}