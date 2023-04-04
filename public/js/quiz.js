// -------------------------------------------------------------------------------------------------------------------
// get Data from Database
// -------------------------------------------------------------------------------------------------------------------
let userData;
let questions_data;
async function loadData() {
  const res = await fetch("/user/details");
  let user = await res.json();
  userData = user[0];

  const response = await fetch("/quiz/details");
  let results = await response.json();
  questions_data = results;

  //load student details
  document.querySelector(".user-info-container").innerHTML =
    /*HTML*/
    `
<span>${userData.student_name}</span><br>
<span>(${userData.student_code})</span>
`;

  setGlobalTimer(userData.time, formatTime); //set the global timer when game starts

  console.log("questions_data", questions_data);
}
loadData();
// -------------------------------------------------------------------------------------------------------------------
// Data from DB
// -------------------------------------------------------------------------------------------------------------------
// const quiz_details = {
//   quiz_id: 1,
//   quiz_name: "Quiz 1",
//   quiz_time: 10,
//   quiz_score: 0,
// };

const questions = [
  {
    question: "以下哪種生物生活在圖中的環境?",
    imageA: "http://localhost:8000/assets/A.png",
    imageB: "http://localhost:8000/assets/B.png",
    imageC: "http://localhost:8000/assets/C.png",
    imageD: "http://localhost:8000/assets/D.png",
    correctOption: "optionD",
    time: 10,
    ans: "D",
    explanation: "No explanation",
    image: "http://localhost:8000/assets/wood.png",
    hint: "No hints",
  },

  {
    question: "How many players are allowed on a soccer pitch ?",
    optionA: "10 players",
    optionB: "11 players",
    optionC: "9 players",
    optionD: "12 players",
    correctOption: "optionB",
    time: 9,
    ans: "B",
    explanation: "11 players are allowed on a soccer pitch.",
    hint: "11 players are allowed on a soccer pitch.",
  },
  {
    question: "Who was the first President of USA ?",
    optionA: "Donald Trump",
    optionB: "Barack Obama",
    optionC: "Abraham Lincoln",
    optionD: "George Washington",
    correctOption: "optionD",
    time: 8,
    ans: "D",
    explanation: "George Washington was the first President of USA.",
    hint: "George Washington was the first President of USA.",
  },

  {
    question: "30 days has ______ ?",
    optionA: "January",
    optionB: "December",
    optionC: "June",
    optionD: "August",
    correctOption: "optionC",
    time: 7,
    ans: "C",
    explanation: "June has 30 days.",
    hint: "No hints",
  },
];

