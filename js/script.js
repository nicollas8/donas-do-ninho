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
  "";
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
          var tipo =formData.tipoMom
  
          if (tipo == "Mãe"){
            var nivel = 1;
          }else if(tipo == "Gestante"){
            var nivel = 6
          }else if(tipo == "Não sou mãe"){
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
              nivel: nivel,
              url: "../assets/noPhoto.png"
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

function previewFilePerfil() {

  const previewPerfil = document.getElementById("imgPerfil");
  const filePerfil = document.getElementById("loadImagePerfil").files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    previewPerfil.src = reader.result; 
  }, 
    false
  ); 
    if (filePerfil) {
    previewPerfil.style.display = "block"
    reader.readAsDataURL(filePerfil)
  }
}

function previewFile() {
  
  const preview = document.getElementById("fotoPubli");
  const file = document.getElementById("loadImage").files[0];
  const reader = new FileReader();
  
  reader.addEventListener("load",() => {
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
              console.log("dados", userPosts);
              publis.innerHTML += `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
        <div class="ballPerguntas p-3">
          <div class="options">
            <h4 class="py-2 text-purple-700">${userPosts.tipo}</h4>
          </div>
          <div class="balaoPergunta" onclick= "window.location.href = 'tela-comments.html' + '?ID=' + '${
            doc.id
          }';">
            <p class="text-black text-left py-2 mb-3"> ${userPosts.post} </p>
          </div>
          <div class="react flex flex-row gap-10 justify-around mb-2">
          
          <p style=color:black> ${doc.data().likesQntd}
          <img class="w-6" src="../assets/like.svg" alt=""></p>

          <p style=color:black> ${doc.data().deslikesQntd}
          <img class="w-6" src="../assets/dislike.svg" alt=""></p>

          <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../assets/favorito.svg" alt=""></p>

          <p style=color:black> ${doc.data().respsQntd}
          <img class="w-6" src="../assets/comentário.svg" alt=""></p>
          <button class="w-6" onclick="confirmarExclusao('${
            doc.id
          }', '1')"><img src="../assets/lixeira.png" alt=""></button>
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
            <img class="w-6" src="../assets/like.svg" alt=""> </p>
            <p style=color:black> ${doc.data().deslikesQntd}
            <img class="w-6" src="../assets/dislike.svg" alt=""> </p>
            <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../assets/favorito.svg" alt=""></p>
            <button class="w-6" onclick="confirmarExclusao('${
              doc.id
            }', 2)"><img src="../assets/lixeira.png" alt=""></button>
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
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var urlParams = new URLSearchParams(window.location.search);
      var IDpostagem = urlParams.get("ID");
      
      if (IDpostagem){
        var uid = IDpostagem
        
      }else{
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

              document.getElementById("nome-user").textContent = userData.nome;
              document.getElementById("data-user").textContent =
                userData.dataNascimento;
              document.getElementById("tipo-user").textContent =
                userData.tipoMom;
              document.getElementById("bio-user").textContent =
                userData.biografia;
                if (userData.url){
                  var foto = userData.url
                }else{
                  var foto = "../assets/perfil-usuário.png"
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

function showPostsUser(user){
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  const posts = document.getElementById("posts");

  firebase.firestore()
  .collection("posts")
  .where("UIDusuario", "==", IDpostagem)
  .get().then(function (querySnapshot){
    if(!querySnapshot.empty){
      querySnapshot.forEach(function (postDoc){
        
        
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
            posts.innerHTML += 
            `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
            <div class="ballPerguntas p-3">
              <h4 class=" text-purple-700 self-center text-rig">${tipoPost}</h4>
            </div>
            <div class="options">
            </div>
            <div class="balaoPergunt a">
            <p style=color:black></p>
            <p class="text-black text-left mb-4 py-2"> ${contPost} </p>
            <div class="flex justify-center py-2 h-1/4" >
              <img src="${img}" class="w-full h-1/4 mb-3">
            </div>
                </div>
                  <div class=" react flex flex-row gap-14 justify-evenly pl-3 py-3 mt-2 mb-2 w-full">
                    <button class="w-6 flex flex-row-reverse" onclick="react('1', '${postID}', 'post')"> <p class="ml-2" id="like${postID}" style=color:black;>${likesQntd} </p> <img src="../assets/like.svg" alt=""></button>
                    <button class="w-6 flex flex-row-reverse" onclick="react('2', '${postID}', 'post')"><p class="ml-2" id="deslike${postID}" style=color:black;> ${deslikesQntd} </p><img src="../assets/dislike.svg" alt=""></button>
                    <button class="w-6 flex flex-row-reverse" onclick="fav('${postID}', '${userUID}', 'post')"><p class="ml-2" id="fav${postID}" style=color:black;> ${favsQntd} </p><img src="../assets/favorito.svg" alt=""> </button>
                    <button class="w-6 flex flex-row-reverse" onclick= "window.location.href = '${redirect}' + '?ID=' + '${postID}';"> <p class="ml-2 text-black" id="comment">${respsQntd}</p><img src="../assets/comentário.svg" alt=""> </button>
                    <button class="w-6 flex flex-row-reverse"><img src="../assets/três-pontos.svg" alt=""></button>
                  </div>
                <div class="flex justify-between">
                <p class="text-left mb-2 text-green-700" onclick="sortBy('${tag}')"> ${tag}</p>
                <p class="text-black text-left mb-2 self-center"> ${tempo}</p>
                </div>
              </div>`
      })
    }
  })
}

function atualizar(URL) {
  var nome = document.getElementById("nameNew").value;
  var biografia = document.getElementById("biografia").value;

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
              if(!querySnapshot.empty){
                querySnapshot.forEach(function (doc) {
                  console.log(doc.data().post);
                  doc.ref
                    .update(updateDataPosts)
                    .then(function () {
                      alert("Dados Atualizados com Sucesso!");
                      window.location.replace("tela-usuario.html");
                    });
                });
              }else{
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
  var resposta = confirm("Tem certeza de que deseja excluir?");
  console.log(resposta);
  if (resposta === true) {
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
  } else {
    console.log("joia");
  }
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

function addPubli(url) {
  if (document.getElementById("publi").value == "") {
    alert("Por favor, digite algo para enviar!");
  } else if (document.getElementById("tipo").value == "") {
    alert("Por favor, selecione um tipo de publicação!");
  } else if (document.getElementById("tag").value == "") {
    alert("Por favor, selecione uma tag!");
  } else {
    const button = document.getElementById("post");
    button.disabled = true;
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
                  alert("Publicação adicionada com sucesso!");
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
                fotoUser: userData.url
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
                        console.error("Erro ao adicionar resposta: ", error);
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
  donoUID
) {
  if (img) {
    var imgCarregado = "style='display:flex'";
  } else {
    var imgCarregado = "style='display:none'";
  }

  var post = `<div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
  <div class="ballPerguntas p-3">
  <div class="cardTittle flex flex-row justify-between">
  <div class="flex flex-row justify-between" onclick="acessarPerfil('${donoUID}')">
   <img class="self-center w-12 h-12 rounded-full mr-2" src="${fotoUser}" style="  background-color: grey;">
   <p id=nome class="text-left self-center text-blue-800"> ${userNome}</p>
  </div>
   
    
    <h4 class=" text-purple-700 self-center">${tipoPost}</h4>
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
        <div class=" react flex flex-row gap-14 justify-evenly pl-3 py-3 mt-2 mb-2 w-full">
          <button class="w-6 flex flex-row-reverse" onclick="react('1', '${postID}', 'post')"> <p class="ml-2" id="like${postID}" style=color:black;>${likesQntd} </p> <img src="../assets/like.svg" alt=""></button>
          <button class="w-6 flex flex-row-reverse" onclick="react('2', '${postID}', 'post')"><p class="ml-2" id="deslike${postID}" style=color:black;> ${deslikesQntd} </p><img src="../assets/dislike.svg" alt=""></button>
          <button class="w-6 flex flex-row-reverse" onclick="fav('${postID}', '${userUID}', 'post')"><p class="ml-2" id="fav${postID}" style=color:black;> ${favsQntd} </p><img src="../assets/favorito.svg" alt=""> </button>
          <button class="w-6 flex flex-row-reverse" onclick= "window.location.href = '${redirect}' + '?ID=' + '${postID}';"> <p class="ml-2 text-black" id="comment">${respsQntd}</p><img src="../assets/comentário.svg" alt=""> </button>
          <button class="w-6 flex flex-row-reverse"><img src="../assets/três-pontos.svg" alt=""></button>
        </div>
      <div class="flex justify-between">
      <p class="text-left mb-2 text-green-700" onclick="sortBy('${tag}')"> ${tag}</p>
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

function showPosts() {
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
            const fotoUser = postData.fotoUser
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
              console.error(
                "Elemento não encontrado com o ID 'like" +
                  reactDoc.data().postID +
                  "'"
              );
            }
          } else if (reactDoc.data().react == 2) {
            const elemento = document.getElementById(
              "deslike" + reactDoc.data().postID
            );
            if (elemento) {
              elemento.style.backgroundColor = "red";
            } else {
              console.error(
                "Elemento não encontrado com o ID 'deslike" +
                  reactDoc.data().postID
              );
            }
          } else if (reactDoc.data().react == 3) {
            const elemento = document.getElementById(
              "fav" + reactDoc.data().postID
            );
            if (elemento) {
              elemento.style.backgroundColor = "yellow";
            } else {
              console.error(
                "Elemento não encontrado com o ID 'fav" +
                  reactDoc.data().postID +
                  "'"
              );
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
            const fotoUser = postData.fotoUser

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
              fotoUser
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
              <button class="w-6" onclick="react('1', '${doc.id}', 'resp')"> <p id="like${doc.id}" style=color:black;>${respData.likesQntd} </p> <img src="../assets/like.svg" alt=""></button>
              <button class="w-6" onclick="react('2', '${doc.id}', 'resp')"><p id="deslike${doc.id}" style=color:black;> ${respData.deslikesQntd} </p><img src="../assets/dislike.svg" alt=""></button>
              <button class="w-6" onclick="fav('${doc.id}', '${user.uid}', 'resp')"><p id="fav${doc.id}" style=color:black;> ${respData.favsQntd} </p><img src="../assets/favorito.svg" alt=""> </button>
              <button class="w-6"><img src="../assets/três-pontos.svg" alt=""></button>
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
  console.log(commentID)

  db.collection("posts")
    .doc(commentID)
    .get()
    .then((doc) => {
        console.log(doc.data)
        const postRef = doc.data().IDresp;
        doc.ref.delete().then(function () {
                db.collection("posts")
                .doc(postRef).get()
                .then((Postdoc) =>{
                  Postdoc.ref.update({
                    respsQntd: Postdoc.data().respsQntd - 1,
                  }).then(function () {
                    db.collection("reacts")
                    .where("postID", "==", commentID)
                    .get()
                    .then(function (querySnapshot){
                      contagem = querySnapshot.size
                      if (!querySnapshot.empty){
                        querySnapshot.forEach(function (Reactdoc){
                          Reactdoc.ref.delete();
                          contagem--
                        })
                      }else{
                        alert("Publicação Excluída com sucesso!");
                        window.location.reload();
                      }
                    })
                  })
                })
              
            
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
            contagem = reactSnapshot.size 
            if (!reactSnapshot.empty) {
              reactSnapshot.forEach(function (doc) {
                doc.ref.delete();
                console.log("Reações encontradas:", reactSnapshot.size);
                 contagem--
              });
            } else {
              alert("Publicação Excluída com sucesso!");
              window.location.reload();
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
    colorInd = "lightgreen";
    style = "like" + postID;
    styleVs = "deslike" + postID;
  } else {
    colorInd = "red";
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
                  doc.ref.update({
                    likesQntd: doc.data().likesQntd - 1,
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
                          });
                      }
                    });
                    document.getElementById(style).style.backgroundColor =
                      colorInd;
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
                      doc.ref.update({
                        likesQntd: qntd + 1,
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
                    document.getElementById(style).style.backgroundColor =
                      colorInd;
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
                      document.getElementById(style).textContent = qntdFav - 1;
                      document.getElementById(style).style.backgroundColor =
                        "white";
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
                    document.getElementById(style).textContent = qntdFav + 1;
                    document.getElementById(style).style.backgroundColor =
                      "yellow";
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
      window.location.replace("tela-login.html");
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
                  publis.innerHTML += `
                  <div class="publi border-b-2 border-[#ffa9a9] bg-white rounded-b-lg">
                  <div class="ballPerguntas p-3">
                  ${postData.nomeUser}  <button class="float-right w-6" onclick="fav('${postID}', '${user.uid}')"><img src="../assets/favorito.svg" alt=""> </button>
                  <div class="options">
                  <h4 class="py-3 text-purple-700 text-left">${postData.tipo}</h4>
                  </div>
                  <div class="balaoPergunta">
                  <p style=color:black></p>
                  <p class="text-black text-left mb-4"> ${postData.post} </p>
                  </div>
                  <p class='text-black text-right mt-2'> ${tempo}</p> </div>
                `;
                });
            });
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
                    redirect
                  );
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
      // Faça o upload da imagem para o Firebase Storage
      const storageRef = storage.ref().child(`img/${file.name}`);
      await storageRef.put(file);

      // Obtenha a URL de download da imagem
      const downloadURL = await storageRef.getDownloadURL();
      addPubli(downloadURL);
      // Armazene a URL no Firestore
      alert("Imagem enviada com sucesso!");
    } else {
      addPubli("")
    }
  });
}

