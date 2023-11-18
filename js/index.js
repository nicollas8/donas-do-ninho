const messaging = firebase.messaging();

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
      window.location.href = "./pages/tela-inicio.html";
    })
    .catch((error) => {
      showAlert(getErrorMessage(error));

    });
}

function showAlert(message){
window.Android.showAlert(message);
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
  "";
  location.href = "./pages/recuperar-senha.html";
}

function recoverPassword() {
  firebase
    .auth()
    .sendPasswordResetEmail(form.email().value)
    .then(() => {
      alert("E-mail enviado com sucesso");
      window.location.href = "./index.html";
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
    var formData = {
      nome: document.getElementById("nome").value,
      data: document.getElementById("dataNascimento").value,
      tipoMom: document.querySelector("select[name=tipoMãe").value,
      email: document.getElementById("newEmail").value,
      senha: document.getElementById("newSenha").value,
      termosDeUso: document.getElementById("termosDeUso").checked,
    };

    let date = formData.data;
    date = date.replace(/\//g, "-");
    let dataArray = date.split("-");
    //console.log(dataArray);
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
    } else if (!formData.termosDeUso) {
      alert("leia e aceite os termos de uso");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.senha)
        .then((data) => {
          const uid = data.user.uid;
          var tipo = formData.tipoMom;

          if (tipo == "Mãe") {
            var nivel = 1;
          } else if (tipo == "Gestante") {
            var nivel = 6;
          } else if (tipo == "Não sou mãe") {
            var nivel = 0;
          }
          const users = firebase.firestore().collection("usuarios");
          users
            .doc(uid)
            .set({
              uid: uid,
              nome: formData.nome,
              dataNascimento: formData.data,
              tipoMom: formData.tipoMom,
              termosDeUso: formData.termosDeUso,
              nivel: nivel,
              url: "../img/noPhoto.png",
              dataEntrada: new Date(),
              xp: 0,
              access: true,
              adm: false,
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
  const preview = document.getElementById("fotoPubli");
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
    preview.style.display = "block";
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
      const comments = document.getElementById("comments");
      firebase
        .firestore()
        .collection("posts")
        .where("UIDusuario", "==", uid)
        .where("categ", "==", "post")
        .get()
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(function (doc) {
              // O documento do usuário foi encontrado
              var userPosts = doc.data();
              //console.log("dados", userPosts);
              publis.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
        <div class="ballPerguntas p-3">
          <div class="options">
            <h4 class="py-2 text-purple-700">${userPosts.tipo}</h4>
          </div>
          <div class="balaoPergunta" onclick= "window.location.href = 'tela-comments.html' + '?ID=' + '${
            doc.id
          }';">
          <p class="text-black text-left py-2 mb-3"> ${userPosts.post} </p>
            <img src="${userPosts.url}" class="w-full">
          </div>
          <div class="react flex flex-row gap-10 py-2 justify-around mb-2">
          
          <p style=color:black> ${doc.data().likesQntd}
          <img class="w-6" src="../img/like.svg" alt=""></p>

          <p style=color:black> ${doc.data().deslikesQntd}
          <img class="w-6" src="../img/dislike.svg" alt=""></p>

          <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../img/favorito.svg" alt=""></p>

          <p style=color:black> ${doc.data().respsQntd}
          <img class="w-6" src="../img/comentário.svg" alt=""></p>
          <button class="self-end" onclick="confirmarExclusao('${
            doc.id
          }', '1')"><img src="../img/lixeira.png" alt="" class="w-6"></button>
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

      firebase
        .firestore()
        .collection("posts")
        .orderBy("timestamp", "desc")
        .where("categ", "==", "resp")
        .where("UIDusuario", "==", uid)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            const postID = doc.data().IDresp;
            console.log(doc.data());
            firebase
              .firestore()
              .collection("posts")
              .doc(postID)
              .get()
              .then((docPost) => {
                let nome = docPost.data().nomeUser;

                comments.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
            <div class="ballPerguntas p-4">
            <p id=nome style="color:blue;" class="text-right"> Resposta à ${nome}  </p>
            <div class="balaoPergunta">
            <p style=color:black></p>
            <p onclick= "window.location.href = 'tela-comments.html' + '?ID=' + '${postID}'" class="text-black text-left mb-4"> ${
                  doc.data().post
                } </p>
            </div>
            <div class="react flex flex-row gap-10 justify-around mb-2">
            <p style=color:black> ${doc.data().likesQntd}
            <img class="w-6" src="../img/like.svg" alt=""> </p>
            <p style=color:black> ${doc.data().deslikesQntd}
            <img class="w-6" src="../img/dislike.svg" alt=""> </p>
            <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../img/favorito.svg" alt=""></p>
            <button class="w-6" onclick="confirmarExclusao('${
              doc.id
            }', 2)"><img src="../img/lixeira.png" alt=""></button>
            </div>
          </div>`;
              });
          });
        });
    } else {
      console.log("não deu certo");
    }
  });
}

function att() {
  renderNots();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var urlParams = new URLSearchParams(window.location.search);
      var IDpostagem = urlParams.get("ID");

      if (IDpostagem) {
        var uid = IDpostagem;
      } else {
        var uid = user.uid;
      }

      //console.log(uid);
      var usersCollection = firebase.firestore().collection("usuarios");
      var userRef = firebase.firestore().collection("usuarios").doc(uid);
      var img = document.querySelector("#imgPerfil");
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

              const dataNasc = userData.dataNascimento.split('-');
              const dataReformada = `${dataNasc[2]}/${dataNasc[1]}/${dataNasc[0]}`
           

              document.getElementById("nome-user").textContent = userData.nome;
              document.getElementById("data-user").textContent =
                dataReformada;
              document.getElementById("tipo-user").textContent =
                userData.tipoMom;
              document.getElementById("bio-user").textContent =
                userData.biografia;
              if (userData.url) {
                var foto = userData.url;
              } else {
                var foto = "../img/perfil-usuário.png";
              }
              img.setAttribute("src", foto);
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

function showPostsUser(user) {
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  const posts = document.getElementById("posts");

  firebase
    .firestore()
    .collection("posts")
    .where("UIDusuario", "==", IDpostagem)
    .get()
    .then(function (querySnapshot) {
      if (!querySnapshot.empty) {
        querySnapshot.forEach(function (postDoc) {
          var postData = postDoc.data();
          var postID = postDoc.id;

          time = postData.timestamp;
          tempo = formatTime(time);
          const userUID = user.uid;
          const tipoPost = postData.tipo;
          const contPost = postData.post;
          const likesQntd = postData.likesQntd;
          const deslikesQntd = postData.deslikesQntd;
          const favsQntd = postData.favsQntd;
          const respsQntd = postData.respsQntd;
          const redirect = "tela-comments.html";
          const tag = postData.tag;
          const img = postData.url;
          posts.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
            <div class="ballPerguntas p-3">
              <h4 class=" text-purple-700 self-center text-rig">${tipoPost}</h4>
            </div>
            <div class="options">
            </div>
            <div class="balaoPergunt a">
            <p style=color:black></p>
            <p class="text-black text-left mb-4 py-2"> ${contPost} </p>
            <div class="flex justify-center py-2 h-1/4">
              <img src="${img}" class="w-full h-1/4 mb-3">
            </div>
                </div>
                  <div class=" react flex flex-row gap-14 justify-evenly pl-3 py-3 mt-2 mb-2 w-full">
                    <button class="w-6 flex flex-row-reverse" onclick="react('1', '${postID}', 'post')"> <p class="ml-2" id="like${postID}" style=color:black;>${likesQntd} </p> <img src="../img/like.svg" alt=""></button>
                    <button class="w-6 flex flex-row-reverse" onclick="react('2', '${postID}', 'post')"><p class="ml-2" id="deslike${postID}" style=color:black;> ${deslikesQntd} </p><img src="../img/dislike.svg" alt=""></button>
                    <button class="w-6 flex flex-row-reverse" onclick="fav('${postID}', '${userUID}', 'post')"><p class="ml-2" id="fav${postID}" style=color:black;> ${favsQntd} </p><img src="../img/favorito.svg" alt=""> </button>
                    <button class="w-6 flex flex-row-reverse" onclick= "window.location.href = '${redirect}' + '?ID=' + '${postID}';"> <p class="ml-2 text-black" id="comment">${respsQntd}</p><img src="../img/comentário.svg" alt=""> </button>
                    <button class="w-6 flex flex-row-reverse"><img src="../img/três-pontos.svg" alt=""></button>
                  </div>
                <div class="flex justify-between">
                <p class="text-left mb-2 text-green-700" onclick="sortBy('${tag}')"> ${tag}</p>
                <p class="text-black text-left mb-2 self-center"> ${tempo}</p>
                </div>
              </div>`;
        });
      }
    });
}

function atualizar(URL) {
  var nome = document.getElementById("nameNew").value;
  var biografia = document.getElementById("biografia").value;
  var botao = document.getElementById("post2")


  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      console.log(uid);
      var usersCollection = firebase.firestore().collection("usuarios");
      var postsCollection = firebase.firestore().collection("posts");

      // Crie uma referência para o documento do usuário
      var userDocRef = usersCollection.doc(uid);

      // Atualize os campos desejados no documento do usuário
      var updateData = {};
      var updateDataPosts = {};
      if (nome) {
        updateData.nome = nome;
        updateDataPosts.nomeUser = nome;
      }

      // Se a biografia foi fornecida, adicione-a ao objeto de atualização
      if (biografia) {
        updateData.biografia = biografia;
      }

      if (URL) {
        updateData.url = URL;
        updateDataPosts.fotoUser = URL;
      }

      // Atualize o documento do usuário com os dados atualizados
      userDocRef
        .update(updateData)
        .then(function () {
          postsCollection
            .where("UIDusuario", "==", uid)
            .get()
            .then(function (querySnapshot) {
              if (!querySnapshot.empty) {
                querySnapshot.forEach(function (doc) {
                  console.log(doc.data().post);
                  doc.ref.update(updateDataPosts).then(function () {
                    alert("Dados Atualizados com Sucesso!");
                    window.location.replace("tela-usuario.html");
                  });
                });
              } else {
                alert("Dados Atualizados com Sucesso!");
                window.location.replace("tela-usuario.html");
              }
            });
        })
        .catch(function (error) {
          console.error("Erro ao atualizar os dados do usuário:", error);
        });
    } else {
      console.log("Não foi possível obter o usuário autenticado.");
    }
  });
}

