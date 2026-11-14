/* ==========================================================
   NovaCart – Admin Panel (JavaScript)
   All data is demonstration data kept in arrays.
   Every module has Create, Read, Update and Delete (CRUD).
   ========================================================== */

// ==========================================================
// DATA
// ==========================================================
let users = [
  { id: 1, name: "Lubaba", email: "lubaba@novacart.com", role: "Customer", status: "Active", joined: "2025-01-15" },
  { id: 2, name: "Sazin", email: "sazin@novacart.com", role: "Seller", status: "Active", joined: "2025-01-14" },
  { id: 3, name: "Fahad", email: "fahad@novacart.com", role: "Manager", status: "Active", joined: "2025-01-11" },
  { id: 4, name: "Ameya", email: "ameya@novacart.com", role: "Administrator", status: "Active", joined: "2025-01-12" },
  { id: 5, name: "Razeen", email: "razeen@novacart.com", role: "Delivery Partner", status: "Active", joined: "2025-01-10" }
];

let activities = [
  { id: 1, text: "New order received", time: "2 min ago" },
  { id: 2, text: "Seller verified", time: "5 min ago" },
  { id: 3, text: "Product reported", time: "12 min ago" },
  { id: 4, text: "New user registered", time: "1 hour ago" }
];

let sellers = [
  { id: 1, storeName: "TechHub BD", owner: "Rafiq Hasan", date: "2025-11-10", info: "Electronics and mobile accessories", status: "Pending" },
  { id: 2, storeName: "Fashion World", owner: "Nusrat Jahan", date: "2025-11-09", info: "Clothing and fashion items", status: "Pending" },
  { id: 3, storeName: "Gadget Zone", owner: "Tanvir Ahmed", date: "2025-11-08", info: "Smart gadgets and wearables", status: "Pending" },
  { id: 4, storeName: "Home Essentials", owner: "Sadia Rahman", date: "2025-11-05", info: "Kitchen and home products", status: "Verified" },
  { id: 5, storeName: "BookNest", owner: "Karim Uddin", date: "2025-11-02", info: "Books and stationery", status: "Rejected" }
];

let products = [
  { id: 1, name: "Wireless Earbuds X2", seller: "TechHub BD", price: 1850, reason: "Misleading product description", date: "2025-11-11", status: "Pending" },
  { id: 2, name: "Designer Handbag", seller: "Fashion World", price: 3200, reason: "Suspected counterfeit item", date: "2025-11-10", status: "Pending" },
  { id: 3, name: "Smart Watch Pro", seller: "Gadget Zone", price: 4500, reason: "Incorrect price listed", date: "2025-11-09", status: "Pending" },
  { id: 4, name: "Herbal Face Cream", seller: "Home Essentials", price: 650, reason: "Prohibited ingredient claim", date: "2025-11-06", status: "Removed" },
  { id: 5, name: "Power Bank 20000mAh", seller: "TechHub BD", price: 2100, reason: "Safety concern reported", date: "2025-11-04", status: "Approved" }
];

let commission = 10;

let categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Home & Kitchen" },
  { id: 4, name: "Books" },
  { id: 5, name: "Beauty & Health" },
  { id: 6, name: "Sports" }
];

let coupons = [
  { id: 1, code: "WELCOME10", type: "Percentage", value: 10, expiry: "2026-12-31" },
  { id: 2, code: "FREESHIP", type: "Fixed", value: 50, expiry: "2026-12-31" },
  { id: 3, code: "STUDENT15", type: "Percentage", value: 15, expiry: "2027-03-31" },
  { id: 4, code: "EID100", type: "Fixed", value: 100, expiry: "2025-06-30" }
];

let revenueData = [
  { id: 1, month: "Jan", revenue: 165000, orders: 820 },
  { id: 2, month: "Feb", revenue: 178000, orders: 880 },
  { id: 3, month: "Mar", revenue: 192500, orders: 940 },
  { id: 4, month: "Apr", revenue: 210000, orders: 1030 },
  { id: 5, month: "May", revenue: 238000, orders: 1170 },
  { id: 6, month: "Jun", revenue: 262000, orders: 1280 }
];

let notifications = [
  { id: 1, message: "New seller application received", date: "2025-11-10", status: "Unread" },
  { id: 2, message: "Product reported: Smart Watch Pro", date: "2025-11-09", status: "Unread" },
  { id: 3, message: "Monthly revenue report is ready", date: "2025-11-08", status: "Unread" },
  { id: 4, message: "Commission settings were reviewed", date: "2025-11-05", status: "Read" },
  { id: 5, message: "System backup completed", date: "2025-11-01", status: "Read" }
];

let logs = [
  { id: 1, description: "Verified seller Home Essentials", date: "2025-11-05" },
  { id: 2, description: "Suspended a user account", date: "2025-11-04" },
  { id: 3, description: "Updated platform commission", date: "2025-11-03" },
  { id: 4, description: "Added a new product category", date: "2025-11-02" }
];