const buttonimgPerfil = document.getElementById("post2")
  ? document.getElementById("post2")
  : null;
const imageInput = document.getElementById("loadImagePerfil");

if (buttonimgPerfil) {
  buttonimgPerfil.addEventListener("click", async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    console.log(file);

    if (file) {
      // Faça o upload da imagem para o Firebase Storage
      const storageRef = storage.ref().child(`img/${file.name}`);
      await storageRef.put(file);

      // Obtenha a URL de download da imagem
      const URL = await storageRef.getDownloadURL();
        atualizar(URL);

        
      }else{
        atualizar();
      }
  });
}

function nivel(){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      firebase.firestore()
      .collection("usuarios")
      .doc(user.uid)
      .get()
      .then((doc) => {
        src = "../assets/lvl"+ doc.data().nivel +"Icon.svg"
        document.getElementById("fotoNivel").src = src;
        document.getElementById("nivelMae").textContent = "Nível: "+ doc.data().nivel
        const lvl = doc.data().nivel
        const xp = doc.data().xp;
        if (lvl == 1){
          var xpMulti = 20;
        }else if(lvl == 2){
          var xpMulti = 10;
        }else if(lvl == 3){
          var xpMulti = 8;
        }else if(lvl == 4){
          var xpMulti = 5;
        }else if(lvl == 5){
          var xpMulti = 4;
        }
        const xpBar = xp*xpMulti
        console.log(xpBar)
        
        document.getElementById("lvlBar").style.width = xpBar +"px"
        
        checarNivel(lvl);
        if (document.getElementById("lvlBar").style.width >= "200px"){
          if (lvl != 5){
            doc.ref.update({
              xp: 0,
              nivel: doc.data().nivel+1,
            }).then(function (){
              window.location.reload();
            })
          }else{
            console.log("Você chegou no nível máximo!")
          }
          
        }
        
        
      }
      )
      
    
    }
  })
  }

  function checarNivel(nivel){
    firebase.firestore()
    .collection("nivel")
    .where("nvl", "==", nivel)
    .get()
    .then(function (querySnapshot){
      if(!querySnapshot.empty){
        querySnapshot.forEach(function (doc) {
          document.getElementById("tituloMae").textContent = doc.data().titulo
          document.getElementById("descTitulo").textContent = doc.data().desc
          doc.data()
          document.getElementById("lvlBar")
        })
      }
    })
  }

  function acessarPerfil(donoUID){
    firebase.auth().onAuthStateChanged(function (user) {
      if (donoUID == user.uid){
        window.location.href='tela-usuario.html';
      }else{
        window.location.href='tela-usuarioOutro.html' + '?ID=' + donoUID
      }
    })
    
  }
  
