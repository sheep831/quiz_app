// -------------------------------------------------------------------------------------------------------------------
// get Data from Database
// -------------------------------------------------------------------------------------------------------------------
let userData;

(async function loadData() {
  const res = await fetch("/user/details");
  let user = await res.json();
  userData = user[0];

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
