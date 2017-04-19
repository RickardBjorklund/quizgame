
quizRApp.controller('QuickplayCtrl', function ($scope, Model) {
  
  $scope.isStart = true; 

  $scope.createQuiz = function() {
  	Model.createQuiz();
  	$scope.status = "Done";
    $scope.isStart = true;
  }

  $scope.viewQuestion = function() {
    $scope.quizLength = Model.getProgress(); 
    $scope.isGame = true;
    $scope.isStart = false;
    $scope.isNext = false;
    $scope.confirm = "";
  	$scope.checkedAnswer = "";
  	$scope.question = Model.getQuestion(); 
    if ($scope.quizLength == 90) { 
      $scope.isEnded = true;
    }
  	$scope.alternatives = Model.createAlternatives($scope.question);
    if ($scope.question == "Quiz ended") {
      $scope.isError = true;
      $scope.isGame = false;
    }
  }

  $scope.check = function(alt) {
    $scope.green = false;
    $scope.red = false;
  	$scope.checkedAnswer = Model.checkAnswer($scope.question, alt);
    if ($scope.checkedAnswer) {
      $scope.confirm = "Wrong!"; 
      $scope.confirmStyle = "fancyRed";
      $scope.isNext = true;
      $scope.selectedRow = alt;
      $scope.red = true; 
    }
    else {
      $scope.confirm = "Correct!";
      $scope.confirmStyle = "fancy";
      $scope.isNext = true;
      $scope.selectedRow = alt;
      $scope.green = true;
    }
  }

  $scope.setCat = function() {
    var cat = Model.getCat();
    if (cat == undefined) {
      cat = 9;
    }
    return cat;
  }
  
  $scope.changeData = function() {
    Model.changeData();
    Model.totalStats();
  };

  $scope.status = function() {
    $scope.loggedIn = Model.checkStatus();
    if ( $scope.loggedIn == true) {
      var userId = firebase.auth().currentUser.uid;
    }
  }
  
  $scope.logOut = function() {
    Model.logoutUser();
    location.reload();
  }
  
});