function excluirConta() {
  //var resposta = confirm("Tem certeza de que deseja excluir?");

  const confirm = document.getElementById("preview");
  confirm.style.display = "block";
  confirm.innerHTML = `<img class='' src='../img/logoExclusao.svg'> 
  <p class='text-black mt-3'> Tem certeza que deseja excluir sua conta? </p>
  <div class='flex flex-row justify-center gap-10 mt-5'>
  <button id='confirmExcluir' class='border-2 border-black p-2 rounded-3xl bg-green-400 px-4'> sim </button>
  <button id='denyExcluir' class='border-2 border-black p-2 rounded-3xl bg-red-400 px-4'> não </button>
  </div>`;

  const decision2 = document.getElementById("denyExcluir");

  decision2.addEventListener("click", async (e) => {
    console.log(decision2.textContent);
    confirm.style.display = "none";
  });

  const decision1 = document.getElementById("confirmExcluir");

  decision1.addEventListener("click", async (e) => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var uid = user.uid;
        console.log(uid);
        usersCollection = firebase.firestore().collection("usuarios");
        // Crie uma referência para o documento do usuário
        var userDocRef = usersCollection.doc(uid);

        // Exclua o documento do usuário do Firestore
        userDocRef
          .delete()
          .then(function () {
            excluirPosts(uid);
            excluirReacts(uid);
            console.log("Usuário excluído do Firestore com sucesso!");

            // Em seguida, exclua o usuário da autenticação do Firebase
            user
              .delete()
              .then(function () {
                console.log(
                  "Usuário excluído da autenticação do Firebase com sucesso!"
                );
                alert("Conta Excluída com sucesso!");
                window.location.replace("../index.html");
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
  });
}

function excluirPosts(uidDoUsuario) {
  var db = firebase.firestore();

  db.collection("posts")
    .where("UIDusuario", "==", uidDoUsuario)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        postID = doc.id;

        db.collection("posts")
          .doc(postID)
          .delete()
          .then(function () {
            console.log("Postagem excluída com sucesso!");
          });
      });
    });
}

function excluirReacts(uid) {
  firebase
    .firestore()
    .collection("reacts")
    .where("userUID", "==", uid)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
}

function addPubli(url) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (document.getElementById("publi").value == "") {
        alert("Por favor, digite algo para enviar!");
      } else if (document.getElementById("tipo").value == "") {
        alert("Por favor, selecione um tipo de publicação!");
      } else if (document.getElementById("tag").value == "") {
        alert("Por favor, selecione uma tag!");
      } else {
        const button = document.getElementById("post");
        button.disabled = true;

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

              var Postuid = firebase.firestore().collection("posts").doc().id;

              const newPostData = {
                post: document.getElementById("publi").value,
                timestamp: new Date(), // Adiciona um timestamp do servidor
                IDpost: Postuid,
                UIDusuario: uid,
                tipo: document.getElementById("tipo").value,
                respsQntd: 0,
                likesQntd: 0,
                deslikesQntd: 0,
                favsQntd: 0,
                tag: document.getElementById("tag").value,
                nomeUser: userData.nome,
                categ: "post",
                url: url,
                fotoUser: userData.url,
              };
              firebase
                .firestore()
                .collection("posts")
                .add(newPostData)
                .then((docRef) => {
                  setTimeout(function () {
                    button.disabled = true;
                  }, 2000);
                  firebase
                    .firestore()
                    .collection("usuarios")
                    .doc(uid)
                    .get()
                    .then((userDoc) => {
                      userDoc.ref
                        .update({
                          xp: userDoc.data().xp + 5,
                        })
                        .then(function () {
                          console.log("XP Concedido papai");
                          alert("Publicação adicionada com sucesso!");
                          window.location.replace("tela-inicio.html");
                        });
                    });
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
    }
  });
}

function addResp() {
  if (document.getElementById("resp").value !== "") {
    var urlParams = new URLSearchParams(window.location.search);
    var IDpostagem = urlParams.get("ID");
    const button = document.getElementById("post");
    button.disabled = true;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var uid = user.uid; // Mova esta linha para dentro deste bloco
        console.log(uid);
        var usersCollection = firebase.firestore().collection("usuarios");
        console.log(usersCollection);
        var RespID = IDpostagem;

        usersCollection
          .doc(uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              var userData = doc.data();
              const newRespData = {
                post: document.getElementById("resp").value,
                timestamp: new Date(), // Adiciona um timestamp do servidor
                IDresp: RespID,
                UIDusuario: uid,
                nomeUser: userData.nome,
                deslikesQntd: 0,
                likesQntd: 0,
                favsQntd: 0,
                categ: "resp",
                fotoUser: userData.url,
              };

              firebase
                .firestore()
                .collection("posts")
                .doc(IDpostagem)
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    firebase
                      .firestore()
                      .collection("posts")
                      .add(newRespData)
                      .then(() => {
                        firebase
                          .firestore()
                          .collection("usuarios")
                          .doc(doc.data().UIDusuario)
                          .collection("notificações")
                          .get()
                          .then(() => {
                            addNotify(
                              doc.id,
                              user.uid,
                              doc.data().UIDusuario,
                              "com"
                            );
                            const qntdResps = doc.data().respsQntd;
                            console.log(qntdResps);
                            doc.ref.update({
                              respsQntd: qntdResps + 1,
                            });
                            setTimeout(function () {
                              button.disabled = false;
                            }, 2000);
                            alert("Resposta enviada com sucesso!");
                            window.location.href =
                              "tela-comments.html" + "?ID=" + IDpostagem;
                          })
                          .catch((error) => {
                            console.error(
                              "Erro ao adicionar resposta: ",
                              error
                            );
                          });
                      });

                    console.log(newRespData);
                  }
                })
                .catch(function (error) {
                  console.error("Erro ao consultar posts:", error);
                });
            } else {
              console.log("Nenhum documento encontrado com o UID fornecido.");
            }
          })
          .catch(function (error) {
            console.error("Erro ao recuperar dados do usuário:", error);
          });
      } else {
        console.log("Usuário não autenticado.");
      }
    });
  } else {
    alert("Por favor, digite alguma coisa para enviar sua resposta!");
  }
}

function formatPost(
  userNome,
  userUID,
  tipoPost,
  contPost,
  postID,
  likesQntd,
  deslikesQntd,
  favsQntd,
  respsQntd,
  redirect,
  tag,
  img,
  fotoUser,
  donoUID,
) {
  //console.log(tag);

  if (img) {
    var imgCarregado = "style='display:flex'";
  } else {
    var imgCarregado = "style='display:none'";
  }

  var post = `
  <div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg w-screen">
    <div class="ballPerguntas p-3">
    <div class="cardTittle flex flex-row justify-between">
  <div class="flex flex-row justify-between" onclick="acessarPerfil('${donoUID}')">
   <img class="self-center w-12 h-12 rounded-full mr-2" src="${fotoUser}" style="background-color: grey;">
   <p id=nome class="text-left self-center text-black"> ${userNome}</p>
  </div>
    <h4 class=" text-red-700 self-center">${tipoPost}</h4>
  </div>
  <div class="options">
  </div>
  <div class="balaoPergunt a">
  <p style=color:black></p>
  <p class="text-black text-left mb-4 py-2"> ${contPost} </p>
  <div class="flex justify-center py-2 h-1/4" ${imgCarregado}>
    <img src="${img}" class="w-full h-1/4 mb-3">
  </div>
      </div>
        <div class="react flex flex-row gap-10 justify-around mt-2 mb-2 w-['90vw']" id="react">
          <button class="w-6 flex flex-row" id="likeButton" onclick="react('1', '${postID}', 'post')"> 
            <img id="imgLike" src="../img/like.svg" alt="">
            <p class="ml-2" id="like${postID}" style=color:black;>${likesQntd} </p> 
          </button>
          <button class="w-6 flex flex-row" id="deslikeButton" onclick="react('2', '${postID}', 'post')">
            <img id="imgDislike" src="../img/dislike.svg" alt="">
            <p class="ml-2" id="deslike${postID}" style=color:black;> ${deslikesQntd} </p>
          </button>
          <button class="w-6 flex flex-row"  id="favoriteButton" onclick="fav( '${postID}', '${userUID}', 'post')">
            <img id="imgFavs" src="../img/favorito.svg" alt=""> 
            <p class="ml-2" id="fav${postID}" style=color:black;> ${favsQntd} </p>
          </button>
          <button class="w-6 flex flex-row" onclick= "window.location.href = '${redirect}' + '?ID=' + '${postID}';"> 
            <img src="../img/comentário.svg" alt=""> 
            <p class="ml-2 text-black" id="comment">${respsQntd}</p>
          </button>
          <button class="w-6 flex flex-row-reverse"><img onclick="report('${postID}', '${userUID}')" class='denuncia' src="../img/denuncia.svg" alt=""></button>
        </div>
      <div class="flex justify-between">
        <p class="text-left mb-2 text-orange-600" id="tagColor" onclick="sortBy('${tag}')"> #${tag}</p>
        <p class="text-black text-left mb-2 self-center"> ${tempo}</p>
      </div>
    </div>`;

  return post;
}

