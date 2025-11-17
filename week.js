// Read week name from query string and populate page header
const params = new URLSearchParams(window.location.search);
const weekName = params.get("week") || "Week";
const titleEl = document.querySelector(".week-title");
if (titleEl) titleEl.textContent = weekName;

// Back button should use history.back() to leverage browser navigation
const backBtn = document.getElementById("backBtn");
if (backBtn) backBtn.addEventListener("click", () => history.back());

// Storage key per week
const STORAGE_KEY = `week_${weekName}`;
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // initialize empty structure
      const empty = {};
      DAYS.forEach((d) => (empty[d] = []));
      return empty;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse stored week data", err);
    const empty = {};
    DAYS.forEach((d) => (empty[d] = []));
    return empty;
  }
}

function saveData(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function renderDay(day, items) {
  const ul = document.querySelector(`.day-list[data-day="${day}"]`);
  if (!ul) return;
  ul.innerHTML = "";
  items.forEach((task, idx) => {
    const li = document.createElement("li");
    if (task.checked) li.classList.add("checked");
    const textNode = document.createTextNode(task.text);
    li.appendChild(textNode);
    // remove button
    const span = document.createElement("span");
    span.innerHTML = "&times;";
    li.appendChild(span);
    li.dataset.index = idx;
    ul.appendChild(li);
  });
}

function renderAll() {
  const data = getData();
  DAYS.forEach((day) => renderDay(day, data[day] || []));
}

// wire up delegated events for add/remove/toggle
document.addEventListener("click", (e) => {
  const dataObj = getData();

  // add task
  const addBtn = e.target.closest(".add-task-btn");
  if (addBtn) {
    const day = addBtn.dataset.day;
    const input = document.querySelector(`.day-input[data-day="${day}"]`);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    if (!Array.isArray(dataObj[day])) dataObj[day] = [];
    dataObj[day].push({ text, checked: false });
    saveData(dataObj);
    renderDay(day, dataObj[day]);
    input.value = "";
    return;
  }

  // remove task (clicked the × inside a li)
  const removeSpan = e.target.closest(".day-list li span");
  if (removeSpan) {
    const li = removeSpan.closest("li");
    const ul = removeSpan.closest("ul");
    const day = ul && ul.dataset.day;
    if (!li || !day) return;
    const idx = parseInt(li.dataset.index, 10);
    if (isNaN(idx)) return;
    dataObj[day].splice(idx, 1);
    saveData(dataObj);
    renderDay(day, dataObj[day]);
    return;
  }

  // toggle checked when clicking a list item (but not the span)
  const liClicked = e.target.closest(".day-list li");
  if (liClicked && !e.target.closest("span")) {
    const ul = liClicked.closest("ul");
    const day = ul && ul.dataset.day;
    const idx = parseInt(liClicked.dataset.index, 10);
    if (!day || isNaN(idx)) return;
    dataObj[day][idx].checked = !dataObj[day][idx].checked;
    saveData(dataObj);
    renderDay(day, dataObj[day]);
    return;
  }
});

// initial render
renderAll();
