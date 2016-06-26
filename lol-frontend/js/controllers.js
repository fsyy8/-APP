function url_base64_decode(str) {
  var output = str.replace('-', '+').replace('_', '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }
  return window.atob(output); 
}
function utf8to16(str) { 
  var out, i, len, c; 
  var char2, char3; 
  out = ""; 
  len = str.length; 
  i = 0; 
  while(i < len) { 
  c = str.charCodeAt(i++); 
  switch(c >> 4) 
  { 
  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: 
  // 0xxxxxxx 
  out += str.charAt(i-1); 
  break; 
  case 12: case 13: 
  // 110x xxxx 10xx xxxx 
  char2 = str.charCodeAt(i++); 
  out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F)); 
  break; 
  case 14: 
  // 1110 xxxx 10xx xxxx 10xx xxxx 
  char2 = str.charCodeAt(i++); 
  char3 = str.charCodeAt(i++); 
  out += String.fromCharCode(((c & 0x0F) << 12) | 
  ((char2 & 0x3F) << 6) | 
  ((char3 & 0x3F) << 0)); 
  break; 
  } 
  } 
  return out; 
} 

angular.module('starter.controllers', [])

.controller('ZhanjiCtrl', function($scope ,$http,Chats,User) {
  $scope.user = User;
  $scope.chats = Chats.all();
  $scope.$on('$ionicView.enter', function(e) {
    $scope.chats = Chats.all();
  });
})
.controller('ZhanjiDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('GongjuCtrl', function($scope) {})

.controller('TianqiCtrl',function($scope) {
  $("#tool1Btn").click(function(){
    if($("#tool1PlayerName").val()==0){
      alert("请输入召唤师名称");
    }else{
      $.ajax({
        url: '/api',
        type: 'GET',
        dataType: 'json',
        data:{
          serverName: $("#tool1ServerName").val(),
          playerName: $("#tool1PlayerName").val()
        }
      })
      .done(function(json) {
        if (json===null) {
          alert("未找到");
        }else{
          $("#tool1ResultBox").attr("ng-show",true);
          $("#tool1Result1").html(
            '<img src="' + json.portrait 
            +'"><h2>' + $("#tool1PlayerName").val()
            +'</h2><p>' + $("#tool1ServerName").val()
            +'</p>');
          $("#tool1Result2").html(
            '<p>等级:'+ json.level +'<br>战斗力:'+ json.zhandouli +'<br>被赞次数:'+
            json.good + '(来自多玩)</p>'
            );
        }        
      })
      .fail(function() {
        alert("查询失败");
      })
      .always(function() {
        console.log("complete");
      });
    }    
  });
})

.controller('AccountCtrl', function($scope, $window, User){
  $scope.user = User;
  $scope.logout = function(){
    delete $window.sessionStorage.token;
    User.playername = "未登录";
    User.servername = "未登录";
    User.isAuthenticated = false;
    alert("注销成功");
  }
})

.controller('AccountLoginCtrl', function($scope, $http, $window ,$location, User,Chats){
  $scope.user = User;
  $scope.submit = function(){
    $http
      .post('/authenticate', {username: $("#accountLogin-username").val(), password: $("#accountLogin-password").val()})
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        User.isAuthenticated = true;
        alert("登录成功");
        var encodedProfile = data.token.split('.')[1];
        var profile = JSON.parse(utf8to16(url_base64_decode(encodedProfile)));
        User.playername = profile.playername;
        User.servername = profile.servername;
        $location.path('/tab/account');
        $.ajax({
          url: '/hero',
          type: 'GET',
          dataType: 'json',
          data:{
            serverName: $scope.user.servername,
            playerName: $scope.user.playername
          }
        })
        .done(function(json) {
          if(User.isAuthenticated){
            if (json===null) {
              alert("未找到");
            }else{
              var json0 = json.herostr;
              for (var i = 0; i < json0.length; i++) {
                json0[i].chatId = i;
              };
              Chats.set(json0);
            }
          }
        })
        .fail(function() {
            alert("查询失败");
        })
        .always(function() {
          console.log("complete");
        });
      })
      .error(function (data, status, headers, config) {
        alert(data);
        delete $window.sessionStorage.token;
        $scope.isAuthenticated = false;
        $scope.error = 'Error: Invalid user or password';
        $scope.welcome = '';
      });
  }
})

.controller('AccountSignupCtrl',function($scope){
  $scope.signup = function(){
    var username = $("#accountSignup-username").val();
    var password = $("#accountSignup-password").val();
    var password2 = $("#accountSignup-password2").val();
    var servername = $("#accountSignup-servername").val();
    var playername = $("#accountSignup-playername").val();
    if(username==""||password==""||servername==""||playername==""){
      alert("请输入正确信息");
    }else if(password!==password2){
      alert("两次密码输入不一致")
    }else{
      $.ajax({
        url: '/api',
        type: 'GET',
        dataType: 'json',
        data:{
          serverName: servername,
          playerName: playername
        }
      })
      .done(function(json) {
        if (json===null) {
          alert("未找到召唤师，请检查服务器名称和召唤师名称是否正确。");
        }else{
          $.ajax({
            url: '/signup',
            type: 'POST',
            dataType: 'json',
            data: {
              username: username,
              password: password,
              servername: servername,
              playername: playername
            },
          })
          .done(function(json) {
            alert(json.msg);
          })
          .fail(function() {
            alert("注册失败");
          })
          .always(function() {
            console.log("complete");
          });
          
        }        
      })
      .fail(function() {
        alert("请检查网络。");
      })
      .always(function() {
        console.log("complete");
      });
    }
  }
})

.controller('AccountAboutCtrl', function($scope){});
