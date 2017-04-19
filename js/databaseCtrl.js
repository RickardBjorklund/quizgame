quizRApp.controller('DatabaseCtrl', function ($scope, Model) {

  $scope.isStandard = true;

  $scope.newUser = function(email, password, username, picture) {
    if (password == null) {
      alert("Enter a password! ")
    }

    else if (password.length < 6) {
      alert("Your password is to short! Minimum of 6 characters");
    }
    else {
      var message = Model.createUser(email, password, username,picture);
    }

    if (message == "You've created a new user! Please log in to play") { 
      $scope.confirmNewUser = true;
      $scope.isStandard = false;
    }

  };
  
  $scope.loginUser = function(email, password) {
    Model.loginUser(email, password);
  };

  $scope.refresh = function() {
    Model.logoutUser();
  };

});