function sortBy(tag) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const db = firebase.firestore();
      const publis = document.getElementById("publis");

      db.collection("posts")
        .where("tag", "==", tag)
        .get()
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            publis.innerHTML = "";
            querySnapshot.forEach(function (doc) {

              console.log(doc.data());
              var postData = doc.data();
              var postID = doc.id;

              time = postData.timestamp;
              tempo = formatTime(time);
              const userNome = postData.nomeUser;
              const userUID = user.uid;
              const tipoPost = postData.tipo;
              const contPost = postData.post;
              const likesQntd = postData.likesQntd;
              const deslikesQntd = postData.deslikesQntd;
              const favsQntd = postData.favsQntd;
              const respsQntd = postData.respsQntd;
              const redirect = "tela-comments.html";
              const tag = postData.tag;
              const img = postData.url;
              const imgPerfil = postData.fotoUser;

              publis.innerHTML += formatPost(
                userNome,
                userUID,
                tipoPost,
                contPost,
                postID,
                likesQntd,
                deslikesQntd,
                favsQntd,
                respsQntd,
                redirect,
                tag,
                img,
                imgPerfil
              );
              checkReact(user.uid, "post");
            });
          } else {
            console.log("Deu erro!");
          }
        });
    }
  });
}

function isADM(uid){
  firebase.firestore().collection("usuarios")
  .doc(uid).get().then((doc) => {
    if (doc.data().adm == true){
      console.log('salve')
      const img = document.querySelectorAll('.denuncia');

      img.forEach(elemento => {
        elemento.src ="../img/lixeira.png";
      })
      console.log(img)
    }
  })
}
function deleta(postID){
  console.log(postID)
}

function showPosts() {
  renderNots();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var db = firebase.firestore();
      const postsRef = db.collection("posts");
      // Obtenha todos os documentos da coleção 'posts'

      postsRef
        .where("categ", "==", "post")
        .orderBy("timestamp", "desc")
        .get()
        .then((postsQuerySnapshot) => {
          postsQuerySnapshot.forEach((postDoc) => {
            var postData = postDoc.data();
            var postID = postDoc.id;
            db.collection("reacts")
              .where("postID", "==", postID)
              .where("react", "==", 3)
              .get()
              .then(function (reactSnapshot3){
                postsRef.doc(postID).get().then((doc) => {
                  doc.ref.update({
                    favsQntd: reactSnapshot3.size,
                  });
                })
                //console.log("Número de Fav:", );
              })

            //deslike
            db.collection("reacts")
              .where("postID", "==", postID)
              .where("react", "==", 2)
              .get()
              .then(function (reactSnapshot2){
                postsRef.doc(postID).get().then((doc) => {
                  doc.ref.update({
                    deslikesQntd: reactSnapshot2.size,
                  });
                })
                //console.log("Número de deslikes:", reactSnapshot2.size);
              })
            
            //like
            db.collection("reacts")
              .where("postID", "==", postID)
              .where("react", "==", 1)
              .get()
              .then(function (reactSnapshot1){
                postsRef.doc(postID).get().then((doc) => {
                  doc.ref.update({
                    likesQntd: reactSnapshot1.size,
                  });
                })
                //console.log("Número de likes:", reactSnapshot1.size);
              })

            //comments
            db.collection("posts")
            .where("categ", "==", "resp")
            .where("IDresp", "==", postID)
            .get()
            .then( function (reactSnapshot4){
              postsRef.doc(postID).get().then((doc) => {
                doc.ref.update({
                  respsQntd: reactSnapshot4.size,
                });
              })
              //console.log("Número de respostas:", reactSnapshot4.size)
            })

            time = postData.timestamp;
            tempo = formatTime(time);
            const userNome = postData.nomeUser;
            const userUID = user.uid;
            const tipoPost = postData.tipo;
            const contPost = postData.post;
            const likesQntd = postData.likesQntd;
            const deslikesQntd = postData.deslikesQntd;
            const favsQntd = postData.favsQntd;
            const respsQntd = postData.respsQntd;
            const redirect = "tela-comments.html";
            const tag = postData.tag;
            const img = postData.url;
            const fotoUser = postData.fotoUser;
            const UIDdonoPost = postData.UIDusuario;
            publis.innerHTML += formatPost(
              userNome,
              userUID,
              tipoPost,
              contPost,
              postID,
              likesQntd,
              deslikesQntd,
              favsQntd,
              respsQntd,
              redirect,
              tag,
              img,
              fotoUser,
              UIDdonoPost
            );
            checkReact(user.uid, "post");
          });
        })

        .catch(function (error) {
          console.error(
            "Erro ao obter os documentos da subcoleção 'posts':",
            error
          );
        });
      console.log("tu tá logado");
      isADM(user.uid);

      db.collection("usuarios").doc(user.uid).get().then((doc) => {
        const data = doc.data().reclusao
        if (data){
          const hoje = new Date().toISOString().split('T')[0];

          const dataFormatada = data.split('-');
          const dataReformada = dataFormatada[2]+'/'+dataFormatada[1]+'/'+dataFormatada[0]
          console.log(data, hoje)
          if (data > hoje){
            const popup = document.getElementById("popup");
            const popupInfo = document.getElementById('info');
            popup.style.display = 'flex';
            popupInfo.innerHTML = `<p class="text-black">Você está proibido de mexer no aplicativo até a seguinte data: ${dataReformada}</p>
            <button onclick="logOut()"class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">Sair</button>`
          }
        }
        
        const block = doc.data().access
        if(block == false){
          const popup = document.getElementById("popup");
          const popupInfo = document.getElementById('info');
          popup.style.display = 'flex';
          popupInfo.innerHTML = `<p class="text-black">Devido as suas atitudes, você foi banido da nossa comunidade, se você acha que isso é um engano, nos envie um email: tccmaternidade6@gmail.com          </p>
          <button onclick="logOut()"class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">Sair</button>`
        }
        
      })

    } else {
      console.log("tu nao tá logado");
    }
    
  });
  
}

function checkReact(userUID, local) {
  var db = firebase.firestore();
  db.collection("reacts")
    .where("userUID", "==", userUID)
    .where("categ", "==", local)
    .get()
    .then(function (reactQuerySnapshot) {
      //console.log(userUID);
      if (!reactQuerySnapshot.empty) {
        reactQuerySnapshot.forEach(function (reactDoc) {
          if (reactDoc.data().react == 1) {
            const elemento = document.getElementById(
              "like" + reactDoc.data().postID
            );
            if (elemento) {
              elemento.style.backgroundColor = "lightgreen";
            } else {
              console
                .warn
                // "Elemento não encontrado com o ID 'like" +
                //   reactDoc.data().postID +
                //   "'"
                ();
            }
          } else if (reactDoc.data().react == 2) {
            const elemento = document.getElementById(
              "deslike" + reactDoc.data().postID
            );
            if (elemento) {
              elemento.style.backgroundColor = "red";
            } else {
              console
                .warn
                // "Elemento não encontrado com o ID 'deslike" +
                //   reactDoc.data().postID
                ();
            }
          } else if (reactDoc.data().react == 3) {
            const elemento = document.getElementById(
              "fav" + reactDoc.data().postID
            );
            if (elemento) {
              elemento.style.backgroundColor = "yellow";
            } else {
              console
                .warn
                // "Elemento não encontrado com o ID 'fav" +
                //   reactDoc.data().postID +
                //   "'"
                ();
            }
          }
        });
      }
    });
}

function formatTime(time) {
  const timestamp = time.toMillis();
  const now = new Date().getTime();
  const miliDiff = now - timestamp;
  const secDiff = Math.floor(miliDiff / 1000);
  const minDiff = Math.floor(secDiff / 60);
  time = time.toDate();
  formatter = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  formatterH = new Intl.DateTimeFormat("pt-BR", {
    hour: "numeric",
    minute: "numeric",
  });
  if (secDiff < 60) {
    tempo = `postado há ${secDiff} ${
      secDiff === 1 ? "segundo" : "segundos"
    } atrás`;
  } else if (minDiff < 60) {
    tempo = `postado há ${minDiff} ${
      minDiff === 1 ? "minuto" : "minutos"
    } atrás`;
  } else if (minDiff >= 60 && minDiff < 1440) {
    tempo = `postado há ${Math.floor(minDiff / 60)} ${
      Math.floor(minDiff / 60) === 1 ? "hora" : "horas"
    } atrás`;
  } else if (minDiff >= 1440 && minDiff <= 2160) {
    tempo = `postado ontem às ` + formatterH.format(time);
  } else {
    tempo =
      "postado " + formatter.format(time) + " às " + formatterH.format(time);
  }
  return tempo;
}

