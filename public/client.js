console.log("Client-side log HOK");

document.addEventListener("DOMContentLoaded", function () {
  getReviews();
  getFilms();
  populateFilms();

  // event is deprecated - avoiding
  // Attach handlers here so the event object is passed to the callbacks
  const reviewBtn = document.getElementById("submitReview");
  if (reviewBtn) reviewBtn.addEventListener("click", submitReview);
});

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

  alert("Review submitted successfully.");
}

function displayReviews() {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";

  let reviews = JSON.parse(this.responseText);
  reviews.reverse(); // Show newest reviews first

  reviews.forEach(function (row) {
    const header = document.createElement("h2");
    header.innerHTML =
      row["user_name"] + ` reviewed <em>${row["film_name"]}</em>:`;

    const reviewText = document.createElement("p");
    reviewText.innerHTML = row["review"];

    reviewList.appendChild(header);
    reviewList.appendChild(reviewText);
  });
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