// Which item is being edited? 0 means "adding a new item".
let editingUserId = 0;
let editingActivityId = 0;
let editingSellerId = 0;
let editingProductId = 0;
let editingCategoryId = 0;
let editingCouponId = 0;
let editingRevenueId = 0;
let editingNotificationId = 0;
let editingLogId = 0;

let currentRole = "All";

// ==========================================================
// SMALL HELPER FUNCTIONS
// ==========================================================
function getValue(id) {
  return document.getElementById(id).value;
}

function setValue(id, value) {
  document.getElementById(id).value = value;
}

function setText(id, text) {
  document.getElementById(id).innerText = text;
}

function show(id) {
  document.getElementById(id).style.display = "block";
}

function hide(id) {
  document.getElementById(id).style.display = "none";
}

// Confirmation message at the top of the page
function showMessage(text) {
  setText("message", text);
}

// Find an item in an array using its id
function findById(list, id) {
  for (let item of list) {
    if (item.id === id) {
      return item;
    }
  }
}

// Next id = highest id + 1
function getNextId(list) {
  let highest = 0;
  for (let item of list) {
    if (item.id > highest) {
      highest = item.id;
    }
  }
  return highest + 1;
}

// Delete an item from an array
function removeItem(list, id) {
  let item = findById(list, id);
  let index = list.indexOf(item);
  list.splice(index, 1);
}

// Count the items that have a given status
function countStatus(list, status) {
  let count = 0;
  for (let item of list) {
    if (item.status === status) {
      count++;
    }
  }
  return count;
}

function money(amount) {
  return "৳ " + amount;
}

// ==========================================================
// SIDEBAR AND TOP BAR
// ==========================================================
let sectionNames = ["dashboard", "users", "sellers", "products", "settings", "analytics"];

let descriptions = {
  dashboard: "Overview of users, sellers and platform activity.",
  users: "Manage users, roles and platform access.",
  sellers: "Review seller applications and verify trusted sellers.",
  products: "Review reported products and moderate content.",
  settings: "Configure commission, categories and coupon policies.",
  analytics: "Track revenue, notifications and administrator activity."
};

// Show one section and hide the others (no page reload)
function showSection(name) {
  for (let section of sectionNames) {
    document.getElementById("section-" + section).style.display = "none";
    document.getElementById("menu-" + section).className = "menu-item";
  }
  document.getElementById("section-" + name).style.display = "block";
  document.getElementById("menu-" + name).className = "menu-item active";
  setText("description", descriptions[name]);
  hide("profileMenu");
  showMessage("");
}