function comments() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var urlParams = new URLSearchParams(window.location.search);
      var idComment = urlParams.get("ID");

      // Verifique se 'meuValor' não é nulo ou vazio
      if (idComment) {
        var db = firebase.firestore();

        // Referência à coleção 'posts' e consulta usando .where
        var postRef = db.collection("posts").doc(idComment);

        // Execute a consulta
        postRef.get().then((doc) => {
          if (doc.exists) {
            const postData = doc.data();
            const postDoc = doc;

            const time = postData.timestamp;
            tempo = formatTime(time);
            const userNome = postData.nomeUser;
            const userUID = user.uid;
            const tipoPost = postData.tipo;
            const contPost = postData.post;
            const likesQntd = postData.likesQntd;
            const deslikesQntd = postData.deslikesQntd;
            const favsQntd = postData.favsQntd;
            const respsQntd1 = postData.respsQntd;
            const tag = postData.tag;
            const redirect = "add-comment.html";
            const img = postData.url;
            const fotoUser = postData.fotoUser;
            const UID = postData.UIDusuario;
            publis.innerHTML = formatPost(
              userNome,
              userUID,
              tipoPost,
              contPost,
              doc.id,
              likesQntd,
              deslikesQntd,
              favsQntd,
              respsQntd1,
              redirect,
              tag,
              img,
              fotoUser,
              UID
            );
            checkReact(user.uid, "post");
            const respUID = postData.IDpost;
            console.log(respUID);
            let respsQntd = 0;

            db.collection("posts")
              .where("IDresp", "==", doc.id)
              .orderBy("timestamp", "desc")
              .get()
              .then(function (querySnapshot) {
                if (!querySnapshot.empty) {
                  querySnapshot.forEach(function (doc) {
                    const respData = doc.data();
                    const time = respData.timestamp;
                    formatTime(time);
                    resps.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] border-t-2 border-[#ffa9a9] rounded-t-xl bg-white rounded-b-lg">
            <div class="ballPerguntas p-4">
            <div class="flex flex-row">
            <img class="self-center w-12 h-12 mr-2 rounded-full" src="${respData.fotoUser}" style="background-color: grey;">
            <p id=nome style="color:blue;" class="text-left self-center"> ${respData.nomeUser}  </p>
            </div>
            <div class="balaoPergunta flex flex-row">
            <p class="text-black mt-4 mb-3 ml-2"> ${respData.post} </p>
            </div>
            <div class="react flex flex-row gap-10 justify-around mb-2">
              <button class="w-6" onclick="react('1', '${doc.id}', 'resp')"> <p id="like${doc.id}" style=color:black;>${respData.likesQntd} </p> <img src="../img/like.svg" alt=""></button>
              <button class="w-6" onclick="react('2', '${doc.id}', 'resp')"><p id="deslike${doc.id}" style=color:black;> ${respData.deslikesQntd} </p><img src="../img/dislike.svg" alt=""></button>
              <button class="w-6" onclick="fav('${doc.id}', '${user.uid}', 'resp')"><p id="fav${doc.id}" style=color:black;> ${respData.favsQntd} </p><img src="../img/favorito.svg" alt=""> </button>
              <button class="w-6" onclick="report('${doc.id}')"><img id="denuncia" src="../img/denuncia.svg" alt=""></button>
            </div>
            <p class='text-black text-right mt-2'> ${tempo}</p>
            </div>`;
                    checkReact(user.uid, "resp");
                  });
                } else {
                  firebase
                    .firestore()
                    .collection("posts")
                    .doc(idComment)
                    .get()
                    .then((doc) => {
                      doc.ref.update({
                        respsQntd: 0,
                      });
                    });
                }
              });
          } else {
            console.log(
              "Nenhum documento encontrado com o IDpost correspondente."
            );
          }
        });
      } else {
        console.log("Não existe");
      }
    }
  });
}

function confirmarExclusao(IDref, num) {
  var resposta = confirm("Tem certeza de que deseja excluir?");
  if (resposta === true) {
    if (num == 1) {
      const postID = IDref;
      excluirPost(postID);
    } else {
      const commentID = IDref;
      console.log(commentID);
      excluirComment(commentID);
    }
  } else {
  }
}

function excluirComment(commentID) {
  var db = firebase.firestore();
  console.log(commentID);

  db.collection("posts")
    .doc(commentID)
    .get()
    .then((doc) => {
      console.log(doc.data);
      const postRef = doc.data().IDresp;
      doc.ref.delete().then(function () {
        db.collection("posts")
          .doc(postRef)
          .get()
          .then((Postdoc) => {
            Postdoc.ref
              .update({
                respsQntd: Postdoc.data().respsQntd - 1,
              })
              .then(function () {
                db.collection("reacts")
                  .where("postID", "==", commentID)
                  .get()
                  .then(function (querySnapshot) {
                    contagem = querySnapshot.size;
                    if (!querySnapshot.empty) {
                      querySnapshot.forEach(function (Reactdoc) {
                        Reactdoc.ref.delete();
                        contagem--;
                      });
                    } else {
                      alert("Publicação Excluída com sucesso!");
                      window.location.reload();
                    }
                  });
              });
          });
      });
      console.log(commentID);
    });
}

function excluirPost(postUID) {
  console.log(postUID);
  var db = firebase.firestore();
  db.collection("posts")
    .doc(postUID)
    .get()
    .then((doc) => {
      doc.ref
        .delete()
        .then(function () {
          db.collection("reacts")
            .where("postID", "==", postUID)
            .get()
            .then(function (reactSnapshot) {
              contagem = reactSnapshot.size;
              if (!reactSnapshot.empty) {
                reactSnapshot.forEach(function (doc) {
                  doc.ref.delete();
                  console.log("Reações encontradas:", reactSnapshot.size);
                  contagem--;
                });
              } else {
                alert("Publicação Excluída com sucesso!");
                //window.location.reload();
              }

              // Após o forEach, você pode recarregar a página
            });
        })
        .catch(function (error) {
          console.error("Erro ao excluir: ", error);
        });
    })
    .catch(function (error) {
      console.error("Erro ao executar a consulta: ", error);
    });
}

function desabilitarBotao() {
  const button = document.getElementById("");
  button.disabled = true;
}

function reabilitarBotao() {
  const button = document.getElementById("");
  button.disabled = false;
}

function react(reactionNum, postID, type) {
  console.log(reactionNum, postID, type);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userUID = user.uid;
      if (reactionNum == 1) {
        var num = 1;
        var vs = num + 1;
      } else {
        num = 2;
        vs = num - 1;
      }

      reactP(num, vs, postID, userUID, type);
    }
  });
}

function reactP(num, vs, postID, userUID, type) {
  const db = firebase.firestore();
  const postRef = db.collection("posts").doc(postID);
  const reactLocation = db.collection("reacts");

  if (num == 1) {

    style = "like" + postID;
    styleVs = "deslike" + postID;
  } else {

    style = "deslike" + postID;
    styleVs = "like" + postID;
  }
  //verificando se já tem a msm reação do msm caba
  reactLocation
    .where("userUID", "==", userUID)
    .where("react", "==", num)
    .where("postID", "==", postID)
    .get()
    .then(function (querySnapshot) {
      if (!querySnapshot.empty) {
        console.log("já deu reação");
        querySnapshot.forEach(function (doc) {
          console.log(doc.id);
          reactLocation
            .doc(doc.id)
            .delete()
            .then(() => {
              postRef.get().then((doc) => {
                if (num == 1) {
                  doc.ref
                    .update({
                      likesQntd: doc.data().likesQntd - 1,
                    })
                    .then(function () {
                      if (doc.data().UIDusuario != userUID) {
                        db.collection("usuarios")
                          .doc(doc.data().UIDusuario)
                          .get()
                          .then((userDoc) => {
                            userDoc.ref
                              .update({
                                xp: userDoc.data().xp - 5,
                              })
                              .then(function () {
                                console.log("XP Concedido papai");
                              });
                          });
                      }
                    });
                  document.getElementById(style).textContent =
                    doc.data().likesQntd - 1;
                } else {
                  doc.ref.update({
                    deslikesQntd: doc.data().deslikesQntd - 1,
                  });
                  document.getElementById(style).textContent =
                    doc.data().deslikesQntd - 1;
                }
              });
              console.log("Foi excluido!");
              document.getElementById(style).style.backgroundColor = "white";
            })
            .catch((error) => {
              console.error("Erro ao excluir", error);
            });
        });
      } else {
        //verifica se existe uma reação contrária
        reactLocation
          .where("userUID", "==", userUID)
          .where("react", "==", vs)
          .where("postID", "==", postID)
          .get()
          .then(function (querySnapshot) {
            if (!querySnapshot.empty) {
              console.log("Tu deu " + styleVs + ", safado");

              const addReact = {
                react: num,
                timestamp: new Date(),
              };

              querySnapshot.forEach(function (doc) {
                console.log(doc.data());
                reactLocation
                  .doc(doc.id)
                  .update(addReact)
                  .then(() => {
                    console.log("Agr é " + style);
                    postRef.get().then((doc) => {
                      console.log(doc.data());
                      if (num == 1) {
                        doc.ref
                          .update({
                            likesQntd: doc.data().likesQntd + 1,
                            deslikesQntd: doc.data().deslikesQntd - 1,
                          })
                          .then(() => {
                            db.collection("usuarios")
                              .doc(doc.data().UIDusuario)
                              .collection("notificações")
                              .where("UID", "==", userUID)
                              .where("commentID", "==", postID)
                              .where("type", "==", "like")
                              .get()
                              .then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                  console.log("Já tem notificação sua lá po");
                                } else {
                                  addNotify(
                                    doc.id,
                                    userUID,
                                    doc.data().UIDusuario,
                                    "like"
                                  );
                                }
                              });

                            var qntd = doc.data().likesQntd + 1;
                            var qntdvs = doc.data().deslikesQntd - 1;
                            document.getElementById(style).textContent = qntd;
                            document.getElementById(styleVs).textContent =
                              qntdvs;
                            console.log(doc.data());
                          });
                      } else {
                        doc.ref
                          .update({
                            likesQntd: doc.data().likesQntd - 1,
                            deslikesQntd: doc.data().deslikesQntd + 1,
                          })
                          .then(() => {
                            qntd = doc.data().deslikesQntd + 1;
                            qntdvs = doc.data().likesQntd - 1;
                            document.getElementById(style).textContent = qntd;
                            document.getElementById(styleVs).textContent =
                              qntdvs;
                            if (doc.data().UIDusuario != userUID) {
                              db.collection("usuarios")
                                .doc(doc.data().UIDusuario)
                                .get()
                                .then((userDoc) => {
                                  userDoc.ref
                                    .update({
                                      xp: userDoc.data().xp - 5,
                                    })
                                    .then(function () {
                                      console.log("XP Concedido papai");
                                    });
                                });
                            }
                          });
                      }
                    });
                    document.getElementById(styleVs).style.backgroundColor =
                      "white";
                  })
                  .catch((error) => {
                    console.error("Erro na atualização: ", error);
                  });
              });
            } else {
              console.log("Num deu reação ainda");
              const addReact = {
                userUID: userUID,
                react: num,
                timestamp: new Date(),
                postID: postID,
                categ: type,
              };

              console.log(postRef.get());
              postRef.get().then((doc) => {
                const content = doc.data();
                console.log(content);

                reactLocation
                  .add(addReact)
                  .then((docRef) => {
                    console.log("Documento foi adicionado: ", docRef);
                    if (num == 1) {
                      var qntd = doc.data().likesQntd;
                      doc.ref
                        .update({
                          likesQntd: qntd + 1,
                        })
                        .then(function () {
                          if (doc.data().UIDusuario != userUID) {
                            db.collection("usuarios")
                              .doc(doc.data().UIDusuario)
                              .get()
                              .then((userDoc) => {
                                console.log(userDoc.data());

                                db.collection("usuarios")
                                  .doc(doc.data().UIDusuario)
                                  .collection("notificações")
                                  .where("UID", "==", userUID)
                                  .where("commentID", "==", postID)
                                  .where("type", "==", "like")
                                  .get()
                                  .then((querySnapshot) => {
                                    if (!querySnapshot.empty) {
                                      console.log(
                                        "Já tem notificação sua lá po"
                                      );
                                    } else {
                                      addNotify(
                                        doc.id,
                                        userUID,
                                        doc.data().UIDusuario,
                                        "like"
                                      );
                                    }
                                  });

                                userDoc.ref
                                  .update({
                                    xp: userDoc.data().xp + 5,
                                  })
                                  .then(function () {
                                    console.log("XP Concedido papai");
                                  });
                              });
                          }
                        });
                    } else {
                      var qntd = doc.data().deslikesQntd;
                      doc.ref
                        .update({
                          deslikesQntd: qntd + 1,
                        })
                        .then(() => {});
                    }
                    document.getElementById(style).textContent = qntd + 1;
                  })
                  .catch((error) => {
                    console.error("Erro: ", error);
                  });
              });
            }
          });
      }
    });
}

function fav(post, userUID, type) {
  console.log(post, userUID);

  style = "fav" + post;
  const contadorVisual = document.getElementById(style).textContent;

  console.log(style);
  const addFav = {
    userUID: userUID,
    react: 3,
    timestamp: new Date(),
    postID: post,
    categ: type,
  };
  firebase
    .firestore()
    .collection("reacts")
    .where("userUID", "==", userUID)
    .where("react", "==", 3)
    .where("postID", "==", post)
    .get()
    .then(function (querySnapshot) {
      if (!querySnapshot.empty) {
        querySnapshot.forEach(function (doc) {
          firebase
            .firestore()
            .collection("reacts")
            .doc(doc.id)
            .delete()
            .then(() => {
              firebase
                .firestore()
                .collection("posts")
                .doc(post)
                .get()
                .then((doc) => {
                  const qntdFav = doc.data().favsQntd;
                  doc.ref
                    .update({
                      favsQntd: qntdFav - 1,
                    })
                    .then(() => {
                      if (doc.data().UIDusuario != userUID) {
                        firebase
                          .firestore()
                          .collection("usuarios")
                          .doc(doc.data().UIDusuario)
                          .get()
                          .then((userDoc) => {
                            userDoc.ref
                              .update({
                                xp: userDoc.data().xp - 10,
                              })
                              .then(function () {
                                console.log("XP Concedido papai");
                                document.getElementById(style).textContent =
                                  qntdFav - 1;
                                document.getElementById(
                                  style
                                ).style.backgroundColor = "white";
                              });
                          });
                      }
                    });
                });
            });
        });
      } else {
        firebase
          .firestore()
          .collection("reacts")
          .add(addFav)
          .then(() => {
            firebase
              .firestore()
              .collection("posts")
              .doc(post)
              .get()
              .then((doc) => {
                const qntdFav = doc.data().favsQntd;
                doc.ref
                  .update({
                    favsQntd: qntdFav + 1,
                  })
                  .then(() => {
                    if (doc.data().UIDusuario != userUID) {
                      firebase
                        .firestore()
                        .collection("usuarios")
                        .doc(doc.data().UIDusuario)
                        .get()
                        .then((userDoc) => {
                          userDoc.ref
                            .update({
                              xp: userDoc.data().xp + 10,
                            })
                            .then(function () {
                              firebase
                                .firestore()
                                .collection("usuarios")
                                .doc(doc.data().UIDusuario)
                                .collection("notificações")
                                .where("UID", "==", userUID)
                                .where("commentID", "==", post)
                                .where("type", "==", "fav")
                                .get()
                                .then((querySnapshot) => {
                                  if (!querySnapshot.empty) {
                                    console.log("Já tem notificação sua lá po");
                                  } else {
                                    addNotify(
                                      doc.id,
                                      userUID,
                                      doc.data().UIDusuario,
                                      "fav"
                                    );
                                  }
                                });
                              console.log("XP Concedido papai");
                              document.getElementById(style).textContent =
                                qntdFav + 1;
                              document.getElementById(
                                style
                              )
                            });
                        });
                    }
                  });
              });
          });
      }
    });
}

function logOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      alert("Você saiu!");
      window.location.replace("../index.html");
    });
}

function viewFavs() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var db = firebase.firestore();
      db.collection("reacts")
        .where("userUID", "==", user.uid)
        .where("react", "==", 3)
        .get()
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(function (doc) {
              console.log(doc.data().postID);
              db.collection("posts")
                .doc(doc.data().postID)
                .get()
                .then(function (doc) {
                  console.log(doc.data());

                  postData = doc.data();
                  postID = doc.id;
                  time = postData.timestamp;
                  tempo = formatTime(time);

                  if (postData.url != "") {
                    var imgCarregado = "style='display:flex'";
                  } else {
                    var imgCarregado = "style='display:none'";
                  }
                  publis.innerHTML += `
                  <div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
                  <div class="ballPerguntas p-3">
                  <img class="float-left w-12 h-12 rounded-full object-contain mr-2" src="${postData.fotoUser}" style="  background-color: grey;">${postData.nomeUser}  
                  <button class="float-right w-6" onclick="fav('${postID}', '${user.uid}')"><img src="../img/favorito.svg" alt=""> </button>
                  <div class="options">
                  <h4 class="py-3 text-purple-700 text-left">${postData.tipo}</h4>
                  </div>
                  <div class="flex justify-center py-2 h-1/4" ${imgCarregado}>
                  <img src="${postData.url}" class="w-full h-1/4 mb-3">
                </div>
                  <div class="balaoPergunta">
                  <p style=color:black></p>
                  <p class="text-black text-left mb-4"> ${postData.post} </p>
                </div>
                  </div>
                  <p class='text-black text-right mt-2'> ${tempo}</p> </div>
                `;
                });
            });
          }else{
            publis.innerHTML = "Você não tem favoritos"
          }
        });
      console.log("minha mae nao me ama");
    } else {
    }
  });
}

function pesquisa() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const termo = document.getElementById("termo").value.toLowerCase();
      if (termo !== "") {
        const db = firebase.firestore();
        let resultadosEncontrados = false; // Variável para verificar se algum resultado foi encontrado

        db.collection("posts")
          .where("categ", "==", "post")
          .orderBy("timestamp", "desc")
          .get()
          .then(function (querySnapshot) {
            if (!querySnapshot.empty) {
              publis.innerHTML = "";
              querySnapshot.forEach(function (doc) {
                const postData = doc.data();
                const contentPost = postData.post.toLowerCase();
                if (contentPost.includes(termo)) {
                  resultadosEncontrados = true;
                  var postID = doc.id;
                  time = postData.timestamp;
                  tempo = formatTime(time);
                  const userNome = postData.nomeUser;
                  const userUID = user.uid;
                  const tipoPost = postData.tipo;
                  const contPost = postData.post;
                  const likesQntd = postData.likesQntd;
                  const deslikesQntd = postData.deslikesQntd;
                  const favsQntd = postData.favsQntd;
                  const respsQntd = postData.respsQntd;
                  const redirect = "tela-comments.html";
                  const tag = postData.tag;
                  const img = postData.url;
                  const fotoUser = postData.fotoUser;
                  const UIDdonoPost = postData.UIDusuario;
                  publis.innerHTML += formatPost(
                    userNome,
                    userUID,
                    tipoPost,
                    contPost,
                    postID,
                    likesQntd,
                    deslikesQntd,
                    favsQntd,
                    respsQntd,
                    redirect,
                    tag,
                    img,
                    fotoUser,
                    UIDdonoPost
                  );
                  checkReact(user.uid, "post");
                }
              });

              if (!resultadosEncontrados) {
                publis.innerHTML = "Sem resultados para sua pesquisa!";
              }
            }
          });
      } else {
        location.reload();
      }
    }
  });
}

const toggleMenu = () => document.body.classList.toggle("open");

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const firestore = firebase.firestore();

// Lidar com o envio do formulário

const buttonimg = document.getElementById("post");
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const buttonimg = document.getElementById("post")
      ? document.getElementById("post")
      : null;
    const imageInputPubli = document.getElementById("loadImage");
    if (buttonimg) {
      buttonimg.addEventListener("click", async (e) => {
        e.preventDefault();

        const file = imageInputPubli.files[0];
        console.log(file);

        if (file) {
          data = new Date();
          arquivonome = "imgPost" + data;
          // Faça o upload da imagem para o Firebase Storage
          const storageRef = storage.ref().child(`img/${arquivonome}`);
          await storageRef.put(file);

          // Obtenha a URL de download da imagem
          const downloadURL = await storageRef.getDownloadURL();
          addPubli(downloadURL);
          // Armazene a URL no Firestore
          alert("Imagem enviada com sucesso!");
        } else {
          addPubli("");
        }
      });
    }
  } else {
    console.log("você não tá logado, dog");
  }
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var buttonimgPerfil = document.getElementById("post2")
    ? document.getElementById("post2")
    : null;
    if (buttonimgPerfil){
      var imageInput = document.getElementById("loadImagePerfil");
      var buttonApply = document.getElementById('apply')
  
      buttonimgPerfil.addEventListener("click", async (e) => {
        atualizar();
      })
  
  
        imageInput.addEventListener("input", async (e) => {
          e.preventDefault();
          const file = imageInput.files[0];
          const files = imageInput.value;
          buttonimgPerfil.style.display = 'none';
          buttonApply.style.display = 'block';
  
          if (files != null) {
            // Exiba a imagem no elemento de pré-visualização
            data = new Date();
            arquivonome = "imgPerfil" + data;
  
            const reader = new FileReader();
            reader.onload = function (e) {
              // Crie uma div para exibir a imagem para corte
              const imagePreview = document.getElementById("preview");
              imagePreview.style.display = "block";
              imagePreview.innerHTML = `<img id="cropperImage" src="${e.target.result}">`;
  
              // Inicialize o cropper
              const cropperImage = document.getElementById("cropperImage");
              const cropper = new Cropper(cropperImage, {
                aspectRatio: 1, // Pode ajustar para a proporção desejada (1 para quadrado)
                viewMode: 1, // Pode ajustar a visualização de acordo com suas necessidades
              });
  
              // Quando o usuário pressionar o botão de corte
              const imgPerfil = document.getElementById("imgPerfil");
              const closeButton = document.createElement("button");
              const cropButton = document.createElement("button");
              cropButton.className = "float-right";
              closeButton.className = "float-left";
              console.log(cropButton);
              closeButton.textContent = "Fechar";
              cropButton.textContent = "Crop";
  
              imagePreview.appendChild(cropButton);
              imagePreview.appendChild(closeButton);
  
              closeButton.addEventListener("click", async () => {
                buttonimgPerfil.style.display = "block"
                buttonApply.style.display = "none";
                imagePreview.style.display = "none";
                imageInput.value = null;
              });
  
              cropButton.addEventListener("click", async () => {
                // Obtenha a imagem recortada
                var croppedCanvas = cropper.getCroppedCanvas();
  
                // Converta o canvas em Blob
                croppedCanvas.toBlob(async (blob) => {
                  var url = URL.createObjectURL(blob);
  
                  imgPerfil.src = url;
  
                  imagePreview.style.display = "none";
  
                  buttonApply.addEventListener("click", async (e) => {
                    const storageRef = storage.ref().child(`img/${arquivonome}`);
                    await storageRef.put(blob);
  
                    var URL = await storageRef.getDownloadURL();
                    atualizar(URL);
                  });
                });
              });
            };
            reader.readAsDataURL(file);
          }else{
            atualizar("");
          }
          
        });
        
    }
    
    
  }
});

function nivel() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .firestore()
        .collection("usuarios")
        .doc(user.uid)
        .get()
        .then((doc) => {
          src = "../img/lvl" + doc.data().nivel + "Icon.svg";
          document.getElementById("fotoNivel").src = src;
          document.getElementById("nivelMae").textContent =
            "Nível: " + doc.data().nivel;
          const lvl = doc.data().nivel;
          const xp = doc.data().xp;
          if (lvl == 1) {
            var xpMulti = 20;
          } else if (lvl == 2) {
            var xpMulti = 10;
          } else if (lvl == 3) {
            var xpMulti = 8;
          } else if (lvl == 4) {
            var xpMulti = 5;
          } else if (lvl == 5) {
            var xpMulti = 6;
          }
          const conta = xp / 10;
          const xpBar = conta * xpMulti;
          console.log(conta)
          console.log(xp);
          console.log(xpBar);

          if (lvl == 5){
            document.getElementById("lvlBar").style.width = "205px";
          }else{
            document.getElementById("lvlBar").style.width = xpBar + "px"
          }
          
          
          checarNivel(lvl);
          if (xpBar >= 200) {
            if (lvl != 5) {
              xpGain = 0;
              doc.ref
                .update({
                  xp: xpGain,
                  nivel: doc.data().nivel + 1,
                })
                .then(function () {
                  window.location.reload();
                });
            } else {
              console.log("Você chegou no nível máximo!");
            }
          }
        });
    }
  });
}

function checarNivel(nivel) {
  firebase
    .firestore()
    .collection("nivel")
    .where("nvl", "==", nivel)
    .get()
    .then(function (querySnapshot) {
      if (!querySnapshot.empty) {
        querySnapshot.forEach(function (doc) {
          document.getElementById("tituloMae").textContent = doc.data().titulo;
          document.getElementById("descTitulo").textContent = doc.data().desc;
          doc.data();
          document.getElementById("lvlBar");
        });
      }
    });
}

function acessarPerfil(donoUID) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (donoUID == user.uid) {
      window.location.href = "tela-usuario.html";
    } else {
      window.location.href = "tela-usuarioOutro.html" + "?ID=" + donoUID;
    }
  });
}

function enterPublis() {
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  window.location.href = "tela-publisOutro.html" + "?ID=" + IDpostagem;
  //console.log(IDpostagem);
}

function voltarOutro() {
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  window.location.href = "tela-usuarioOutro.html" + "?ID=" + IDpostagem;
}

function viewPublisOutro() {
  var urlParams = new URLSearchParams(window.location.search);
  var uidOutro = urlParams.get("ID");

  // Consulta para recuperar o documento do usuário com base no UID
  const publis = document.getElementById("publis");
  const comments = document.getElementById("comments");
  firebase
    .firestore()
    .collection("posts")
    .where("UIDusuario", "==", uidOutro)
    .where("categ", "==", "post")
    .get()
    .then(function (querySnapshot) {
      if (!querySnapshot.empty) {
        querySnapshot.forEach(function (doc) {
          // O documento do usuário foi encontrado
          var userPosts = doc.data();

          if (userPosts.url) {
            var imgCarregado = "style='display:flex'";
          } else {
            var imgCarregado = "style='display:none'";
          }
          publis.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
        <div class="ballPerguntas p-3">
          <div class="options">
            <h4 class="py-2 text-purple-700">${userPosts.tipo}</h4>
          </div>
          <div class="balaoPergunta" onclick= "window.location.href = 'tela-comments.html' + '?ID=' + '${
            doc.id
          }';">
            <p class="text-black text-left py-2 mb-3"> ${userPosts.post} </p>
            <div class="flex justify-center py-2 h-1/4" ${imgCarregado}>
            <img src="${userPosts.url}" class="w-full h-1/4 mb-3">
            </div>
          </div>
          <div class="react flex flex-row gap-10 justify-around mb-2">
          
          <p style=color:black> ${doc.data().likesQntd}
          <img class="w-6" src="../img/like.svg" alt=""></p>

          <p style=color:black> ${doc.data().deslikesQntd}
          <img class="w-6" src="../img/dislike.svg" alt=""></p>

          <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../img/favorito.svg" alt=""></p>

          <p style=color:black> ${doc.data().respsQntd}
          <img class="w-6" src="../img/comentário.svg" alt=""></p>
          <button class="w-6"><img src="../img/três-pontos.svg" alt=""></button>
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

  firebase
    .firestore()
    .collection("posts")
    .orderBy("timestamp", "desc")
    .where("categ", "==", "resp")
    .where("UIDusuario", "==", uidOutro)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const postID = doc.data().IDresp;
        console.log(doc.data());
        firebase
          .firestore()
          .collection("posts")
          .doc(postID)
          .get()
          .then((docPost) => {
            let nome = docPost.data().nomeUser;

            comments.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
            <div class="ballPerguntas p-4">
            <p id=nome style="color:blue;" class="text-right"> Resposta à ${nome}  </p>
            <div class="balaoPergunta">
            <p style=color:black></p>
            <p onclick= "window.location.href = 'tela-comments.html' + '?ID=' + '${postID}'" class="text-black text-left mb-4"> ${
              doc.data().post
            } </p>
            </div>
            <div class="react flex flex-row gap-10 justify-around mb-2">
            <p style=color:black> ${doc.data().likesQntd}
            <img class="w-6" src="../img/like.svg" alt=""> </p>
            <p style=color:black> ${doc.data().deslikesQntd}
            <img class="w-6" src="../img/dislike.svg" alt=""> </p>
            <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../img/favorito.svg" alt=""></p>
            <button class="w-6"> <img src="../img/três-pontos.svg" alt=""></button>
            </div>
          </div>`;
          });
      });
    });
}

window.addEventListener("load", function () {
  var loaderContainer = document.getElementById("loader-container");
  loaderContainer.style.display = "none"; // Esconde o indicador de carregamento e o fundo escuro
});

function renderNots() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const contadorElement = document.querySelector(".contador");

      firebase
        .firestore()
        .collection("usuarios")
        .doc(user.uid)
        .collection("notificações")
        .get()
        .then((querySnapshot) => {
          cont = 0;
          if (!querySnapshot.empty) {
            //console.log(cont);
            const numeroNotificacoes = querySnapshot.size;
            contadorElement.style.display = "flex";
            contadorElement.textContent = numeroNotificacoes.toString();
          } else {
          }
        });
    }
  });
}

