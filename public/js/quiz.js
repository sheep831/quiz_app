// Define a function to fetch data and then execute the NextQuestion function
async function loadAndStart() {
  await loadData();
  NextQuestion(0);
}

window.onload = loadAndStart;

// -------------------------------------------------------------------------------------------------------------------
// get Data from Database
// -------------------------------------------------------------------------------------------------------------------
let userData;
let questions;
const urlParams = new URLSearchParams(window.location.search);
const quiz_guid = urlParams.get("quiz");

async function loadData() {
  try {
    const res = await Promise.all([
      fetch(`/user/details/${quiz_guid}`),
      fetch(`/quiz/details/${quiz_guid}`),
    ]);
    const data = await Promise.all(res.map((item) => item.json()));
    userData = data[0][0];
    questions = data[1];
  } catch (e) {
    console.log(e);
  }

  //load student details
  document.querySelector(".user-info-container").innerHTML =
    /*HTML*/
    `
    <span>${userData.student_name}</span><br>
    <span>(${userData.student_code})</span>
    `;

  document.querySelector("#upper-player-score").innerHTML =
    userData.student_score;

  document.querySelector(".total-question-no").innerHTML = questions.length;

  //set the global timer when game starts
  setGlobalTimer(userData.time, formatTime);
}
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
      let timesUp = remainingTime <= 0 ? true : false;
      remainingTime -= 1000;
      if (timesUp) {
        // if time is up
        clearInterval(intervalId);
        handleEndGame();
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
    if (questionTimesUp) {
      closeHintModal();
    }

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
  while (shuffledQuestions.length < questions.length) {
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
let wrongAttempt = 0;
let indexNumber = 0;

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
    questionImage.minHeight = "100px";

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
  } else {
    document.getElementById("option-one-label").innerHTML = currentQuestion.A;
    document.getElementById("option-two-label").innerHTML = currentQuestion.B;
    document.getElementById("option-three-label").innerHTML = currentQuestion.C;
    document.getElementById("option-four-label").innerHTML = currentQuestion.D;
  }

  //set game details
  document.querySelector(".question-no").innerHTML = questionNumber;
  document.querySelector(".question-number").innerHTML =
    formatQuestionNumber(questionNumber);
  document.getElementById("player-score").innerHTML =
    /*HTML*/
    `
   <span>${currentQuestion.score}</span>
   `;

  document.getElementById("display-question").innerHTML =
    currentQuestion.question;
}

// function for displaying next question in the array to dom
function NextQuestion(index) {
  handleQuestions();
  const currentQuestion = shuffledQuestions[index];
  document.getElementById("question-img").style = "";

  //function to open hint modal
  document.querySelector(".hint-btn").addEventListener("click", function () {
    document.querySelector(".hint-detail").innerHTML = currentQuestion.hints;
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
  setQuestionTimer(currentQuestion, formatTime);

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
      indexNumber++;
      questionNumber++;
    } else if (option.checked && option.value !== currentQuestionAnswer) {
      wrongAttempt++;
      indexNumber++;
      questionNumber++;
    }
  });
}

//check if answer is correct when the user clicks the continue button
function checkForTick(questionTimesUp) {
  const currentQuestion = shuffledQuestions[indexNumber]; //gets current Question
  const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)

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
    if (option.checked && option.value !== currentQuestion.ans) {
      document.querySelector(".modal-content-container img").style.display =
        "none";
    }
  });

  // display explanation modal
  document.querySelector(".explanation-detail").innerHTML =
    currentQuestion.explanation;
  document.querySelector(
    ".explanation-container .modal-content-container h1"
  ).innerHTML = `${currentQuestion.ans}. ${
    currentQuestion[currentQuestion.ans]
  }`;
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
  if (indexNumber < shuffledQuestions.length) {
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

  //data to display to score board
  //hide the questions and options (jim)
  document.getElementById("explanation-modal").style.display = "none";
  document.getElementById("user-score").innerHTML = 1;
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
  document.getElementById("score-modal").style.display = "flex";
}

function formatQuestionNumber(currentQuestion) {
  if (currentQuestion < 10) {
    return `00${currentQuestion}`;
  } else if (currentQuestion < 100) {
    return `0${currentQuestion}`;
  } else {
    return currentQuestion;
  }
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
