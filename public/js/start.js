// -------------------------------------------------------------------------------------------------------------------
// get Data from Database
// -------------------------------------------------------------------------------------------------------------------
let userData;
const urlParams = new URLSearchParams(window.location.search);
const quiz_guid = urlParams.get("quiz");

(async function loadData() {
  const res = await fetch(`/user/details/${quiz_guid}`);
  let user = await res.json();
  userData = user[0];

  //load student details
  document.querySelector(".user-info-container").innerHTML =
    /*HTML*/
    `
<span id="name">${userData.student_name}</span>
<span id="student-code">(${userData.student_code})</span>
`;

  document.querySelector("#upper-player-score").innerHTML =
    userData.student_score;

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

  // set media
  if (checkMediaType(userData.midea) === "video") {
    document.querySelector(".media").innerHTML =
      /*HTML*/
      `
      <div id="light">
        <a class="boxclose" id="boxclose" onclick="lightbox_close();"></a>
          <video id="VisaChipCardVideo" width="600" controls>
            <source src="${userData.midea}" type="video/mp4">
          </video>
      </div>

      <div id="fade" onClick="lightbox_close();"></div>

      <div>
        <img style="cursor: pointer;" src="../assets/play_button.png" onclick="lightbox_open();" />
      </div>


      `;
  } else if (checkMediaType(userData.midea) === "image") {
    document.querySelector(".media").innerHTML =
      /*HTML*/
      `
      <img src="${userData.midea}" alt="image" width="20%" height="15%" />`;
  } else if (checkMediaType(userData.midea) === "audio") {
    document.querySelector(".media").innerHTML =
      /*HTML*/
      `
    <audio controls>
    <source src="${userData.midea}" type="audio/ogg">
    <source src="${userData.midea}" type="audio/mpeg">
  Your browser does not support the audio element.
  </audio>
    `;
  }
})();

document.querySelector("#continue").addEventListener("click", () => {
  window.location.href = `quiz.html?quiz=${quiz_guid}`;
});

// -------------------------------------------------------------------------------------------------------------------
// Utils
// -------------------------------------------------------------------------------------------------------------------

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

window.document.onkeydown = function (e) {
  if (e.keyCode == 27) {
    lightbox_close();
  }
};

function lightbox_open() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  window.scrollTo(0, 0);
  document.getElementById("light").style.display = "block";
  document.getElementById("fade").style.display = "block";
  lightBoxVideo.play();
}

function lightbox_close() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  document.getElementById("light").style.display = "none";
  document.getElementById("fade").style.display = "none";
  lightBoxVideo.pause();
}
