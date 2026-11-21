// ----- Shared top bar for every seller page -----
// Shows the seller name + photo, the notification bell and the logout button.
// Load this file BEFORE the page's own JS file.

// ----- Get HTML elements -----
const notifBtn = document.getElementById("notifBtn");
const notifPanel = document.getElementById("notifPanel");
const notifList = document.getElementById("notifList");
const notifBadge = document.getElementById("notifBadge");

// ----- Name and photo -----
function refreshTopbar() {
    const name = localStorage.getItem("seller_owner") || "Mahir";
    const photo = localStorage.getItem("seller_photo");
    const avatar = document.getElementById("headerAvatar");

    document.getElementById("welcomeName").innerHTML = name;
    document.getElementById("sidebarName").innerHTML = name;

    if (photo) {
        avatar.style.backgroundImage = 'url("' + photo + '")';
        avatar.innerHTML = "";
    } else {
        avatar.style.backgroundImage = "none";
        avatar.innerHTML = name.charAt(0).toUpperCase();
    }
}

// ----- Saved data (plain text, written by the other pages) -----
// Orders are saved as one line per order: id|customer|product|amount|status
function getOrderCounts() {
    const saved = localStorage.getItem("sellerOrders");
    const counts = { total: 3, pending: 1 };   // sample numbers until the Orders page saves its own

    if (saved === null) {
        return counts;
    }

    counts.total = 0;
    counts.pending = 0;

    if (saved !== "") {
        const lines = saved.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split("|");
            counts.total++;
            if (parts[4] == "Pending") {
                counts.pending++;
            }
        }
    }

    return counts;
}

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

// Tasks are saved as one line per task: name|date
function getDueTaskCount() {
    const saved = localStorage.getItem("sellerTasks");
    const today = getToday();
    let due = 0;

    if (saved !== null && saved !== "") {
        const lines = saved.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split("|");
            if (parts[1] != "" && parts[1] <= today) {
                due++;
            }
        }
    }

    return due;
}

// ----- Notifications -----
function refreshNotifications() {
    const messages = [];

    const pendingOrders = getOrderCounts().pending;
    if (pendingOrders > 0) {
        messages.push({ icon: "🛒", text: pendingOrders + " pending order(s) waiting for you." });
    }

    const dueTasks = getDueTaskCount();
    if (dueTasks > 0) {
        messages.push({ icon: "📝", text: dueTasks + " task(s) due today or overdue." });
    }

    // Show the messages in the panel
    notifList.innerHTML = "";
    let allText = "";

    for (let i = 0; i < messages.length; i++) {
        notifList.innerHTML += '<div class="notif-item">' +
            '<span class="notif-icon">' + messages[i].icon + "</span>" +
            "<div>" + messages[i].text + "</div></div>";
        allText += messages[i].text + "|";
    }

    if (messages.length == 0) {
        notifList.innerHTML = '<div class="notif-empty">You are all caught up!</div>';

        // Nothing to show, so the next notification will count as new
        localStorage.removeItem("sellerNotifSeen");
    }

    // Red badge: shown only when there is something new since the bell was last opened
    if (messages.length > 0 && localStorage.getItem("sellerNotifSeen") != allText) {
        notifBadge.innerHTML = messages.length;
        notifBadge.style.display = "flex";
    } else {
        notifBadge.style.display = "none";
    }

    notifBadge.setAttribute("data-text", allText);
}

// Open / close the notification panel
notifBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    notifPanel.classList.toggle("open");

    // Opening the bell marks the current notifications as seen
    localStorage.setItem("sellerNotifSeen", notifBadge.getAttribute("data-text"));
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
refreshTopbar();
refreshNotifications();