function toggleProfile() {
  let menu = document.getElementById("profileMenu");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

function profileLink(name) {
  hide("profileMenu");
  showMessage(name + " is not part of this demo.");
}

function logOut() {
  hide("profileMenu");
  showMessage("Logged out (demo only).");
}

// The bell opens the Notifications tab
function openNotifications() {
  showSection("analytics");
  showAnalyticsTab("notifications");
}

// The number on the bell = unread notifications
function updateBell() {
  let unread = countStatus(notifications, "Unread");
  setText("bellCount", unread);
  if (unread === 0) {
    hide("bellCount");
  } else {
    document.getElementById("bellCount").style.display = "inline";
  }
}

// ==========================================================
// DASHBOARD – RECENT ACTIVITY (CRUD)
// ==========================================================

// READ
function showActivities() {
  let html = "<tr><th>Activity</th><th>Time</th><th>Actions</th></tr>";
  let listHtml = "";

  for (let activity of activities) {
    html += "<tr><td>" + activity.text + "</td><td>" + activity.time + "</td><td>" +
      "<button class='small' onclick='openActivityForm(" + activity.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteActivity(" + activity.id + ")'>Delete</button>" +
      "</td></tr>";
    listHtml += "<li>" + activity.text + " (" + activity.time + ")</li>";
  }

  if (activities.length === 0) {
    html += "<tr><td colspan='3'>No recent activity.</td></tr>";
  }
  document.getElementById("activityTable").innerHTML = html;
  document.getElementById("analyticsActivity").innerHTML = listHtml;
}

// Open the form: id 0 = Add, otherwise Edit
function openActivityForm(id) {
  editingActivityId = id;
  setText("activityError", "");

  if (id === 0) {
    setText("activityLegend", "Add Activity");
    setValue("activityText", "");
    setValue("activityTime", "Just now");
  } else {
    let activity = findById(activities, id);
    setText("activityLegend", "Edit Activity");
    setValue("activityText", activity.text);
    setValue("activityTime", activity.time);
  }
  show("activityForm");
}

// CREATE and UPDATE
function saveActivity() {
  let text = getValue("activityText").trim();
  let time = getValue("activityTime").trim();

  if (text === "") {
    setText("activityError", "Please enter the activity description.");
    return;
  }
  if (time === "") {
    time = "Just now";
  }

  if (editingActivityId === 0) {
    activities.unshift({ id: getNextId(activities), text: text, time: time });
    showMessage("Activity added successfully.");
  } else {
    let activity = findById(activities, editingActivityId);
    activity.text = text;
    activity.time = time;
    showMessage("Activity updated successfully.");
  }
  hide("activityForm");
  showActivities();
}

// DELETE
function deleteActivity(id) {
  removeItem(activities, id);
  showMessage("Activity deleted.");
  showActivities();
}

// ==========================================================
// USER MANAGEMENT (CRUD)
// ==========================================================

// Statistics cards (dashboard and user page) come from the users array
function updateStats() {
  let sellerCount = 0;
  let active = countStatus(users, "Active");
  let suspended = countStatus(users, "Suspended");

  for (let user of users) {
    if (user.role === "Seller") {
      sellerCount++;
    }
  }

  setText("statTotalUsers", users.length);
  setText("statTotalSellers", sellerCount);
  setText("statActive", active);
  setText("statSuspended", suspended);

  setText("userStatTotal", users.length);
  setText("userStatSellers", sellerCount);
  setText("userStatActive", active);
  setText("userStatSuspended", suspended);
}

// READ: show the table (uses the selected role and the search box)
function showUsers() {
  let search = getValue("userSearch").toLowerCase();
  let html = "<tr><th>ID</th><th>User Name</th><th>Email</th><th>Role</th><th>Account Status</th><th>Joined Date</th><th>Actions</th></tr>";
  let count = 0;

  for (let user of users) {
    let roleMatches = currentRole === "All" || user.role === currentRole;
    let searchMatches = user.name.toLowerCase().indexOf(search) !== -1 ||
      user.email.toLowerCase().indexOf(search) !== -1;

    if (roleMatches && searchMatches) {
      count++;
      let suspendButton = "<button class='small danger' onclick='toggleUser(" + user.id + ")'>Suspend</button>";
      if (user.status === "Suspended") {
        suspendButton = "<button class='small good' onclick='toggleUser(" + user.id + ")'>Reactivate</button>";
      }

      html += "<tr><td>#" + user.id + "</td>" +
        "<td>" + user.name + "</td>" +
        "<td>" + user.email + "</td>" +
        "<td>" + user.role + "</td>" +
        "<td><span class='badge status-" + user.status + "'>" + user.status + "</span></td>" +
        "<td>" + user.joined + "</td>" +
        "<td><button class='small' onclick='viewUser(" + user.id + ")'>View</button>" +
        "<button class='small' onclick='openUserForm(" + user.id + ")'>Edit</button>" +
        suspendButton +
        "<button class='small danger' onclick='deleteUser(" + user.id + ")'>Delete</button></td></tr>";
    }
  }

  if (count === 0) {
    html += "<tr><td colspan='7'>No users found.</td></tr>";
  }
  document.getElementById("userTable").innerHTML = html;
  setText("userCount", "Showing " + count + " of " + users.length + " users");
  updateStats();
}

// Role tabs and the role dropdown both call this function
function filterRole(role) {
  currentRole = role;
  setValue("roleFilter", role);

  let tabs = document.querySelectorAll("#roleTabs button");
  for (let tab of tabs) {
    if (tab.value === role) {
      tab.className = "tab active";
    } else {
      tab.className = "tab";
    }
  }
  showUsers();
}

// READ: view details
function viewUser(id) {
  let user = findById(users, id);
  document.getElementById("userDetailsText").innerHTML = "<strong>User Details</strong><br>" +
    "ID: #" + user.id + "<br>Name: " + user.name + "<br>Email: " + user.email +
    "<br>Role: " + user.role + "<br>Account Status: " + user.status + "<br>Joined Date: " + user.joined;
  show("userDetails");
}

// Open the form: id 0 = Add, otherwise Edit
function openUserForm(id) {
  editingUserId = id;
  setText("userError", "");

  if (id === 0) {
    setText("userLegend", "Add User");
    setValue("userName", "");
    setValue("userEmail", "");
    setValue("userRole", "Customer");
    setValue("userStatus", "Active");
    setValue("userJoined", "");
  } else {
    let user = findById(users, id);
    setText("userLegend", "Edit User");
    setValue("userName", user.name);
    setValue("userEmail", user.email);
    setValue("userRole", user.role);
    setValue("userStatus", user.status);
    setValue("userJoined", user.joined);
  }
  show("userForm");
}

// CREATE and UPDATE
function saveUser() {
  let name = getValue("userName").trim();
  let email = getValue("userEmail").trim();
  let role = getValue("userRole");
  let status = getValue("userStatus");
  let joined = getValue("userJoined");

  // Validation
  if (name === "") {
    setText("userError", "Please enter the user's name.");
    return;
  }
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    setText("userError", "Please enter a valid email address.");
    return;
  }
  for (let user of users) {
    if (user.email.toLowerCase() === email.toLowerCase() && user.id !== editingUserId) {
      setText("userError", "This email is already used by another user.");
      return;
    }
  }
  if (joined === "") {
    setText("userError", "Please select the joined date.");
    return;
  }

  if (editingUserId === 0) {
    users.push({ id: getNextId(users), name: name, email: email, role: role, status: status, joined: joined });
    showMessage("New user added successfully.");
  } else {
    let user = findById(users, editingUserId);
    user.name = name;
    user.email = email;
    user.role = role;
    user.status = status;
    user.joined = joined;
    showMessage("User updated successfully.");
  }
  hide("userForm");
  showUsers();
}

