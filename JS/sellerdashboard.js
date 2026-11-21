// ----- Save and load tasks (plain text, one line per task: name|date) -----
// Remove the character we use as a separator
function cleanTaskText(text) {
    return text.split("|").join("").split("\n").join("");
}

function saveTasks() {
    const lines = [];

    for (let i = 0; i < tasks.length; i++) {
        lines.push(tasks[i].name + "|" + tasks[i].date);
    }

    localStorage.setItem("sellerTasks", lines.join("\n"));
}

function loadTasks() {
    const saved = localStorage.getItem("sellerTasks");
    const list = [];

    if (saved !== null && saved !== "") {
        const lines = saved.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split("|");
            list.push({ name: parts[0], date: parts[1] });
        }
    }

    return list;
}

// ----- Data -----
const tasks = loadTasks();
let editIndex = -1;
const totalPromotions = 0;

// ----- Get HTML elements -----
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");
const taskButton = document.getElementById("taskButton");
const cancelTask = document.getElementById("cancelTask");
const taskTable = document.getElementById("taskTable");

// ----- Summary cards -----
// Total orders comes from the orders saved by the Orders page (see sellertopbar.js)
document.getElementById("totalOrders").innerHTML = getOrderCounts().total;
document.getElementById("totalPromotions").innerHTML = totalPromotions;

// ----- Tasks -----
function displayTasks() {
    taskTable.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        let dueDate = tasks[i].date;
        if (dueDate == "") {
            dueDate = "-";
        }

        const row = "<tr>" +
            "<td>" + tasks[i].name + "</td>" +
            "<td>" + dueDate + "</td>" +
            '<td><button class="small" onclick="editTask(' + i + ')">Edit</button>' +
            '<button class="small danger" onclick="deleteTask(' + i + ')">Delete</button></td>' +
            "</tr>";

        taskTable.innerHTML += row;
    }

    if (tasks.length == 0) {
        taskTable.innerHTML = '<tr><td colspan="3">No tasks yet.</td></tr>';
    }
}

// Save the tasks, redraw the table and update the bell
function tasksChanged() {
    saveTasks();
    displayTasks();
    refreshNotifications();
}

// Add or update a task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const task = {
        name: cleanTaskText(taskName.value),
        date: taskDate.value
    };

    if (editIndex == -1) {
        tasks.push(task);
    } else {
        tasks[editIndex] = task;
        editIndex = -1;
        taskButton.innerHTML = "Add Task";
        cancelTask.style.display = "none";
    }

    taskForm.reset();
    tasksChanged();
});

// Put task into the form for editing
function editTask(index) {
    taskName.value = tasks[index].name;
    taskDate.value = tasks[index].date;
    editIndex = index;

    taskButton.innerHTML = "Update Task";
    cancelTask.style.display = "inline";
}

// Delete a task
function deleteTask(index) {
    const answer = confirm("Delete this task?");

    if (answer == true) {
        tasks.splice(index, 1);
        tasksChanged();
    }
}

// Cancel editing
cancelTask.addEventListener("click", function() {
    editIndex = -1;
    taskForm.reset();
    taskButton.innerHTML = "Add Task";
    cancelTask.style.display = "none";
});

// ----- Show everything when the page opens -----
displayTasks();
