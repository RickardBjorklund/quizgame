quizRApp.controller('SideCtrl', function ($scope,Model) {

	$scope.correctPercentage = function() { 
		return Model.getNumberOfCorrectAnswers();
	}

	$scope.incorrectPercentage = function() {
		if (Model.getNumberOfCorrectAnswers() == 0 && Model.getNumberOfIncorrectAnswers() == 0) {
			return Model.getNumberOfIncorrectAnswers();
		}
		else {
			return (100 - Model.getNumberOfCorrectAnswers());
		}
	}

	$scope.progressPercentage = function() {
		return Model.getProgress();
	}

    $scope.status = function() {
        $scope.loggedIn = Model.checkStatus();
        //console.log("check")
    }

    $scope.logOut = function() {
        Model.logoutUser();
    }
    
});
