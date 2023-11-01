importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyB2J40UU-zVhIF5uvHgsyYyAd-qIegz5QQ",
    authDomain: "donasdoninho.firebaseapp.com",
    projectId: "donasdoninho",
    storageBucket: "donasdoninho.appspot.com",
    messagingSenderId: "775885688659",
    appId: "1:775885688659:web:93a137be1d6443b9041ba6",
    measurementId: "G-6H97D5FZNE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});