// -------------------------------------------------------------------------------------------------------------------
// Timer
// -------------------------------------------------------------------------------------------------------------------
function formatTime(milliseconds) {
  let totalSeconds = Math.ceil(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return (
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
}

function setGlobalTimer(quizTime, formatTime) {
  let intervalId;
  let remainingTime = quizTime * 60 * 1000;

  document.querySelector(".total-timer-container").innerHTML =
    formatTime(remainingTime);

  (function startTimer() {
    let intervalId = setInterval(() => {
      remainingTime -= 1000;
      if (remainingTime <= 0) {
        // if time is up
        clearInterval(intervalId);
        document.querySelector(".total-timer-container").innerHTML =
          "Time's up!";
      } else {
        document.querySelector(".total-timer-container").innerHTML =
          formatTime(remainingTime);
      }
    }, 1000);
  })();
}

// -------------------------------------------------------------------------------------------------------------------
// set question Timer-bar
// -------------------------------------------------------------------------------------------------------------------
function setQuestionTimer(currentQuestion, formatTime) {
  let remainingTime = currentQuestion.time * 1000;
  let timeLimit = currentQuestion.time;
  let continueClicked = false;
  let noOptionSelected = true;

  document
    .querySelector(".continue-btn")
    .addEventListener("click", function () {
      const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)
      if (
        !(
          options[0].checked === false &&
          options[1].checked === false &&
          options[2].checked === false &&
          options[3].checked == false
        )
      ) {
        continueClicked = true;
        noOptionSelected = false;
      }
    });

  // set the numerical timer beside the progress bar
  document.querySelector(".question-time-container").innerText =
    formatTime(remainingTime);

  // Get the progress bar element
  let progressBar = document.getElementById("progressBar");

  // Set the width of the green bar to 100%
  let progress = progressBar.querySelector("div");
  progress.style.width = "100%";

  let timerId = setInterval(() => {
    remainingTime -= 10;
    let questionTimesUp = remainingTime <= 0 ? true : false;
    if (questionTimesUp || (continueClicked && !noOptionSelected)) {
      // if time is up or question is answered
      clearInterval(timerId);
      progress.style.width = "0%";
      checkForTick(questionTimesUp);
    } else {
      document.querySelector(".question-time-container").innerHTML =
        formatTime(remainingTime);
      progress.style.width =
        (remainingTime / (currentQuestion.time * 1000)) * 100 + "%";
    }
  }, 10);
}

// -------------------------------------------------------------------------------------------------------------------
// close Modal (close when onClick continue button in the modal)
// -------------------------------------------------------------------------------------------------------------------
function closeHintModal() {
  //function to close hint modal
  document.getElementById("hint-modal").style.display = "none";
  document.querySelector(".game-details-container").style.filter = "";
  document.querySelector(".game-question-container").style.filter = "";
  document.querySelector(".game-options-container").style.filter = "";
  document.querySelector(".foot-bar").style.filter = "";
}

function closeExplanationModal() {
  //function to close explanation modal
  document.getElementById("explanation-modal").style.display = "none";
  document.querySelector(".game-details-container").style.filter = "";
  document.querySelector(".game-question-container").style.filter = "";
  document.querySelector(".game-options-container").style.filter = "";
  document.querySelector(".foot-bar").style.filter = "";
}

// -------------------------------------------------------------------------------------------------------------------
//  Main functions
// -------------------------------------------------------------------------------------------------------------------

let shuffledQuestions = []; //empty array to hold shuffled selected questions
let timeIsUp = false;

function handleQuestions() {
  //function to shuffle and push questions to shuffledQuestions array
  while (shuffledQuestions.length <= 3) {
    const random = questions[Math.floor(Math.random() * questions.length)];
    if (!shuffledQuestions.includes(random)) {
      shuffledQuestions.push(random);
    }
  }
}

// checked option to be highlighted
let radios = document.querySelectorAll("input[type=radio]");
for (let i = 0; i < radios.length; i++) {
  radios[i].addEventListener("click", function () {
    if (this.checked) {
      let id = this.id;
      let span = document.getElementById(id + "-span");
      span.style.backgroundColor = "paleturquoise";

      for (let j = 0; j < radios.length; j++) {
        if (radios[j].id != id) {
          let span = document.getElementById(radios[j].id + "-span");
          span.style.backgroundColor = "white";
        }
      }
    }
  });
}

let questionNumber = 1;
let playerScore = 0;
let wrongAttempt = 0;
let indexNumber = 0;

document.querySelector(".total-question-no").innerHTML = questions.length;

function nextQuestionStage(currentQuestion) {
  //if there is question image
  if (currentQuestion.image) {
    document.querySelector(".game-question-container").style.flexDirection =
      "column";
    let questionImage = document.getElementById("question-img").style;
    questionImage.background = `url("${currentQuestion.image}")`;
    questionImage.height = "120px";
    questionImage.width = "150px";
    questionImage.backgroundSize = "contain";
    questionImage.backgroundRepeat = "no-repeat";
    questionImage.marginTop = "15px";
  }

  //set game details
  document.querySelector(".question-no").innerHTML = questionNumber;
  document.getElementById("player-score").innerHTML =
    "&nbsp" + playerScore; /*HTML*/
  // `
  // <span> <span style="font-size: 30px;">x</span> ${playerScore}</span>
  // `;

  document.getElementById("display-question").innerHTML =
    currentQuestion.question;

  if (currentQuestion.optionA) {
    document.getElementById("option-one-label").innerHTML =
      currentQuestion.optionA;
    document.getElementById("option-two-label").innerHTML =
      currentQuestion.optionB;
    document.getElementById("option-three-label").innerHTML =
      currentQuestion.optionC;
    document.getElementById("option-four-label").innerHTML =
      currentQuestion.optionD;
  } else {
    const options = document.querySelectorAll(".game-options-container span");
    for (const option of options) {
      option.style.display = "flex";
      option.style.justifyContent = "center";
      option.style.alignItems = "center";
    }

    const arr = ["A", "B", "C", "D"];

    let imageStyles = document.querySelectorAll(
      ".game-options-container span label"
    );
    for (let i = 0; i < imageStyles.length; i++) {
      imageStyles[i].style.background = `url("${
        currentQuestion[`image${arr[i]}`]
      }")`;
      imageStyles[i].innerText = "";
      imageStyles[i].style.height = "90px";
      imageStyles[i].style.width = "120px";
      imageStyles[i].style.backgroundSize = "contain";
      imageStyles[i].style.backgroundRepeat = "no-repeat";
      imageStyles[i].style.backgroundPosition = "center";
    }
  }
}

// function for displaying next question in the array to dom
function NextQuestion(index) {
  handleQuestions();
  const currentQuestion = shuffledQuestions[index];
  document.getElementById("question-img").style = "";

  //function to open hint modal
  document.querySelector(".hint-btn").addEventListener("click", function () {
    document.querySelector(".hint-detail").innerHTML = currentQuestion.hint;
    document.getElementById("hint-modal").style.display = "flex";
    document.querySelector(".game-details-container").style.filter =
      "blur(5px)";
    document.querySelector(".game-question-container").style.filter =
      "blur(5px)";
    document.querySelector(".game-options-container").style.filter =
      "blur(5px)";
    document.querySelector(".foot-bar").style.filter = "blur(5px)";
  });

  //function to set the question timer
  setQuestionTimer(currentQuestion, formatTime, currentQuestion);

  //function to open explanation modal
  document
    .querySelector(".continue-btn")
    .addEventListener("click", function () {
      continueClicked = true;
      checkForTick(false); // times up is not related here
    });

  nextQuestionStage(currentQuestion);
}

function checkForAnswer() {
  const currentQuestion = shuffledQuestions[indexNumber]; //gets current Question
  const currentQuestionAnswer = currentQuestion.correctOption; //gets current Question's answer
  const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)
  let correctOption = null;

  options.forEach((option) => {
    if (option.value === currentQuestionAnswer) {
      //get's correct's radio input with correct answer
      correctOption = option.labels[0].id;
    }
  });

  //check if all options are not checked
  let optionsArr = Array.prototype.slice
    .call(options)
    .every((option) => option.checked === false);
  if (optionsArr) {
    wrongAttempt++;
    indexNumber++;
    questionNumber++;
  }

  options.forEach((option) => {
    if (option.checked === true && option.value === currentQuestionAnswer) {
      let span = correctOption.slice(0, -5) + "span";
      playerScore++;
      indexNumber++;
      questionNumber++;
    } else if (option.checked && option.value !== currentQuestionAnswer) {
      const wrongLabelId = option.labels[0].id;
      let wrongSpan = wrongLabelId.slice(0, -5) + "span";
      let correctSpan = correctOption.slice(0, -5) + "span";
      wrongAttempt++;
      indexNumber++;
      questionNumber++;
    }
  });
}