// UPDATE: suspend or reactivate
function toggleUser(id) {
  let user = findById(users, id);
  if (user.status === "Active") {
    user.status = "Suspended";
    showMessage(user.name + "'s account has been suspended.");
  } else {
    user.status = "Active";
    showMessage(user.name + "'s account has been reactivated.");
  }
  showUsers();
}

// DELETE
function deleteUser(id) {
  let user = findById(users, id);
  removeItem(users, id);
  showMessage(user.name + " has been permanently deleted.");
  showUsers();
}

// ==========================================================
// SELLER VERIFICATION (CRUD)
// ==========================================================

// READ
function showSellers() {
  let html = "<tr><th>Store Name</th><th>Applied Date</th><th>Store Information</th><th>Verification Status</th><th>Actions</th></tr>";

  for (let seller of sellers) {
    html += "<tr><td><strong>" + seller.storeName + "</strong></td>" +
      "<td>" + seller.date + "</td>" +
      "<td>" + seller.info + "</td>" +
      "<td><span class='badge status-" + seller.status + "'>" + seller.status + "</span></td>" +
      "<td><button class='small' onclick='viewSeller(" + seller.id + ")'>View</button>" +
      "<button class='small good' onclick='verifySeller(" + seller.id + ")'>Verify</button>" +
      "<button class='small danger' onclick='rejectSeller(" + seller.id + ")'>Reject</button>" +
      "<button class='small' onclick='openSellerForm(" + seller.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteSeller(" + seller.id + ")'>Delete</button></td></tr>";
  }

  if (sellers.length === 0) {
    html += "<tr><td colspan='5'>No seller applications.</td></tr>";
  }
  document.getElementById("sellerTable").innerHTML = html;
  setText("sellerCount", "Showing " + sellers.length + " seller applications");
  updateModerationStats();
}

function viewSeller(id) {
  let seller = findById(sellers, id);
  document.getElementById("sellerDetailsText").innerHTML = "<strong>Seller Application</strong><br>" +
    "Application ID: #" + seller.id + "<br>Store Name: " + seller.storeName + "<br>Applicant: " + seller.owner +
    "<br>Application Date: " + seller.date + "<br>Store Information: " + seller.info +
    "<br>Verification Status: " + seller.status;
  show("sellerDetails");
}

function openSellerForm(id) {
  editingSellerId = id;
  setText("sellerError", "");

  if (id === 0) {
    setText("sellerLegend", "Add Seller Application");
    setValue("sellerStoreName", "");
    setValue("sellerOwner", "");
    setValue("sellerDate", "");
    setValue("sellerInfo", "");
    setValue("sellerStatus", "Pending");
  } else {
    let seller = findById(sellers, id);
    setText("sellerLegend", "Edit Seller Application");
    setValue("sellerStoreName", seller.storeName);
    setValue("sellerOwner", seller.owner);
    setValue("sellerDate", seller.date);
    setValue("sellerInfo", seller.info);
    setValue("sellerStatus", seller.status);
  }
  show("sellerForm");
}

// CREATE and UPDATE
function saveSeller() {
  let storeName = getValue("sellerStoreName").trim();
  let owner = getValue("sellerOwner").trim();
  let date = getValue("sellerDate");
  let info = getValue("sellerInfo").trim();
  let status = getValue("sellerStatus");

  if (storeName === "" || owner === "" || date === "" || info === "") {
    setText("sellerError", "Please fill in all fields.");
    return;
  }

  if (editingSellerId === 0) {
    sellers.unshift({ id: getNextId(sellers), storeName: storeName, owner: owner, date: date, info: info, status: status });
    showMessage("Seller application added.");
  } else {
    let seller = findById(sellers, editingSellerId);
    seller.storeName = storeName;
    seller.owner = owner;
    seller.date = date;
    seller.info = info;
    seller.status = status;
    showMessage("Seller application updated.");
  }
  hide("sellerForm");
  showSellers();
}

