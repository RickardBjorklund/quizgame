quizRApp.controller('SettingsCtrl', function ($scope, Model) {
  
  $scope.isStart = false; 

  $scope.createQuizWS = function(category, difficulty) {
  	Model.createQuizWS(category, difficulty);
    Model.profileInfo();
    Model.totalStats();
  	Model.clearAll();
  }
 
  $scope.status = function() {
    $scope.loggedIn = Model.checkStatus();
    // console.log("check")
  } 
});

