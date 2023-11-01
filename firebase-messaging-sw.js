// firebase-messaging-sw.js

self.addEventListener('activate', function(event) {
  event.waitUntil(
    clients.claim()
  );
});

self.addEventListener('fetch', function(event) {
  // Aqui você pode adicionar a lógica para responder a solicitações de cache
});