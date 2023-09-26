// TELA LOGIN

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

function recoverySenha() {
  location.href = "../pages/recuperar-senha.html";
}

function recoverPassword() {
  firebase
  .auth()
  .sendPasswordResetEmail(form.email().value)
  .then(() => {
    alert("E-mail enviado com sucesso");
      window.location.href = "../pages/tela-login.html";
    })
    .catch((error) => {
      alert(getErrorMessage(error));
    });
  }
  
  // TELA CADASTRO
  
  const buttonCreateAccount = document.getElementById("btnCadInfo") ? document.getElementById("btnCadInfo") : null;
  if (buttonCreateAccount) {
    buttonCreateAccount.addEventListener("click", () => {
      const formData = {
        nome: document.getElementById("nome").value,
        data: document.getElementById("dataNascimento").value,
        tipoMom: document.querySelector("select[name=tipoMãe").value,
        email: document.getElementById("newEmail").value,
        senha: document.getElementById("newSenha").value,
      };
    
      let date = formData.data;
      date = date.replace(/\//g, "-");
      let dataArray = date.split("-");
      console.log(dataArray);
      let nowdate = new Date();
      nowdate = nowdate.getFullYear();
    
      let confirmSenha = document.getElementById("confirmSenha").value;
    
      if (formData.nome.length == "") {
        alert("Por favor, insira seu nome no campo!");
      } else if (formData.nome.length > 100) {
        alert("Limite de 100 caracteres para o nome!");
      } else if (
        dataArray[0] < 1900 ||
        dataArray[0] >= nowdate ||
        dataArray[0] == "" ||
        dataArray[1] == "" ||
        dataArray[2] == ""
      ) {
        alert("Por favor, selecione uma data de nascimento válida!");
      } else if (formData.senha.length < 8) {
        alert("Por favor, digite uma senha com mais de 8 caracteres!");
      } else if (formData.senha != confirmSenha) {
        alert("As senhas devem se coincidir!");
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(formData.email, formData.senha)
          .then((data) => {
            const uid = data.user.uid;
    
            const users = firebase.firestore().collection("usuarios");
            users.doc(uid).set({
              uid: uid,
              nome: formData.nome,
              dataNascimento: formData.data,
              tipoMom: formData.tipoMom,
            });
            alert("conta criada com sucesso");
          })
          .catch((error) => {
            if (error.code == "auth/email-already-in-use") {
              alert("Esse e-mail já está em uso por outro usuário");
            } else if (error.code == "auth/invalid-email") {
              alert("Por favor, insira um e-mail!");
            } else if (error.code == "auth/missing-password") {
              alert("Por favor, insira uma senha!");
            } else {
              alert(error.message);
            }
            console.log(error);
          });
      }
    });
  }
  // VALIDAÇÃO CADASTRO
  
  const formEMailCadastro = document.getElementById("formEmail");
  const campos = document.querySelectorAll(".required");
  const spans = document.querySelectorAll(".span-required");
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  function setError(index) {
    spans[index].style.display = "block";
  }
  
  function removeError(index) {
    spans[index].style.display = "none";
  }
  
  function nomeValidation() {
    if (campos[0].value.length > 100) {
      setError(0);
    } else {
      removeError(0);
    }
}

function dataValidation() {
  let date = document.getElementById("dataNascimento").value;
  date = date.replace(/\//g, "-");
  let dataArray = date.split("-");
  
  if (dataArray[0] < 1900) {
    setError(1);
  } else {
    removeError(1);
  }
}
function emailValidateCadastro() {
  if (!emailRegex.test(campos[2].value)) {
    setError(2);
  } else {
    removeError(2);
  }
}

function mainPasswordValidate() {
  if (campos[3].value.length < 8) {
    setError(3);
  } else {
    removeError(3);
    comparePassword();
  }
}

function comparePassword() {
  if (campos[3].value == campos[4].value && campos[4].value.length >= 8) {
    removeError(4);
  } else {
    setError(4);
  }
}

function previewFile() {
  const preview = document.getElementById('fotoPerfil');
  const file = document.getElementById('loadImage').files[0];
  const reader = new FileReader();
  
  reader.addEventListener("load", () => {
    preview.src = reader.result;
  }, false);
  
  if (file) {
    reader.readAsDataURL(file);
  }
}
function teste(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid
      console.log(uid)
      var usersCollection = firebase.firestore().collection('usuarios');

  // Consulta para recuperar o documento do usuário com base no UID
  var userQuery = usersCollection.where('uid', '==', uid);
  console.log(userQuery);

  // Executar a consulta
  userQuery.get()
    .then(function(querySnapshot) {
      if (!querySnapshot.empty) {
        querySnapshot.forEach(function(doc) {
          // O documento do usuário foi encontrado
          var userData = doc.data();
          console.log('Dados do usuário:', userData);

          document.getElementById('dataNasc-usuario').textContent = userData.dataNascimento;
          document.getElementById('nome-usuario').textContent = userData.nome;
          document.getElementById('bio').textContent = userData.biografia;
        });    
      } else {
        console.log('Nenhum usuário encontrado com o UID fornecido.');
      }
    })
    .catch(function(error) {
      console.error('Erro ao recuperar dados do usuário:', error);
    });

    } else{
      console.log("não deu certo")
    }
 });
}

