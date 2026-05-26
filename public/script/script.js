// HTML ELEMENTEN OPHALEN
const taskInput       = document.getElementById("taskInput");
const categorySelect  = document.getElementById("categorySelect");
const addTaskBtn      = document.getElementById("addTaskBtn");
const taskContainer   = document.getElementById("taskContainer");
const errorMessage    = document.getElementById("errorMessage");

// ARRAY MET TAKEN
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// TAKEN OPSLAAN
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// TAKEN ELEMENT MAKEN
function createTaskElement(task, index) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");

  if (task.completed) taskDiv.classList.add("completed");

  taskDiv.innerHTML = `
    <h3>${task.text}</h3>
    <p>Categorie: ${task.category}</p>
    <p>Datum: ${new Date(task.date).toLocaleDateString("nl-NL")}</p>
    <div class="task-buttons">
      <button onclick="toggleTask(${index})">${task.completed ? "Open" : "Voltooid"}</button>
      <button onclick="editTask(${index})">Bewerken</button>
      <button onclick="deleteTask(${index})">Verwijderen</button>
    </div>
  `;

  return taskDiv;
}

// TAKEN TONEN
function renderTasks(taskList = tasks) {
  taskContainer.innerHTML = "";

  taskList.forEach((task, index) => {
    taskContainer.appendChild(createTaskElement(task, index));
  });
}

// TAAK TOEVOEGEN
function addTask() {
  const taskText     = taskInput.value.trim();
  const taskCategory = categorySelect.value;

  // CONTROLE
  if (taskText === "") {
    errorMessage.textContent = "Voer eerst een taak in";
    return;
  } else {
    errorMessage.textContent = "";
  }

  // NIEUWE TAAK
  const newTask = {
    text:      taskText,
    category:  taskCategory,
    completed: false,
    date:      new Date(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
}

// TAAK VOLTOOIEN
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// TAAK VERWIJDEREN
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// TAAK BEWERKEN
function editTask(index) {
  const newText = prompt("Nieuwe tekst:", tasks[index].text);

  if (newText && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// FILTEREN: ALLE TAKEN
function showAllTasks() {
  renderTasks(tasks);
}

// FILTEREN: VOLTOOIDE TAKEN
function showCompletedTasks() {
  const completedTasks = tasks.filter((task) => task.completed === true);
  renderTasks(completedTasks);
}

// FILTEREN: OPEN TAKEN
function showOpenTasks() {
  const openTasks = tasks.filter((task) => task.completed === false);
  renderTasks(openTasks);
}

// KEYBOARD SUPPORT
// addTaskBtn.addEventListener("click", addTask); // Verwijderd, nu via form onsubmit

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// PAGINA LADEN
renderTasks();

// Functies globaal beschikbaar maken
window.addTask           = addTask;
window.toggleTask        = toggleTask;
window.deleteTask        = deleteTask;
window.editTask          = editTask;
window.showAllTasks      = showAllTasks;
window.showCompletedTasks = showCompletedTasks;
window.showOpenTasks     = showOpenTasks;