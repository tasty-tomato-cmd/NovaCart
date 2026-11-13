/* ==========================================================
   NovaCart – Admin Panel Script (Parts 1 and 2)
   Part 1: sidebar navigation, top bar, dashboard
   Part 2: user & role management – full CRUD (with localStorage)
   Part 1 CRUD: dashboard recent activity – add, edit, delete
   Part 3: seller verification & product moderation – full CRUD
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

// Seller applications. "storeName" and "verificationStatus" come from the ER diagram (Seller);
// the other fields are extra frontend-only details for this panel.
const sampleSellers = [
  { id: 1, storeName: "TechHub BD",      owner: "Rafiq Hasan",  appliedDate: "2025-11-10", storeInfo: "Electronics and mobile accessories", status: "Pending" },
  { id: 2, storeName: "Fashion World",   owner: "Nusrat Jahan", appliedDate: "2025-11-09", storeInfo: "Clothing and fashion items",        status: "Pending" },
  { id: 3, storeName: "Gadget Zone",     owner: "Tanvir Ahmed", appliedDate: "2025-11-08", storeInfo: "Smart gadgets and wearables",       status: "Pending" },
  { id: 4, storeName: "Home Essentials", owner: "Sadia Rahman", appliedDate: "2025-11-05", storeInfo: "Kitchen and home products",         status: "Verified" },
  { id: 5, storeName: "BookNest",        owner: "Karim Uddin",  appliedDate: "2025-11-02", storeInfo: "Books and stationery",              status: "Rejected" }
];

// Reported products. "productName", "price" and the seller come from the ER diagram (Product);
// the report reason, report date and moderation status are frontend-only details.
const sampleReportedProducts = [
  { id: 1, productName: "Wireless Earbuds X2",  sellerName: "TechHub BD",      price: 1850, reason: "Misleading product description", reportDate: "2025-11-11", status: "Pending" },
  { id: 2, productName: "Designer Handbag",     sellerName: "Fashion World",   price: 3200, reason: "Suspected counterfeit item",     reportDate: "2025-11-10", status: "Pending" },
  { id: 3, productName: "Smart Watch Pro",      sellerName: "Gadget Zone",     price: 4500, reason: "Incorrect price listed",         reportDate: "2025-11-09", status: "Pending" },
  { id: 4, productName: "Herbal Face Cream",    sellerName: "Home Essentials", price: 650,  reason: "Prohibited ingredient claim",    reportDate: "2025-11-06", status: "Removed" },
  { id: 5, productName: "Power Bank 20000mAh",  sellerName: "TechHub BD",      price: 2100, reason: "Safety concern reported",        reportDate: "2025-11-04", status: "Approved" }
];

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
const sellerModal = document.getElementById("sellerModal");
const productModal = document.getElementById("productModal");

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
    if (item.dataset.tab) showModerationTab(item.dataset.tab);
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
  sellerModal.classList.remove("show");
  productModal.classList.remove("show");
}

// ----- View user details -----
function viewUser(id) {
  const user = findUser(id);
  document.getElementById("viewTitle").textContent = "User Details";
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
[userModal, viewModal, activityModal, sellerModal, productModal].forEach(function (modal) {
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
// SELLER VERIFICATION & PRODUCT MODERATION – CRUD (Part 3)
// ==========================================================
const SELLERS_KEY = "novacartSellers";
const PRODUCTS_KEY = "novacartReportedProducts";
let sellers = [];
let reportedProducts = [];

// ---------- Helpers ----------
function loadList(key, sampleList) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.log("Could not read saved data:", error);
  }
  saveList(key, sampleList);
  return sampleList.slice();
}

function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    console.log("Could not save data:", error);
  }
}

// Next ID = highest ID + 1
function getNextId(list) {
  let newId = 1;
  list.forEach(function (item) {
    if (item.id >= newId) newId = item.id + 1;
  });
  return newId;
}

function findById(list, id) {
  return list.find(function (item) {
    return item.id === id;
  });
}

function countByStatus(list, status) {
  return list.filter(function (item) {
    return item.status === status;
  }).length;
}

function showError(elementId, message) {
  const error = document.getElementById(elementId);
  error.textContent = message;
  error.classList.add("show");
}

function loadModeration() {
  sellers = loadList(SELLERS_KEY, sampleSellers);
  reportedProducts = loadList(PRODUCTS_KEY, sampleReportedProducts);
  updateModerationStats();
  renderSellers();
  renderProducts();
}

// Update the overview numbers (moderation page, tab labels and dashboard)
function updateModerationStats() {
  const pendingSellers = countByStatus(sellers, "Pending");
  const pendingProducts = countByStatus(reportedProducts, "Pending");
  const reported = reportedProducts.length;

  document.getElementById("modPendingSellers").textContent = pendingSellers;
  document.getElementById("modPendingProducts").textContent = pendingProducts;
  document.getElementById("modReported").textContent = reported;

  document.getElementById("pendingSellers").textContent = pendingSellers;
  document.getElementById("pendingProducts").textContent = pendingProducts;
  document.getElementById("reportedProducts").textContent = reported;

  document.getElementById("tabSellers").textContent = "Seller Applications (" + pendingSellers + ")";
  document.getElementById("tabProducts").textContent = "Reported Products (" + pendingProducts + ")";
}

// ---------- Tabs ----------
function showModerationTab(tabName) {
  document.getElementById("tabSellers").classList.toggle("active", tabName === "sellers");
  document.getElementById("tabProducts").classList.toggle("active", tabName === "products");
  document.getElementById("panelSellers").classList.toggle("active", tabName === "sellers");
  document.getElementById("panelProducts").classList.toggle("active", tabName === "products");
}

document.querySelectorAll("#moderationTabs .tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    showModerationTab(tab.dataset.mtab);
  });
});

// ==========================================================
// A. SELLER APPLICATIONS
// ==========================================================

// READ: show all seller applications
function renderSellers() {
  const body = document.getElementById("sellerTableBody");
  body.innerHTML = "";

  if (sellers.length === 0) {
    body.innerHTML = "<tr><td colspan='5' class='empty-row'>No seller applications.</td></tr>";
  }

  sellers.forEach(function (seller) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td><strong>" + escapeHtml(seller.storeName) + "</strong></td>" +
      "<td>" + formatDate(seller.appliedDate) + "</td>" +
      "<td class='info-cell'>" + escapeHtml(seller.storeInfo) + "</td>" +
      "<td><span class='badge status-" + seller.status + "'>" + seller.status + "</span></td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn' data-action='view' data-id='" + seller.id + "'>👁️ View</button>" +
        (seller.status !== "Verified" ? "<button class='action-btn success' data-action='approve' data-id='" + seller.id + "'>✅ Verify</button>" : "") +
        (seller.status !== "Rejected" ? "<button class='action-btn danger' data-action='reject' data-id='" + seller.id + "'>❌ Reject</button>" : "") +
        "<button class='action-btn' data-action='edit' data-id='" + seller.id + "'>✏️ Edit</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + seller.id + "'>🗑️ Delete</button>" +
      "</div></td>";
    body.appendChild(row);
  });

  document.getElementById("sellerCount").textContent = "Showing " + sellers.length + " seller applications";
}

// READ: view details
function viewSeller(id) {
  const seller = findById(sellers, id);
  document.getElementById("viewTitle").textContent = "Seller Application";
  document.getElementById("viewDetails").innerHTML =
    "<div class='detail-row'><span>Application ID</span><span>#" + String(seller.id).padStart(3, "0") + "</span></div>" +
    "<div class='detail-row'><span>Store Name</span><span>" + escapeHtml(seller.storeName) + "</span></div>" +
    "<div class='detail-row'><span>Applicant</span><span>" + escapeHtml(seller.owner) + "</span></div>" +
    "<div class='detail-row'><span>Application Date</span><span>" + formatDate(seller.appliedDate) + "</span></div>" +
    "<div class='detail-row'><span>Store Information</span><span>" + escapeHtml(seller.storeInfo) + "</span></div>" +
    "<div class='detail-row'><span>Verification Status</span><span>" + seller.status + "</span></div>";
  openModal(viewModal);
}

// Open the form: no id = Add, with id = Edit
function openSellerForm(id) {
  document.getElementById("sellerError").classList.remove("show");

  if (id) {
    const seller = findById(sellers, id);
    document.getElementById("sellerModalTitle").textContent = "Edit Seller Application";
    document.getElementById("sellerId").value = seller.id;
    document.getElementById("sellerStoreName").value = seller.storeName;
    document.getElementById("sellerOwner").value = seller.owner;
    document.getElementById("sellerDate").value = seller.appliedDate;
    document.getElementById("sellerInfo").value = seller.storeInfo;
    document.getElementById("sellerStatus").value = seller.status;
  } else {
    document.getElementById("sellerModalTitle").textContent = "Add Seller Application";
    document.getElementById("sellerId").value = "";
    document.getElementById("sellerStoreName").value = "";
    document.getElementById("sellerOwner").value = "";
    document.getElementById("sellerDate").value = getToday();
    document.getElementById("sellerInfo").value = "";
    document.getElementById("sellerStatus").value = "Pending";
  }
  openModal(sellerModal);
}

// CREATE / UPDATE
function saveSellerForm() {
  const idValue = document.getElementById("sellerId").value;
  const storeName = document.getElementById("sellerStoreName").value.trim();
  const owner = document.getElementById("sellerOwner").value.trim();
  const appliedDate = document.getElementById("sellerDate").value;
  const storeInfo = document.getElementById("sellerInfo").value.trim();
  const status = document.getElementById("sellerStatus").value;

  if (storeName === "" || owner === "" || appliedDate === "" || storeInfo === "") {
    showError("sellerError", "Please fill in all fields.");
    return;
  }

  if (idValue) {
    const seller = findById(sellers, Number(idValue));
    seller.storeName = storeName;
    seller.owner = owner;
    seller.appliedDate = appliedDate;
    seller.storeInfo = storeInfo;
    seller.status = status;
    showToast("Seller application updated.");
  } else {
    sellers.unshift({ id: getNextId(sellers), storeName: storeName, owner: owner, appliedDate: appliedDate, storeInfo: storeInfo, status: status });
    showToast("Seller application added.");
  }

  saveList(SELLERS_KEY, sellers);
  closeModals();
  renderSellers();
  updateModerationStats();
}

// UPDATE: verify or reject an application
function setSellerStatus(id, status) {
  const seller = findById(sellers, id);
  seller.status = status;

  saveList(SELLERS_KEY, sellers);
  renderSellers();
  updateModerationStats();
  showToast(seller.storeName + " has been " + status.toLowerCase() + ".");
}

// DELETE: permanently remove an application
function deleteSeller(id) {
  const seller = findById(sellers, id);
  if (!confirm("Permanently delete the application of " + seller.storeName + "? This cannot be undone.")) return;

  sellers = sellers.filter(function (item) {
    return item.id !== id;
  });

  saveList(SELLERS_KEY, sellers);
  renderSellers();
  updateModerationStats();
  showToast("Seller application deleted.");
}

document.getElementById("sellerTableBody").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  if (action === "view") viewSeller(id);
  if (action === "edit") openSellerForm(id);
  if (action === "approve") setSellerStatus(id, "Verified");
  if (action === "reject") setSellerStatus(id, "Rejected");
  if (action === "delete") deleteSeller(id);
});

document.getElementById("addSellerBtn").addEventListener("click", function () {
  openSellerForm(null);
});
document.getElementById("saveSellerBtn").addEventListener("click", saveSellerForm);
document.getElementById("cancelSellerBtn").addEventListener("click", closeModals);

// ==========================================================
// B. REPORTED PRODUCTS
// ==========================================================

// READ: show all reported products
function renderProducts() {
  const body = document.getElementById("productTableBody");
  body.innerHTML = "";

  if (reportedProducts.length === 0) {
    body.innerHTML = "<tr><td colspan='6' class='empty-row'>No reported products.</td></tr>";
  }

  reportedProducts.forEach(function (product) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td><strong>" + escapeHtml(product.productName) + "</strong></td>" +
      "<td>" + escapeHtml(product.sellerName) + "</td>" +
      "<td class='info-cell'>" + escapeHtml(product.reason) + "</td>" +
      "<td>" + formatDate(product.reportDate) + "</td>" +
      "<td><span class='badge status-" + product.status + "'>" + product.status + "</span></td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn' data-action='view' data-id='" + product.id + "'>👁️ View</button>" +
        (product.status !== "Approved" ? "<button class='action-btn success' data-action='approve' data-id='" + product.id + "'>✅ Approve</button>" : "") +
        (product.status !== "Removed" ? "<button class='action-btn danger' data-action='reject' data-id='" + product.id + "'>❌ Remove</button>" : "") +
        "<button class='action-btn' data-action='edit' data-id='" + product.id + "'>✏️ Edit</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + product.id + "'>🗑️ Delete</button>" +
      "</div></td>";
    body.appendChild(row);
  });

  document.getElementById("productCount").textContent = "Showing " + reportedProducts.length + " reported products";
}

// READ: view details
function viewProduct(id) {
  const product = findById(reportedProducts, id);
  document.getElementById("viewTitle").textContent = "Reported Product";
  document.getElementById("viewDetails").innerHTML =
    "<div class='detail-row'><span>Report ID</span><span>#" + String(product.id).padStart(3, "0") + "</span></div>" +
    "<div class='detail-row'><span>Product Name</span><span>" + escapeHtml(product.productName) + "</span></div>" +
    "<div class='detail-row'><span>Seller</span><span>" + escapeHtml(product.sellerName) + "</span></div>" +
    "<div class='detail-row'><span>Price</span><span>৳ " + formatNumber(product.price) + "</span></div>" +
    "<div class='detail-row'><span>Report Reason</span><span>" + escapeHtml(product.reason) + "</span></div>" +
    "<div class='detail-row'><span>Report Date</span><span>" + formatDate(product.reportDate) + "</span></div>" +
    "<div class='detail-row'><span>Moderation Status</span><span>" + product.status + "</span></div>";
  openModal(viewModal);
}

// Open the form: no id = Add, with id = Edit
function openProductForm(id) {
  document.getElementById("productError").classList.remove("show");

  if (id) {
    const product = findById(reportedProducts, id);
    document.getElementById("productModalTitle").textContent = "Edit Reported Product";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.productName;
    document.getElementById("productSellerName").value = product.sellerName;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productReason").value = product.reason;
    document.getElementById("productDate").value = product.reportDate;
    document.getElementById("productStatus").value = product.status;
  } else {
    document.getElementById("productModalTitle").textContent = "Add Reported Product";
    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productSellerName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productReason").value = "";
    document.getElementById("productDate").value = getToday();
    document.getElementById("productStatus").value = "Pending";
  }
  openModal(productModal);
}

// CREATE / UPDATE
function saveProductForm() {
  const idValue = document.getElementById("productId").value;
  const productName = document.getElementById("productName").value.trim();
  const sellerName = document.getElementById("productSellerName").value.trim();
  const priceText = document.getElementById("productPrice").value;
  const reason = document.getElementById("productReason").value.trim();
  const reportDate = document.getElementById("productDate").value;
  const status = document.getElementById("productStatus").value;

  if (productName === "" || sellerName === "" || reason === "" || reportDate === "") {
    showError("productError", "Please fill in all fields.");
    return;
  }
  if (priceText === "" || Number(priceText) < 0) {
    showError("productError", "Please enter a valid price.");
    return;
  }
  const price = Number(priceText);

  if (idValue) {
    const product = findById(reportedProducts, Number(idValue));
    product.productName = productName;
    product.sellerName = sellerName;
    product.price = price;
    product.reason = reason;
    product.reportDate = reportDate;
    product.status = status;
    showToast("Reported product updated.");
  } else {
    reportedProducts.unshift({ id: getNextId(reportedProducts), productName: productName, sellerName: sellerName, price: price, reason: reason, reportDate: reportDate, status: status });
    showToast("Reported product added.");
  }

  saveList(PRODUCTS_KEY, reportedProducts);
  closeModals();
  renderProducts();
  updateModerationStats();
}

// UPDATE: approve or remove a reported product
function setProductStatus(id, status) {
  const product = findById(reportedProducts, id);
  product.status = status;

  saveList(PRODUCTS_KEY, reportedProducts);
  renderProducts();
  updateModerationStats();
  showToast(product.productName + " has been " + status.toLowerCase() + ".");
}

// DELETE: permanently remove a report
function deleteProduct(id) {
  const product = findById(reportedProducts, id);
  if (!confirm("Permanently delete the report for " + product.productName + "? This cannot be undone.")) return;

  reportedProducts = reportedProducts.filter(function (item) {
    return item.id !== id;
  });

  saveList(PRODUCTS_KEY, reportedProducts);
  renderProducts();
  updateModerationStats();
  showToast("Reported product deleted.");
}

document.getElementById("productTableBody").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  if (action === "view") viewProduct(id);
  if (action === "edit") openProductForm(id);
  if (action === "approve") setProductStatus(id, "Approved");
  if (action === "reject") setProductStatus(id, "Removed");
  if (action === "delete") deleteProduct(id);
});

document.getElementById("addProductBtn").addEventListener("click", function () {
  openProductForm(null);
});
document.getElementById("saveProductBtn").addEventListener("click", saveProductForm);
document.getElementById("cancelProductBtn").addEventListener("click", closeModals);

// ==========================================================
// START THE PAGE
// ==========================================================
loadUsers();
updateStats();
renderUsers();
loadModeration();
loadActivities();
renderActivities();
