/* ==========================================================
   NovaCart – Admin Panel Script (Parts 1 and 2)
   Part 1: sidebar navigation, top bar, dashboard
   Part 2: user & role management – full CRUD (with localStorage)
   Part 1 CRUD: dashboard recent activity – add, edit, delete
   ========================================================== */

// ==========================================================
// DEMONSTRATION DATA
// ==========================================================

// Roles used in NovaCart (from the project proposal)
// User fields follow the ER diagram: userID, name, email, role.
// "status" and "joined" are extra frontend-only fields for this panel.
const sampleUsers = [
  { id: 1, name: "Lubaba", email: "lubaba@novacart.com", role: "Customer",         status: "Active", joined: "2025-01-15" },
  { id: 2, name: "Sazin",  email: "sazin@novacart.com",  role: "Seller",           status: "Active", joined: "2025-01-14" },
  { id: 3, name: "Fahad",  email: "fahad@novacart.com",  role: "Manager",          status: "Active", joined: "2025-01-11" },
  { id: 4, name: "Ameya",  email: "ameya@novacart.com",  role: "Administrator",    status: "Active", joined: "2025-01-12" },
  { id: 5, name: "Razeen", email: "razeen@novacart.com", role: "Delivery Partner", status: "Active", joined: "2025-01-10" }
];

// Moderation and activity numbers are still demo values (they become real in Part 3)
const moderationStats = {
  pendingSellers: 5,
  pendingProducts: 8,
  reportedProducts: 3
};

const sampleActivities = [
  { id: 1, text: "New order received", time: "2 min ago" },
  { id: 2, text: "Seller verified",    time: "5 min ago" },
  { id: 3, text: "Product reported",   time: "12 min ago" },
  { id: 4, text: "New user registered", time: "1 hour ago" }
];

// Short description shown in the top bar for each section
const sectionDescriptions = {
  dashboard: "Overview of users, sellers and platform activity.",
  users: "Manage users, roles and platform access.",
  moderation: "Review pending verifications and moderate content.",
  platform: "Configure platform settings and track performance."
};

// ==========================================================
// PAGE ELEMENTS
// ==========================================================
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuItems = document.querySelectorAll(".menu-item[data-section]");
const sections = document.querySelectorAll(".section");
const topbarDescription = document.getElementById("topbarDescription");
const profileDropdown = document.getElementById("profileDropdown");
const toast = document.getElementById("toast");

const userTableBody = document.getElementById("userTableBody");
const userSearch = document.getElementById("userSearch");
const roleFilter = document.getElementById("roleFilter");
const userTabs = document.querySelectorAll("#userTabs .tab");
const userModal = document.getElementById("userModal");
const viewModal = document.getElementById("viewModal");
const activityModal = document.getElementById("activityModal");

// ==========================================================
// SIDEBAR NAVIGATION (Part 1)
// ==========================================================

// Show one section and hide the others (no page reload)
function showSection(sectionName) {
  sections.forEach(function (section) {
    section.classList.remove("active");
  });
  document.getElementById("section-" + sectionName).classList.add("active");

  topbarDescription.textContent = sectionDescriptions[sectionName];
  closeSidebar();
}

// Highlight the clicked menu item
function setActiveMenu(clickedItem) {
  menuItems.forEach(function (item) {
    item.classList.remove("active");
  });
  clickedItem.classList.add("active");
}

menuItems.forEach(function (item) {
  item.addEventListener("click", function () {
    setActiveMenu(item);
    showSection(item.dataset.section);
  });
});

// Sidebar open/close (small screens)
function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("show");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("menuToggle").addEventListener("click", openSidebar);
overlay.addEventListener("click", closeSidebar);

// ==========================================================
// TOP BAR (Part 1)
// ==========================================================

// Profile dropdown
document.getElementById("profileBtn").addEventListener("click", function (event) {
  event.stopPropagation();
  profileDropdown.classList.toggle("show");
});

// Close the dropdown when clicking anywhere else
document.addEventListener("click", function () {
  profileDropdown.classList.remove("show");
});

// Notification bell
document.getElementById("notificationBtn").addEventListener("click", function () {
  showToast("You have 3 new notifications.");
});

// Log out (demonstration only)
function logOut() {
  if (confirm("Are you sure you want to log out?")) {
    showToast("Logged out (demo only).");
  }
}

document.getElementById("logoutBtn").addEventListener("click", logOut);
document.getElementById("dropdownLogout").addEventListener("click", function (event) {
  event.preventDefault();
  logOut();
});

// Toast confirmation message
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

// Format numbers like 12580 -> 12,580
function formatNumber(number) {
  return number.toLocaleString("en-US");
}

