const sellerName = "Mahir";
const tasks = [];
let editIndex = -1;

// Sample numbers for the cards and notifications
const totalOrders = 3;
const pendingOrders = 1;
const totalPromotions = 0;
const pendingPromotions = 0;

// Seen notifications (used to hide the red badge after opening the bell)
let seenCount = -1;

// ----- Get HTML elements -----
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");
const taskButton = document.getElementById("taskButton");
const cancelTask = document.getElementById("cancelTask");
const taskTable = document.getElementById("taskTable");

const notifBtn = document.getElementById("notifBtn");
const notifPanel = document.getElementById("notifPanel");
const notifList = document.getElementById("notifList");
const notifBadge = document.getElementById("notifBadge");

// ----- Welcome message, summary cards and avatar -----
document.getElementById("welcomeName").innerHTML = sellerName;
document.getElementById("totalOrders").innerHTML = totalOrders;
document.getElementById("totalPromotions").innerHTML = totalPromotions;
document.getElementById("headerAvatar").innerHTML = sellerName.charAt(0).toUpperCase();

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

    showNotifications();
}

// Add or update a task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const task = {
        name: taskName.value,
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
    displayTasks();
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
        displayTasks();
    }
}

// Cancel editing
cancelTask.addEventListener("click", function() {
    editIndex = -1;
    taskForm.reset();
    taskButton.innerHTML = "Add Task";
    cancelTask.style.display = "none";
});

// ----- Notifications -----
// Today's date as YYYY-MM-DD
function getToday() {
    const d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    return d.getFullYear() + "-" + month + "-" + day;
}

function showNotifications() {
    const messages = [];

    if (pendingOrders > 0) {
        messages.push(pendingOrders + " pending order(s) waiting for you.");
    }

    if (pendingPromotions > 0) {
        messages.push(pendingPromotions + " promotion request(s) awaiting approval.");
    }

    // Count tasks that are due today or overdue
    const today = getToday();
    let dueTasks = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].date != "" && tasks[i].date <= today) {
            dueTasks++;
        }
    }
    if (dueTasks > 0) {
        messages.push(dueTasks + " task(s) due today or overdue.");
    }

    // Show messages in the panel
    notifList.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        notifList.innerHTML += '<div class="notif-item">' + messages[i] + "</div>";
    }
    if (messages.length == 0) {
        notifList.innerHTML = '<div class="notif-item">You are all caught up!</div>';
    }

    // Show the red badge only for notifications not seen yet
    if (messages.length > 0 && messages.length != seenCount) {
        notifBadge.innerHTML = messages.length;
        notifBadge.style.display = "flex";
    } else {
        notifBadge.style.display = "none";
    }

    notifBadge.setAttribute("data-count", messages.length);
}

// Open / close the notification panel
notifBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    notifPanel.classList.toggle("open");

    seenCount = Number(notifBadge.getAttribute("data-count"));
    notifBadge.style.display = "none";
});

// Close the panel when clicking anywhere else
document.addEventListener("click", function(event) {
    if (!notifPanel.contains(event.target)) {
        notifPanel.classList.remove("open");
    }
});

// ----- Logout -----
function logOut() {
    alert("You have been logged out.");
    window.location.href = "../LOGIN/HTML/login.html";
}

document.getElementById("logoutBtn").addEventListener("click", logOut);

// ----- Show everything when the page opens -----
displayTasks();