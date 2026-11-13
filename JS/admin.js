/* ==========================================================
   NovaCart – Admin Panel Script (Part 1)
   Handles: sidebar navigation, top bar, dashboard statistics
   ========================================================== */

// ---------- Demonstration data (will be connected to real data in later parts) ----------
const dashboardStats = {
  totalUsers: 12580,
  totalSellers: 1240,
  activeAccounts: 11980,
  suspendedAccounts: 120
};

const moderationStats = {
  pendingSellers: 5,
  pendingProducts: 8,
  reportedProducts: 3
};

const recentActivities = [
  { text: "New order received", time: "2 min ago" },
  { text: "Seller verified", time: "5 min ago" },
  { text: "Product reported", time: "12 min ago" },
  { text: "New user registered", time: "1 hour ago" }
];

// Short description shown in the top bar for each section
const sectionDescriptions = {
  dashboard: "Overview of users, sellers and platform activity.",
  users: "Manage users, roles and platform access.",
  moderation: "Review pending verifications and moderate content.",
  platform: "Configure platform settings and track performance."
};

// ---------- Get page elements ----------
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuItems = document.querySelectorAll(".menu-item[data-section]");
const sections = document.querySelectorAll(".section");
const topbarDescription = document.getElementById("topbarDescription");
const profileDropdown = document.getElementById("profileDropdown");
const toast = document.getElementById("toast");

// ---------- Sidebar navigation ----------
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

// ---------- Sidebar open/close (small screens) ----------
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

// ---------- Profile dropdown ----------
document.getElementById("profileBtn").addEventListener("click", function (event) {
  event.stopPropagation();
  profileDropdown.classList.toggle("show");
});

// Close the dropdown when clicking anywhere else
document.addEventListener("click", function () {
  profileDropdown.classList.remove("show");
});

// ---------- Notification bell ----------
document.getElementById("notificationBtn").addEventListener("click", function () {
  showToast("You have 3 new notifications.");
});

// ---------- Log out (demonstration only) ----------
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

// ---------- Toast confirmation message ----------
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

// ---------- Dashboard ----------
// Format numbers like 12580 -> 12,580
function formatNumber(number) {
  return number.toLocaleString("en-US");
}

function loadDashboardStats() {
  document.getElementById("statTotalUsers").textContent = formatNumber(dashboardStats.totalUsers);
  document.getElementById("statTotalSellers").textContent = formatNumber(dashboardStats.totalSellers);
  document.getElementById("statActive").textContent = formatNumber(dashboardStats.activeAccounts);
  document.getElementById("statSuspended").textContent = formatNumber(dashboardStats.suspendedAccounts);

  document.getElementById("pendingSellers").textContent = moderationStats.pendingSellers;
  document.getElementById("pendingProducts").textContent = moderationStats.pendingProducts;
  document.getElementById("reportedProducts").textContent = moderationStats.reportedProducts;
}

function loadRecentActivity() {
  const list = document.getElementById("activityList");
  list.innerHTML = "";

  recentActivities.forEach(function (activity) {
    const item = document.createElement("li");
    item.innerHTML = "<span>" + activity.text + "</span><span class='time'>" + activity.time + "</span>";
    list.appendChild(item);
  });
}

// ---------- Start the page ----------
loadDashboardStats();
loadRecentActivity();
