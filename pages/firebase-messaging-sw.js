// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyB2J40UU-zVhIF5uvHgsyYyAd-qIegz5QQ",
    authDomain: "donasdoninho.firebaseapp.com",
    projectId: "donasdoninho",
    storageBucket: "donasdoninho.appspot.com",
    messagingSenderId: "775885688659",
    appId: "1:775885688659:web:93a137be1d6443b9041ba6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener('notificationclick', function(event) {
  // Lidar com o clique na notificação, se necessário.
  // Pode redirecionar o usuário para um URL, por exemplo.
  // Exemplo: clients.openWindow('https://example.com');
});

self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/img/logoAPP.svg', // Ícone da notificação
    badge: '/img/noPhoto.png', // Ícone de contagem (pode ser nulo)
  };

  event.waitUntil(
    self.registration.showNotification('Título da Notificação', options)
  );
});