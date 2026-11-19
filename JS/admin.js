// NovaCart Admin Panel

// DATA (arrays of objects)
const users = [
  { id: 1, name: "Lubaba", email: "lubaba@novacart.com", role: "Customer", status: "Active", joined: "2025-01-15" },
  { id: 2, name: "Sazin", email: "sazin@novacart.com", role: "Seller", status: "Active", joined: "2025-01-14" },
  { id: 3, name: "Fahad", email: "fahad@novacart.com", role: "Manager", status: "Active", joined: "2025-01-11" },
  { id: 4, name: "Ameya", email: "ameya@novacart.com", role: "Administrator", status: "Active", joined: "2025-01-12" },
  { id: 5, name: "Razeen", email: "razeen@novacart.com", role: "Delivery Partner", status: "Active", joined: "2025-01-10" }
];

const activities = [
  { id: 1, text: "New order received", time: "2 min ago" },
  { id: 2, text: "Seller verified", time: "5 min ago" },
  { id: 3, text: "Product reported", time: "12 min ago" },
  { id: 4, text: "New user registered", time: "1 hour ago" }
];

const sellers = [
  { id: 1, storeName: "TechHub BD", owner: "Rafiq Hasan", date: "2025-11-10", info: "Electronics and mobile accessories", status: "Pending" },
  { id: 2, storeName: "Fashion World", owner: "Nusrat Jahan", date: "2025-11-09", info: "Clothing and fashion items", status: "Pending" },
  { id: 3, storeName: "Gadget Zone", owner: "Tanvir Ahmed", date: "2025-11-08", info: "Smart gadgets and wearables", status: "Pending" },
  { id: 4, storeName: "Home Essentials", owner: "Sadia Rahman", date: "2025-11-05", info: "Kitchen and home products", status: "Verified" },
  { id: 5, storeName: "BookNest", owner: "Karim Uddin", date: "2025-11-02", info: "Books and stationery", status: "Rejected" }
];

const products = [
  { id: 1, name: "Wireless Earbuds X2", seller: "TechHub BD", price: 1850, reason: "Misleading product description", date: "2025-11-11", status: "Pending" },
  { id: 2, name: "Designer Handbag", seller: "Fashion World", price: 3200, reason: "Suspected counterfeit item", date: "2025-11-10", status: "Pending" },
  { id: 3, name: "Smart Watch Pro", seller: "Gadget Zone", price: 4500, reason: "Incorrect price listed", date: "2025-11-09", status: "Pending" },
  { id: 4, name: "Herbal Face Cream", seller: "Home Essentials", price: 650, reason: "Prohibited ingredient claim", date: "2025-11-06", status: "Removed" },
  { id: 5, name: "Power Bank 20000mAh", seller: "TechHub BD", price: 2100, reason: "Safety concern reported", date: "2025-11-04", status: "Approved" }
];

// An object with a method: "this" means the object that owns the method
const settings = {
  commission: 10,
  summary: function () {
    return "Commission is now " + this.commission + "%.";
  }
};

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Home & Kitchen" },
  { id: 4, name: "Books" },
  { id: 5, name: "Beauty & Health" },
  { id: 6, name: "Sports" }
];

const coupons = [
  { id: 1, code: "WELCOME10", type: "Percentage", value: 10, expiry: "2026-12-31" },
  { id: 2, code: "FREESHIP", type: "Fixed", value: 50, expiry: "2026-12-31" },
  { id: 3, code: "STUDENT15", type: "Percentage", value: 15, expiry: "2027-03-31" },
  { id: 4, code: "EID100", type: "Fixed", value: 100, expiry: "2025-06-30" }
];

const revenueData = [
  { id: 1, month: "Jan", revenue: 165000, orders: 820 },
  { id: 2, month: "Feb", revenue: 178000, orders: 880 },
  { id: 3, month: "Mar", revenue: 192500, orders: 940 },
  { id: 4, month: "Apr", revenue: 210000, orders: 1030 },
  { id: 5, month: "May", revenue: 238000, orders: 1170 },
  { id: 6, month: "Jun", revenue: 262000, orders: 1280 }
];

const notifications = [
  { id: 1, message: "New seller application received", date: "2025-11-10", status: "Unread" },
  { id: 2, message: "Product reported: Smart Watch Pro", date: "2025-11-09", status: "Unread" },
  { id: 3, message: "Monthly revenue report is ready", date: "2025-11-08", status: "Unread" },
  { id: 4, message: "Commission settings were reviewed", date: "2025-11-05", status: "Read" },
  { id: 5, message: "System backup completed", date: "2025-11-01", status: "Read" }
];

