
quizRApp.controller('ProfileCtrl', function ($scope, Model) {

  $scope.profileInfo = function() {
    /*console.log("inne i controller profileinfo");*/
    $scope.list = Model.getProfileInfo();
  };

  $scope.totals = function() {
    $scope.totalStats = Model.getData(); 
  }
  
  $scope.logOut = function() {
    Model.logoutUser();
    location.reload();
  }


});