// Format "2025-01-15" -> "Jan 15, 2025"
function formatDate(dateText) {
  const date = new Date(dateText + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Today's date as "YYYY-MM-DD"
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// "John Doe" -> "JD"
function getInitials(name) {
  const words = name.trim().split(" ");
  let initials = words[0].charAt(0);
  if (words.length > 1) {
    initials += words[words.length - 1].charAt(0);
  }
  return initials.toUpperCase();
}

// Stops user text from being read as HTML
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// "Delivery Partner" -> "Delivery-Partner" (used for CSS class names)
function roleClass(role) {
  return "role-" + role.replace(" ", "-");
}

// ==========================================================
// USER DATA AND LOCALSTORAGE (Part 2)
// ==========================================================
const USERS_KEY = "novacartUsersV3";
let users = [];
let currentRole = "All";   // selected role (tab / dropdown)

// Load users from localStorage, or use the sample data the first time
function loadUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) {
      users = JSON.parse(saved);
      return;
    }
  } catch (error) {
    console.log("Could not read saved users:", error);
  }
  users = sampleUsers.slice();
  saveUsers();
}

function saveUsers() {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.log("Could not save users:", error);
  }
}

function findUser(id) {
  return users.find(function (user) {
    return user.id === id;
  });
}

// ==========================================================
// STATISTICS (dashboard + user management)
// ==========================================================
function updateStats() {
  const total = users.length;
  const sellers = users.filter(function (u) { return u.role === "Seller"; }).length;
  const active = users.filter(function (u) { return u.status === "Active"; }).length;
  const suspended = users.filter(function (u) { return u.status === "Suspended"; }).length;

  // Dashboard cards
  document.getElementById("statTotalUsers").textContent = formatNumber(total);
  document.getElementById("statTotalSellers").textContent = formatNumber(sellers);
  document.getElementById("statActive").textContent = formatNumber(active);
  document.getElementById("statSuspended").textContent = formatNumber(suspended);

  // User management cards
  document.getElementById("userStatTotal").textContent = formatNumber(total);
  document.getElementById("userStatSellers").textContent = formatNumber(sellers);
  document.getElementById("userStatActive").textContent = formatNumber(active);
  document.getElementById("userStatSuspended").textContent = formatNumber(suspended);
}

function loadModerationStats() {
  document.getElementById("pendingSellers").textContent = moderationStats.pendingSellers;
  document.getElementById("pendingProducts").textContent = moderationStats.pendingProducts;
  document.getElementById("reportedProducts").textContent = moderationStats.reportedProducts;
}

// ==========================================================
// USER TABLE: SEARCH, FILTER, DISPLAY
// ==========================================================

// Apply the role filter and the search text
function getFilteredUsers() {
  const searchText = userSearch.value.trim().toLowerCase();

  return users.filter(function (user) {
    const roleMatches = currentRole === "All" || user.role === currentRole;
    const idText = "#" + String(user.id).padStart(3, "0");
    const searchMatches =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      idText.includes(searchText);
    return roleMatches && searchMatches;
  });
}

function renderUsers() {
  const list = getFilteredUsers();
  userTableBody.innerHTML = "";

  if (list.length === 0) {
    userTableBody.innerHTML = "<tr><td colspan='7' class='empty-row'>No users found.</td></tr>";
  }

  list.forEach(function (user) {
    const isSuspended = user.status === "Suspended";
    const row = document.createElement("tr");

    row.innerHTML =
      "<td>#" + String(user.id).padStart(3, "0") + "</td>" +
      "<td><div class='user-cell'><span class='user-initials'>" + escapeHtml(getInitials(user.name)) + "</span>" +
        escapeHtml(user.name) + "</div></td>" +
      "<td>" + escapeHtml(user.email) + "</td>" +
      "<td><span class='badge " + roleClass(user.role) + "'>" + user.role + "</span></td>" +
      "<td><span class='badge status-" + user.status + "'>" + user.status + "</span></td>" +
      "<td>" + formatDate(user.joined) + "</td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn' data-action='view' data-id='" + user.id + "' title='View details'>👁️ View</button>" +
        "<button class='action-btn' data-action='edit' data-id='" + user.id + "' title='Edit user'>✏️ Edit</button>" +
        "<button class='action-btn " + (isSuspended ? "success" : "danger") + "' data-action='toggle' data-id='" + user.id + "' " +
          "title='" + (isSuspended ? "Reactivate account" : "Suspend account") + "'>" + (isSuspended ? "✅ Reactivate" : "🚫 Suspend") + "</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + user.id + "' title='Delete user permanently'>🗑️ Delete</button>" +
      "</div></td>";

    userTableBody.appendChild(row);
  });

  document.getElementById("userCount").textContent =
    "Showing " + list.length + " of " + users.length + " users";
}