const logs = [
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

// SMALL HELPER FUNCTIONS
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

// Pop-up forms: the CSS class "show" makes the overlay visible
function openModal(id) {
  document.getElementById(id).classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

function closeAllModals() {
  document.querySelectorAll(".overlay").forEach(function (overlay) { overlay.classList.remove("show"); });
}

// Radio buttons that share one name form a group
function getRadio(name) {
  for (const radio of document.getElementsByName(name)) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return "";
}

function setRadio(name, value) {
  for (const radio of document.getElementsByName(name)) {
    radio.checked = (radio.value === value);
  }
}

// Show a validation error in red next to its field
function showError(id, text) {
  const error = document.getElementById(id);
  error.innerText = text;
  error.style.color = "red";
}

function clearErrors(ids) {
  ids.forEach(function (id) { setText(id, ""); });
}

// Confirmation message at the top of the page
function showMessage(text) {
  setText("message", text);
}

// Working with arrays of objects
function findById(list, id) {
  for (const item of list) {
    if (item.id === id) {
      return item;
    }
  }
}

function getNextId(list) {
  let highest = 0;
  for (const item of list) {
    if (item.id > highest) {
      highest = item.id;
    }
  }
  return highest + 1;
}

function removeItem(list, id) {
  list.splice(list.indexOf(findById(list, id)), 1);
}

function countStatus(list, status) {
  let count = 0;
  for (const item of list) {
    if (item.status === status) {
      count++;
    }
  }
  return count;
}

function money(amount) {
  return "৳ " + amount;
}

// SIDEBAR AND TOP BAR
const menuSections = ["dashboard", "users", "sellers", "products", "settings", "analytics"];
const sectionNames = ["dashboard", "users", "sellers", "products", "settings", "analytics", "profile", "password"];

const descriptions = {
  dashboard: "Overview of users, sellers and platform activity.",
  users: "Manage users, roles and platform access.",
  sellers: "Review seller applications and verify trusted sellers.",
  products: "Review reported products and moderate content.",
  settings: "Configure commission, categories and coupon policies.",
  analytics: "Track revenue, notifications and administrator activity.",
  profile: "View and update your administrator profile.",
  password: "Keep your account secure by changing your password."
};

// Show one section and hide the others (no page reload)
function showSection(name) {
  sectionNames.forEach(function (section) {
    document.getElementById("section-" + section).style.display = "none";
    const menuItem = document.getElementById("menu-" + section);   // profile and password have no menu item
    if (menuItem) {
      menuItem.className = "menu-item";
    }
  });
  document.getElementById("section-" + name).style.display = "block";
  const activeItem = document.getElementById("menu-" + name);
  if (activeItem) {
    activeItem.className = "menu-item active";
  }
  setText("description", descriptions[name]);
  hide("profileMenu");
  showMessage("");
}

function toggleProfile() {
  const menu = document.getElementById("profileMenu");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function logOut() {
  hide("profileMenu");
  alert("You have been logged out.");
  window.location.href = "../LOGIN/HTML/Login.html";
}

// The bell opens the Notifications tab
function openNotifications() {
  showSection("analytics");
  showAnalyticsTab("notifications");
}

// The number on the bell = unread notifications
function updateBell() {
  const unread = countStatus(notifications, "Unread");
  setText("bellCount", unread);
  document.getElementById("bellCount").style.display = (unread === 0) ? "none" : "inline";
}

// DASHBOARD – RECENT ACTIVITY (CRUD)

// READ
function showActivities() {
  let rows = "";
  for (const activity of activities) {
    rows += "<tr>" +
      "<td>" + activity.text + "</td>" +
      "<td>" + activity.time + "</td>" +
      "<td>" +
      "<button class='small' name='edit' value='" + activity.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + activity.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("activityBody").innerHTML = rows || "<tr><td colspan='3'>No recent activity.</td></tr>";
  let listItems = "";
  for (const activity of activities) {
    listItems += "<li>" + activity.text + " (" + activity.time + ")</li>";
  }
  document.getElementById("analyticsActivity").innerHTML = listItems;
}

// Open the form: id 0 = Add, otherwise Edit
function openActivityForm(id) {
  editingActivityId = id;
  clearErrors(["activityTextError"]);

  if (id === 0) {
    setText("activityLegend", "Add Activity");
    setValue("activityText", "");
    setValue("activityTime", "Just now");
  } else {
    const activity = findById(activities, id);
    setText("activityLegend", "Edit Activity");
    setValue("activityText", activity.text);
    setValue("activityTime", activity.time);
  }
  openModal("activityModal");
}

// CREATE and UPDATE
function saveActivity() {
  clearErrors(["activityTextError"]);
  const text = getValue("activityText").trim();
  const time = getValue("activityTime").trim() || "Just now";

  if (text === "") {
    showError("activityTextError", "Activity must be filled out");
    return;
  }

  if (editingActivityId === 0) {
    activities.unshift({ id: getNextId(activities), text: text, time: time });
    showMessage("Activity added successfully.");
  } else {
    const activity = findById(activities, editingActivityId);
    activity.text = text;
    activity.time = time;
    showMessage("Activity updated successfully.");
  }
  console.log(activities);
  closeModal("activityModal");
  showActivities();
}

// DELETE
function deleteActivity(id) {
  removeItem(activities, id);
  showMessage("Activity deleted.");
  console.log(activities);
  showActivities();
}

// USER MANAGEMENT (CRUD)

// Statistics cards (dashboard and user page) come from the users array
function updateStats() {
  let sellerCount = 0;
  for (const user of users) {
    if (user.role === "Seller") {
      sellerCount++;
    }
  }
  const active = countStatus(users, "Active");
  const suspended = countStatus(users, "Suspended");

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
  const search = getValue("userSearch").toLowerCase();
  let rows = "";
  let count = 0;

  for (const user of users) {
    const roleMatches = currentRole === "All" || user.role === currentRole;
    const searchMatches = user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    if (roleMatches && searchMatches) {
      count++;
      const suspendButton = (user.status === "Active")
        ? "<button class='small danger' name='toggle' value='" + user.id + "'>Suspend</button>"
        : "<button class='small good' name='toggle' value='" + user.id + "'>Reactivate</button>";

      rows += "<tr>" +
        "<td>#" + user.id + "</td>" +
        "<td>" + user.name + "</td>" +
        "<td>" + user.email + "</td>" +
        "<td>" + user.role + "</td>" +
        "<td><span class='badge status-" + user.status + "'>" + user.status + "</span></td>" +
        "<td>" + user.joined + "</td>" +
        "<td>" +
        "<button class='small' name='view' value='" + user.id + "'>View</button> " +
        "<button class='small' name='edit' value='" + user.id + "'>Edit</button> " +
        suspendButton + " " +
        "<button class='small danger' name='delete' value='" + user.id + "'>Delete</button> " +
        "</td>" +
        "</tr>";
    }
  }

  document.getElementById("userBody").innerHTML = rows || "<tr><td colspan='7'>No users found.</td></tr>";
  setText("userCount", "Showing " + count + " of " + users.length + " users");
  updateStats();
}

// Role tabs and the role dropdown both call this function
function filterRole(role) {
  currentRole = role;
  setValue("roleFilter", role);

  document.querySelectorAll("#roleTabs button").forEach(function (tab) {
    tab.className = (tab.value === role) ? "tab active" : "tab";
  });
  showUsers();
}

// READ: view details
function viewUser(id) {
  const user = findById(users, id);
  document.getElementById("userDetailsText").innerHTML = "<strong>User Details</strong><br>" +
      "ID: #" + user.id + "<br>Name: " + user.name + "<br>Email: " + user.email + "<br>" +
      "Role: " + user.role + "<br>Account Status: " + user.status + "<br>Joined Date: " + user.joined;
  show("userDetails");
}

// Open the form: id 0 = Add, otherwise Edit
function openUserForm(id) {
  editingUserId = id;
  clearErrors(["userNameError", "userEmailError"]);

  if (id === 0) {
    setText("userLegend", "Add User");
    setValue("userName", "");
    setValue("userEmail", "");
    setValue("userRole", "");
    setRadio("userStatus", "Active");
    setValue("userJoined", "");
  } else {
    const user = findById(users, id);
    setText("userLegend", "Edit User");
    setValue("userName", user.name);
    setValue("userEmail", user.email);
    setValue("userRole", user.role);
    setRadio("userStatus", user.status);
    setValue("userJoined", user.joined);
  }
  openModal("userModal");
}

// CREATE and UPDATE (the browser checks required and email, here we check duplicates)
function saveUser() {
  clearErrors(["userNameError", "userEmailError"]);
  const name = getValue("userName").trim();
  const email = getValue("userEmail").trim();
  const role = getValue("userRole");
  const status = getRadio("userStatus");
  const joined = getValue("userJoined");
  let valid = true;

  if (name === "") {
    showError("userNameError", "Name must be filled out");
    valid = false;
  }
  if (!email.includes("@")) {
    showError("userEmailError", "Email must contain an @");
    valid = false;
  }
  let emailTaken = false;
  for (const user of users) {
    if (user.email.toLowerCase() === email.toLowerCase() && user.id !== editingUserId) {
      emailTaken = true;
    }
  }
  if (emailTaken) {
    showError("userEmailError", "This email is already used by another user");
    valid = false;
  }
  if (!valid) {
    return;
  }

  if (editingUserId === 0) {
    users.push({ id: getNextId(users), name: name, email: email, role: role, status: status, joined: joined });
    showMessage("New user added successfully.");
  } else {
    const user = findById(users, editingUserId);
    user.name = name;
    user.email = email;
    user.role = role;
    user.status = status;
    user.joined = joined;
    showMessage("User updated successfully.");
  }
  console.log(users);
  closeModal("userModal");
  showUsers();
}

// UPDATE: suspend or reactivate
function toggleUser(id) {
  const user = findById(users, id);
  user.status = (user.status === "Active") ? "Suspended" : "Active";
  showMessage(user.status === "Suspended"
    ? user.name + "'s account has been suspended."
    : user.name + "'s account has been reactivated.");
  showUsers();
}

// DELETE
function deleteUser(id) {
  const user = findById(users, id);
  removeItem(users, id);
  showMessage(user.name + " has been permanently deleted.");
  console.log(users);
  showUsers();
}

// SELLER VERIFICATION (CRUD)

// READ
function showSellers() {
  let rows = "";
  for (const seller of sellers) {
    rows += "<tr>" +
      "<td><strong>" + seller.storeName + "</strong></td>" +
      "<td>" + seller.date + "</td>" +
      "<td>" + seller.info + "</td>" +
      "<td><span class='badge status-" + seller.status + "'>" + seller.status + "</span></td>" +
      "<td>" +
      "<button class='small' name='view' value='" + seller.id + "'>View</button> " +
      "<button class='small good' name='verify' value='" + seller.id + "'>Verify</button> " +
      "<button class='small danger' name='reject' value='" + seller.id + "'>Reject</button> " +
      "<button class='small' name='edit' value='" + seller.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + seller.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("sellerBody").innerHTML = rows || "<tr><td colspan='5'>No seller applications.</td></tr>";
  setText("sellerCount", "Showing " + sellers.length + " seller applications");
  updateModerationStats();
}

function viewSeller(id) {
  const seller = findById(sellers, id);
  document.getElementById("sellerDetailsText").innerHTML = "<strong>Seller Application</strong><br>" +
      "Application ID: #" + seller.id + "<br>Store Name: " + seller.storeName + "<br>Applicant: " + seller.owner + "<br>" +
      "Application Date: " + seller.date + "<br>Store Information: " + seller.info + "<br>" +
      "Verification Status: " + seller.status;
  show("sellerDetails");
}

function openSellerForm(id) {
  editingSellerId = id;
  clearErrors(["sellerStoreNameError", "sellerOwnerError", "sellerInfoError"]);

  if (id === 0) {
    setText("sellerLegend", "Add Seller Application");
    setValue("sellerStoreName", "");
    setValue("sellerOwner", "");
    setValue("sellerDate", "");
    setValue("sellerInfo", "");
    setValue("sellerStatus", "Pending");
  } else {
    const seller = findById(sellers, id);
    setText("sellerLegend", "Edit Seller Application");
    setValue("sellerStoreName", seller.storeName);
    setValue("sellerOwner", seller.owner);
    setValue("sellerDate", seller.date);
    setValue("sellerInfo", seller.info);
    setValue("sellerStatus", seller.status);
  }
  openModal("sellerModal");
}

// CREATE and UPDATE
function saveSeller() {
  clearErrors(["sellerStoreNameError", "sellerOwnerError", "sellerInfoError"]);
  const storeName = getValue("sellerStoreName").trim();
  const owner = getValue("sellerOwner").trim();
  const date = getValue("sellerDate");
  const info = getValue("sellerInfo").trim();
  const status = getValue("sellerStatus");
  let valid = true;

  if (storeName === "") {
    showError("sellerStoreNameError", "Store name must be filled out");
    valid = false;
  }
  if (owner === "") {
    showError("sellerOwnerError", "Applicant name must be filled out");
    valid = false;
  }
  if (info === "") {
    showError("sellerInfoError", "Store information must be filled out");
    valid = false;
  }
  if (!valid) {
    return;
  }

  if (editingSellerId === 0) {
    sellers.unshift({ id: getNextId(sellers), storeName: storeName, owner: owner, date: date, info: info, status: status });
    showMessage("Seller application added.");
  } else {
    const seller = findById(sellers, editingSellerId);
    seller.storeName = storeName;
    seller.owner = owner;
    seller.date = date;
    seller.info = info;
    seller.status = status;
    showMessage("Seller application updated.");
  }
  closeModal("sellerModal");
  showSellers();
}

// UPDATE: verify or reject
function verifySeller(id) {
  const seller = findById(sellers, id);
  seller.status = "Verified";
  showMessage(seller.storeName + " has been verified.");
  showSellers();
}

function rejectSeller(id) {
  const seller = findById(sellers, id);
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

// PRODUCT MODERATION (CRUD)

// READ
function showProducts() {
  let rows = "";
  for (const product of products) {
    rows += "<tr>" +
      "<td><strong>" + product.name + "</strong></td>" +
      "<td>" + product.seller + "</td>" +
      "<td>" + product.reason + "</td>" +
      "<td>" + product.date + "</td>" +
      "<td><span class='badge status-" + product.status + "'>" + product.status + "</span></td>" +
      "<td>" +
      "<button class='small' name='view' value='" + product.id + "'>View</button> " +
      "<button class='small good' name='approve' value='" + product.id + "'>Approve</button> " +
      "<button class='small danger' name='remove' value='" + product.id + "'>Remove</button> " +
      "<button class='small' name='edit' value='" + product.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + product.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("productBody").innerHTML = rows || "<tr><td colspan='6'>No reported products.</td></tr>";
  setText("productCount", "Showing " + products.length + " reported products");
  updateModerationStats();
}

function viewProduct(id) {
  const product = findById(products, id);
  document.getElementById("productDetailsText").innerHTML = "<strong>Reported Product</strong><br>" +
      "Report ID: #" + product.id + "<br>Product Name: " + product.name + "<br>Seller: " + product.seller + "<br>" +
      "Price: " + money(product.price) + "<br>Report Reason: " + product.reason + "<br>" +
      "Report Date: " + product.date + "<br>Moderation Status: " + product.status;
  show("productDetails");
}

function openProductForm(id) {
  editingProductId = id;
  clearErrors(["productNameError", "productSellerError", "productReasonError"]);

  if (id === 0) {
    setText("productLegend", "Add Reported Product");
    setValue("productName", "");
    setValue("productSeller", "");
    setValue("productPrice", "");
    setValue("productReason", "");
    setValue("productDate", "");
    setValue("productStatus", "Pending");
  } else {
    const product = findById(products, id);
    setText("productLegend", "Edit Reported Product");
    setValue("productName", product.name);
    setValue("productSeller", product.seller);
    setValue("productPrice", product.price);
    setValue("productReason", product.reason);
    setValue("productDate", product.date);
    setValue("productStatus", product.status);
  }
  openModal("productModal");
}

// CREATE and UPDATE
function saveProduct() {
  clearErrors(["productNameError", "productSellerError", "productReasonError"]);
  const name = getValue("productName").trim();
  const seller = getValue("productSeller").trim();
  const price = Number(getValue("productPrice"));
  const reason = getValue("productReason").trim();
  const date = getValue("productDate");
  const status = getValue("productStatus");
  let valid = true;

  if (name === "") {
    showError("productNameError", "Product name must be filled out");
    valid = false;
  }
  if (seller === "") {
    showError("productSellerError", "Seller name must be filled out");
    valid = false;
  }
  if (reason === "") {
    showError("productReasonError", "Report reason must be filled out");
    valid = false;
  }
  if (!valid) {
    return;
  }

  if (editingProductId === 0) {
    products.unshift({ id: getNextId(products), name: name, seller: seller, price: price, reason: reason, date: date, status: status });
    showMessage("Reported product added.");
  } else {
    const product = findById(products, editingProductId);
    product.name = name;
    product.seller = seller;
    product.price = price;
    product.reason = reason;
    product.date = date;
    product.status = status;
    showMessage("Reported product updated.");
  }
  closeModal("productModal");
  showProducts();
}

// UPDATE: approve or remove
function approveProduct(id) {
  const product = findById(products, id);
  product.status = "Approved";
  showMessage(product.name + " has been approved.");
  showProducts();
}

function removeProduct(id) {
  const product = findById(products, id);
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
  const pendingSellers = countStatus(sellers, "Pending");
  const pendingProducts = countStatus(products, "Pending");

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

// PLATFORM SETTINGS – COMMISSION
function saveSettings() {
  const value = getValue("commissionInput");
  clearErrors(["commissionError"]);

  if (value === "" || Number(value) < 0 || Number(value) > 100) {
    showError("commissionError", "Commission must be a number between 0 and 100");
    return;
  }
  settings.commission = Number(value);
  showMessage("Platform settings saved. " + settings.summary());
}

// PLATFORM SETTINGS – CATEGORIES (CRUD)

// READ
function showCategories() {
  let rows = "";
  for (const category of categories) {
    rows += "<tr>" +
      "<td>#" + category.id + "</td>" +
      "<td><strong>" + category.name + "</strong></td>" +
      "<td>" +
      "<button class='small' name='edit' value='" + category.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + category.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("categoryBody").innerHTML = rows || "<tr><td colspan='3'>No categories.</td></tr>";
}

function openCategoryForm(id) {
  editingCategoryId = id;
  clearErrors(["categoryNameError"]);

  if (id === 0) {
    setText("categoryLegend", "Add Category");
    setValue("categoryName", "");
  } else {
    setText("categoryLegend", "Edit Category");
    setValue("categoryName", findById(categories, id).name);
  }
  openModal("categoryModal");
}

// CREATE and UPDATE
function saveCategory() {
  clearErrors(["categoryNameError"]);
  const name = getValue("categoryName").trim();

  if (name === "") {
    showError("categoryNameError", "Category name must be filled out");
    return;
  }
  let exists = false;
  for (const category of categories) {
    if (category.name.toLowerCase() === name.toLowerCase() && category.id !== editingCategoryId) {
      exists = true;
    }
  }
  if (exists) {
    showError("categoryNameError", "This category already exists");
    return;
  }

  if (editingCategoryId === 0) {
    categories.push({ id: getNextId(categories), name: name });
    showMessage("Category added: " + name + ".");
  } else {
    findById(categories, editingCategoryId).name = name;
    showMessage("Category updated: " + name + ".");
  }
  closeModal("categoryModal");
  showCategories();
}

// DELETE
function deleteCategory(id) {
  removeItem(categories, id);
  showMessage("Category deleted.");
  showCategories();
}

// PLATFORM SETTINGS – COUPONS (CRUD)

// READ
function showCoupons() {
  let rows = "";
  for (const coupon of coupons) {
    const discount = (coupon.type === "Percentage") ? coupon.value + "%" : money(coupon.value);
    rows += "<tr>" +
      "<td><strong>" + coupon.code + "</strong></td>" +
      "<td>" + coupon.type + "</td>" +
      "<td>" + discount + "</td>" +
      "<td>" + coupon.expiry + "</td>" +
      "<td>" +
      "<button class='small' name='edit' value='" + coupon.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + coupon.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("couponBody").innerHTML = rows || "<tr><td colspan='5'>No coupons.</td></tr>";
}

function openCouponForm(id) {
  editingCouponId = id;
  clearErrors(["couponCodeError", "couponValueError"]);

  if (id === 0) {
    setText("couponLegend", "Add Coupon");
    setValue("couponCode", "");
    setRadio("couponType", "Percentage");
    setValue("couponValue", "");
    setValue("couponExpiry", "");
  } else {
    const coupon = findById(coupons, id);
    setText("couponLegend", "Edit Coupon");
    setValue("couponCode", coupon.code);
    setRadio("couponType", coupon.type);
    setValue("couponValue", coupon.value);
    setValue("couponExpiry", coupon.expiry);
  }
  openModal("couponModal");
}

// CREATE and UPDATE
function saveCoupon() {
  clearErrors(["couponCodeError", "couponValueError"]);
  const code = getValue("couponCode").trim().toUpperCase();
  const type = getRadio("couponType");
  const value = Number(getValue("couponValue"));
  const expiry = getValue("couponExpiry");
  let valid = true;

  if (code === "" || code.includes(" ")) {
    showError("couponCodeError", "The coupon code cannot be empty or contain spaces");
    valid = false;
  }
  let codeTaken = false;
  for (const coupon of coupons) {
    if (coupon.code === code && coupon.id !== editingCouponId) {
      codeTaken = true;
    }
  }
  if (codeTaken) {
    showError("couponCodeError", "This coupon code already exists");
    valid = false;
  }
  if (type === "Percentage" && value > 100) {
    showError("couponValueError", "A percentage discount cannot be more than 100");
    valid = false;
  }
  if (!valid) {
    return;
  }

  if (editingCouponId === 0) {
    coupons.push({ id: getNextId(coupons), code: code, type: type, value: value, expiry: expiry });
    showMessage("Coupon " + code + " added.");
  } else {
    const coupon = findById(coupons, editingCouponId);
    coupon.code = code;
    coupon.type = type;
    coupon.value = value;
    coupon.expiry = expiry;
    showMessage("Coupon " + code + " updated.");
  }
  closeModal("couponModal");
  showCoupons();
}

// DELETE
function deleteCoupon(id) {
  removeItem(coupons, id);
  showMessage("Coupon deleted.");
  showCoupons();
}

// ANALYTICS – TABS
const analyticsTabs = ["analytics", "notifications", "logs"];

function showAnalyticsTab(name) {
  analyticsTabs.forEach(function (tab) {
    document.getElementById("panel-" + tab).style.display = "none";
    document.getElementById("atab-" + tab).className = "tab";
  });
  document.getElementById("panel-" + name).style.display = "block";
  document.getElementById("atab-" + name).className = "tab active";
}

// ANALYTICS – MONTHLY REVENUE DATA (CRUD), STATISTICS AND CHART

// READ: statistics, chart and table are all made from the revenueData array
function showRevenue() {
  let totalRevenue = 0;
  let totalOrders = 0;
  let highest = 0;
  for (const item of revenueData) {
    totalRevenue += item.revenue;
    totalOrders += item.orders;
    if (item.revenue > highest) {
      highest = item.revenue;
    }
  }
  const average = (totalOrders > 0) ? Math.round(totalRevenue / totalOrders * 100) / 100 : 0;

  setText("statRevenue", money(totalRevenue));
  setText("statOrders", totalOrders);
  setText("statAvgOrder", money(average));

  // Bar chart: the highest month gets a 180px bar, the others are smaller
  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  revenueData.forEach(function (item) {
    const height = (highest > 0) ? Math.round(item.revenue / highest * 180) : 0;

    const column = document.createElement("div");
    column.className = "bar-column";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = height + "px";
    bar.innerText = Math.round(item.revenue / 1000) + "k";

    const label = document.createElement("p");
    label.innerText = item.month;

    column.appendChild(bar);
    column.appendChild(label);
    chart.appendChild(column);
  });

  // Table
  let rows = "";
  for (const item of revenueData) {
    rows += "<tr>" +
      "<td><strong>" + item.month + "</strong></td>" +
      "<td>" + money(item.revenue) + "</td>" +
      "<td>" + item.orders + "</td>" +
      "<td>" +
      "<button class='small' name='edit' value='" + item.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + item.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("revenueBody").innerHTML = rows || "<tr><td colspan='4'>No monthly data.</td></tr>";
}

function openRevenueForm(id) {
  editingRevenueId = id;
  clearErrors(["revenueMonthError"]);

  if (id === 0) {
    setText("revenueLegend", "Add Monthly Data");
    setValue("revenueMonth", "");
    setValue("revenueAmount", "");
    setValue("revenueOrders", "");
  } else {
    const item = findById(revenueData, id);
    setText("revenueLegend", "Edit Monthly Data");
    setValue("revenueMonth", item.month);
    setValue("revenueAmount", item.revenue);
    setValue("revenueOrders", item.orders);
  }
  openModal("revenueModal");
}

// CREATE and UPDATE
function saveRevenue() {
  clearErrors(["revenueMonthError"]);
  const month = getValue("revenueMonth").trim();
  const revenue = Number(getValue("revenueAmount"));
  const orders = Number(getValue("revenueOrders"));

  if (month === "") {
    showError("revenueMonthError", "Month must be filled out");
    return;
  }

  if (editingRevenueId === 0) {
    revenueData.push({ id: getNextId(revenueData), month: month, revenue: revenue, orders: orders });
    showMessage("Monthly data for " + month + " added.");
  } else {
    const item = findById(revenueData, editingRevenueId);
    item.month = month;
    item.revenue = revenue;
    item.orders = orders;
    showMessage("Monthly data for " + month + " updated.");
  }
  closeModal("revenueModal");
  showRevenue();
}

// DELETE
function deleteRevenue(id) {
  removeItem(revenueData, id);
  showMessage("Monthly data deleted.");
  showRevenue();
}

// ANALYTICS – NOTIFICATIONS (CRUD)

// READ
function showNotifications() {
  let rows = "";
  for (const note of notifications) {
    const toggleText = (note.status === "Read") ? "Mark Unread" : "Mark Read";
    rows += "<tr>" +
      "<td>" + note.message + "</td>" +
      "<td>" + note.date + "</td>" +
      "<td><span class='badge status-" + note.status + "'>" + note.status + "</span></td>" +
      "<td>" +
      "<button class='small good' name='toggle' value='" + note.id + "'>" + toggleText + "</button> " +
      "<button class='small' name='edit' value='" + note.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + note.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("notificationBody").innerHTML = rows || "<tr><td colspan='4'>No notifications.</td></tr>";
  updateBell();
}

function openNotificationForm(id) {
  editingNotificationId = id;
  clearErrors(["notificationMessageError"]);

  if (id === 0) {
    setText("notificationLegend", "Add Notification");
    setValue("notificationMessage", "");
    setValue("notificationDate", "");
    setRadio("notificationStatus", "Unread");
  } else {
    const note = findById(notifications, id);
    setText("notificationLegend", "Edit Notification");
    setValue("notificationMessage", note.message);
    setValue("notificationDate", note.date);
    setRadio("notificationStatus", note.status);
  }
  openModal("notificationModal");
}

// CREATE and UPDATE
function saveNotification() {
  clearErrors(["notificationMessageError"]);
  const message = getValue("notificationMessage").trim();
  const date = getValue("notificationDate");
  const status = getRadio("notificationStatus");

  if (message === "") {
    showError("notificationMessageError", "Notification must be filled out");
    return;
  }

  if (editingNotificationId === 0) {
    notifications.unshift({ id: getNextId(notifications), message: message, date: date, status: status });
    showMessage("Notification added.");
  } else {
    const note = findById(notifications, editingNotificationId);
    note.message = message;
    note.date = date;
    note.status = status;
    showMessage("Notification updated.");
  }
  closeModal("notificationModal");
  showNotifications();
}

// UPDATE: mark as read or unread
function toggleNotification(id) {
  const note = findById(notifications, id);
  note.status = (note.status === "Unread") ? "Read" : "Unread";
  showMessage("Notification marked as " + note.status.toLowerCase() + ".");
  showNotifications();
}

// DELETE
function deleteNotification(id) {
  removeItem(notifications, id);
  showMessage("Notification deleted.");
  showNotifications();
}

// ANALYTICS – SYSTEM LOGS (CRUD)

// READ
function showLogs() {
  let rows = "";
  for (const log of logs) {
    rows += "<tr>" +
      "<td>" + log.description + "</td>" +
      "<td>" + log.date + "</td>" +
      "<td>" +
      "<button class='small' name='edit' value='" + log.id + "'>Edit</button> " +
      "<button class='small danger' name='delete' value='" + log.id + "'>Delete</button> " +
      "</td>" +
      "</tr>";
  }

  document.getElementById("logBody").innerHTML = rows || "<tr><td colspan='3'>No log entries.</td></tr>";
}

function openLogForm(id) {
  editingLogId = id;
  clearErrors(["logDescriptionError"]);

  if (id === 0) {
    setText("logLegend", "Add Log Entry");
    setValue("logDescription", "");
    setValue("logDate", "");
  } else {
    const log = findById(logs, id);
    setText("logLegend", "Edit Log Entry");
    setValue("logDescription", log.description);
    setValue("logDate", log.date);
  }
  openModal("logModal");
}

// CREATE and UPDATE
function saveLog() {
  clearErrors(["logDescriptionError"]);
  const description = getValue("logDescription").trim();
  const date = getValue("logDate");

  if (description === "") {
    showError("logDescriptionError", "Description must be filled out");
    return;
  }

  if (editingLogId === 0) {
    logs.unshift({ id: getNextId(logs), description: description, date: date });
    showMessage("Log entry added.");
  } else {
    const log = findById(logs, editingLogId);
    log.description = description;
    log.date = date;
    showMessage("Log entry updated.");
  }
  closeModal("logModal");
  showLogs();
}

// DELETE
function deleteLog(id) {
  removeItem(logs, id);
  showMessage("Log entry deleted.");
  showLogs();
}

// MY PROFILE
// The logged-in administrator (the same person as user #4 in the Users table)
const profile = {
  id: 4,
  name: "Ameya",
  email: "ameya@novacart.com",
  phone: "+8801712345678",
  birth: "2002-05-15",
  address: "House 12, Road 5, Dhanmondi, Dhaka",
  role: "Administrator",
  joined: "2025-01-12"
};

// READ
function showProfile() {
  showPicture();
  setText("welcomeName", profile.name);   // the greeting at the top uses the profile name
  setText("profileName", profile.name);
  setText("profileEmail", profile.email);
  setText("profilePhone", profile.phone);
  setText("profileBirth", profile.birth);
  setText("profileAddress", profile.address);
  setText("profileRole", profile.role);
  setText("profileJoined", profile.joined);
}

function openProfileForm() {
  clearErrors(["profileNameError", "profileEmailError", "profilePhoneError", "profileAddressError"]);
  setValue("profileNameInput", profile.name);
  setValue("profileEmailInput", profile.email);
  setValue("profilePhoneInput", profile.phone);
  setValue("profileBirthInput", profile.birth);
  setValue("profileAddressInput", profile.address);
  openModal("profileModal");
}

// Bangladesh mobile number: +880 and 10 digits starting with 1, or 0 and 10 digits starting with 1
function getPhoneDigits(phone) {
  if (phone.startsWith("+880")) {
    return phone.slice(4);
  }
  return phone.startsWith("0") ? phone.slice(1) : "";
}

function isValidPhone(phone) {
  const digits = getPhoneDigits(phone);
  if (digits.length !== 10 || !digits.startsWith("1")) {
    return false;
  }
  for (const digit of digits) {
    if (!"0123456789".includes(digit)) {
      return false;
    }
  }
  return true;
}

// UPDATE
function saveProfile() {
  clearErrors(["profileNameError", "profileEmailError", "profilePhoneError", "profileAddressError"]);
  const name = getValue("profileNameInput").trim();
  const email = getValue("profileEmailInput").trim();
  const phoneText = getValue("profilePhoneInput").trim();
  const birth = getValue("profileBirthInput");
  const address = getValue("profileAddressInput").trim();
  let valid = true;

  if (name === "") {
    showError("profileNameError", "Name must be filled out");
    valid = false;
  }
  if (!email.includes("@")) {
    showError("profileEmailError", "Email must contain an @");
    valid = false;
  }
  let emailTaken = false;
  for (const user of users) {
    if (user.email.toLowerCase() === email.toLowerCase() && user.id !== profile.id) {
      emailTaken = true;
    }
  }
  if (emailTaken) {
    showError("profileEmailError", "This email is already used by another user");
    valid = false;
  }
  if (!isValidPhone(phoneText)) {
    showError("profilePhoneError", "Enter a valid number, for example +8801712345678");
    valid = false;
  }
  if (address === "") {
    showError("profileAddressError", "Address must be filled out");
    valid = false;
  }
  if (!valid) {
    return;
  }

  const phone = "+880" + getPhoneDigits(phoneText);   // always saved in the +880 form
  profile.name = name;
  profile.email = email;
  profile.phone = phone;
  profile.birth = birth;
  profile.address = address;
  const adminUser = findById(users, profile.id);   // keep the Users table in step
  if (adminUser) {
    adminUser.name = name;
    adminUser.email = email;
    showUsers();
  }
  closeModal("profileModal");
  showProfile();
  showMessage("Profile updated successfully.");
}

// PROFILE PICTURE
let savedPicture = "";   // "" means no picture
const maxPictureSize = 2 * 1024 * 1024;   // 2 MB
const pictureTypes = ["image/png", "image/jpeg", "image/webp"];

// The PICTURES folder
const picturesFolder = "../PICTURES/";
const folderPictureNames = ["admin.jpg", "admin.jpeg", "admin.png", "admin.webp"];

// Show the picture, or the first letter of the name when there is none
function showPicture() {
  const picture = savedPicture;
  const big = document.getElementById("profileInitial");
  const small = document.getElementById("topAvatar");
  if (picture) {
    big.innerText = "";
    big.style.backgroundImage = 'url("' + picture + '")';
    small.style.backgroundImage = 'url("' + picture + '")';
    small.style.display = "inline-block";
  } else {
    big.innerText = profile.name.charAt(0).toUpperCase();
    big.style.backgroundImage = "none";
    small.style.display = "none";
  }
}

// Draw the chosen image on a 200 x 200 canvas
function shrinkPicture(image) {
  const size = 200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const side = Math.min(image.width, image.height);
  const left = (image.width - side) / 2;
  const top = (image.height - side) / 2;
  const context = canvas.getContext("2d");
  context.fillStyle = "white";   // JPEG has no transparency
  context.fillRect(0, 0, size, size);
  context.drawImage(image, left, top, side, side, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function savePicture() {
  clearErrors(["pictureError"]);
  const input = document.getElementById("pictureInput");
  const file = input.files[0];
  if (!file) {
    return;
  }
  if (!pictureTypes.includes(file.type)) {
    showError("pictureError", "Choose a PNG, JPG or WEBP image");
    input.value = "";
    return;
  }
  if (file.size > maxPictureSize) {
    showError("pictureError", "The image must be smaller than 2 MB");
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", function () {
    const image = new Image();
    image.addEventListener("load", function () {
      savedPicture = shrinkPicture(image);
      showPicture();
      showMessage("Profile picture saved.");
    });
    image.addEventListener("error", function () {
      showError("pictureError", "This file is not a valid image");
    });
    image.src = reader.result;
  });
  reader.readAsDataURL(file);
  input.value = "";   // so the same file can be chosen again later
}

// Find the first existing picture in the PICTURES folder (admin.jpg, admin.png or admin.webp)
function findFolderPicture(index, done) {
  if (index >= folderPictureNames.length) {
    done("");
    return;
  }
  const path = picturesFolder + folderPictureNames[index];
  const image = new Image();
  image.addEventListener("load", function () { done(path); });
  image.addEventListener("error", function () { findFolderPicture(index + 1, done); });
  image.src = path;
}

// Use the admin picture from the PICTURES folder
function useFolderPicture(fromButton) {
  clearErrors(["pictureError"]);
  findFolderPicture(0, function (path) {
    if (path === "") {
      if (fromButton) {
        showError("pictureError", "No admin.jpg, admin.png or admin.webp found in the PICTURES folder");
      }
      return;
    }
    savedPicture = path;
    showPicture();
    if (fromButton) {
      showMessage("Profile picture loaded from the PICTURES folder.");
    }
  });
}

function removePicture() {
  clearErrors(["pictureError"]);
  savedPicture = "";
  showPicture();
  showMessage("Profile picture removed.");
}

// CHANGE PASSWORD
let adminPassword = "admin123";

// Show or hide the typed passwords (checkbox)
function togglePasswords() {
  const type = document.getElementById("showPasswords").checked ? "text" : "password";
  ["currentPassword", "newPassword", "confirmPassword"].forEach(function (id) {
    document.getElementById(id).type = type;
  });
}

// UPDATE (the browser checks required and minlength, here we check the other rules)
function savePassword() {
  clearErrors(["currentPasswordError", "newPasswordError", "confirmPasswordError"]);
  const current = getValue("currentPassword");
  const newPassword = getValue("newPassword");
  const confirm = getValue("confirmPassword");
  let hasNumber = false;
  for (const character of newPassword) {
    if ("0123456789".includes(character)) {
      hasNumber = true;
    }
  }
  let valid = true;

  if (current !== adminPassword) {
    showError("currentPasswordError", "Current password is incorrect");
    valid = false;
  }
  if (newPassword.length < 8) {
    showError("newPasswordError", "Password must be at least 8 characters");
    valid = false;
  } else if (!hasNumber) {
    showError("newPasswordError", "Password must contain at least one number");
    valid = false;
  } else if (newPassword === current) {
    showError("newPasswordError", "New password must be different from the current password");
    valid = false;
  }
  if (confirm !== newPassword) {
    showError("confirmPasswordError", "Passwords do not match");
    valid = false;
  }
  if (!valid) {
    return;
  }

  adminPassword = newPassword;
  document.getElementById("passwordForm").reset();
  togglePasswords();
  showMessage("Password changed successfully.");
}

// EVENTS (everything is connected with addEventListener)
function onClick(id, handler) {
  document.getElementById(id).addEventListener("click", handler);
}

// Sidebar and top bar
menuSections.forEach(function (name) {
  onClick("menu-" + name, function () { showSection(name); });
});
onClick("logoutBtn", logOut);
onClick("menuLogout", logOut);
onClick("bellButton", openNotifications);
onClick("profileButton", toggleProfile);
onClick("myProfileBtn", function () { showSection("profile"); });
onClick("changePasswordBtn", function () { showSection("password"); });
onClick("editProfileBtn", openProfileForm);
onClick("cancelProfileBtn", function () { closeModal("profileModal"); });
onClick("changePictureBtn", function () { document.getElementById("pictureInput").click(); });
onClick("removePictureBtn", removePicture);
onClick("folderPictureBtn", function () { useFolderPicture(true); });
document.getElementById("pictureInput").addEventListener("change", savePicture);
document.getElementById("showPasswords").addEventListener("change", togglePasswords);

// Tabs
document.querySelectorAll("#roleTabs button").forEach(function (tab) {
  tab.addEventListener("click", function () { filterRole(tab.value); });
});
analyticsTabs.forEach(function (name) {
  onClick("atab-" + name, function () { showAnalyticsTab(name); });
});

// Search box and role dropdown
document.getElementById("userSearch").addEventListener("keyup", showUsers);
document.getElementById("roleFilter").addEventListener("change", function () { filterRole(getValue("roleFilter")); });

// "+ Add" buttons (0 means "a new item")
onClick("addActivityBtn", function () { openActivityForm(0); });
onClick("addUserBtn", function () { openUserForm(0); });
onClick("addSellerBtn", function () { openSellerForm(0); });
onClick("addProductBtn", function () { openProductForm(0); });
onClick("addCategoryBtn", function () { openCategoryForm(0); });
onClick("addCouponBtn", function () { openCouponForm(0); });
onClick("addRevenueBtn", function () { openRevenueForm(0); });
onClick("addNotificationBtn", function () { openNotificationForm(0); });
onClick("addLogBtn", function () { openLogForm(0); });

// Forms: preventDefault() stops the page from reloading
function onSubmit(id, handler) {
  document.getElementById(id).addEventListener("submit", function (event) {
    event.preventDefault();
    handler();
  });
}
onSubmit("userForm", saveUser);
onSubmit("activityForm", saveActivity);
onSubmit("sellerForm", saveSeller);
onSubmit("productForm", saveProduct);
onSubmit("categoryForm", saveCategory);
onSubmit("couponForm", saveCoupon);
onSubmit("revenueForm", saveRevenue);
onSubmit("notificationForm", saveNotification);
onSubmit("logForm", saveLog);
onSubmit("settingsForm", saveSettings);
onSubmit("profileForm", saveProfile);
onSubmit("passwordForm", savePassword);

// Close buttons: the x on a pop-up form and the Close button of a details box
document.querySelectorAll(".close").forEach(function (button) { button.addEventListener("click", closeAllModals); });
document.querySelectorAll(".details button").forEach(function (button) {
  button.addEventListener("click", function () { button.parentNode.style.display = "none"; });
});

// Keyboard: the Escape key closes any open pop-up form
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAllModals();
  }
});

// Table rows are redrawn often, so each table body has one listener (button name = action, value = id)
function listenToTable(bodyId, actions) {
  document.getElementById(bodyId).addEventListener("click", function (event) {
    const button = event.target;
    if (button.tagName === "BUTTON" && actions[button.name]) {
      actions[button.name](Number(button.value));
    }
  });
}

listenToTable("activityBody", { edit: openActivityForm, delete: deleteActivity });
listenToTable("userBody", { view: viewUser, edit: openUserForm, toggle: toggleUser, delete: deleteUser });
listenToTable("sellerBody", { view: viewSeller, verify: verifySeller, reject: rejectSeller, edit: openSellerForm, delete: deleteSeller });
listenToTable("productBody", { view: viewProduct, approve: approveProduct, remove: removeProduct, edit: openProductForm, delete: deleteProduct });
listenToTable("categoryBody", { edit: openCategoryForm, delete: deleteCategory });
listenToTable("couponBody", { edit: openCouponForm, delete: deleteCoupon });
listenToTable("revenueBody", { edit: openRevenueForm, delete: deleteRevenue });
listenToTable("notificationBody", { toggle: toggleNotification, edit: openNotificationForm, delete: deleteNotification });
listenToTable("logBody", { edit: openLogForm, delete: deleteLog });

// START THE PAGE
showActivities();
showUsers();
showSellers();
showProducts();
showCategories();
showCoupons();
showRevenue();
showNotifications();
showLogs();
showProfile();
useFolderPicture(false);   // show the admin picture from the PICTURES folder, if there is one
showSection("dashboard");
