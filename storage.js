(function() {
  function loadStorage() {
    window.storage = window.storage ?? {};
    try {
      console.log(sessionStorage);
      storage = sessionStorage;
    } catch {
      function refreshLength() {
        storage.length = Object.keys(customStorage).length;
      }

      console.log('no session storage available');
      window.customStorage = window.customStorage ?? {};
      refreshLength();

      storage.setItem = function(key, value) {
        customStorage[key] = value;
        refreshLength();
      }

      storage.clear = function() {
        customStorage = {};
        refreshLength();
      }

      storage.getItem = function(key) {
        return customStorage[key];
      }

      storage.key = function(index) {
        return Object.keys(customStorage)[index];
      }
      
      storage.removeItem = function(key) {
        delete customStorage[key];
        refreshLength();
      }
    }
  }

  loadStorage();

  let default_input = document.querySelector('input#typeans');
  if (default_input) {
    storage.setItem('typed_ans', default_input.value);
    default_input.addEventListener('input', function() {
      storage.setItem('typed_ans', default_input.value);
    });
  }

  window.getTypedAns = function() {
    return storage.getItem('typed_ans')??'';
  }
})();