// Change the selected role (keeps tabs and dropdown in sync)
function setRoleFilter(role) {
  currentRole = role;
  roleFilter.value = role;
  userTabs.forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.role === role);
  });
  renderUsers();
}

userTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    setRoleFilter(tab.dataset.role);
  });
});

roleFilter.addEventListener("change", function () {
  setRoleFilter(roleFilter.value);
});

userSearch.addEventListener("input", renderUsers);

// One click listener handles all View / Edit / Suspend buttons in the table
userTableBody.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "view") viewUser(id);
  if (button.dataset.action === "edit") openUserForm(id);
  if (button.dataset.action === "toggle") toggleSuspend(id);
  if (button.dataset.action === "delete") deleteUser(id);
});

// ==========================================================
// VIEW, ADD, EDIT, SUSPEND
// ==========================================================

function openModal(modal) {
  modal.classList.add("show");
}

function closeModals() {
  userModal.classList.remove("show");
  viewModal.classList.remove("show");
  activityModal.classList.remove("show");
}

// ----- View user details -----
function viewUser(id) {
  const user = findUser(id);
  document.getElementById("viewDetails").innerHTML =
    "<div class='detail-row'><span>User ID</span><span>#" + String(user.id).padStart(3, "0") + "</span></div>" +
    "<div class='detail-row'><span>Name</span><span>" + escapeHtml(user.name) + "</span></div>" +
    "<div class='detail-row'><span>Email</span><span>" + escapeHtml(user.email) + "</span></div>" +
    "<div class='detail-row'><span>Role</span><span>" + user.role + "</span></div>" +
    "<div class='detail-row'><span>Account Status</span><span>" + user.status + "</span></div>" +
    "<div class='detail-row'><span>Joined Date</span><span>" + formatDate(user.joined) + "</span></div>";
  openModal(viewModal);
}

// ----- Open the form: no id = Add User, with id = Edit User -----
function openUserForm(id) {
  const formError = document.getElementById("formError");
  formError.classList.remove("show");

  if (id) {
    const user = findUser(id);
    document.getElementById("userModalTitle").textContent = "Edit User";
    document.getElementById("userId").value = user.id;
    document.getElementById("userName").value = user.name;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userRole").value = user.role;
    document.getElementById("userStatus").value = user.status;
  } else {
    document.getElementById("userModalTitle").textContent = "Add User";
    document.getElementById("userId").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("userRole").value = "Customer";
    document.getElementById("userStatus").value = "Active";
  }
  openModal(userModal);
}

function showFormError(message) {
  const formError = document.getElementById("formError");
  formError.textContent = message;
  formError.classList.add("show");
}

// ----- Save the form (add or edit) -----
function saveUserForm() {
  const idValue = document.getElementById("userId").value;
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;
  const status = document.getElementById("userStatus").value;

  // Simple validation
  if (name === "") {
    showFormError("Please enter the user's name.");
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showFormError("Please enter a valid email address.");
    return;
  }
  const duplicate = users.some(function (user) {
    return user.email.toLowerCase() === email.toLowerCase() && String(user.id) !== idValue;
  });
  if (duplicate) {
    showFormError("This email is already used by another user.");
    return;
  }

  if (idValue) {
    // Edit existing user
    const user = findUser(Number(idValue));
    user.name = name;
    user.email = email;
    user.role = role;
    user.status = status;
    showToast("User updated successfully.");
  } else {
    // Add new user (next ID = highest ID + 1)
    let newId = 1;
    users.forEach(function (user) {
      if (user.id >= newId) newId = user.id + 1;
    });
    users.push({ id: newId, name: name, email: email, role: role, status: status, joined: getToday() });
    showToast("New user added successfully.");
  }

  saveUsers();
  closeModals();
  renderUsers();
  updateStats();
}

// ----- Suspend or reactivate an account -----
function toggleSuspend(id) {
  const user = findUser(id);

  if (user.status === "Active") {
    if (!confirm("Suspend the account of " + user.name + "?")) return;
    user.status = "Suspended";
    showToast(user.name + "'s account has been suspended.");
  } else {
    user.status = "Active";
    showToast(user.name + "'s account has been reactivated.");
  }

  saveUsers();
  renderUsers();
  updateStats();
}

// ----- Delete a user permanently (the "D" in CRUD) -----
function deleteUser(id) {
  const user = findUser(id);

  if (!confirm("Permanently delete " + user.name + "? This cannot be undone.")) return;

  // Keep every user except the deleted one
  users = users.filter(function (u) {
    return u.id !== id;
  });

  saveUsers();
  renderUsers();
  updateStats();
  showToast(user.name + " has been permanently deleted.");
}