// UPDATE: verify or reject
function verifySeller(id) {
  let seller = findById(sellers, id);
  seller.status = "Verified";
  showMessage(seller.storeName + " has been verified.");
  showSellers();
}

function rejectSeller(id) {
  let seller = findById(sellers, id);
  seller.status = "Rejected";
  showMessage(seller.storeName + " has been rejected.");
  showSellers();
}

// DELETE
function deleteSeller(id) {
  removeItem(sellers, id);
  showMessage("Seller application deleted.");
  showSellers();
}

// ==========================================================
// PRODUCT MODERATION (CRUD)
// ==========================================================

// READ
function showProducts() {
  let html = "<tr><th>Product Name</th><th>Seller</th><th>Report Reason</th><th>Report Date</th><th>Moderation Status</th><th>Actions</th></tr>";

  for (let product of products) {
    html += "<tr><td><strong>" + product.name + "</strong></td>" +
      "<td>" + product.seller + "</td>" +
      "<td>" + product.reason + "</td>" +
      "<td>" + product.date + "</td>" +
      "<td><span class='badge status-" + product.status + "'>" + product.status + "</span></td>" +
      "<td><button class='small' onclick='viewProduct(" + product.id + ")'>View</button>" +
      "<button class='small good' onclick='approveProduct(" + product.id + ")'>Approve</button>" +
      "<button class='small danger' onclick='removeProduct(" + product.id + ")'>Remove</button>" +
      "<button class='small' onclick='openProductForm(" + product.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteProduct(" + product.id + ")'>Delete</button></td></tr>";
  }

  if (products.length === 0) {
    html += "<tr><td colspan='6'>No reported products.</td></tr>";
  }
  document.getElementById("productTable").innerHTML = html;
  setText("productCount", "Showing " + products.length + " reported products");
  updateModerationStats();
}

function viewProduct(id) {
  let product = findById(products, id);
  document.getElementById("productDetailsText").innerHTML = "<strong>Reported Product</strong><br>" +
    "Report ID: #" + product.id + "<br>Product Name: " + product.name + "<br>Seller: " + product.seller +
    "<br>Price: " + money(product.price) + "<br>Report Reason: " + product.reason +
    "<br>Report Date: " + product.date + "<br>Moderation Status: " + product.status;
  show("productDetails");
}

function openProductForm(id) {
  editingProductId = id;
  setText("productError", "");

  if (id === 0) {
    setText("productLegend", "Add Reported Product");
    setValue("productName", "");
    setValue("productSeller", "");
    setValue("productPrice", "");
    setValue("productReason", "");
    setValue("productDate", "");
    setValue("productStatus", "Pending");
  } else {
    let product = findById(products, id);
    setText("productLegend", "Edit Reported Product");
    setValue("productName", product.name);
    setValue("productSeller", product.seller);
    setValue("productPrice", product.price);
    setValue("productReason", product.reason);
    setValue("productDate", product.date);
    setValue("productStatus", product.status);
  }
  show("productForm");
}

// CREATE and UPDATE
function saveProduct() {
  let name = getValue("productName").trim();
  let seller = getValue("productSeller").trim();
  let price = getValue("productPrice");
  let reason = getValue("productReason").trim();
  let date = getValue("productDate");
  let status = getValue("productStatus");

  if (name === "" || seller === "" || reason === "" || date === "") {
    setText("productError", "Please fill in all fields.");
    return;
  }
  if (price === "" || Number(price) < 0) {
    setText("productError", "Please enter a valid price.");
    return;
  }

  if (editingProductId === 0) {
    products.unshift({ id: getNextId(products), name: name, seller: seller, price: Number(price), reason: reason, date: date, status: status });
    showMessage("Reported product added.");
  } else {
    let product = findById(products, editingProductId);
    product.name = name;
    product.seller = seller;
    product.price = Number(price);
    product.reason = reason;
    product.date = date;
    product.status = status;
    showMessage("Reported product updated.");
  }
  hide("productForm");
  showProducts();
}

// UPDATE: approve or remove
function approveProduct(id) {
  let product = findById(products, id);
  product.status = "Approved";
  showMessage(product.name + " has been approved.");
  showProducts();
}

function removeProduct(id) {
  let product = findById(products, id);
  product.status = "Removed";
  showMessage(product.name + " has been removed.");
  showProducts();
}

// DELETE
function deleteProduct(id) {
  removeItem(products, id);
  showMessage("Reported product deleted.");
  showProducts();
}

// Moderation numbers: dashboard, seller page and product page
function updateModerationStats() {
  let pendingSellers = countStatus(sellers, "Pending");
  let pendingProducts = countStatus(products, "Pending");

  setText("pendingSellers", pendingSellers);
  setText("pendingProducts", pendingProducts);
  setText("reportedProducts", products.length);

  setText("sellerStatPending", pendingSellers);
  setText("sellerStatVerified", countStatus(sellers, "Verified"));
  setText("sellerStatRejected", countStatus(sellers, "Rejected"));

  setText("productStatPending", pendingProducts);
  setText("productStatApproved", countStatus(products, "Approved"));
  setText("productStatRemoved", countStatus(products, "Removed"));
}

