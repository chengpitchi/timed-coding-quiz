// declare the element in HTML
var welcomePage = document.querySelector(".welcome-page"); 
var questionPage = document.querySelector(".question-page"); 
var resultPage = document.querySelector(".result-page"); 
var highScorePage = document.querySelector(".high-score-page"); 
var answerList = document.querySelector("#answer-list"); 

var startButton = document.querySelector("#start-button"); 
var viewHighscores = document.querySelector("#view-highscores"); 
var gobackButton = document.querySelector("#goback-button"); 
var submitButton = document.querySelector("#submit-button"); 
var nextButton = document.querySelector("#next-button"); 
var confirmButton = document.querySelector("#confirm-button"); 
var clearHSButton = document.querySelector("#clear-hs-button"); 

var finalScoreEl = document.querySelector("#final-score"); 
var totQuestionEl = document.querySelector("#total-question"); 
var correctAnsEl = document.querySelector("#correct-answer"); 
var highScoresOl = document.querySelector("#high-score-list"); 
var nameInput = document.querySelector("#name"); 
var resultMessage = document.querySelector("#result-message"); 

var timerEl = document.querySelector("#timer-text"); 

// delcare and initialize variables
var quizStatus = 0; 
var timeLeft = 120; 
var questionIndex = 0; 
var chosenAnswer = ""; 

// define questions in the quiz
var questions = [
    {question:"Inside which HTML element do we put the JavaScript?", 
     opt1:"&ltscripting&gt", 
     opt2:"&ltjavascript&gt",
     opt3:"&ltscript&gt", 
     opt4:"&ltjs&gt", 
     answer:"3", 
     answered:false
    }, 
    {question:"Where is the correct place to insert a JavaScript?", 
     opt1:"The &lthead&gt section", 
     opt2:"The &ltbody&gt section",
     opt3:"Both &lthead&gt and &ltbody&gt section", 
     opt4:"The &ltheader&gt section", 
     answer:"3",
     answered:false 
    }, 
    {question:"What is the correct syntax for referring to an external script called \"xxx.js\"?", 
    opt1:"&ltscript name=\"xxx.js\"&gt", 
    opt2:"&ltscript src=\"xxx.js\"&gt",
    opt3:"&ltscript alt=\"xxx.js\"&gt", 
    opt4:"&ltscript type=\"xxx.js\"&gt", 
    answer:"2",
    answered:false 
    },
    {question:"How do you write \"Hello World\" in an alert box?", 
    opt1:"msgBox(\"Hello World\")", 
    opt2:"alertBox(\"Hello World\")",
    opt3:"msg(\"Hello World\")", 
    opt4:"alert(\"Hello World\")", 
    answer:"4",
    answered:false 
    },
    {question:"How do you create a function in JavaScript?", 
    opt1:"function myFunction()", 
    opt2:"function = myFunction()",
    opt3:"function:myFunction()", 
    opt4:"myFunction() as function", 
    answer:"1",
    answered:false 
    },
    {question:"How do you call a function named \"myFunction\"?", 
    opt1:"myFunction();", 
    opt2:"call function myFunction();",
    opt3:"myFunction;", 
    opt4:"call myFunction();", 
    answer:"1",
    answered:false 
    },
    {question:"How to write an IF statement in JavaScript?", 
    opt1:"if i == 5 then", 
    opt2:"if (i == 5) {}",
    opt3:"if i = 5 then", 
    opt4:"if (i equal to 5) {}", 
    answer:"2",
    answered:false 
    }, 
    {question:"How to write an IF statement for executing some codes if \"i\" is not equal to 5?", 
    opt1:"if (i != 5)", 
    opt2:"if (i <> 5)",
    opt3:"if (i not equal to 5)", 
    opt4:"if i !! 5", 
    answer:"1",
    answered:false 
    }, 
    {question:"How does a WHILE loop start?", 
    opt1:"while i = 1 to 10", 
    opt2:"while (i <= 10; i++)",
    opt3:"while (i <= 10)", 
    opt4:"while (var i = 0; i <= 10; i++)", 
    answer:"3",
    answered:false 
    },   
    {question:"How does a FOR loop start?", 
    opt1:"for i = 1 to 5", 
    opt2:"for (i = 0; i <= 5)",
    opt3:"for (i <= 5; i++)", 
    opt4:"for (i = 0; i <= 5; i++)", 
    answer:"4",
    answered:false 
    }, 
    {question:"How can you add a comment in a JavaScript?", 
    opt1:"&lt!--This is a comment--&gt", 
    opt2:"\'This is a comment",
    opt3:"//This is a comment", 
    opt4:"## This is a comment", 
    answer:"3",
    answered:false 
    }
]

