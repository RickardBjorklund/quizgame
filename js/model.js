quizRApp.factory('Model',function ($resource) {
  
  var quiz = []; 
  var correctAnswers = 0; 
  var incorrectAnswers = 0; 
  var answers = [];
  var answeredQuestions = [];
  var categorySelected = "";

  var localRight = 0;
  var localWrong = 0;

  var totalList = []; 
  var userInfo = [];
  var that = this; 

  this.clearAll = function() {
    quiz = []; 
    correctAnswers = 0; 
    incorrectAnswers = 0; 
    answers = [];
    answeredQuestions = [];
  }

  this.checkStatus = function () {
    var user = firebase.auth().currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  /* GET DATA */
  this.getProfileInfo = function () {
    return userInfo;
  }

  this.getData = function() {
    return totalList; //[totRight, totWrong];
  }

  this.getCat = function() {
    return categorySelected;
  }

  this.getQuiz = $resource('https://opentdb.com/api.php?amount=10',{},{
    get: {}
  });
  
  this.totalStats = function() {
    var userId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref("users/"+userId);

    ref.once("value").then(function(snapshot) {
      var right = snapshot.val().right;
      var wrong = snapshot.val().wrong;

      localWrong = wrong;
      localRight = right;

      totalList = [right, wrong];
      return totalList;
    });
  }

  this.profileInfo = function() {
    // console.log("login status: " + this.checkStatus())
    var userId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref("users/"+userId);

    ref.once("value").then(function(snapshot) {
      var username = snapshot.val().username;
      var picture = snapshot.val().picture;

      userInfo = [username, picture];

      return userInfo;
    });
  }

  /* LOGIN AND OUT USER */
  this.loginUser = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
      //console.log("logged in then func");
      that.totalStats();
      that.profileInfo();

    }).catch(function(error) {
       console.log(error.code);
       console.log(error.message);
       alert(error.message);
    });
    return;
  }

  this.logoutUser = function() {
      firebase.auth().signOut().then(function() {
        // console.log("Logged out!")
      }, function(error) {
       console.log(error.code);
       console.log(error.message);
       alert(error.message);
    });
  }

   /*    CREATE NEW USER    */
  this.createUser = function(email, password, username, picture) {
    var returnMessage = "";
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
    	that.setNewData();
    	that.setUserPic(picture);
    	that.setUsername(username);
    }).catch(function(error) {
      returnMessage = error.message;
      console.log(error.code);
      console.log(error.message);
      alert(error.message);
    });
    //status = true;
    //this.setNewData();
    //this.logoutUser();
    returnMessage = "You've created a new user! Please log in to play";
    return returnMessage
  }

  /*      SET DATA */
  this.setUserPic = function(input) {
    var ref = firebase.database().ref("users");
    var userId = firebase.auth().currentUser.uid;
    var setPicture = ref.child(userId).child('picture');
    setPicture.transaction(function(picture) {
    var setPic = input;
    return setPic;
    });
  }

  this.setUsername = function(input) {
    var ref = firebase.database().ref("users");
    var userId = firebase.auth().currentUser.uid;
    var setName = ref.child(userId).child('username');
    setName.transaction(function(username) {
    var setName = input;
    return setName;
    });
  }

  this.setNewData = function() {
    // console.log("inne i setNewData")
    var ref = firebase.database().ref("users");
    var user = firebase.auth().currentUser;
    if (user != null) {
      var uid = user.uid; 
      var realRef = ref.child(uid);
      realRef.set({picture: "", right: 0, wrong: 0, username: ""});
    }
    else {
      // console.log("else") Checking for user logged in 
    }
  }

  /*  DATA CHANGE  */
  this.changeData = function(answer) {
    if (this.checkStatus()) { // (returns true for logged in)
      var ref = firebase.database().ref("users");
      var userId = firebase.auth().currentUser.uid;
      if (answer == "right") {
        localRight = localRight + 1;
       	var getRight = ref.child(userId).child('right');
        getRight.transaction(function(right) {
          var totalRight = right + 1;
          totalList = [localRight, localWrong];
          return totalRight;
        });
      }
      if (answer == "wrong") {
        localWrong = localWrong +1; 
        var getWrong = ref.child(userId).child('wrong');
        getWrong.transaction(function(wrong) {
          var totalWrong = wrong + 1;
          totalList = [localRight, localWrong];
          return totalWrong;
        });
      }
    }

    else {
      // console.log("NOT LOGGED IN!") 
    }
  }

  this.createQuiz = function() {
    quiz = [];
    this.getQuiz.get( {}, function(data) {
      quiz.push(data.results);
      })
  }

  this.createQuizWS = function(category, difficulty) {
    quiz = [];
    categorySelected = category;
    this.getQuiz.get( {category:category,difficulty:difficulty}, function(data) {
      quiz.push(data.results);
      })
  }

  this.getQuestion = function() {
    if (quiz[0].length > 0 ) {
      var question = quiz[0].shift(); 
      answeredQuestions.push(question.question);
      return question; 
    }
    else {
      // console.log("Quiz ended")
      return ["Quiz ended"];
    }
  }

  this.createAlternatives = function(question) {
    if (question[0] == "Quiz ended") {
      return;
    }
    else {
		var alternatives = [];
		alternatives.push(question.correct_answer);
		for (var i = 0; i < question.incorrect_answers.length; i++) {
			alternatives.push(question.incorrect_answers[i]);
		}
		return alternatives.sort();
    }
  }
  
  this.checkAnswer= function(question, answer) {
    if (answer == question.correct_answer) {
      correctAnswers += 1;
      answers.push('Right answer');
      this.changeData("right");
      return false;
    }
    else {
      incorrectAnswers += 1;
      answers.push('Wrong answer');
      this.changeData("wrong");
      return true;
    }
  }

  this.getAnswers = function() {
    return answers;
  }

  this.getAnsweredQuestions = function() {
  	return answeredQuestions;
  }

  this.getNumberOfCorrectAnswers = function() {
    var sum = correctAnswers+incorrectAnswers;
    if (sum == 0) {
      return 0;
    }
    else {
      return Math.floor((correctAnswers/(correctAnswers+incorrectAnswers))*100);
    }
  }

  this.getNumberOfIncorrectAnswers = function() {
    var sum = correctAnswers+incorrectAnswers;
    if (sum == 0) {
      return 0;
    }
    return Math.floor((incorrectAnswers/(correctAnswers+incorrectAnswers))*100);
  }

  this.getProgress = function() {
    return Math.floor(((correctAnswers+incorrectAnswers))*10);
  }

  return this;

});
