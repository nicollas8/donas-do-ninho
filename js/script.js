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

const buttonCreateAccount = document.getElementById("btnCadInfo")
  ? document.getElementById("btnCadInfo")
  : null;
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
    } else if (formData.senha.length < 6) {
      alert("Por favor, digite uma senha com mais de 6 caracteres!");
    } else if (formData.senha != confirmSenha) {
      alert("As senhas devem se coincidir!");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.senha)
        .then((data) => {
          const uid = data.user.uid;

          const users = firebase.firestore().collection("usuarios");
          users
            .doc(uid)
            .set({
              uid: uid,
              nome: formData.nome,
              dataNascimento: formData.data,
              tipoMom: formData.tipoMom,
            })
            .then(() => {
              alert("conta criada com sucesso");
              window.location.replace("boas-vindas.html");
            });
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
  if (campos[3].value.length < 6) {
    setError(3);
  } else {
    removeError(3);
    comparePassword();
  }
}

function comparePassword() {
  if (campos[3].value == campos[4].value && campos[4].value.length >= 6) {
    removeError(4);
  } else {
    setError(4);
  }
}

function previewFile() {
  const preview = document.getElementById("fotoPerfil");
  const file = document.getElementById("loadImage").files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      preview.src = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}
function viewPublis() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      //console.log(uid)
      var usersCollection = firebase.firestore().collection("usuarios");
      var userRef = firebase.firestore().collection("usuarios").doc(uid);

      // Consulta para recuperar o documento do usuário com base no UID
      const publis = document.getElementById("publis");

      firebase
        .firestore()
        .collection("posts")
        .where("UIDusuario", "==", uid)
        .get()
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(function (doc) {
              // O documento do usuário foi encontrado
              var userPosts = doc.data();
              //console.log("dados", userPosts.post);
              publis.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
        <div class="ballPerguntas p-3">
          <div class="options">
            <h4 class="py-2 text-purple-700">DÚVIDA</h4>
          </div>
          <div class="balaoPergunta">
            <p class="text-black text-left py-2 mb-3"> ${userPosts.post} </p>
          </div>
          <div class="react flex flex-row gap-10 justify-around mb-2">
            <button class="w-6"><img src="../assets/social-network.svg" alt=""></button>
            <button class="w-6"><img src="../assets/hand.svg" alt=""></button>
            <button class="w-6"><img src="../assets/star.svg" alt=""></button>
            <button class="w-6"><img src="../assets/comment-dots.svg" alt=""></button>
            <button class="w-6"><img src="../assets/menu-dots.svg" alt=""></button>
          </div>
        </div>
      </div>`;
            });
          } else {
            console.log("Nenhum usuário encontrado com o UID fornecido.");
          }
        })
        .catch(function (error) {
          console.error("Erro ao recuperar dados do usuário:", error);
        });

      // Executar a consulta
    } else {
      console.log("não deu certo");
    }
  });
}

function att() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      //console.log(uid);
      var usersCollection = firebase.firestore().collection("usuarios");
      var userRef = firebase.firestore().collection("usuarios").doc(uid);

      //console.log("vamo ver ele:" + userRef.collection('posts'));

      // Consulta para recuperar o documento do usuário com base no UID
      var userQuery = usersCollection.where("uid", "==", uid);
      userQuery
        .get()
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(function (doc) {
              // O documento do usuário foi encontrado
              var userData = doc.data();
              //console.log('Dados do usuário:', userData);

              document.getElementById("nome-user").textContent = userData.nome;
              document.getElementById("data-user").textContent =
                userData.dataNascimento;
              document.getElementById("tipo-user").textContent =
                userData.tipoMom;
              document.getElementById("bio-user").textContent =
                userData.biografia;
            });
          } else {
            console.log("Nenhum usuário encontrado com o UID fornecido.");
          }
        })
        .catch(function (error) {
          console.error("Erro ao recuperar dados do usuário:", error);
        });
    }
  });
}

function atualizar() {
  var nome = document.getElementById("nameNew").value;
  var biografia = document.getElementById("biografia").value;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      console.log(uid);
      var usersCollection = firebase.firestore().collection("usuarios");

      // Crie uma referência para o documento do usuário
      var userDocRef = usersCollection.doc(uid);

      // Atualize os campos desejados no documento do usuário
      var updateData = {};
      if (nome) {
        updateData.nome = nome;
      }

      // Se a biografia foi fornecida, adicione-a ao objeto de atualização
      if (biografia) {
        updateData.biografia = biografia;
      }

      // Atualize o documento do usuário com os dados atualizados
      userDocRef
        .update(updateData)
        .then(function () {
          console.log("Dados do usuário atualizados com sucesso!");
          alert("Dados Atualizados com Sucesso!");
          window.location.replace("tela-usuario.html");
        })
        .catch(function (error) {
          console.error("Erro ao atualizar os dados do usuário:", error);
        });
    } else {
      console.log("Não foi possível obter o usuário autenticado.");
    }
  });
}

function excluir() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      console.log(uid);
      var usersCollection = firebase.firestore().collection("usuarios");

      // Crie uma referência para o documento do usuário
      var userDocRef = usersCollection.doc(uid);

      // Exclua o documento do usuário do Firestore
      userDocRef
        .delete()
        .then(function () {
          console.log("Usuário excluído do Firestore com sucesso!");

          // Em seguida, exclua o usuário da autenticação do Firebase
          user
            .delete()
            .then(function () {
              console.log(
                "Usuário excluído da autenticação do Firebase com sucesso!"
              );
              alert("Conta Excluída com sucesso!");
              window.location.replace("tela-login.html");
            })
            .catch(function (error) {
              console.error(
                "Erro ao excluir o usuário da autenticação do Firebase:",
                error
              );
            });
        })
        .catch(function (error) {
          console.error("Erro ao excluir o usuário do Firestore:", error);
        });
    } else {
      console.log("Não foi possível obter o usuário autenticado.");
    }
  });
}

function addPubli() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      console.log(uid);
      var usersCollection = firebase.firestore().collection("usuarios");
      console.log(usersCollection);

      var userQuery = usersCollection.where("uid", "==", uid);
      userQuery.get().then(function (querySnapshot) {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(function (doc) {
            // O documento do usuário foi encontrado
            var userData = doc.data();
            console.log("Dados do usuário:", userData);
            const newPostData = {
              post: document.getElementById("publi").value,
              timestamp: new Date(), // Adiciona um timestamp do servidor
              UIDusuario: uid,
              nomeUser: userData.nome,
            };
            firebase
              .firestore()
              .collection("posts")
              .add(newPostData)
              .then((docRef) => {
                console.log(
                  "Publicação adicionada com sucesso com o ID:",
                  docRef.id
                );
                window.location.replace("tela-inicio.html");
              })
              .catch((error) => {
                console.error("Erro ao adicionar a publicação:", error);
              });
          });
        } else {
          alert("deu erro");
        }
      });
    }
  });
}

function showPosts() {
  var db = firebase.firestore();
  // Obtenha todos os documentos da coleção 'posts'
  db.collection("posts")
    .orderBy("timestamp", "desc")
    .get()
    .then(function (postsQuerySnapshot) {
      postsQuerySnapshot.forEach(function (postDoc) {
        //console.log('Olha:',postDoc.data().post);
        var postData = postDoc.data();
        const uiduser = postData.UIDusuario;

        var tempNome;

        db.collection("usuarios")
          .doc(uiduser)
          .get()
          .then(function (userDoc) {
            if (userDoc.exists) {
              var userData = userDoc.data();
              tempNome = userData.nome;
              //console.log(tempNome);
            } else {
              console.log("foda");
            }
          });

        // Acesse os dados da postagem
        const timestamp = postData.timestamp.toMillis();
        const now = new Date().getTime();
        const miliDiff = now - timestamp;
        const minDiff = Math.floor(miliDiff / 60000);
        if (minDiff < 60) {
          tempo = `postado há ${minDiff} ${
            minDiff === 1 ? "minuto" : "minutos"
          } atrás`;
        } else if ((minDiff) => 60) {
          tempo = `postado há ${Math.floor(minDiff / 60)} ${
            Math.floor(minDiff / 60) === 1 ? "hora" : "horas"
          } atrás`;
        } else if ((minDiff) => 1440) {
          tempo = `postado ontem`;
        } else {
          time = postData.timestamp.toDate();
          formatter = new Intl.DateTimeFormat("pt-BR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });

          tempo = formatter.format(time);
        }
        publis.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
        <div class="ballPerguntas p-3">
        <p id=nome style= color:black></p> ${postData.nomeUser}
            <div class="options">
            <h4 class="py-3 text-purple-700 text-left">DÚVIDA</h4>
            </div>
            <div class="balaoPergunta">
            <p class="text-black text-left mb-4"> ${postData.post} </p>
            </div>
            <div class="react flex flex-row gap-10 justify-around mb-2">
            <button class="w-6"><img src="../assets/social-network.svg" alt=""></button>
            <button class="w-6"><img src="../assets/hand.svg" alt=""></button>
            <button class="w-6"><img src="../assets/star.svg" alt=""></button>
            <button class="w-6"><img src="../assets/comment-dots.svg" alt=""></button>
            <button class="w-6"><img src="../assets/menu-dots.svg" alt=""></button>
            </div>
            <p class='text-black text-right mt-2'> ${tempo}</p>
          </div>`;
        //console.log( db.collection("posts").get());
      });
    })
    .catch(function (error) {
      console.error(
        "Erro ao obter os documentos da subcoleção 'posts':",
        error
      );
    });
}

// firebase.initializeApp(firebaseConfig);

// const storage = firebase.storage();
// const firestore = firebase.firestore();

// // Lidar com o envio do formulário

// const buttonimg = document.getElementById("buttonimg");
// const imageInput = document.getElementById("image-input");

// buttonimg.addEventListener("click", async (e) => {
//   e.preventDefault();

//   const file = imageInput.files[0];
//   console.log(file);

//   if (file) {
//     // Faça o upload da imagem para o Firebase Storage
//     const storageRef = storage.ref().child(`img/${file.name}`);
//     await storageRef.put(file);

//     // Obtenha a URL de download da imagem
//     const downloadURL = await storageRef.getDownloadURL();

//     // Armazene a URL no Firestore
//     await firestore.collection("img").add({ url: downloadURL });

//     alert("Imagem enviada com sucesso!");
//   } else {
//     alert("Selecione uma imagem antes de enviar.");
//   }
// });