var numOfCorrect = 0; 
var totalQuestion = questions.length; 
var highScoresList = new Array();

// function run when loading the page, render the highscore list. 
function init() {
    renderHighScoresList(); 
}

// call when user click the start quiz button.
function startQuiz(event){
    event.preventDefault(); 

    quizStatus = 1; 
    questionIndex = 0;
    numOfCorrect = 0; 

    startTimer(); 

    showQuestion(); 

    welcomePage.setAttribute("style", "display:none"); 
    resultPage.setAttribute("style", "display:none"); 
    highScorePage.setAttribute("style", "display:none"); 
    questionPage.setAttribute("style", "display:block"); 
}

// call when user click view highscore link.
function showHighscores(event) {
    event.preventDefault(); 

    welcomePage.setAttribute("style", "display:none"); 
    resultPage.setAttribute("style", "display:none"); 
    questionPage.setAttribute("style", "display:none"); 

    highScorePage.setAttribute("style", "display:block"); 
}

// call when user click goback button.
function goBack(event) {
    event.preventDefault(); 

    highScorePage.setAttribute("style", "display:none"); 

    /* 
    show pages depending on the status of the quiz
    0 = user at the welcome page 
    1 = user is doing the quiz 
    2 = the quiz finished and at the result page 
    */
    if (quizStatus === 0) {
        welcomePage.setAttribute("style", "display:block");
        resultPage.setAttribute("style", "display:none"); 
        questionPage.setAttribute("style", "display:none");
    } else if (quizStatus === 1) {
        welcomePage.setAttribute("style", "display:none");
        resultPage.setAttribute("style", "display:none"); 
        questionPage.setAttribute("style", "display:block");
    } else {
        welcomePage.setAttribute("style", "display:none");
        resultPage.setAttribute("style", "display:block"); 
        questionPage.setAttribute("style", "display:none");
    }
}

// call when user click next question button
function nextQuestion(event) {
    event.preventDefault(); 

    var confirmNext = true; 

    if (!questions[questionIndex].answered) {
        //if the user skip the question, we assume the answer is wrong and deduct 10 seconds  
        if (confirm("You have not confirmed the answer yet.  Are you OK to proceed to next question?\nBeware that 10 seconds will be deducted if you click OK.")) {
            timeLeft = timeLeft - 10; 
        } else {
            confirmNext = false; 
        }
    }

    if (confirmNext) {
        questionIndex++; 

        if (questionIndex !== questions.length) {
            showQuestion(); 
        } else {
            // if reach the last questions, quiz ends and show result.
            showResultPage(); 
        }           
    }
}

// call when the user click confirm button to confirm the answer of the question. 
function checkAnswer(event) {
    event.preventDefault(); 

    // if the question already answered, skip the answer checking.
    if (questions[questionIndex].answered) {
        resultMessage.textContent = "You have answered this question already.  Please proceed to the next question."; 
        resultMessage.setAttribute("style", "color:red"); 
        return; 
    }

    // if the question is net yet answer, skip the answer checking. 
    if (chosenAnswer.trim() == "") {
        resultMessage.textContent = "Please choose your answer."; 
        resultMessage.setAttribute("style", "color:red"); 
        return; 
    }

    questions[questionIndex].answered = true; 

    if (questions[questionIndex].answer == chosenAnswer) {
        resultMessage.textContent = "You are right!"
        resultMessage.setAttribute("style", "color:black"); 
        numOfCorrect++; 
    } else {
        // if the answer is incorrect, deduct 10 seconds.
        resultMessage.textContent = "Your answer is incorrect.  10 seconds deducted."
        resultMessage.setAttribute("style", "color:red"); 
        timeLeft = timeLeft - 10;     
    }
}