function atualizar() {
  var nome = document.getElementById('nameNew').value;
  var email = document.getElementById('emailNew').value;
  var senha = document.getElementById('senhaNew').value;
  var biografia = document.getElementById('biografia').value;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid;
      console.log(uid);
      var usersCollection = firebase.firestore().collection('usuarios');
      
      // Crie uma referência para o documento do usuário
      var userDocRef = usersCollection.doc(uid);
      
      // Atualize os campos desejados no documento do usuário
      var updateData = {
        
      };
      if (nome) {
        updateData.nome = nome
      }
      
      // Se a biografia foi fornecida, adicione-a ao objeto de atualização
      if (biografia) {
        updateData.biografia = biografia;
      }
      
      // Atualize o documento do usuário com os dados atualizados
      userDocRef.update(updateData)
        .then(function() {
          console.log("Dados do usuário atualizados com sucesso!");
          
          // Se a senha foi fornecida, atualize a senha no Firebase Authentication
          if (senha) {
            user.updatePassword(senha)
              .then(function() {
                console.log("Senha atualizada com sucesso!");
              })
              .catch(function(error) {
                console.error("Erro ao atualizar a senha:", error);
              });
          }

          user.updateEmail(email)
    .then(function() {
      console.log("Email atualizado com sucesso!");
    })
    .catch(function(error) {
      console.error("Erro ao atualizar o email:", error);
    });
        })
        .catch(function(error) {
          console.error("Erro ao atualizar os dados do usuário:", error);
        });
    } else {
      console.log("Não foi possível obter o usuário autenticado.");
    }
  });
  alert('Dados Atualizados com Sucesso!');
}

function excluir() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid;
      console.log(uid);
      var usersCollection = firebase.firestore().collection('usuarios');
      
      // Crie uma referência para o documento do usuário
      var userDocRef = usersCollection.doc(uid);
      
      // Exclua o documento do usuário do Firestore
      userDocRef.delete()
        .then(function() {
          console.log("Usuário excluído do Firestore com sucesso!");
          
          // Em seguida, exclua o usuário da autenticação do Firebase
          user.delete()
            .then(function() {
              console.log("Usuário excluído da autenticação do Firebase com sucesso!");
            })
            .catch(function(error) {
              console.error("Erro ao excluir o usuário da autenticação do Firebase:", error);
            });
        })
        .catch(function(error) {
          console.error("Erro ao excluir o usuário do Firestore:", error);
        });
    } else {
      console.log("Não foi possível obter o usuário autenticado.");
    }
  });
  alert('Conta Excluída com sucesso!');
  location.href ='tela-login.html';
}