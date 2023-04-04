// -------------------------------------------------------------------------------------------------------------------
// Data from DB
// -------------------------------------------------------------------------------------------------------------------
const user = [
    {
      name: "Kelvin",
      surname: "Wong",
      SID: 500314,
    },
];
// -------------------------------------------------------------------------------------------------------------------
//  load Data from DB
// -------------------------------------------------------------------------------------------------------------------

(function loadUserDetails() { //load user details and date
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = yyyy + '/' + mm + '/' + dd;

    document.querySelector(".user-info").innerHTML =
      /*HTML*/
      `
    <span>${user[0].name} ${user[0].surname} (${user[0].SID})</span>
    `;

    document.querySelector(".date").innerHTML =
    /*HTML*/
    `
    <div>
    <span>Today</span>
    <span>${formattedToday}</span>
    </div>
  `;
})();
  

const start = document.querySelector('.lower');
start.addEventListener('click', function(event) {
  window.location.href = '/start.html';
});