function showPostsInicio() {
  renderNots();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var db = firebase.firestore();
      const postsRef = db.collection("posts");
      //pedindo(user.uid)

      db.collection("usuarios")
        .doc(user.uid)
        .get()
        .then((doc) => {
          num = 0;

          var interesses = doc.data().interesses;

          var queries = interesses.map(function (interesse) {
            return postsRef
              .where("categ", "==", "post")
              .where("tag", "==", interesse)
              .get();
          });

          Promise.all(queries).then(function (querySnapshots) {
            var posts = [];
            querySnapshots.forEach(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                posts.push(doc.data());
              });
            });

            posts.sort(function (a, b) {
              return b.timestamp - a.timestamp;
            });
            var i = 0;

            posts.forEach(function (postData) {
              firebase
                .firestore()
                .collection("posts")
                .where("IDpost", "==", postData.IDpost)
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (dados) {
                    var postID = dados.id;

                    time = postData.timestamp;
                    tempo = formatTime(time);
                    const userNome = postData.nomeUser;
                    const userUID = user.uid;
                    const tipoPost = postData.tipo;
                    const contPost = postData.post;
                    const likesQntd = postData.likesQntd;
                    const deslikesQntd = postData.deslikesQntd;
                    const favsQntd = postData.favsQntd;
                    const respsQntd = postData.respsQntd;
                    const redirect = "tela-comments.html";
                    const tag = postData.tag;
                    const img = postData.url;
                    const fotoUser = postData.fotoUser;
                    const UIDdonoPost = postData.UIDusuario;
                    publis.innerHTML += formatPost(
                      userNome,
                      userUID,
                      tipoPost,
                      contPost,
                      postID,
                      likesQntd,
                      deslikesQntd,
                      favsQntd,
                      respsQntd,
                      redirect,
                      tag,
                      img,
                      fotoUser,
                      UIDdonoPost
                    );
                    checkReact(user.uid, "post");
                  });
                });
            });
          });
        });
    }
  });
}