function enterPublis(){
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  window.location.href='tela-publisOutro.html' + '?ID=' + IDpostagem
  console.log(IDpostagem)
}

function voltarOutro(){
  var urlParams = new URLSearchParams(window.location.search);
  var IDpostagem = urlParams.get("ID");
  window.location.href='tela-usuarioOutro.html' + '?ID=' + IDpostagem
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
          <img class="w-6" src="../assets/like.svg" alt=""></p>

          <p style=color:black> ${doc.data().deslikesQntd}
          <img class="w-6" src="../assets/dislike.svg" alt=""></p>

          <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../assets/favorito.svg" alt=""></p>

          <p style=color:black> ${doc.data().respsQntd}
          <img class="w-6" src="../assets/comentário.svg" alt=""></p>
          <button class="w-6"><img src="../assets/três-pontos.svg" alt=""></button>
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
            <img class="w-6" src="../assets/like.svg" alt=""> </p>
            <p style=color:black> ${doc.data().deslikesQntd}
            <img class="w-6" src="../assets/dislike.svg" alt=""> </p>
            <p style=color:black> ${doc.data().favsQntd}
          <img class="w-6" src="../assets/favorito.svg" alt=""></p>
            <button class="w-6"> <img src="../assets/três-pontos.svg" alt=""></button>
            </div>
          </div>`;
              });
          });
        });
}

function addInter(){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase.firestore()
      .collection("usuarios")
      .doc(user.uid)
      .get()
      .then((doc) =>{
        doc.data().interesses.forEach(function (interesse){
          document.getElementById(interesse).style.backgroundColor = "blue"
        })
        
        document.getElementById("imgPerfil").src = doc.data().url
      })
    }
  })

}

var interesses = [];

function toggleInterest(interestNumber) {
            var button = document.getElementById(interestNumber);
            var index = interesses.indexOf(interestNumber);

            if (button.style.backgroundColor == "blue"){
              button.style.backgroundColor = "";
              interesses.splice(index, 1);
              button.style.backgroundColor = "";
            }else{
              if (index !== -1) {
                interesses.splice(index, 1);
                button.style.backgroundColor = "";
            } else {
                interesses.push(interestNumber);
                button.style.backgroundColor = "blue";
            }
            }
            console.log(interesses)
           
}

function sendInterest(){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase.firestore()
      .collection("usuarios")
      .doc(user.uid)
      .get()
      .then((doc) =>{
        doc.ref.update({
          interesses: interesses,
        }).then(function(){
          alert("Interesses Atualizados com sucesso!");
          window.location.href="tela-usuario.html";
        })
        console.log(doc.data().interesses[2])
      })
    }
  })

}

function showPostsInicio(){
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var db = firebase.firestore();
      const postsRef = db.collection("posts");
      db.collection("usuarios").doc(user.uid)
      .get().then((doc) => {
        num = 0
        doc.data().interesses.forEach(function (interesse){
          num++
          var interest = interesse;
          console.log(interest)
        

          postsRef
          .where("categ", "==", "post")
          .where("tag", "==", interesse)
          .orderBy("timestamp", "desc")
          .get()
          .then((postsQuerySnapshot) => {
          postsQuerySnapshot.forEach((postDoc) => {
            console.log(postDoc.data());
            var postData = postDoc.data();
            var postID = postDoc.id;

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
            const fotoUser = postData.fotoUser
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
          })
        })
      })
      })

      
      
    }
  })
}