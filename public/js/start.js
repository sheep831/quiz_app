// -------------------------------------------------------------------------------------------------------------------
// get Data from Database
// -------------------------------------------------------------------------------------------------------------------
let userData;

(async function loadData() {
  const res = await fetch("/user/details");
  let user = await res.json();
  userData = user[0];

  // const result = {
  //   question: "Please select an animal live in the enviroment shown in photo.",
  //   student_code: "S00001",
  //   student_id: 1,
  //   student_name: "波波' Lai",
  //   student_score: 10,
  //   time: 10,
  //   total_question: 5,
  //   total_score: 35,
  // };

  //load student details
  document.querySelector(".user-info-container").innerHTML =
    /*HTML*/
    `
<span id="name">${userData.student_name}</span>
<span id="student-code">(${userData.student_code})</span>
`;

  //load quiz header
  document.querySelector(".modal-content-container h2").innerHTML =
    userData.question;

  document.querySelector(".quiz-star").innerHTML =
    /*HTML*/
    `
<span>x ${userData.total_score}</span>
`;

  document.querySelector(".quiz-credit").innerHTML =
    /*HTML*/
    `
<span>${userData.total_question}</span>
`;

  document.querySelector(".quiz-time").innerHTML =
    /*HTML*/
    `
<span>${userData.time}:00</span>
`;
})();