//check if answer is correct when the user clicks the continue button
function checkForTick(questionTimesUp) {
  const currentQuestion = shuffledQuestions[indexNumber]; //gets current Question
  const currentQuestionAnswer = currentQuestion.correctOption; //gets current Question's answer
  const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)
  let correctOption = null;

  options.forEach((option) => {
    if (option.value === currentQuestionAnswer) {
      //get's correct's radio input with correct answer
      correctOption = option.labels[0].id;
    }
  });

  //checking to make sure a radio input has been checked or an option being chosen
  if (
    options[0].checked === false &&
    options[1].checked === false &&
    options[2].checked === false &&
    options[3].checked == false
  ) {
    if (questionTimesUp) {
      document.querySelector(".modal-content-container img").style.display =
        "none";
    } else {
      document.getElementById("option-modal").style.display = "flex";
      return;
    }
  }

  //checking if checked radio button is same as answer, if so display tick image
  options.forEach((option) => {
    if (option.checked && option.value !== currentQuestionAnswer) {
      document.querySelector(".modal-content-container img").style.display =
        "none";
    }
  });

  // display explanation modal
  document.querySelector(".explanation-detail").innerHTML =
    currentQuestion.explanation;
  document.querySelector(
    ".explanation-container .modal-content-container h1"
  ).innerHTML = `${currentQuestion.ans}. ${currentQuestion.correctOption}`;
  document.getElementById("explanation-modal").style.display = "flex";
  document.querySelector(".game-details-container").style.filter = "blur(5px)";
  document.querySelector(".game-question-container").style.filter = "blur(5px)";
  document.querySelector(".game-options-container").style.filter = "blur(5px)";
  document.querySelector(".foot-bar").style.filter = "blur(5px)";
}

