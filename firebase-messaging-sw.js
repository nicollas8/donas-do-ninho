self.addEventListener('activate', function(event) {
    event.waitUntil(
      clients.claim()
    );
  });
  
  self.addEventListener('fetch', function(event) {
    console.log('alooooooooooooo')
});