// function pedindo(uid) {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('firebase-messaging-sw.js')
//       .then(function (registration) {
//         console.log('Service Worker registrado', registration);

//         // Solicite o token após o registro do Service Worker
//         return messaging.getToken({ vapidKey: 'BIlbsehKH2Cav8naDnpLA4w56OtvAkNuGRhMeVBYdlm7de1hFag0AX372G2eJTwl_9kc87KraOhYd1rDb1JpKW0' });
//       })
//       .then((currentToken) => {
//         if (currentToken) {
//           // Você obteve um token de notificação.
//           firebase.firestore()
//             .collection('usuarios')
//             .doc(uid)
//             .get()
//             .then((doc) => {
//               doc.ref.update({
//                 token: currentToken,
//               });
//             });

//           console.log("Token atual:", currentToken);
//         } else {
//           // Nenhum token disponível, solicite permissão ao usuário.
//           return messaging.requestPermission();
//         }
//       })
//       .then(() => {
//         console.log("Permissão concedida.");
//       })
//       .catch((err) => {
//         console.log("Erro ao solicitar permissão:", err);
//       });
//   }
// }

function formatNotify(
  time,
  UID,
  commentID,
  type,
  foto,
  nome,
  postType,
  postText
) {
  tempoF = formatTime(time);
  tempo = tempoF.replace(/^postado\s+/i, "");
  console.log(tempo, UID, commentID, type);

  const tipo =type.split(" ");
  if (type == "del" ){
    console.log("deletaod")
  }
  

  if (tipo.length > 1){
    if(tipo[1] == 1){
      var infracao = "Assédio";
    }else if(tipo[1] == 2){
      var infracao = "Conteúdo ofensivo"
    }else if(tipo[1] == 3){
      var infracao = "Spam"
    }else if(tipo[1] == 4){
      var infracao = "Comportamento Inadequado"
    }
    var content = `<div class="notis border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
    <p onclick="excluirNotify('${commentID}', '${UID}', '${type}')" class="text-right text-red-500 text-xl pr-5">X</p>
    <div class="flex flex-row p-3" onclick=" window.location.href='tela-analise.html' + '?ID=' + '${commentID}'">
    <img class="self-center w-12 h-12 mr-2" src="../img/notifyReport.svg">
    <p class="text-left self-center text-black"> ${nome} denunciou uma postagem por ${infracao} </p>
    
    </div>
    <p class="text-right self-center text-black"> ${tempo} </p> 
    
    </div>`


  }else{
      if (postType == "post") {
        categ = " sua postagem:";
      } else {
        categ = " seu comentário:";
      }
    
      if (type == "like") {
        texto = " curtiu ";
      } else if (type == "fav") {
        texto = " favoritou ";
      } else if (type == "com") {
        texto = " comentou ";
      }
      var content = `
      <div class="notis border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
      <p onclick="excluirNotify('${commentID}', '${UID}', '${type}')" class="text-right text-red-500 text-xl pr-5">X</p>
      <div class="flex flex-row p-3" onclick=" window.location.href='tela-comments.html' + '?ID=' + '${commentID}'">
      <img class="self-center w-12 h-12 rounded-full mr-2" src="${foto}" style="  background-color: grey;">
      <p class="text-left self-center text-black"> ${nome} ${texto} ${categ}<br> ${postText}</p>
      
      </div>
      <p class="text-right self-center text-black"> ${tempo} </p> 
      
      </div>`;
  }

  
  

  
  
  return content;
}