//called when the continue button is clicked
function handleNextQuestion() {
  checkForAnswer();
  unCheckRadioButtons();

  //delays next question displaying for a second
  if (indexNumber <= 3) {
    resetOptionBackground();
    NextQuestion(indexNumber);
  } else {
    handleEndGame();
  }
  closeExplanationModal();

  document.querySelector(".modal-content-container img").style.display =
    "block"; //show tick image
}

//sets options background back to null after display the right/wrong colors
function resetOptionBackground() {
  const options = document.getElementsByName("option");
  options.forEach((option) => {
    document.getElementById(option.labels[0].id).style.background = "";
    document.getElementById(option.labels[0].id).style.height = "100%";
    document.getElementById(option.labels[0].id).style.width = "100%";
  });
}

// unchecking all radio buttons for next question(can be done with map or foreach loop also)
function unCheckRadioButtons() {
  const options = document.getElementsByName("option");
  for (let i = 0; i < options.length; i++) {
    options[i].checked = false;
  }
  let spans = document.querySelectorAll(".game-options-container span");
  for (const span of spans) {
    span.style.backgroundColor = "white";
  }
}

// function for when all questions being answered
function handleEndGame() {
  let remark = null;
  let remarkColor = null;

  // condition check for player remark and remark color
  if (playerScore <= 3) {
    remark = "Bad Grades, Keep Practicing.";
    remarkColor = "red";
  } else if (playerScore >= 4 && playerScore < 7) {
    remark = "Average Grades, You can do better.";
    remarkColor = "orange";
  } else if (playerScore >= 7) {
    remark = "Excellent, Keep the good work going.";
    remarkColor = "green";
  }
  const playerGrade = (playerScore / 10) * 100;

  //data to display to score board
  //hide the questions and options (jim)
  document.getElementById("user-score").innerHTML = playerScore;
  document.getElementsByClassName(
    "modal-content-container-result"
  )[0].style.height = "35rem";
  document.getElementsByClassName(
    "modal-content-container-result"
  )[0].style.width = "35rem";
  document.getElementsByClassName("game-question-container")[0].style.display =
    "none";
  document.getElementsByClassName("game-options-container")[0].style.display =
    "none";
  document.getElementsByClassName("score-container")[0].style.display = "none";
  document.getElementsByClassName("foot-bar")[0].style.display = "none";

  document.getElementsByClassName(
    "modal-content-container-result"
  )[0].style.backgroundColor = "rgb(0, 0, 0,0)";
  //data to display to score board
  // document.getElementById("remarks").innerHTML = remark;
  // document.getElementById("remarks").style.color = remarkColor;
  // document.getElementById("grade-percentage").innerHTML = playerGrade;
  // document.getElementById("wrong-answers").innerHTML = wrongAttempt;
  // document.getElementById("right-answers").innerHTML = playerScore;
  document.getElementById("score-modal").style.display = "flex";
}

//closes score modal and resets game
document
  .querySelector(".modal-button-img")
  .addEventListener("click", function closeScoreModal() {
    window.location.href = "index.html";
  });

//function to close warning modal
function closeOptionModal() {
  document.getElementById("option-modal").style.display = "none";
}
