/* ==========================================================
   NovaCart – Admin Panel Script (final version)
   Part 1: sidebar navigation, top bar, dashboard (recent activity CRUD)
   Part 2: user & role management – full CRUD
   Part 3: seller verification & product moderation – full CRUD
   Part 4: platform settings, analytics, notifications, system logs – full CRUD
   Part 5: final integration and cleanup
   All data is demonstration data, saved with localStorage.
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
  sellers: "Review seller applications and verify trusted sellers.",
  products: "Review reported products and moderate content.",
  settings: "Configure commission, categories and coupon policies.",
  analytics: "Track revenue, notifications and administrator activity."
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

// Notification bell: opens the Notifications tab (Analytics & Reports)
document.getElementById("notificationBtn").addEventListener("click", function () {
  setActiveMenu(document.querySelector('.menu-item[data-section="analytics"]'));
  showSection("analytics");
  showAnalyticsTab("notifications");
});

// "My Profile" and "Change Password" are demonstration links only
document.querySelectorAll(".demo-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    showToast(link.textContent + " is not part of this demo.", true);
  });
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
function showToast(message, skipLog) {
  if (!skipLog) addLog(message);
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
  document.querySelectorAll(".modal-backdrop").forEach(function (modal) {
    modal.classList.remove("show");
  });
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
document.querySelectorAll(".modal-backdrop").forEach(function (modal) {
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

  renderAnalyticsActivity();
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

// Update the overview numbers (dashboard, Seller Verification and Product Moderation pages)
function updateModerationStats() {
  const pendingSellers = countByStatus(sellers, "Pending");
  const pendingProducts = countByStatus(reportedProducts, "Pending");

  // Dashboard "Moderation Overview"
  document.getElementById("pendingSellers").textContent = pendingSellers;
  document.getElementById("pendingProducts").textContent = pendingProducts;
  document.getElementById("reportedProducts").textContent = reportedProducts.length;

  // Seller Verification page
  document.getElementById("sellerStatPending").textContent = pendingSellers;
  document.getElementById("sellerStatVerified").textContent = countByStatus(sellers, "Verified");
  document.getElementById("sellerStatRejected").textContent = countByStatus(sellers, "Rejected");

  // Product Moderation page
  document.getElementById("productStatPending").textContent = pendingProducts;
  document.getElementById("productStatApproved").textContent = countByStatus(reportedProducts, "Approved");
  document.getElementById("productStatRemoved").textContent = countByStatus(reportedProducts, "Removed");
}

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
// PLATFORM SETTINGS, ANALYTICS, NOTIFICATIONS, LOGS – CRUD (Part 4)
// ==========================================================
const REVENUE_KEY = "novacartRevenue";
const CATEGORIES_KEY = "novacartCategories";
const COUPONS_KEY = "novacartCoupons";
const NOTIFICATIONS_KEY = "novacartNotifications";
const LOGS_KEY = "novacartLogs";
const SETTINGS_KEY = "novacartSettings";

// ---------- Demonstration data ----------
// Category and Coupon fields follow the ER diagram (categoryName; code, discountType,
// discountValue, expiryDate). Revenue, notifications and logs are demo data.
const sampleRevenue = [
  { id: 1, month: "Jan", revenue: 165000, orders: 820 },
  { id: 2, month: "Feb", revenue: 178000, orders: 880 },
  { id: 3, month: "Mar", revenue: 192500, orders: 940 },
  { id: 4, month: "Apr", revenue: 210000, orders: 1030 },
  { id: 5, month: "May", revenue: 238000, orders: 1170 },
  { id: 6, month: "Jun", revenue: 262000, orders: 1280 }
];

const sampleCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Home & Kitchen" },
  { id: 4, name: "Books" },
  { id: 5, name: "Beauty & Health" },
  { id: 6, name: "Sports" }
];

const sampleCoupons = [
  { id: 1, code: "WELCOME10", type: "Percentage", value: 10,  expiry: "2026-12-31" },
  { id: 2, code: "FREESHIP",  type: "Fixed",      value: 50,  expiry: "2026-12-31" },
  { id: 3, code: "STUDENT15", type: "Percentage", value: 15,  expiry: "2027-03-31" },
  { id: 4, code: "EID100",    type: "Fixed",      value: 100, expiry: "2025-06-30" }
];

const sampleNotifications = [
  { id: 1, message: "New seller application received", date: "2025-11-10", status: "Unread" },
  { id: 2, message: "Product reported: Smart Watch Pro", date: "2025-11-09", status: "Unread" },
  { id: 3, message: "Monthly revenue report is ready", date: "2025-11-08", status: "Unread" },
  { id: 4, message: "Commission settings were reviewed", date: "2025-11-05", status: "Read" },
  { id: 5, message: "System backup completed", date: "2025-11-01", status: "Read" }
];

const sampleLogs = [
  { id: 1, description: "Verified seller Home Essentials", date: "2025-11-05" },
  { id: 2, description: "Suspended a user account",        date: "2025-11-04" },
  { id: 3, description: "Updated platform commission",     date: "2025-11-03" },
  { id: 4, description: "Added a new product category",    date: "2025-11-02" }
];

let revenueData = [];
let categories = [];
let coupons = [];
let notifications = [];
let logs = [];
let settings = { commission: 10 };

// ---------- Load everything ----------
function loadPlatform() {
  revenueData = loadList(REVENUE_KEY, sampleRevenue);
  categories = loadList(CATEGORIES_KEY, sampleCategories);
  coupons = loadList(COUPONS_KEY, sampleCoupons);
  notifications = loadList(NOTIFICATIONS_KEY, sampleNotifications);
  logs = loadList(LOGS_KEY, sampleLogs);

  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) settings = JSON.parse(saved);
  } catch (error) {
    console.log("Could not read saved settings:", error);
  }
  document.getElementById("commissionInput").value = settings.commission;

  renderRevenue();
  renderCategories();
  renderCoupons();
  renderNotifications();
  renderLogs();
  renderAnalyticsActivity();
}

// ---------- Tabs (Analytics, Notifications, System Logs) ----------
function showAnalyticsTab(tabName) {
  ["analytics", "notifications", "logs"].forEach(function (name) {
    document.querySelector('#analyticsTabs [data-atab="' + name + '"]').classList.toggle("active", name === tabName);
    document.getElementById("analyticsPanel-" + name).classList.toggle("active", name === tabName);
  });
}

document.querySelectorAll("#analyticsTabs .tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    showAnalyticsTab(tab.dataset.atab);
  });
});

// Money like "৳ 1,245,500"
function formatMoney(amount) {
  return "৳ " + formatNumber(amount);
}

// ==========================================================
// A. ANALYTICS – monthly revenue data (CRUD) + stats + chart
// ==========================================================

// READ: statistics, chart and table are all built from the monthly data
function renderRevenue() {
  let totalRevenue = 0;
  let totalOrders = 0;
  let maxRevenue = 0;

  revenueData.forEach(function (item) {
    totalRevenue += item.revenue;
    totalOrders += item.orders;
    if (item.revenue > maxRevenue) maxRevenue = item.revenue;
  });

  const average = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  document.getElementById("statRevenue").textContent = formatMoney(totalRevenue);
  document.getElementById("statOrders").textContent = formatNumber(totalOrders);
  document.getElementById("statAvgOrder").textContent =
    "৳ " + average.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Bar chart: each bar height is a percentage of the highest month
  const chart = document.getElementById("revenueChart");
  chart.innerHTML = "";
  if (revenueData.length === 0) {
    chart.innerHTML = "<p class='hint'>No revenue data yet.</p>";
  }
  revenueData.forEach(function (item) {
    const percent = maxRevenue > 0 ? Math.round((item.revenue / maxRevenue) * 100) : 0;
    const shortText = item.revenue >= 1000 ? Math.round(item.revenue / 1000) + "k" : item.revenue;
    const column = document.createElement("div");
    column.className = "bar-col";
    column.innerHTML =
      "<div class='bar-area'><div class='bar' style='height:" + percent + "%' title='" + formatMoney(item.revenue) + "'>" + shortText + "</div></div>" +
      "<span class='bar-label'>" + escapeHtml(item.month) + "</span>";
    chart.appendChild(column);
  });

  // Table
  const body = document.getElementById("revenueTableBody");
  body.innerHTML = "";
  if (revenueData.length === 0) {
    body.innerHTML = "<tr><td colspan='4' class='empty-row'>No monthly data.</td></tr>";
  }
  revenueData.forEach(function (item) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td><strong>" + escapeHtml(item.month) + "</strong></td>" +
      "<td>" + formatMoney(item.revenue) + "</td>" +
      "<td>" + formatNumber(item.orders) + "</td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn' data-action='edit' data-id='" + item.id + "'>✏️ Edit</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + item.id + "'>🗑️ Delete</button>" +
      "</div></td>";
    body.appendChild(row);
  });
}

// Analytics "Recent Activity" shows the latest dashboard activities
function renderAnalyticsActivity() {
  const list = document.getElementById("analyticsActivityList");
  list.innerHTML = "";

  if (activities.length === 0) {
    list.innerHTML = "<li class='time'>No recent activity.</li>";
  }
  activities.slice(0, 5).forEach(function (activity) {
    const item = document.createElement("li");
    item.innerHTML = "<span class='activity-text'>" + escapeHtml(activity.text) + "</span><span class='time'>" + escapeHtml(activity.time) + "</span>";
    list.appendChild(item);
  });
}

function openRevenueForm(id) {
  document.getElementById("revenueError").classList.remove("show");
  if (id) {
    const item = findById(revenueData, id);
    document.getElementById("revenueModalTitle").textContent = "Edit Monthly Data";
    document.getElementById("revenueId").value = item.id;
    document.getElementById("revenueMonth").value = item.month;
    document.getElementById("revenueAmount").value = item.revenue;
    document.getElementById("revenueOrders").value = item.orders;
  } else {
    document.getElementById("revenueModalTitle").textContent = "Add Monthly Data";
    document.getElementById("revenueId").value = "";
    document.getElementById("revenueMonth").value = "";
    document.getElementById("revenueAmount").value = "";
    document.getElementById("revenueOrders").value = "";
  }
  openModal(document.getElementById("revenueModal"));
}

// CREATE / UPDATE
function saveRevenueForm() {
  const idValue = document.getElementById("revenueId").value;
  const month = document.getElementById("revenueMonth").value.trim();
  const revenueText = document.getElementById("revenueAmount").value;
  const ordersText = document.getElementById("revenueOrders").value;

  if (month === "") {
    showError("revenueError", "Please enter the month.");
    return;
  }
  if (revenueText === "" || Number(revenueText) < 0 || ordersText === "" || Number(ordersText) < 0) {
    showError("revenueError", "Please enter valid revenue and order numbers.");
    return;
  }

  if (idValue) {
    const item = findById(revenueData, Number(idValue));
    item.month = month;
    item.revenue = Number(revenueText);
    item.orders = Math.round(Number(ordersText));
    showToast("Monthly data for " + month + " updated.");
  } else {
    revenueData.push({ id: getNextId(revenueData), month: month, revenue: Number(revenueText), orders: Math.round(Number(ordersText)) });
    showToast("Monthly data for " + month + " added.");
  }

  saveList(REVENUE_KEY, revenueData);
  closeModals();
  renderRevenue();
}

// DELETE
function deleteRevenue(id) {
  const item = findById(revenueData, id);
  if (!confirm("Permanently delete the data for " + item.month + "?")) return;

  revenueData = revenueData.filter(function (entry) {
    return entry.id !== id;
  });
  saveList(REVENUE_KEY, revenueData);
  renderRevenue();
  showToast("Monthly data for " + item.month + " deleted.");
}

document.getElementById("revenueTableBody").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit") openRevenueForm(id);
  if (button.dataset.action === "delete") deleteRevenue(id);
});
document.getElementById("addRevenueBtn").addEventListener("click", function () { openRevenueForm(null); });
document.getElementById("saveRevenueBtn").addEventListener("click", saveRevenueForm);
document.getElementById("cancelRevenueBtn").addEventListener("click", closeModals);

// ==========================================================
// B1. COMMISSION SETTINGS
// ==========================================================
function saveSettings() {
  const error = document.getElementById("settingsError");
  const value = document.getElementById("commissionInput").value;

  if (value === "" || Number(value) < 0 || Number(value) > 100) {
    error.textContent = "Commission must be a number between 0 and 100.";
    error.classList.add("show");
    return;
  }
  error.classList.remove("show");

  settings.commission = Number(value);
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.log("Could not save settings:", err);
  }
  showToast("Platform settings saved. Commission is now " + settings.commission + "%.");
}

document.getElementById("saveSettingsBtn").addEventListener("click", saveSettings);

// ==========================================================
// B2. PRODUCT CATEGORIES (CRUD)
// ==========================================================

// READ
function renderCategories() {
  const body = document.getElementById("categoryTableBody");
  body.innerHTML = "";

  if (categories.length === 0) {
    body.innerHTML = "<tr><td colspan='3' class='empty-row'>No categories.</td></tr>";
  }
  categories.forEach(function (category) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>#" + String(category.id).padStart(3, "0") + "</td>" +
      "<td><strong>" + escapeHtml(category.name) + "</strong></td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn' data-action='edit' data-id='" + category.id + "'>✏️ Edit</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + category.id + "'>🗑️ Delete</button>" +
      "</div></td>";
    body.appendChild(row);
  });
  document.getElementById("categoryCount").textContent = "Showing " + categories.length + " categories";
}

function openCategoryForm(id) {
  document.getElementById("categoryError").classList.remove("show");
  if (id) {
    const category = findById(categories, id);
    document.getElementById("categoryModalTitle").textContent = "Edit Category";
    document.getElementById("categoryId").value = category.id;
    document.getElementById("categoryNameInput").value = category.name;
  } else {
    document.getElementById("categoryModalTitle").textContent = "Add Category";
    document.getElementById("categoryId").value = "";
    document.getElementById("categoryNameInput").value = "";
  }
  openModal(document.getElementById("categoryModal"));
}

// CREATE / UPDATE
function saveCategoryForm() {
  const idValue = document.getElementById("categoryId").value;
  const name = document.getElementById("categoryNameInput").value.trim();

  if (name === "") {
    showError("categoryError", "Please enter the category name.");
    return;
  }
  const duplicate = categories.some(function (category) {
    return category.name.toLowerCase() === name.toLowerCase() && String(category.id) !== idValue;
  });
  if (duplicate) {
    showError("categoryError", "This category already exists.");
    return;
  }

  if (idValue) {
    findById(categories, Number(idValue)).name = name;
    showToast("Category updated: " + name + ".");
  } else {
    categories.push({ id: getNextId(categories), name: name });
    showToast("Category added: " + name + ".");
  }

  saveList(CATEGORIES_KEY, categories);
  closeModals();
  renderCategories();
}

// DELETE
function deleteCategory(id) {
  const category = findById(categories, id);
  if (!confirm("Permanently delete the category " + category.name + "?")) return;

  categories = categories.filter(function (item) {
    return item.id !== id;
  });
  saveList(CATEGORIES_KEY, categories);
  renderCategories();
  showToast("Category deleted: " + category.name + ".");
}

document.getElementById("categoryTableBody").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit") openCategoryForm(id);
  if (button.dataset.action === "delete") deleteCategory(id);
});
document.getElementById("addCategoryBtn").addEventListener("click", function () { openCategoryForm(null); });
document.getElementById("saveCategoryBtn").addEventListener("click", saveCategoryForm);
document.getElementById("cancelCategoryBtn").addEventListener("click", closeModals);

// ==========================================================
// B3. COUPON POLICIES (CRUD)
// ==========================================================

// READ
function renderCoupons() {
  const body = document.getElementById("couponTableBody");
  body.innerHTML = "";

  if (coupons.length === 0) {
    body.innerHTML = "<tr><td colspan='5' class='empty-row'>No coupons.</td></tr>";
  }
  coupons.forEach(function (coupon) {
    const discountText = coupon.type === "Percentage" ? coupon.value + "%" : formatMoney(coupon.value);
    const expiredText = coupon.expiry < getToday() ? " <span class='expired'>Expired</span>" : "";
    const row = document.createElement("tr");
    row.innerHTML =
      "<td><strong>" + escapeHtml(coupon.code) + "</strong></td>" +
      "<td>" + coupon.type + "</td>" +
      "<td>" + discountText + "</td>" +
      "<td>" + formatDate(coupon.expiry) + expiredText + "</td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn' data-action='edit' data-id='" + coupon.id + "'>✏️ Edit</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + coupon.id + "'>🗑️ Delete</button>" +
      "</div></td>";
    body.appendChild(row);
  });
  document.getElementById("couponCount").textContent = "Showing " + coupons.length + " coupons";
}

function openCouponForm(id) {
  document.getElementById("couponError").classList.remove("show");
  if (id) {
    const coupon = findById(coupons, id);
    document.getElementById("couponModalTitle").textContent = "Edit Coupon";
    document.getElementById("couponId").value = coupon.id;
    document.getElementById("couponCode").value = coupon.code;
    document.getElementById("couponType").value = coupon.type;
    document.getElementById("couponValue").value = coupon.value;
    document.getElementById("couponExpiry").value = coupon.expiry;
  } else {
    document.getElementById("couponModalTitle").textContent = "Add Coupon";
    document.getElementById("couponId").value = "";
    document.getElementById("couponCode").value = "";
    document.getElementById("couponType").value = "Percentage";
    document.getElementById("couponValue").value = "";
    document.getElementById("couponExpiry").value = "";
  }
  openModal(document.getElementById("couponModal"));
}

// CREATE / UPDATE
function saveCouponForm() {
  const idValue = document.getElementById("couponId").value;
  const code = document.getElementById("couponCode").value.trim().toUpperCase();
  const type = document.getElementById("couponType").value;
  const valueText = document.getElementById("couponValue").value;
  const expiry = document.getElementById("couponExpiry").value;

  if (code === "" || expiry === "") {
    showError("couponError", "Please enter the coupon code and expiry date.");
    return;
  }
  if (code.indexOf(" ") !== -1) {
    showError("couponError", "The coupon code cannot contain spaces.");
    return;
  }
  const value = Number(valueText);
  if (valueText === "" || value <= 0) {
    showError("couponError", "Please enter a discount value greater than 0.");
    return;
  }
  if (type === "Percentage" && value > 100) {
    showError("couponError", "A percentage discount cannot be more than 100.");
    return;
  }
  const duplicate = coupons.some(function (coupon) {
    return coupon.code === code && String(coupon.id) !== idValue;
  });
  if (duplicate) {
    showError("couponError", "This coupon code already exists.");
    return;
  }

  if (idValue) {
    const coupon = findById(coupons, Number(idValue));
    coupon.code = code;
    coupon.type = type;
    coupon.value = value;
    coupon.expiry = expiry;
    showToast("Coupon " + code + " updated.");
  } else {
    coupons.push({ id: getNextId(coupons), code: code, type: type, value: value, expiry: expiry });
    showToast("Coupon " + code + " added.");
  }

  saveList(COUPONS_KEY, coupons);
  closeModals();
  renderCoupons();
}

// DELETE
function deleteCoupon(id) {
  const coupon = findById(coupons, id);
  if (!confirm("Permanently delete the coupon " + coupon.code + "?")) return;

  coupons = coupons.filter(function (item) {
    return item.id !== id;
  });
  saveList(COUPONS_KEY, coupons);
  renderCoupons();
  showToast("Coupon " + coupon.code + " deleted.");
}

document.getElementById("couponTableBody").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit") openCouponForm(id);
  if (button.dataset.action === "delete") deleteCoupon(id);
});
document.getElementById("addCouponBtn").addEventListener("click", function () { openCouponForm(null); });
document.getElementById("saveCouponBtn").addEventListener("click", saveCouponForm);
document.getElementById("cancelCouponBtn").addEventListener("click", closeModals);

// ==========================================================
// C. NOTIFICATIONS (CRUD)
// ==========================================================

// The red number on the bell = unread notifications
function updateBell() {
  const unread = countByStatus(notifications, "Unread");
  const bell = document.getElementById("bellCount");
  bell.textContent = unread;
  bell.style.display = unread > 0 ? "" : "none";
}

// READ
function renderNotifications() {
  const body = document.getElementById("notificationTableBody");
  body.innerHTML = "";

  if (notifications.length === 0) {
    body.innerHTML = "<tr><td colspan='4' class='empty-row'>No notifications.</td></tr>";
  }
  notifications.forEach(function (note) {
    const toggleText = note.status === "Unread" ? "✔️ Mark Read" : "↩️ Mark Unread";
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + escapeHtml(note.message) + "</td>" +
      "<td>" + formatDate(note.date) + "</td>" +
      "<td><span class='badge status-" + note.status + "'>" + note.status + "</span></td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn success' data-action='toggle' data-id='" + note.id + "'>" + toggleText + "</button>" +
        "<button class='action-btn' data-action='edit' data-id='" + note.id + "'>✏️ Edit</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + note.id + "'>🗑️ Delete</button>" +
      "</div></td>";
    body.appendChild(row);
  });
  document.getElementById("notificationCount").textContent =
    "Showing " + notifications.length + " notifications (" + countByStatus(notifications, "Unread") + " unread)";
  updateBell();
}

function openNotificationForm(id) {
  document.getElementById("notificationError").classList.remove("show");
  if (id) {
    const note = findById(notifications, id);
    document.getElementById("notificationModalTitle").textContent = "Edit Notification";
    document.getElementById("notificationId").value = note.id;
    document.getElementById("notificationMessage").value = note.message;
    document.getElementById("notificationDate").value = note.date;
    document.getElementById("notificationStatus").value = note.status;
  } else {
    document.getElementById("notificationModalTitle").textContent = "Add Notification";
    document.getElementById("notificationId").value = "";
    document.getElementById("notificationMessage").value = "";
    document.getElementById("notificationDate").value = getToday();
    document.getElementById("notificationStatus").value = "Unread";
  }
  openModal(document.getElementById("notificationModal"));
}

// CREATE / UPDATE
function saveNotificationForm() {
  const idValue = document.getElementById("notificationId").value;
  const message = document.getElementById("notificationMessage").value.trim();
  const date = document.getElementById("notificationDate").value;
  const status = document.getElementById("notificationStatus").value;

  if (message === "" || date === "") {
    showError("notificationError", "Please enter the message and date.");
    return;
  }

  if (idValue) {
    const note = findById(notifications, Number(idValue));
    note.message = message;
    note.date = date;
    note.status = status;
    showToast("Notification updated.");
  } else {
    notifications.unshift({ id: getNextId(notifications), message: message, date: date, status: status });
    showToast("Notification added.");
  }

  saveList(NOTIFICATIONS_KEY, notifications);
  closeModals();
  renderNotifications();
}

// UPDATE: mark as read / unread (not written to the log)
function toggleNotification(id) {
  const note = findById(notifications, id);
  note.status = note.status === "Unread" ? "Read" : "Unread";
  saveList(NOTIFICATIONS_KEY, notifications);
  renderNotifications();
  showToast("Notification marked as " + note.status.toLowerCase() + ".", true);
}

// DELETE
function deleteNotification(id) {
  if (!confirm("Permanently delete this notification?")) return;

  notifications = notifications.filter(function (item) {
    return item.id !== id;
  });
  saveList(NOTIFICATIONS_KEY, notifications);
  renderNotifications();
  showToast("Notification deleted.");
}

document.getElementById("notificationTableBody").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === "toggle") toggleNotification(id);
  if (button.dataset.action === "edit") openNotificationForm(id);
  if (button.dataset.action === "delete") deleteNotification(id);
});
document.getElementById("addNotificationBtn").addEventListener("click", function () { openNotificationForm(null); });
document.getElementById("saveNotificationBtn").addEventListener("click", saveNotificationForm);
document.getElementById("cancelNotificationBtn").addEventListener("click", closeModals);

// ==========================================================
// D. SYSTEM LOGS (CRUD)
// ==========================================================

// CREATE (automatic): called by showToast() for every important action
function addLog(description) {
  logs.unshift({ id: getNextId(logs), description: description, date: getToday() });
  if (logs.length > 100) logs.pop();   // keep the list small
  saveList(LOGS_KEY, logs);
  renderLogs();
}

// READ
function renderLogs() {
  const body = document.getElementById("logTableBody");
  body.innerHTML = "";

  if (logs.length === 0) {
    body.innerHTML = "<tr><td colspan='3' class='empty-row'>No log entries.</td></tr>";
  }
  logs.forEach(function (log) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + escapeHtml(log.description) + "</td>" +
      "<td>" + formatDate(log.date) + "</td>" +
      "<td><div class='actions'>" +
        "<button class='action-btn' data-action='edit' data-id='" + log.id + "'>✏️ Edit</button>" +
        "<button class='action-btn danger' data-action='delete' data-id='" + log.id + "'>🗑️ Delete</button>" +
      "</div></td>";
    body.appendChild(row);
  });
  document.getElementById("logCount").textContent = "Showing " + logs.length + " log entries";
}

function openLogForm(id) {
  document.getElementById("logError").classList.remove("show");
  if (id) {
    const log = findById(logs, id);
    document.getElementById("logModalTitle").textContent = "Edit Log Entry";
    document.getElementById("logId").value = log.id;
    document.getElementById("logDescription").value = log.description;
    document.getElementById("logDate").value = log.date;
  } else {
    document.getElementById("logModalTitle").textContent = "Add Log Entry";
    document.getElementById("logId").value = "";
    document.getElementById("logDescription").value = "";
    document.getElementById("logDate").value = getToday();
  }
  openModal(document.getElementById("logModal"));
}

// CREATE / UPDATE (manual)
function saveLogForm() {
  const idValue = document.getElementById("logId").value;
  const description = document.getElementById("logDescription").value.trim();
  const date = document.getElementById("logDate").value;

  if (description === "" || date === "") {
    showError("logError", "Please enter the description and date.");
    return;
  }

  if (idValue) {
    const log = findById(logs, Number(idValue));
    log.description = description;
    log.date = date;
    showToast("Log entry updated.", true);
  } else {
    logs.unshift({ id: getNextId(logs), description: description, date: date });
    showToast("Log entry added.", true);
  }

  saveList(LOGS_KEY, logs);
  closeModals();
  renderLogs();
}

// DELETE
function deleteLog(id) {
  if (!confirm("Permanently delete this log entry?")) return;

  logs = logs.filter(function (item) {
    return item.id !== id;
  });
  saveList(LOGS_KEY, logs);
  renderLogs();
  showToast("Log entry deleted.", true);
}

document.getElementById("logTableBody").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit") openLogForm(id);
  if (button.dataset.action === "delete") deleteLog(id);
});
document.getElementById("addLogBtn").addEventListener("click", function () { openLogForm(null); });
document.getElementById("saveLogBtn").addEventListener("click", saveLogForm);
document.getElementById("cancelLogBtn").addEventListener("click", closeModals);

// ==========================================================
// START THE PAGE
// ==========================================================
loadUsers();
updateStats();
renderUsers();
loadModeration();
loadActivities();
renderActivities();
loadPlatform();
