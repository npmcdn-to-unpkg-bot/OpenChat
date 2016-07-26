var socket = io.connect("http://localhost:8080");
var app = angular.module('myApp', []);
var pathname = window.location.pathname;
path = pathname.split("/")[2];
document.title = "OpenChat at " + path;
console.log("conected at " + path);

app.controller("AppCtrl", function($scope) {
  $scope.path = path;

  $scope.send = function(){
      var msg = {
        user: $scope.user,
        message: $scope.message,
        path: path
      };

      if(msg.user == "" || msg.message == ""){
        console.log("message not sent");
      }else{
        if($scope.messages.length > 19)
          $scope.messages.shift();
        $scope.message = "";
        socket.emit("message", msg);
        $scope.messages.push([msg.user, msg.message]);
        console.log("message sent");
      }
  }

  $scope.reset = function(){
    $scope.user = "";
    $scope.message = "";
  }

  $scope.cancel = function(){
    socket.emit("cancel", path);
    console.log("ending chat...");
  }

  $scope.messages = [];

  socket.on("message" + path, function(data){
    if($scope.messages.length > 19)
      $scope.messages.shift();
    $scope.messages.push([data.user, data.message]);
    $scope.$apply();
    console.log("message received");
  });

  socket.on("cancel" + path, function(data){
    $scope.message = "";
    $scope.messages = [];
    $scope.$apply();
    console.log("chat ended");
  });

});