// ==========================================================
// PLATFORM SETTINGS – COMMISSION
// ==========================================================
function saveSettings() {
  let value = getValue("commissionInput");

  if (value === "" || Number(value) < 0 || Number(value) > 100) {
    setText("settingsError", "Commission must be a number between 0 and 100.");
    return;
  }
  setText("settingsError", "");
  commission = Number(value);
  showMessage("Platform settings saved. Commission is now " + commission + "%.");
}

// ==========================================================
// PLATFORM SETTINGS – CATEGORIES (CRUD)
// ==========================================================

// READ
function showCategories() {
  let html = "<tr><th>ID</th><th>Category Name</th><th>Actions</th></tr>";

  for (let category of categories) {
    html += "<tr><td>#" + category.id + "</td><td><strong>" + category.name + "</strong></td>" +
      "<td><button class='small' onclick='openCategoryForm(" + category.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteCategory(" + category.id + ")'>Delete</button></td></tr>";
  }

  if (categories.length === 0) {
    html += "<tr><td colspan='3'>No categories.</td></tr>";
  }
  document.getElementById("categoryTable").innerHTML = html;
}

function openCategoryForm(id) {
  editingCategoryId = id;
  setText("categoryError", "");

  if (id === 0) {
    setText("categoryLegend", "Add Category");
    setValue("categoryName", "");
  } else {
    setText("categoryLegend", "Edit Category");
    setValue("categoryName", findById(categories, id).name);
  }
  show("categoryForm");
}

// CREATE and UPDATE
function saveCategory() {
  let name = getValue("categoryName").trim();

  if (name === "") {
    setText("categoryError", "Please enter the category name.");
    return;
  }
  for (let category of categories) {
    if (category.name.toLowerCase() === name.toLowerCase() && category.id !== editingCategoryId) {
      setText("categoryError", "This category already exists.");
      return;
    }
  }

  if (editingCategoryId === 0) {
    categories.push({ id: getNextId(categories), name: name });
    showMessage("Category added: " + name + ".");
  } else {
    findById(categories, editingCategoryId).name = name;
    showMessage("Category updated: " + name + ".");
  }
  hide("categoryForm");
  showCategories();
}

// DELETE
function deleteCategory(id) {
  removeItem(categories, id);
  showMessage("Category deleted.");
  showCategories();
}

// ==========================================================
// PLATFORM SETTINGS – COUPONS (CRUD)
// ==========================================================

// READ
function showCoupons() {
  let html = "<tr><th>Code</th><th>Discount Type</th><th>Discount Value</th><th>Expiry Date</th><th>Actions</th></tr>";

  for (let coupon of coupons) {
    let discount = money(coupon.value);
    if (coupon.type === "Percentage") {
      discount = coupon.value + "%";
    }
    html += "<tr><td><strong>" + coupon.code + "</strong></td><td>" + coupon.type + "</td>" +
      "<td>" + discount + "</td><td>" + coupon.expiry + "</td>" +
      "<td><button class='small' onclick='openCouponForm(" + coupon.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteCoupon(" + coupon.id + ")'>Delete</button></td></tr>";
  }

  if (coupons.length === 0) {
    html += "<tr><td colspan='5'>No coupons.</td></tr>";
  }
  document.getElementById("couponTable").innerHTML = html;
}

function openCouponForm(id) {
  editingCouponId = id;
  setText("couponError", "");

  if (id === 0) {
    setText("couponLegend", "Add Coupon");
    setValue("couponCode", "");
    setValue("couponType", "Percentage");
    setValue("couponValue", "");
    setValue("couponExpiry", "");
  } else {
    let coupon = findById(coupons, id);
    setText("couponLegend", "Edit Coupon");
    setValue("couponCode", coupon.code);
    setValue("couponType", coupon.type);
    setValue("couponValue", coupon.value);
    setValue("couponExpiry", coupon.expiry);
  }
  show("couponForm");
}

// CREATE and UPDATE
function saveCoupon() {
  let code = getValue("couponCode").trim().toUpperCase();
  let type = getValue("couponType");
  let value = Number(getValue("couponValue"));
  let expiry = getValue("couponExpiry");

  if (code === "" || expiry === "") {
    setText("couponError", "Please enter the coupon code and expiry date.");
    return;
  }
  if (code.indexOf(" ") !== -1) {
    setText("couponError", "The coupon code cannot contain spaces.");
    return;
  }
  if (value <= 0) {
    setText("couponError", "Please enter a discount value greater than 0.");
    return;
  }
  if (type === "Percentage" && value > 100) {
    setText("couponError", "A percentage discount cannot be more than 100.");
    return;
  }
  for (let coupon of coupons) {
    if (coupon.code === code && coupon.id !== editingCouponId) {
      setText("couponError", "This coupon code already exists.");
      return;
    }
  }

  if (editingCouponId === 0) {
    coupons.push({ id: getNextId(coupons), code: code, type: type, value: value, expiry: expiry });
    showMessage("Coupon " + code + " added.");
  } else {
    let coupon = findById(coupons, editingCouponId);
    coupon.code = code;
    coupon.type = type;
    coupon.value = value;
    coupon.expiry = expiry;
    showMessage("Coupon " + code + " updated.");
  }
  hide("couponForm");
  showCoupons();
}