// call when the user click submit button at the result page 
function saveHighscore(event) {
    event.preventDefault(); 

    if (nameInput.value.trim() == "") {
        alert("Please input your name."); 
        return; 
    }

    var l_highScore = {
        rank: 0, 
        name: nameInput.value.trim(), 
        score: calculateFinalScore() 
    }

    if (highScoresList === null) {
        highScoresList = new Array(); 
        highScoresList.push(l_highScore);    
    } else {
        highScoresList.push(l_highScore);
    }
    nameInput.value = "";

    // sorting the highscores in descending orders
    highScoresList.sort(function(a, b) {return b.score - a.score}); 

    // assign ranking for each highscores
    for (var i = 0; i < highScoresList.length; i++) {
        if (i == 0){
            highScoresList[i].rank = 1; 
        } else if (highScoresList[i].score === highScoresList[i-1].score) {
            highScoresList[i].rank = highScoresList[i-1].rank; 
        } else {
            highScoresList[i].rank = i + 1; 
        }
    }

    // save highscores to local storage 
    localStorage.setItem("highScores", JSON.stringify(highScoresList))
  
    // reset the variables, rendor and show the new highscore list
    quizStatus = 0; 
    timeLeft = 0; 
    timerEl.innerHTML = "Time: " + timeLeft; 

    renderHighScoresList(); 

    welcomePage.setAttribute("style", "display:none"); 
    resultPage.setAttribute("style", "display:none"); 
    questionPage.setAttribute("style", "display:none"); 
    highScorePage.setAttribute("style", "display:block");    
}

// call when the user click clear highscores button
function clearHighScores(event) {
    event.preventDefault(); 

    localStorage.removeItem("highScores"); 

    highScoresList = JSON.parse(localStorage.getItem("highScores")); 
    renderHighScoresList(); 
}

// call when user click on the answer of the question. 
function selectAnswer(event) {
    var element = event.target;

    if (element.matches("li") && !questions[questionIndex].answered) {
      chosenAnswer = element.dataset.option 

      for (var i = 0; i < answerList.children.length; i++) {
        (i == chosenAnswer - 1) ? 
        answerList.children[i].setAttribute("style", "background-color:green") : 
        answerList.children[i].setAttribute("style", "background-color:rgb(71, 76, 209)"); 
      }
    }
}

// showing the result page with statistics and scores
function showResultPage() {
    quizStatus = 2; 
    totQuestionEl.textContent = "Total questions: " + totalQuestion; 
    correctAnsEl.textContent = "Number of correct answer: " + numOfCorrect; 
    finalScoreEl.textContent = "Your final score is " + calculateFinalScore() + "."; 

    welcomePage.setAttribute("style", "display:none"); 
    resultPage.setAttribute("style", "display:block"); 
    questionPage.setAttribute("style", "display:none"); 
    highScorePage.setAttribute("style", "display:none"); 
}; 

// start the timer.
function startTimer() {
    timeLeft = 120; 

    var timerInterval = setInterval(function () {
      timerEl.innerHTML = "Time: " + timeLeft; 
  
      if(timeLeft === 0 | quizStatus === 2) {
        clearInterval(timerInterval);

        showResultPage(); 
      }

      timeLeft--;
    }, 1000);  
}

// show the questions on the page 
function showQuestion() {
    questionPage.children[0].innerHTML = questions[questionIndex].question; 
    answerList.children[0].innerHTML = questions[questionIndex].opt1; 
    answerList.children[1].innerHTML = questions[questionIndex].opt2; 
    answerList.children[2].innerHTML = questions[questionIndex].opt3;
    answerList.children[3].innerHTML = questions[questionIndex].opt4;  

    // resetting the variables and styles related to the questions.
    resultMessage.textContent = ""; 
    chosenAnswer = ""; 
    questions[questionIndex].answered = false; 

    for (var i = 0; i < answerList.children.length; i++) {
        answerList.children[i].setAttribute("style", "background-color:rgb(71, 76, 209)"); 
    }
}

// calculating the user score
function calculateFinalScore(){
    return (numOfCorrect/totalQuestion*100).toFixed(0);
}

// rendering the highscores list
function renderHighScoresList() {
    highScoresOl.innerHTML = ""; 

    highScoresList = JSON.parse(localStorage.getItem("highScores")); 

    if (highScoresList !== null) {
        // show only top 10 records on the screen 
        for (var i = 0; i < (highScoresList.length < 10 ? highScoresList.length : 10); i++) {
            var highScore = highScoresList[i];

            var li = document.createElement("li");
            li.textContent = highScore.rank + ". " + highScore.name + " - " + highScore.score;

            // give a different styles for the top-ranked score. 
            if (highScore.rank == 1) li.setAttribute("style", "background-color:green;color:white");  
            highScoresOl.appendChild(li);
        }
    }
}

startButton.addEventListener("click", startQuiz); 
viewHighscores.addEventListener("click", showHighscores); 
gobackButton.addEventListener("click", goBack); 
submitButton.addEventListener("click", saveHighscore); 
nextButton.addEventListener("click", nextQuestion); 
confirmButton.addEventListener("click", checkAnswer); 
clearHSButton.addEventListener("click", clearHighScores); 
answerList.addEventListener("click", selectAnswer); 

init();   