// ----- Modal buttons -----
// Both "Add User" buttons (page header and above the table) open the same form
["addUserBtn", "addUserBtn2"].forEach(function (buttonId) {
  document.getElementById(buttonId).addEventListener("click", function () {
    openUserForm(null);
  });
});
document.getElementById("saveUserBtn").addEventListener("click", saveUserForm);
document.getElementById("cancelUserBtn").addEventListener("click", closeModals);
document.getElementById("closeViewBtn").addEventListener("click", closeModals);

// Close a modal by clicking the dark background or pressing Escape
[userModal, viewModal, activityModal].forEach(function (modal) {
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModals();
  });
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeModals();
});

// ==========================================================
// DASHBOARD RECENT ACTIVITY – CRUD (Part 1)
// Create, Read, Update and Delete activities (saved in localStorage)
// ==========================================================
const ACTIVITIES_KEY = "novacartActivities";
let activities = [];

// Load activities from localStorage, or use the sample data the first time
function loadActivities() {
  try {
    const saved = localStorage.getItem(ACTIVITIES_KEY);
    if (saved) {
      activities = JSON.parse(saved);
      return;
    }
  } catch (error) {
    console.log("Could not read saved activities:", error);
  }
  activities = sampleActivities.slice();
  saveActivities();
}

function saveActivities() {
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (error) {
    console.log("Could not save activities:", error);
  }
}

// READ: show all activities in the list
function renderActivities() {
  const list = document.getElementById("activityList");
  list.innerHTML = "";

  if (activities.length === 0) {
    list.innerHTML = "<li class='time'>No recent activity.</li>";
  }

  activities.forEach(function (activity) {
    const item = document.createElement("li");
    item.innerHTML =
      "<span class='activity-text'>" + escapeHtml(activity.text) + "</span>" +
      "<span class='time'>" + escapeHtml(activity.time) + "</span>" +
      "<div class='activity-actions'>" +
        "<button class='action-btn' data-action='edit' data-id='" + activity.id + "' title='Edit'>✏️</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + activity.id + "' title='Delete'>🗑️</button>" +
      "</div>";
    list.appendChild(item);
  });
}

// Open the form: no id = Add Activity, with id = Edit Activity
function openActivityForm(id) {
  document.getElementById("activityError").classList.remove("show");

  if (id) {
    const activity = activities.find(function (a) { return a.id === id; });
    document.getElementById("activityModalTitle").textContent = "Edit Activity";
    document.getElementById("activityId").value = activity.id;
    document.getElementById("activityText").value = activity.text;
    document.getElementById("activityTime").value = activity.time;
  } else {
    document.getElementById("activityModalTitle").textContent = "Add Activity";
    document.getElementById("activityId").value = "";
    document.getElementById("activityText").value = "";
    document.getElementById("activityTime").value = "Just now";
  }
  openModal(activityModal);
}

// CREATE / UPDATE: save the form
function saveActivityForm() {
  const idValue = document.getElementById("activityId").value;
  const text = document.getElementById("activityText").value.trim();
  const time = document.getElementById("activityTime").value.trim() || "Just now";

  if (text === "") {
    const error = document.getElementById("activityError");
    error.textContent = "Please enter the activity description.";
    error.classList.add("show");
    return;
  }

  if (idValue) {
    // UPDATE existing activity
    const activity = activities.find(function (a) { return a.id === Number(idValue); });
    activity.text = text;
    activity.time = time;
    showToast("Activity updated successfully.");
  } else {
    // CREATE new activity (next ID = highest ID + 1) and show it at the top
    let newId = 1;
    activities.forEach(function (a) {
      if (a.id >= newId) newId = a.id + 1;
    });
    activities.unshift({ id: newId, text: text, time: time });
    showToast("Activity added successfully.");
  }

  saveActivities();
  closeModals();
  renderActivities();
}

// DELETE: remove an activity permanently
function deleteActivity(id) {
  if (!confirm("Permanently delete this activity?")) return;

  activities = activities.filter(function (a) {
    return a.id !== id;
  });

  saveActivities();
  renderActivities();
  showToast("Activity deleted.");
}

// Buttons
document.getElementById("addActivityBtn").addEventListener("click", function () {
  openActivityForm(null);
});
document.getElementById("saveActivityBtn").addEventListener("click", saveActivityForm);
document.getElementById("cancelActivityBtn").addEventListener("click", closeModals);

// One click listener handles all Edit / Delete buttons in the list
document.getElementById("activityList").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit") openActivityForm(id);
  if (button.dataset.action === "delete") deleteActivity(id);
});

// ==========================================================
// START THE PAGE
// ==========================================================
loadUsers();
updateStats();
renderUsers();
loadModerationStats();
loadActivities();
renderActivities();
