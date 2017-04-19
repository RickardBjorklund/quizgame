quizRApp.controller('ResultsCtrl', function ($scope,Model) {

	$scope.isRoundsResults = false;

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

	$scope.answers = Model.getAnswers();
	$scope.answeredQuestions = Model.getAnsweredQuestions();

	$scope.roundsResults = function() {
		$scope.isRoundsResults = !$scope.isRoundsResults;
	}

	$scope.totals = function() {
		//console.log("totals in")
		$scope.totalStats = Model.getData(); 
		// console.log("totals: " + $scope.totalStats)
	}

	$scope.status = function() {
		$scope.loggedIn = Model.checkStatus();
		//console.log("check")
	}

});