function notis() {
  renderNots();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const notis = document.getElementById("notis");

      firebase.firestore().collection("usuarios")
      .doc(user.uid).collection("notificações")
      .get().then((queryNotify) => {
        console.log(queryNotify.size)
        if (queryNotify.size == 0){
          notis.innerHTML = "SEM NOTIFICAÇÕES"
        }
      })

      firebase
        .firestore()
        .collection("usuarios")
        .doc(user.uid)
        .collection("notificações")
        .where("type", "!=", "del")
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              console.log(doc.data());
              firebase
                .firestore()
                .collection("usuarios")
                .doc(doc.data().UID)
                .get()
                .then((userDoc) => {
                  firebase
                    .firestore()
                    .collection("posts")
                    .doc(doc.data().commentID)
                    .get()
                    .then((postDoc) => {
                      console.log(userDoc.data());
                      const tempo = doc.data().timestamp;
                      const UID = doc.data().UID;
                      const commentID = doc.data().commentID;
                      const tipo = doc.data().type;
                      const foto = userDoc.data().url;
                      const nome = userDoc.data().nome;
                      const tipoPost = postDoc.data().categ;
                      const textoPost = postDoc.data().post;

                      notis.innerHTML += formatNotify(
                        tempo,
                        UID,
                        commentID,
                        tipo,
                        foto,
                        nome,
                        tipoPost,
                        textoPost
                      );
                    });
                });
            });
          } else {
          }
        });

      firebase.firestore()
      .collection('usuarios')
      .doc(user.uid)
      .collection("notificações")
      .where("type", "==", "del")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const tempoF = formatTime(doc.data().timestamp);
            const tempo = tempoF.replace(/^postado\s+/i, "");
            
            console.log(doc.data())
            notis.innerHTML += `<div class="notis border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
            <p onclick="excluirNotifyDel('${doc.data().commentID}', '${doc.data().motivo}', '${doc.data().type}')" class="text-right text-red-500 text-xl pr-5">X</p>
            <div class="flex flex-row">
            <img class="self-center w-12 h-12 mr-2" src="../img/notifyReport.svg">
            <p class="text-left self-center text-black"> Sua postagem foi excluída após ser denunciada por ${doc.data().motivo} </p>
            </div>
            <p class="text-right self-center text-black"> ${tempo} </p> 

            </div>`
          })
        }
      }) 
    }
  });
}

function excluirNotifyDel(commentID, motivo, type){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
  firebase.firestore().collection("usuarios")
  .doc(user.uid).collection("notificações")
  .where("commentID", "==", commentID)
  .where("motivo", "==", motivo)
  .where("type", "==", type)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      doc.ref.delete().then(() => {
        window.location.reload();
      })
    })
  })
  console.log(commentID, motivo, type)
}})
}


function excluirNotify(commentID, UID, tipo) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .firestore()
        .collection("usuarios")
        .doc(user.uid)
        .collection("notificações")
        .where("commentID", "==", commentID)
        .where("UID", "==", UID)
        .where("type", "==", tipo)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
              window.location.reload();
            });
          });
        });
    }
  });
}

function getUserEmail() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var email = user.email;
      document.getElementById("email-user").innerText = email;
    } else {
      console.log("No user is signed in.");
    }
  });
}

function report(uid, userID){
  firebase.firestore()
  .collection("usuarios")
  .doc(userID)
  .get()
  .then((doc) =>{
    if (doc.data().adm == true){
      window.location.href = 'tela-analise.html' + '?ID=' + uid;
    }else{
      window.location.href = 'tela-denuncia.html' + '?ID=' + uid;
    }

  })
}

