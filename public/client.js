console.log("Client-side log HOK");
// const btn = document.getElementById("submit-btn");
// btn.addEventListener("click", submitDataToServer);

document.addEventListener("DOMContentLoaded", function () {
  getReviews();
  getFilms();
  populateFilms();

  // event is deprecated - avoiding
  // Attach handlers here so the event object is passed to the callbacks
  const reviewBtn = document.getElementById("submitReview");
  if (reviewBtn) reviewBtn.addEventListener("click", submitReview);
});

// Submit clicked so post the data to the server
// Submit clicked so post the data to the server
function submitDataToServer(event) {
  // Use the passed event object instead of the deprecated global `event`.
  if (event && typeof event.preventDefault === "function")
    event.preventDefault();
  console.log("SUBMIT clicked!!!"); // display a message
  // create an object to post to the server
  // IMPORTANT: ONE NAME - VALUE PAIR FOR EACH FIELD
  let dataObj = {
    fname: document.getElementById("firstName").value,
    sname: document.getElementById("surName").value,
  };
  const requestMsg = new XMLHttpRequest();
  requestMsg.open("post", "/putData", true); // open a HTTP post request
  requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  requestMsg.send(JSON.stringify(dataObj));
}

function submitReview(e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  console.log("Submitted new review");

  let dataObj = {
    username: document.getElementById("username").value,
    film: document.getElementById("filmSelect").value,
    review: document.getElementById("review").value,
  };

  const requestMsg = new XMLHttpRequest();
  requestMsg.open("post", "/postReview", true);
  requestMsg.setRequestHeader("Content-Type", "application/json");
  requestMsg.send(JSON.stringify(dataObj));
}

// Make sure to call this function to get latest data
// getDataFromServer();
// Send a request to the server to query the db and send the data back
function getDataFromServer() {
  console.log("getData()"); // display a debug message
  // request the data from the database
  const requestMsg = new XMLHttpRequest();
  requestMsg.addEventListener("load", displayData); // attach a listener
  requestMsg.open("get", "/getData"); // open a HTTP GET request
  requestMsg.send();
}

function displayData() {
  console.log("displayData()");
  // define variables that reference elements on our page
  const rowList = document.getElementById("users");
  rowList.innerHTML = ""; // clear all the list items
  // parse our response to convert to JSON
  let users = JSON.parse(this.responseText);
  // iterate through every row and add it to our page
  users.forEach(function (row) {
    const newListItem = document.createElement("li");
    newListItem.innerHTML = row["film_name"] + " " + row["genre"];
    rowList.appendChild(newListItem);
  });
}

function displayReviews() {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";

  let reviews = JSON.parse(this.responseText);
  console.log(reviews);
}

function getReviews() {
  const requestMsg = new XMLHttpRequest();
  requestMsg.addEventListener("load", displayReviews);
  requestMsg.open("get", "/getReviews");
  requestMsg.send();
}

function getFilms() {
  const requestMsg = new XMLHttpRequest();
  requestMsg.addEventListener("load", displayFilms); // attach a listener
  requestMsg.open("get", "/getFilms");
  requestMsg.send();
}

function displayFilms() {
  console.log("displayFilms()");

  const filmsTable = document.getElementById("whatson");
  let films = JSON.parse(this.responseText);

  films.forEach((el) => {
    console.log(el);
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${el["film_name"]}</td><td>${el["genre"]}</td>`;
    filmsTable.appendChild(newRow);
  });
}

function populateFilms() {
  const requestMsg = new XMLHttpRequest();

  requestMsg.addEventListener("load", function () {
    const sel = document.getElementById("filmSelect");
    if (!sel) return;

    sel.innerHTML = "";

    try {
      const films = JSON.parse(this.responseText);
      if (!Array.isArray(films) || films.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No films available";
        sel.appendChild(opt);
        return;
      }

      films.forEach((f) => {
        const opt = document.createElement("option");
        opt.value = f.film_name;
        opt.textContent = f.film_name;
        sel.appendChild(opt);
      });
    } catch (e) {
      // Parsing or other error
      sel.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Error loading films";
      sel.appendChild(opt);
      console.error("populateFilmSelect error:", e);
    }
  });

  requestMsg.open("GET", "/getFilms");
  requestMsg.send();
}
