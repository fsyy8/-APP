angular.module('starter.services', [])
.factory('User' , function(){
  return {
    playername: "未登录",
    servername: "未登录",
    isAuthenticated: false
  }
})
.factory('Chats', function() {
  
  var chats = [];

  return {
    set: function(array){
      for (var i = 0; i < array.length; i++) {
        chats[i] = array[i];
      }
    },
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].chatId === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