// DELETE
function deleteCoupon(id) {
  removeItem(coupons, id);
  showMessage("Coupon deleted.");
  showCoupons();
}

// ==========================================================
// ANALYTICS – TABS
// ==========================================================
let analyticsTabs = ["analytics", "notifications", "logs"];

function showAnalyticsTab(name) {
  for (let tab of analyticsTabs) {
    document.getElementById("panel-" + tab).style.display = "none";
    document.getElementById("atab-" + tab).className = "tab";
  }
  document.getElementById("panel-" + name).style.display = "block";
  document.getElementById("atab-" + name).className = "tab active";
}

// ==========================================================
// ANALYTICS – MONTHLY REVENUE DATA (CRUD), STATISTICS AND CHART
// ==========================================================

// READ: statistics, chart and table are all made from the revenueData array
function showRevenue() {
  let totalRevenue = 0;
  let totalOrders = 0;
  let highest = 0;

  for (let item of revenueData) {
    totalRevenue += item.revenue;
    totalOrders += item.orders;
    if (item.revenue > highest) {
      highest = item.revenue;
    }
  }

  let average = 0;
  if (totalOrders > 0) {
    average = Math.round(totalRevenue / totalOrders * 100) / 100;
  }
  setText("statRevenue", money(totalRevenue));
  setText("statOrders", totalOrders);
  setText("statAvgOrder", money(average));

  // Bar chart: the highest month gets a 180px bar, the others are smaller
  let chart = document.getElementById("chart");
  chart.innerHTML = "";

  for (let item of revenueData) {
    let height = 0;
    if (highest > 0) {
      height = Math.round(item.revenue / highest * 180);
    }

    let column = document.createElement("div");
    column.className = "bar-column";

    let bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = height + "px";
    bar.innerText = Math.round(item.revenue / 1000) + "k";

    let label = document.createElement("p");
    label.innerText = item.month;

    column.appendChild(bar);
    column.appendChild(label);
    chart.appendChild(column);
  }

  // Table
  let html = "<tr><th>Month</th><th>Revenue</th><th>Orders</th><th>Actions</th></tr>";
  for (let item of revenueData) {
    html += "<tr><td><strong>" + item.month + "</strong></td><td>" + money(item.revenue) + "</td><td>" + item.orders + "</td>" +
      "<td><button class='small' onclick='openRevenueForm(" + item.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteRevenue(" + item.id + ")'>Delete</button></td></tr>";
  }
  if (revenueData.length === 0) {
    html += "<tr><td colspan='4'>No monthly data.</td></tr>";
  }
  document.getElementById("revenueTable").innerHTML = html;
}

function openRevenueForm(id) {
  editingRevenueId = id;
  setText("revenueError", "");

  if (id === 0) {
    setText("revenueLegend", "Add Monthly Data");
    setValue("revenueMonth", "");
    setValue("revenueAmount", "");
    setValue("revenueOrders", "");
  } else {
    let item = findById(revenueData, id);
    setText("revenueLegend", "Edit Monthly Data");
    setValue("revenueMonth", item.month);
    setValue("revenueAmount", item.revenue);
    setValue("revenueOrders", item.orders);
  }
  show("revenueForm");
}

// CREATE and UPDATE
function saveRevenue() {
  let month = getValue("revenueMonth").trim();
  let revenue = getValue("revenueAmount");
  let orders = getValue("revenueOrders");

  if (month === "") {
    setText("revenueError", "Please enter the month.");
    return;
  }
  if (revenue === "" || Number(revenue) < 0 || orders === "" || Number(orders) < 0) {
    setText("revenueError", "Please enter valid revenue and order numbers.");
    return;
  }

  if (editingRevenueId === 0) {
    revenueData.push({ id: getNextId(revenueData), month: month, revenue: Number(revenue), orders: Number(orders) });
    showMessage("Monthly data for " + month + " added.");
  } else {
    let item = findById(revenueData, editingRevenueId);
    item.month = month;
    item.revenue = Number(revenue);
    item.orders = Number(orders);
    showMessage("Monthly data for " + month + " updated.");
  }
  hide("revenueForm");
  showRevenue();
}

