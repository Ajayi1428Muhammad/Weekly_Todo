const listContainer = document.getElementById("list-container");
const inputBox = document.getElementById("input-box");
// select by class because in the HTML these are classes, not IDs
const addWeekPage = document.querySelector(".add-week-page");
const fullWeekPage = document.querySelector(".full-week-page");

function addWeek() {
  const taskText = inputBox.value.trim();
  if (!taskText) return;

  const li = document.createElement("li");
  li.innerHTML = `${taskText} <span>&times;</span>`;
  listContainer.appendChild(li);
  inputBox.value = ''
 saveData();
}

// When a week <li> is clicked: if the × (span) was clicked, remove the week;
// otherwise open the full-week view and hide the add-week view.
listContainer.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return; // click outside an li

  // if the span (remove button) was clicked
  if (e.target.tagName === "SPAN") {
    li.remove();
    if (typeof saveData === "function") saveData();
    return;
  }

  // otherwise: navigate to a standalone page for the selected week so the
  // browser's Back/Forward work as expected
  const weekName = li.firstChild ? li.firstChild.textContent.trim() : "";
  if (weekName) {
    const url = `week.html?week=${encodeURIComponent(weekName)}`;
    window.location.href = url;
  }
});

// Back button: hide full-week page and show add-week page
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    if (fullWeekPage) fullWeekPage.classList.add("hidden");
    if (addWeekPage) addWeekPage.classList.remove("hidden");
  });
}

// listContainer.addEventListener("click", (e) => {
//   if (e.target.tagName === "LI") {
//     e.target.classList.toggle("checked");
//     saveData();
//   } else if (e.target.tagName === "SPAN") {
//     e.target.parentElement.remove();
//     saveData();
//   }
// });

function saveData() {
  localStorage.setItem('data', listContainer.innerHTML)
}
function showTask() {
 listContainer.innerHTML = localStorage.getItem('data')
}
showTask()
