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
let remainingTime;
let questions;
let hintCounter = 0;
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
  setGlobalTimer(userData.time);
}
// -------------------------------------------------------------------------------------------------------------------
// Timer
// -------------------------------------------------------------------------------------------------------------------
function setGlobalTimer(quizTime) {
  let intervalId;
  remainingTime = quizTime * 60 * 1000;

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
  if (checkMediaType(currentQuestion.A) === "image") {
    document.querySelector(".game-question-container").style.flexDirection =
      "column";
    let questionImage = document.getElementById("question-img").style;
    questionImage.background = `url("${currentQuestion.image}")`; // media in question
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
        currentQuestion[`${arr[i]}`]
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

document.querySelector(".hint-btn").addEventListener("click", function () {
  hintCounter++;
});

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

async function checkForAnswer() {
  const currentQuestion = shuffledQuestions[indexNumber]; //gets current Question
  const currentQuestionAnswer = currentQuestion.ans; //gets current Question's answer
  const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)
  const timeLeft =
    currentQuestion.time -
    formatTimeToSeconds(
      document.querySelector(".question-time-container").innerText
    );

  //if all are not checked, optionsArr = true
  let optionsArr = [...options].every((option) => !option.checked);
  if (optionsArr) {
    wrongAttempt++;
    indexNumber++;
    questionNumber++;
    await fetch(`/quiz/result`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz_guid: currentQuestion.quiz_guid,
        idx: currentQuestion.idx,
        time: currentQuestion.time,
        student_ans: "-",
        hints: hintCounter,
      }),
    });
  }

  options.forEach(async (option) => {
    if (option.checked) {
      indexNumber++;
      questionNumber++;
      await fetch(`/quiz/result`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_guid: currentQuestion.quiz_guid,
          idx: currentQuestion.idx,
          time: timeLeft,
          student_ans: option.value,
          hints: hintCounter,
        }),
      });
    }

    // if (option.checked && option.value === currentQuestionAnswer) {
    //   console.log("correct");
    //   indexNumber++;
    //   questionNumber++;
    // } else if (option.checked && option.value !== currentQuestionAnswer) {
    //   console.log("wrong");
    //   wrongAttempt++;
    //   indexNumber++;
    //   questionNumber++;
    // }
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

  if (indexNumber < shuffledQuestions.length) {
    resetOptionBackground();
    NextQuestion(indexNumber);
  } else {
    handleEndGame();
  }
  closeExplanationModal();

  hintCounter = 0;
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
async function handleEndGame() {
  //get the quiz result score
  const res = await fetch(`/quiz/details/${quiz_guid}`);
  const result = await res.json();
  let student_score = sumStudentScores(result);

  //data to display to score board
  document.getElementById("timer-time").innerText = getTimeSpent(
    remainingTime,
    userData.time
  );

  document.getElementById("user-score").innerHTML = student_score;

  //hide the questions and options (jim)
  document.getElementById("explanation-modal").style.display = "none";
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
// -------------------------------------------------------------------------------------------------------------------
//  Utils
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

function formatQuestionNumber(currentQuestion) {
  if (currentQuestion < 10) {
    return `00${currentQuestion}`;
  } else if (currentQuestion < 100) {
    return `0${currentQuestion}`;
  } else {
    return currentQuestion;
  }
}

function getTimeSpent(remainingTime, quizTime) {
  const timeSpent = quizTime * 60 * 1000 - remainingTime;
  const minutes = Math.floor(timeSpent / 60000);
  const seconds = Math.floor((timeSpent % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function formatTimeToSeconds(timeString) {
  const timeArr = timeString.split(":");
  const minutes = parseInt(timeArr[0]);
  const seconds = parseInt(timeArr[1]);
  return minutes * 60 + seconds;
}

function checkMediaType(media) {
  if (/\.(jpg|png|tif)$/i.test(media)) {
    return "image";
  } else if (/\.(mp3|ogg)$/i.test(media)) {
    return "audio";
  } else if (/\.(mp4)$/i.test(media)) {
    return "video";
  } else {
    return "unknown";
  }
}

function sumStudentScores(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i].student_score;
  }
  return sum;
}