// DELETE
function deleteRevenue(id) {
  removeItem(revenueData, id);
  showMessage("Monthly data deleted.");
  showRevenue();
}

// ==========================================================
// ANALYTICS – NOTIFICATIONS (CRUD)
// ==========================================================

// READ
function showNotifications() {
  let html = "<tr><th>Notification</th><th>Date</th><th>Status</th><th>Actions</th></tr>";

  for (let note of notifications) {
    let toggleText = "Mark Read";
    if (note.status === "Read") {
      toggleText = "Mark Unread";
    }
    html += "<tr><td>" + note.message + "</td><td>" + note.date + "</td>" +
      "<td><span class='badge status-" + note.status + "'>" + note.status + "</span></td>" +
      "<td><button class='small good' onclick='toggleNotification(" + note.id + ")'>" + toggleText + "</button>" +
      "<button class='small' onclick='openNotificationForm(" + note.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteNotification(" + note.id + ")'>Delete</button></td></tr>";
  }

  if (notifications.length === 0) {
    html += "<tr><td colspan='4'>No notifications.</td></tr>";
  }
  document.getElementById("notificationTable").innerHTML = html;
  updateBell();
}

function openNotificationForm(id) {
  editingNotificationId = id;
  setText("notificationError", "");

  if (id === 0) {
    setText("notificationLegend", "Add Notification");
    setValue("notificationMessage", "");
    setValue("notificationDate", "");
    setValue("notificationStatus", "Unread");
  } else {
    let note = findById(notifications, id);
    setText("notificationLegend", "Edit Notification");
    setValue("notificationMessage", note.message);
    setValue("notificationDate", note.date);
    setValue("notificationStatus", note.status);
  }
  show("notificationForm");
}

// CREATE and UPDATE
function saveNotification() {
  let message = getValue("notificationMessage").trim();
  let date = getValue("notificationDate");
  let status = getValue("notificationStatus");

  if (message === "" || date === "") {
    setText("notificationError", "Please enter the message and date.");
    return;
  }

  if (editingNotificationId === 0) {
    notifications.unshift({ id: getNextId(notifications), message: message, date: date, status: status });
    showMessage("Notification added.");
  } else {
    let note = findById(notifications, editingNotificationId);
    note.message = message;
    note.date = date;
    note.status = status;
    showMessage("Notification updated.");
  }
  hide("notificationForm");
  showNotifications();
}

// UPDATE: mark as read or unread
function toggleNotification(id) {
  let note = findById(notifications, id);
  if (note.status === "Unread") {
    note.status = "Read";
  } else {
    note.status = "Unread";
  }
  showMessage("Notification marked as " + note.status.toLowerCase() + ".");
  showNotifications();
}

// DELETE
function deleteNotification(id) {
  removeItem(notifications, id);
  showMessage("Notification deleted.");
  showNotifications();
}

// ==========================================================
// ANALYTICS – SYSTEM LOGS (CRUD)
// ==========================================================

// READ
function showLogs() {
  let html = "<tr><th>Activity Description</th><th>Date</th><th>Actions</th></tr>";

  for (let log of logs) {
    html += "<tr><td>" + log.description + "</td><td>" + log.date + "</td>" +
      "<td><button class='small' onclick='openLogForm(" + log.id + ")'>Edit</button>" +
      "<button class='small danger' onclick='deleteLog(" + log.id + ")'>Delete</button></td></tr>";
  }

  if (logs.length === 0) {
    html += "<tr><td colspan='3'>No log entries.</td></tr>";
  }
  document.getElementById("logTable").innerHTML = html;
}

function openLogForm(id) {
  editingLogId = id;
  setText("logError", "");

  if (id === 0) {
    setText("logLegend", "Add Log Entry");
    setValue("logDescription", "");
    setValue("logDate", "");
  } else {
    let log = findById(logs, id);
    setText("logLegend", "Edit Log Entry");
    setValue("logDescription", log.description);
    setValue("logDate", log.date);
  }
  show("logForm");
}

// CREATE and UPDATE
function saveLog() {
  let description = getValue("logDescription").trim();
  let date = getValue("logDate");

  if (description === "" || date === "") {
    setText("logError", "Please enter the description and date.");
    return;
  }

  if (editingLogId === 0) {
    logs.unshift({ id: getNextId(logs), description: description, date: date });
    showMessage("Log entry added.");
  } else {
    let log = findById(logs, editingLogId);
    log.description = description;
    log.date = date;
    showMessage("Log entry updated.");
  }
  hide("logForm");
  showLogs();
}

// DELETE
function deleteLog(id) {
  removeItem(logs, id);
  showMessage("Log entry deleted.");
  showLogs();
}

// ==========================================================
// START THE PAGE
// ==========================================================
showActivities();
showUsers();
showSellers();
showProducts();
showCategories();
showCoupons();
showRevenue();
showNotifications();
showLogs();
showSection("dashboard");
