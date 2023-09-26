
function showInfos(){
const db = firebase.firestore()
db.collection('usuarios').get()
.then((snapshot) => {
    const nomes = snapshot.docs.reduce((acc, doc) => {
        acc = ` ${doc.data().nome} `
        document.getElementsByName('username')[0].placeholder= acc;
        acc2 = ` ${doc.data().dataNascimento}`
        document.getElementsByName('userdata')[0].placeholder= acc2;
    })
    console.log(nomes);
})
.catch(err => {
    console.log(err.message)
})

}