function analise(){
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  const postLocation = firebase.firestore().collection("posts").doc(IDpostagem);
  postLocation.get().then((doc) => {
    const tempo =formatTime(doc.data().timestamp)
    const content =document.getElementById('content');
    content.innerHTML = `<div class="max-w-md bg-white rounded-lg overflow-hidden shadow-lg p-6">
    <div class="flex items-center mb-4">
      <img src="${doc.data().fotoUser}" alt="Foto de Perfil" class="bg-black w-12 h-12 rounded-full mr-4">

      <h2 class="text-lg font-semibold">${doc.data().nomeUser}</h2>
    </div>

    <p class="text-gray-500 text-sm mb-4 ">${tempo}</p>

    <p class="text-gray-700 mb-6">${doc.data().post}</p>
    <img src="${doc.data().url}" class="mb-4">
  </div>
   
  <div class="max-w-md bg-white rounded-lg overflow-hidden shadow-lg p-6 mt-4">
  <!-- Motivo de exclusão -->
  <label for="motivo" class="block text-gray-700 text-sm font-bold mb-2">Motivo de exclusão</label>
  <select id="motivo" name="motivo" class="w-full border rounded p-2 mb-4">
    <option value="Assédio">Assédio</option>
    <option value="Conteúdo ofensivo">Conteúdo ofensivo</option>
    <option value="Spam">Spam</option>
    <option value="Comportamento Inadequado">Comportamento Inadequado</option>
    <!-- Adicione mais opções, se necessário -->
  </select>

  <!-- Botões de Excluir e Manter -->
    <button onclick="deletarADM('${IDpostagem}', '${doc.data().UIDusuario}')" class="bg-red-500 hover:bg-red-600 float-right text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Excluir</button>
</div>

  <!-- Fora do bloco de motivo de exclusão -->
  <div class="max-w-md bg-white rounded-lg p-6 mt-4 flex justify-center">
    <button onclick= "window.location.href = 'tela-analiseUser.html' + '?ID=' + '${doc.data().UIDusuario}'" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">Analisar Usuário</button>
  </div>
  `
    console.log(doc.data())

  })
  
}

function analiseUser(){
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");

  firebase.firestore().collection("usuarios").doc(IDpostagem)
  .get().then((doc) => {
    const hoje = new Date().toISOString().split('T')[0];
    console.log(hoje)
    const dataEntrada = doc.data().dataEntrada;
    const data = new Date(dataEntrada.seconds * 1000);
    const dia = data.getDate().toString().padStart(2, '0'); // Dia com zero à esquerda se necessário
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Mês com zero à esquerda se necessário
    const ano = data.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const entrada = data;
    const content = document.getElementById("content")
    const dataNasc = doc.data().dataNascimento.split('-');
      const dataReformada = `${dataNasc[2]}/${dataNasc[1]}/${dataNasc[0]}`
    if (!doc.data().bio){
     var bio = "nenhuma biografia"
    }else{
     var bio = doc.data().biografia;
    }
    
    
    
    content.innerHTML = `<div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-center">
      <img src="${doc.data().url}" alt="Foto de perfil" class="w-32 h-32 rounded-full">
    </div>
    <div class="text-center mt-4">
      <h2 class="text-xl font-semibold">${doc.data().nome}</h2>
      <p class="text-gray-600 text-sm">Nível: ${doc.data().nivel} | XP:  ${doc.data().xp}</p>
      <p class="text-gray-600 text-sm">Data de Entrada: ${dataFormatada}</p>
      <p class="text-gray-600 text-sm">Data de Nascimento: ${dataReformada}</p>
      <p class="text-gray-600 text-sm">Biografia: ${bio}</p>
      </div>
  </div>

  <div class="space-x-4 mt-8">
  <input id="xp" type="number" class=" w-1/2 border border-gray-300 rounded-md px-3 py-2 " placeholder="Escolha um número" min='0' max="${doc.data().xp}">
  <button onclick=removexp('${doc.id}') class="bg-red-500 float-right hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Revogar XP</button>
</div>

<div class="space-x-4 mt-8">
  <input type="date" id='intervalo' class="border border-gray-300 rounded-md px-3 py-2" placeholder="Escolha uma data" min="${hoje}">
  <button onclick=interacaoOff('${doc.id}') class="bg-blue-500 float-right hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Impedir Interação</button>
</div>

<div id="block" class="flex justify-center mt-10">
</div>
  `
  const block = document.getElementById('block');
  if (doc.data().access == true){
    block.innerHTML = `<button  onclick=blockAcess('${doc.id}') class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Bloquear Acesso</button>`
       
  }else{
    block.innerHTML = `<button id="block" onclick=blockAcess('${doc.id}') class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Desbloquear Acesso</button>`;
  }
  })
  
}

function removexp(uid){
  const valor = document.getElementById('xp').value
  if (valor != 0){
    firebase.firestore().collection("usuarios")
    .doc(uid).get().then((doc) => {

      if (valor < doc.data().xp){
        doc.ref.update({
          xp: doc.data().xp - valor
        }).then(() =>{
          window.location.reload();
          alert('XP revogado com sucesso')
        })
      }else{
        alert("Não é possível abaixar tanto XP assim")
      }
      
    })
  }
  console.log(valor)
}

function interacaoOff(uid){
  const data = document.getElementById('intervalo').value
  const Fdata = new Date(data);
  const timestamp = Fdata.getTime();
  console.log(data);

  firebase.firestore().collection("usuarios").doc(uid)
  .get().then((doc) => {
    doc.ref.update({
      reclusao: data
    })
  })
}

function blockAcess(uid){
  firebase.firestore().collection('usuarios').doc(uid)
  .get().then((doc) =>{
    const block = document.getElementById('block');
    if (doc.data().access == true){
      doc.ref.update({
        access: false
      }).then(() => {
        block.innerHTML = `<button id="block" onclick=blockAcess('${doc.id}') class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Desbloquear Acesso</button>`;
      })
    }else{
      doc.ref.update({
        access: true
      }).then(() => {
        block.innerHTML = `<button  onclick=blockAcess('${doc.id}') class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Bloquear Acesso</button>`
      })
    }
    
  })
}

function deletarADM(IDpost, uidUser){
  firebase.auth().onAuthStateChanged(function (user) {

    if(user){
  const popup = document.getElementById("popup");

  popup.style.display = 'block'

  const decisionY = document.getElementById("sim");
  const decisionN = document.getElementById("nao");

  decisionN.addEventListener("click", () => {
    popup.style.display = 'none';
  })

  decisionY.addEventListener("click", () => {
    const motivo = document.getElementById("motivo").value;

    addNotify(IDpost, motivo, uidUser, "del");
    excluirPost(IDpost);
    
    firebase.firestore().collection("usuarios")
    .doc(user.uid).collection("notificações")
    .where("commentID", "==", IDpost)
    .where("UID", "==", uidUser)
    .get()
    .then((querySnapshot) =>{
      if(!querySnapshot.empty){
        querySnapshot.forEach((doc) => {
          doc.ref.delete().then(() => {
            window.location.replace('tela-inicio.html');
          });
        });
      }else{
        window.location.replace('tela-inicio.html');
      }
      
    })
    
  })
}})
}

function manterADM(){
  const popup = document.getElementById("popup");
}

function discover(){

  const tags = ['Amamentação', 'Gestação', 'Filhos', 'Medicação', 'Cuidados', 'Planejamento', 'Saúde', 'Promoções'];
  const postRef = firebase.firestore().collection('posts').where('categ', '==', 'post');
  const tagPromises = tags.map(tag => postRef.where('tag', '==', tag).get());
  Promise.all(tagPromises)
  .then((snapshots) => {
    const tagSizes = snapshots.map((snapshot, index) => ({ tag: tags[index], size: snapshot.size }));
    
    const sortSize = tagSizes.sort((a, b) => b.size -a.size);
    const quatroPrimeiras = sortSize.slice(0,4);
    const teste = quatroPrimeiras.map( item => item.tag);
    const interesses = document.getElementById('interesses');

    teste.forEach(texto => {
      interesses.innerHTML += `<div style='width:8rem; height:3rem' class='bg-white rounded-xl text-center' onclick="sortBy('${texto}')"> ${texto}</div>`;
    });
    console.log(teste)
  })
  .catch((error) => {
    console.error('Erro ao contar documentos:', error);
  });
}


function logado(){
  firebase.auth().onAuthStateChanged(function (user) {

    if(user){
      console.log(user.uid)
      window.location.replace('./pages/tela-inicio.html');
    }else{
      console.log("realmente, vc tá fora")
    }
  })
}
 
function sendReport(num){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
  
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  console.log(IDpostagem, num);

  firebase.firestore().collection("usuarios").where("adm", "==", true)
  .get().then(function (querySnapshot){
      querySnapshot.forEach(function (doc){
        firebase.firestore().collection("usuarios").doc(doc.data().uid).collection("notificações")
        .get().then(() => {
          addNotify(
            IDpostagem,
            user.uid,
            doc.data().uid,
            "den "+ num,
          )
        })
      })
    
  })

}})
}

function addNotify(commentID, userUID, uid, tipo) {
  const db = firebase.firestore();
  const userRef = db.collection("usuarios").doc(uid);
  const notifyRef = userRef.collection("notificações");
  if (userUID.length < 20){
    const dados = {
      commentID: commentID,
      motivo: userUID,
      timestamp: new Date(),
      type: tipo,
    };
    notifyRef.add(dados)
  }else{
    const dados = {
      commentID: commentID,
      UID: userUID,
      timestamp: new Date(),
      type: tipo,
    };
    notifyRef.add(dados).then(() =>{
      alert('Denuncia enviada com sucesso!')
            window.location.replace('tela-inicio.html');
    });
  }
  
  console.log(commentID, userUID, uid, tipo)


  
}