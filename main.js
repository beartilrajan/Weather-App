const city = document.getElementById("city");
const search = document.getElementById("search");

search.addEventListener("click", getState);
addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getState();
  }
});

function getState() {
  const cityName = city.value;
  console.log(cityName);

  // Visual feedback + clear the input after Enter/click.
  search.style.backgroundColor = "#16a34a";
  city.value = "";

  // Revert back to the CSS-defined color shortly after.
  setTimeout(() => {
    search.style.backgroundColor = "";
  }, 50);
}
