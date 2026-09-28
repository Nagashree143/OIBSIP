const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display all tasks
function displayTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pending.forEach(task => {
        createTaskElement(task, pendingTasks);
    });

    completed.forEach(task => {
        createTaskElement(task, completedTasks);
    });

    // Update counts
    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;
    totalCount.textContent = tasks.length;

    // Empty messages
    pendingEmpty.style.display =
        pending.length === 0 ? "block" : "none";

    completedEmpty.style.display =
        completed.length === 0 ? "block" : "none";
}

// Create task
function createTaskElement(task, container) {

    const li = document.createElement("li");
    li.className = "task-item";

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    if (task.completed) {
        taskText.classList.add("completed-task");
    }

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    // Complete / Undo button
    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = task.completed ? "Undo" : "Complete";

    completeBtn.addEventListener("click", function () {

        task.completed = !task.completed;

        saveTasks();
        displayTasks();
    });

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", function () {

        const newText = prompt(
            "Edit your task:",
            task.text
        );

        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();
            displayTasks();
        }
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {

        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );

        if (confirmDelete) {

            tasks = tasks.filter(
                item => item.id !== task.id
            );

            saveTasks();
            displayTasks();
        }
    });

    buttons.appendChild(completeBtn);
    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    li.appendChild(taskText);
    li.appendChild(buttons);

    container.appendChild(li);
}

// Add new task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Add button
addTaskBtn.addEventListener("click", addTask);

// Press Enter to add
taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        addTask();
    }
});

// Load tasks when page opens
displayTasks();