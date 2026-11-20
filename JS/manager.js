// DATA (objects and arrays of objects)
const profile = {
  name: "MD. ABDUR RAHMAN",
  email: "manager@novacart.com",
  phone: "+880 1521 799704",
  department: "Management & Operations",
  location: "Mirpur, Dhaka, Bangladesh",
  photo: "../PICTURES/manager.jpg"
};

let managerPassword = "manager123";

const campaigns = [
  {
    id: "CMP-101",
    name: "Eid Shopping Festival",
    category: "Fashion & Apparel",
    discount: 30,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    budget: 75000,
    spent: 45000,
    status: "Active"
  },
  {
    id: "CMP-102",
    name: "Boishakhi Tech Fair",
    category: "Electronics & Gadgets",
    discount: 25,
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    budget: 120000,
    spent: 0,
    status: "Upcoming"
  },
  {
    id: "CMP-103",
    name: "Winter Clearance Sale",
    category: "Home & Kitchen",
    discount: 40,
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    budget: 50000,
    spent: 49000,
    status: "Expired"
  },
  {
    id: "CMP-104",
    name: "Monsoon Flash Deals",
    category: "Beauty & Wellness",
    discount: 15,
    startDate: "2026-06-15",
    endDate: "2026-06-30",
    budget: 35000,
    spent: 0,
    status: "Draft"
  }
];

const orders = [
  {
    id: "ORD-98214",
    customer: "MST, FARZANA KHANOM AMILY",
    seller: "Apex Tech Electronics",
    date: "2026-11-14",
    amount: 14500,
    paymentStatus: "Paid",
    orderStatus: "Processing"
  },
  {
    id: "ORD-98215",
    customer: "AMAYA RAHMAN",
    seller: "Dhaka Fashion Hub",
    date: "2026-11-15",
    amount: 3850,
    paymentStatus: "Paid",
    orderStatus: "Shipped"
  },
  {
    id: "ORD-98216",
    customer: "AHNAM RAZZEN KHAN",
    seller: "Modern Home Living",
    date: "2026-11-16",
    amount: 8200,
    paymentStatus: "Pending",
    orderStatus: "Pending"
  },
  {
    id: "ORD-98210",
    customer: "MAHIR SAJIN",
    seller: "Apex Tech Electronics",
    date: "2026-11-10",
    amount: 24900,
    paymentStatus: "Paid",
    orderStatus: "Delivered"
  },
  {
    id: "ORD-98205",
    customer: "LUBABA",
    seller: "Green Organic Foods",
    date: "2026-11-08",
    amount: 1200,
    paymentStatus: "Refunded",
    orderStatus: "Cancelled"
  }
];

const complaints = [
  {
    id: "CMPL-401",
    customer: "MAHIR SAZIN",
    orderId: "ORD-98214",
    description: "Delayed order dispatch from merchant after 48h.",
    priority: "Urgent",
    date: "2026-11-15",
    status: "Open",
    notes: "Contacted vendor packing supervisor."
  },
  {
    id: "CMPL-398",
    customer: "AMAYA RAHMAN",
    orderId: "ORD-98215",
    description: "Wrong color variant shipped by merchant.",
    priority: "Urgent",
    date: "2026-11-14",
    status: "In Progress",
    notes: "Replacement item parcel initiated."
  },
  {
    id: "CMPL-390",
    customer: "AHNAM RAZZEN KHAN",
    orderId: "ORD-98210",
    description: "Warranty card unverified in package.",
    priority: "Low",
    date: "2026-11-11",
    status: "Resolved",
    notes: "Official digital warranty stamped and emailed."
  }
];

let editingCampaignId = "";
let editingComplaintId = "";
let currentCampaignFilter = "All";

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

function openModal(id) {
  document.getElementById(id).classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

function closeAllModals() {
  document.querySelectorAll(".overlay").forEach(function (overlay) {
    overlay.classList.remove("show");
  });
}

function showError(id, text) {
  const error = document.getElementById(id);
  error.innerText = text;
}

function clearErrors(ids) {
  ids.forEach(function (id) {
    setText(id, "");
  });
}

function showMessage(text) {
  setText("message", text);
}

function findById(list, id) {
  for (const item of list) {
    if (item.id === id) {
      return item;
    }
  }
}

function removeItem(list, id) {
  list.splice(list.indexOf(findById(list, id)), 1);
}

function getNextCampaignId() {
  let highest = 100;
  for (const campaign of campaigns) {
    const num = Number(campaign.id.slice(4));
    if (num > highest) {
      highest = num;
    }
  }
  return "CMP-" + (highest + 1);
}

function money(amount) {
  return amount + " ৳";
}

function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let diffTime = end - start;
  if (diffTime < 0) {
    diffTime = -diffTime;
  }
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays + (diffDays > 1 ? " Days" : " Day");
}


function getInitials(fullName) {
  const clean = fullName.replace(".", "").trim();
  const parts = clean.split(" ");
  const validParts = [];
  for (const part of parts) {
    if (part !== "" && part.toUpperCase() !== "MD") {
      validParts.push(part);
    }
  }
  if (validParts.length >= 2) {
    return (validParts[0].charAt(0) + validParts[1].charAt(0)).toUpperCase();
  }
  if (validParts.length === 1) {
    return validParts[0].charAt(0).toUpperCase();
  }
  return "M";
}

// Sync photo and initials across both Profile section and Top Bar header
function syncManagerHeaderAndPhoto() {
  const initials = getInitials(profile.name);
  setText("profileInitial", initials);
  setText("avatarInitials", initials);
  setText("sidebarManagerName", profile.name);
  setText("topbarManagerName", profile.name);
  setText("welcomeManagerName", profile.name);

  const profileImg = document.getElementById("profilePhoto");
  const topbarImg = document.getElementById("topbarAvatarImg");

  if (profile.photo !== "") {
    profileImg.src = profile.photo;
    topbarImg.src = profile.photo;
    show("profilePhoto");
    hide("profileInitial");
    topbarImg.style.display = "inline-block";
    hide("avatarInitials");
  } else {
    hide("profilePhoto");
    show("profileInitial");
    hide("topbarAvatarImg");
    document.getElementById("avatarInitials").style.display = "inline-block";
  }
}

// SIDEBAR AND TOP BAR
const sectionNames = ["dashboard", "campaigns", "monitoring", "reports", "profile"];

function showSection(name) {
  sectionNames.forEach(function (section) {
    hide("section-" + section);
    const menuItem = document.getElementById("menu-" + section);
    if (menuItem) {
      menuItem.className = "menu-item";
    }
  });

  show("section-" + name);
  const activeItem = document.getElementById("menu-" + name);
  if (activeItem) {
    activeItem.className = "menu-item active";
  }

  hide("profileMenu");
  showMessage("");

  if (name === "dashboard") showDashboard();
  if (name === "campaigns") showCampaigns();
  if (name === "monitoring") showMonitoring();
  if (name === "reports") showReports();
  if (name === "profile") showProfile();
}

function toggleProfile() {
  const menu = document.getElementById("profileMenu");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function goToChangePassword() {
  hide("profileMenu");
  showSection("profile");
  document.getElementById("oldPass").focus();
}

function logOut() {
  hide("profileMenu");
  alert("You have been logged out.");
  window.location.href = "../LOGIN/HTML/login.html";
}

// 1. DASHBOARD
function showDashboard() {
  let totalSales = 0;
  for (const order of orders) {
    if (order.paymentStatus === "Paid") {
      totalSales += Number(order.amount);
    }
  }

  let activeCount = 0;
  for (const campaign of campaigns) {
    if (campaign.status === "Active") {
      activeCount++;
    }
  }

  let openComplaints = 0;
  for (const complaint of complaints) {
    if (complaint.status !== "Resolved") {
      openComplaints++;
    }
  }

  setText("statTotalSales", money(totalSales));
  setText("statTotalOrders", orders.length);
  setText("statActiveCampaigns", activeCount);
  setText("statPendingComplaints", openComplaints);

  // Campaigns overview (first 4)
  let campRows = "";
  let campShown = 0;
  for (const c of campaigns) {
    if (campShown >= 4) {
      break;
    }
    campShown++;
    campRows += "<tr>" +
      "<td><strong>" + c.name + "</strong><br><small class='sub-text'>" + c.category + "</small></td>" +
      "<td><strong>" + c.discount + "% OFF</strong></td>" +
      "<td>" + money(c.budget) + "</td>" +
      "<td><span class='badge badge-" + c.status + "'>" + c.status + "</span></td>" +
      "</tr>";
  }
  document.getElementById("dashCampaignsTable").innerHTML = campRows;

  // Recent orders (first 5)
  let orderRows = "";
  let orderShown = 0;
  for (const o of orders) {
    if (orderShown >= 5) {
      break;
    }
    orderShown++;
    orderRows += "<tr>" +
      "<td><strong>" + o.id + "</strong></td>" +
      "<td>" + o.customer + "<br><small class='sub-text'>" + o.seller + "</small></td>" +
      "<td>" + o.date + "</td>" +
      "<td><strong>" + money(o.amount) + "</strong></td>" +
      "<td>" + o.orderStatus + "</td>" +
      "</tr>";
  }
  document.getElementById("dashOrdersTable").innerHTML = orderRows;
}

// 2. CAMPAIGNS 
function showCampaigns() {
  const search = getValue("searchCampaign").toLowerCase().trim();
  let rows = "";

  for (const c of campaigns) {
    const filterMatches = currentCampaignFilter === "All" || c.status === currentCampaignFilter;
    const searchMatches = c.name.toLowerCase().includes(search) ||
      c.category.toLowerCase().includes(search);

    if (filterMatches && searchMatches) {
      const duration = calculateDays(c.startDate, c.endDate);

      rows += "<tr>" +
        "<td><strong>" + c.id + "</strong></td>" +
        "<td><strong>" + c.name + "</strong><br><small class='sub-text'>" + c.category + "</small></td>" +
        "<td><strong class='primary-text'>" + c.discount + "% OFF</strong></td>" +
        "<td>" + c.startDate + " to " + c.endDate + "<br><small class='sub-text'>" + duration + "</small></td>" +
        "<td>" + money(c.budget) + "</td>" +
        "<td><span class='badge badge-" + c.status + "'>" + c.status + "</span></td>" +
        "<td>" +
          "<button type='button' class='btn outline small btn-gap' name='edit' value='" + c.id + "'>Edit</button>" +
          "<button type='button' class='btn danger small' name='delete' value='" + c.id + "'>Delete</button>" +
        "</td>" +
        "</tr>";
    }
  }

  document.getElementById("campaignTableBody").innerHTML =
    rows || "<tr><td colspan='7' class='empty-cell'>No campaigns match your filter.</td></tr>";
}

function filterCampaigns(status) {
  currentCampaignFilter = status;

  document.querySelectorAll("#campaignTabs button").forEach(function (tab) {
    tab.className = (tab.value === status) ? "tab active" : "tab";
  });

  showCampaigns();
}

function openCampaignForm(id) {
  editingCampaignId = id;
  clearErrors([
    "campNameError",
    "campDiscountError",
    "campStartDateError",
    "campEndDateError",
    "campBudgetError"
  ]);

  if (id === "") {
    setText("campaignLegend", "Create Promotional Campaign");
    setValue("campName", "");
    setValue("campCategory", "Fashion & Apparel");
    setValue("campDiscount", "");
    setValue("campStartDate", "");
    setValue("campEndDate", "");
    setValue("campBudget", "");
    setValue("campStatus", "Active");
  } else {
    const campaign = findById(campaigns, id);
    setText("campaignLegend", "Edit Campaign (" + campaign.id + ")");
    setValue("campName", campaign.name);
    setValue("campCategory", campaign.category);
    setValue("campDiscount", campaign.discount);
    setValue("campStartDate", campaign.startDate);
    setValue("campEndDate", campaign.endDate);
    setValue("campBudget", campaign.budget);
    setValue("campStatus", campaign.status);
  }

  openModal("campaignModal");
}

function saveCampaign() {
  clearErrors([
    "campNameError",
    "campDiscountError",
    "campStartDateError",
    "campEndDateError",
    "campBudgetError"
  ]);

  const name = getValue("campName").trim();
  const category = getValue("campCategory");
  const discount = Number(getValue("campDiscount"));
  const startDate = getValue("campStartDate");
  const endDate = getValue("campEndDate");
  const budget = Number(getValue("campBudget"));
  const status = getValue("campStatus");
  let valid = true;

  if (name === "") {
    showError("campNameError", "Campaign name must be filled out");
    valid = false;
  }
  if (getValue("campDiscount") === "" || discount < 1 || discount > 90) {
    showError("campDiscountError", "Discount must be between 1% and 90%");
    valid = false;
  }
  if (startDate === "") {
    showError("campStartDateError", "Start date must be selected");
    valid = false;
  }
  if (endDate === "") {
    showError("campEndDateError", "End date must be selected");
    valid = false;
  } else if (startDate !== "" && endDate < startDate) {
    showError("campEndDateError", "End date cannot be earlier than start date");
    valid = false;
  }
  if (getValue("campBudget") === "" || budget < 1000) {
    showError("campBudgetError", "Approved budget must be at least 1000 BDT");
    valid = false;
  }
  if (!valid) {
    return;
  }

  if (editingCampaignId === "") {
    const newId = getNextCampaignId();
    campaigns.unshift({
      id: newId,
      name: name,
      category: category,
      discount: discount,
      startDate: startDate,
      endDate: endDate,
      budget: budget,
      spent: 0,
      status: status
    });
    showMessage("Campaign " + newId + " created successfully.");
  } else {
    const campaign = findById(campaigns, editingCampaignId);
    campaign.name = name;
    campaign.category = category;
    campaign.discount = discount;
    campaign.startDate = startDate;
    campaign.endDate = endDate;
    campaign.budget = budget;
    campaign.status = status;
    showMessage("Campaign " + editingCampaignId + " updated successfully.");
  }

  closeModal("campaignModal");
  showCampaigns();
}

function deleteCampaign(id) {
  const campaign = findById(campaigns, id);
  if (campaign.status === "Active") {
    alert("Active campaigns cannot be deleted to preserve customer discounts. Please set status to Expired first.");
    return;
  }

  removeItem(campaigns, id);
  showMessage("Campaign " + id + " deleted.");
  showCampaigns();
}

// 3. OPERATIONS MONITORING & COMPLAINT RESOLUTION
function showMonitoring() {
  showOrderStatusChart();
  showGrievanceChart();

  // Merchant orders table
  let orderRows = "";
  for (const o of orders) {
    orderRows += "<tr>" +
      "<td><strong>" + o.id + "</strong></td>" +
      "<td>" + o.customer + "</td>" +
      "<td>" + o.seller + "</td>" +
      "<td>" + o.date + "</td>" +
      "<td><strong>" + money(o.amount) + "</strong></td>" +
      "<td>" + o.paymentStatus + "</td>" +
      "<td>" +
        "<select class='status-select' name='" + o.id + "'>" +
          "<option value='Pending'" + (o.orderStatus === "Pending" ? " selected" : "") + ">Pending</option>" +
          "<option value='Processing'" + (o.orderStatus === "Processing" ? " selected" : "") + ">Processing</option>" +
          "<option value='Shipped'" + (o.orderStatus === "Shipped" ? " selected" : "") + ">Shipped</option>" +
          "<option value='Delivered'" + (o.orderStatus === "Delivered" ? " selected" : "") + ">Delivered</option>" +
          "<option value='Cancelled'" + (o.orderStatus === "Cancelled" ? " selected" : "") + ">Cancelled</option>" +
        "</select>" +
      "</td>" +
      "</tr>";
  }
  document.getElementById("ordersTable").innerHTML = orderRows;

  // Complaints table
  let compRows = "";
  for (const c of complaints) {
    const priorityBadge = (c.priority === "Urgent")
      ? "<span class='badge badge-Urgent'>Urgent</span>"
      : c.priority;

    compRows += "<tr>" +
      "<td><strong>" + c.id + "</strong></td>" +
      "<td>" + c.customer + "<br><small class='sub-text'>Order: " + c.orderId + "</small></td>" +
      "<td>" + c.description + "</td>" +
      "<td>" + priorityBadge + "</td>" +
      "<td>" + c.date + "</td>" +
      "<td><strong>" + c.status + "</strong></td>" +
      "<td><button type='button' class='btn outline small' name='resolve' value='" + c.id + "'>Resolve</button></td>" +
      "</tr>";
  }
  document.getElementById("complaintsTable").innerHTML = compRows;
}

function buildBarList(items, total) {
  let html = "";
  for (const item of items) {
    const percent = Math.round((item.count / total) * 100);
    html += "<div class='bar-item'>" +
      "<div class='bar-header'>" +
        "<span>" + item.label + " (" + item.count + ")</span>" +
        "<span>" + percent + "%</span>" +
      "</div>" +
      "<div class='bar-track'>" +
        "<div class='bar-fill " + item.color + "' style='width: " + percent + "%;'></div>" +
      "</div>" +
      "</div>";
  }
  return html;
}

function showOrderStatusChart() {
  let delivered = 0;
  let processing = 0;
  let shipped = 0;
  let pending = 0;
  let cancelled = 0;

  for (const o of orders) {
    if (o.orderStatus === "Delivered") delivered++;
    if (o.orderStatus === "Processing") processing++;
    if (o.orderStatus === "Shipped") shipped++;
    if (o.orderStatus === "Pending") pending++;
    if (o.orderStatus === "Cancelled") cancelled++;
  }

  const statuses = [
    { label: "Delivered", count: delivered, color: "green" },
    { label: "Processing", count: processing, color: "" },
    { label: "Shipped", count: shipped, color: "blue" },
    { label: "Pending", count: pending, color: "amber" },
    { label: "Cancelled", count: cancelled, color: "red" }
  ];

  document.getElementById("orderStatusChart").innerHTML = buildBarList(statuses, orders.length || 1);
}

function showGrievanceChart() {
  let urgent = 0;
  let medium = 0;
  let low = 0;

  for (const c of complaints) {
    if (c.priority === "Urgent") urgent++;
    if (c.priority === "Medium") medium++;
    if (c.priority === "Low") low++;
  }

  const priorities = [
    { label: "Urgent Priority", count: urgent, color: "red" },
    { label: "Medium Priority", count: medium, color: "amber" },
    { label: "Low Priority", count: low, color: "blue" }
  ];

  document.getElementById("grievanceChart").innerHTML = buildBarList(priorities, complaints.length || 1);
}

function updateOrderStatus(orderId, newStatus) {
  const order = findById(orders, orderId);
  if (order) {
    order.orderStatus = newStatus;
    showMessage("Order " + orderId + " status updated to " + newStatus + ".");
    showOrderStatusChart();
  }
}

function openArbitrateForm(id) {
  editingComplaintId = id;
  clearErrors(["arbitrateNotesError"]);

  const complaint = findById(complaints, id);
  setText("arbitrateLegend", "Resolve Complaint (" + complaint.id + ")");
  setValue("arbitrateCustomerInfo", complaint.customer + " — " + complaint.orderId);
  setValue("arbitrateSummary", complaint.description);
  setValue("arbitrateStatus", complaint.status);
  setValue("arbitrateNotes", complaint.notes || "");

  openModal("arbitrateModal");
}

function saveArbitration() {
  clearErrors(["arbitrateNotesError"]);
  const status = getValue("arbitrateStatus");
  const notes = getValue("arbitrateNotes").trim();

  if (notes === "") {
    showError("arbitrateNotesError", "Solution notes must be filled out");
    return;
  }

  const complaint = findById(complaints, editingComplaintId);
  complaint.status = status;
  complaint.notes = notes;

  closeModal("arbitrateModal");
  showMessage("Complaint " + editingComplaintId + " updated to " + status + ".");
  showMonitoring();
}

// 4. REPORTS & ANALYTICS
function showReports() {
  let totalSales = 0;
  let paidCount = 0;

  for (const o of orders) {
    if (o.paymentStatus === "Paid") {
      totalSales += Number(o.amount);
      paidCount++;
    }
  }

  const aov = (paidCount > 0) ? Math.round(totalSales / paidCount) : 0;

  setText("reportSales", money(totalSales));
  setText("reportOrders", orders.length);
  setText("reportAov", money(aov));

  showMerchantRevenueChart(totalSales);

  let rows = "";
  for (const o of orders) {
    rows += "<tr>" +
      "<td><strong>" + o.id + "</strong></td>" +
      "<td>" + o.customer + "</td>" +
      "<td>" + o.seller + "</td>" +
      "<td>" + o.date + "</td>" +
      "<td><strong>" + money(o.amount) + "</strong></td>" +
      "<td>" + o.paymentStatus + "</td>" +
      "</tr>";
  }
  document.getElementById("reportOrdersTable").innerHTML = rows;
}

function showMerchantRevenueChart(totalSales) {
  const merchants = [];
  for (const o of orders) {
    if (o.paymentStatus === "Paid") {
      let existing = null;
      for (const m of merchants) {
        if (m.name === o.seller) {
          existing = m;
        }
      }
      if (existing) {
        existing.revenue += Number(o.amount);
      } else {
        merchants.push({ name: o.seller, revenue: Number(o.amount) });
      }
    }
  }

  const maxRevenue = totalSales || 1;
  let html = "";

  for (const m of merchants) {
    const percent = Math.round((m.revenue / maxRevenue) * 100);
    html += "<div class='bar-item'>" +
      "<div class='bar-header'>" +
        "<span>" + m.name + "</span>" +
        "<span class='primary-text'>" + money(m.revenue) + " (" + percent + "%)</span>" +
      "</div>" +
      "<div class='bar-track'>" +
        "<div class='bar-fill' style='width: " + percent + "%;'></div>" +
      "</div>" +
      "</div>";
  }

  document.getElementById("merchantRevenueChart").innerHTML = html;
}

function downloadCSV() {
  let csv = "Order ID,Customer,Merchant,Date,Amount (BDT),Payment Status,Order Status\n";

  for (const o of orders) {
    csv += o.id + ',"' + o.customer + '","' + o.seller + '",' + o.date + "," + o.amount + "," + o.paymentStatus + "," + o.orderStatus + "\n";
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "NovaCart_Manager_Performance_Report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showMessage("Performance Report CSV downloaded successfully.");
}

// 5. MY PROFILE, PHOTO & CHANGE PASSWORD
function showProfile() {
  syncManagerHeaderAndPhoto();
  setValue("profileName", profile.name);
  setValue("profileEmail", profile.email);
  setValue("profilePhone", profile.phone);
  setValue("profileDept", profile.department);
}

function changePhoto(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    profile.photo = reader.result;
    syncManagerHeaderAndPhoto();
    showMessage("Profile photo updated.");
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  profile.photo = "";
  setValue("photoInput", "");
  syncManagerHeaderAndPhoto();
  showMessage("Profile photo removed.");
}

function saveProfile() {
  clearErrors(["profileNameError", "profilePhoneError", "profileDeptError"]);
  const name = getValue("profileName").trim();
  const phone = getValue("profilePhone").trim();
  const dept = getValue("profileDept").trim();
  let valid = true;

  if (name === "") {
    showError("profileNameError", "Full name must be filled out");
    valid = false;
  }
  if (phone === "") {
    showError("profilePhoneError", "Mobile contact must be filled out");
    valid = false;
  }
  if (dept === "") {
    showError("profileDeptError", "Department must be filled out");
    valid = false;
  }
  if (!valid) {
    return;
  }

  profile.name = name;
  profile.phone = phone;
  profile.department = dept;

  syncManagerHeaderAndPhoto();
  showMessage("Profile updated successfully.");
}

function togglePasswords() {
  const type = document.getElementById("showPasswords").checked ? "text" : "password";
  ["oldPass", "newPass", "confirmPass"].forEach(function (id) {
    document.getElementById(id).type = type;
  });
}

function savePassword() {
  clearErrors(["oldPassError", "newPassError", "confirmPassError"]);
  const current = getValue("oldPass");
  const newPass = getValue("newPass");
  const confirmPass = getValue("confirmPass");
  let valid = true;

  if (current !== managerPassword) {
    showError("oldPassError", "Current password is incorrect");
    valid = false;
  }
  if (newPass.length < 6) {
    showError("newPassError", "New password must be at least 6 characters");
    valid = false;
  } else if (newPass === current) {
    showError("newPassError", "New password must be different from current password");
    valid = false;
  }
  if (confirmPass !== newPass) {
    showError("confirmPassError", "Passwords do not match");
    valid = false;
  }
  if (!valid) {
    return;
  }

  managerPassword = newPass;
  document.getElementById("passwordForm").reset();
  togglePasswords();
  showMessage("Password updated successfully.");
}

// EVENTS (everything is connected with addEventListener)
function onClick(id, handler) {
  document.getElementById(id).addEventListener("click", handler);
}

function onSubmit(id, handler) {
  document.getElementById(id).addEventListener("submit", function (event) {
    event.preventDefault();
    handler();
  });
}

// Sidebar and top bar
sectionNames.forEach(function (name) {
  onClick("menu-" + name, function () {
    showSection(name);
  });
});

onClick("logoutBtn", logOut);
onClick("menuLogout", logOut);
onClick("profileButton", toggleProfile);
onClick("myProfileBtn", function () {
  showSection("profile");
});
onClick("changePasswordBtn", goToChangePassword);
document.getElementById("showPasswords").addEventListener("change", togglePasswords);

// Profile Photo Change, Remove & Fallback
onClick("changePhotoBtn", function () {
  document.getElementById("photoInput").click();
});
document.getElementById("photoInput").addEventListener("change", changePhoto);
onClick("removePhotoBtn", removePhoto);

document.getElementById("profilePhoto").addEventListener("error", function () {
  hide("profilePhoto");
  show("profileInitial");
});

document.getElementById("topbarAvatarImg").addEventListener("error", function () {
  hide("topbarAvatarImg");
  document.getElementById("avatarInitials").style.display = "inline-block";
});

// Dashboard quick buttons
onClick("dashManageCampaignsBtn", function () {
  showSection("campaigns");
});
onClick("dashViewOrdersBtn", function () {
  showSection("monitoring");
});

// Campaign search, filter tabs & modal buttons
document.getElementById("searchCampaign").addEventListener("keyup", showCampaigns);

document.querySelectorAll("#campaignTabs button").forEach(function (tab) {
  tab.addEventListener("click", function () {
    filterCampaigns(tab.value);
  });
});

onClick("addCampaignBtn", function () {
  openCampaignForm("");
});
onClick("cancelCampaignBtn", function () {
  closeModal("campaignModal");
});
onClick("cancelArbitrateBtn", function () {
  closeModal("arbitrateModal");
});

// Forms
onSubmit("campaignForm", saveCampaign);
onSubmit("arbitrateForm", saveArbitration);
onSubmit("profileForm", saveProfile);
onSubmit("passwordForm", savePassword);

// Reports CSV
onClick("downloadCsvBtn", downloadCSV);

// Modal close buttons and Escape key
document.querySelectorAll(".close").forEach(function (button) {
  button.addEventListener("click", closeAllModals);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAllModals();
  }
});

// Table event listeners
function listenToTable(bodyId, actions) {
  document.getElementById(bodyId).addEventListener("click", function (event) {
    const button = event.target;
    if (button.tagName === "BUTTON" && actions[button.name]) {
      actions[button.name](button.value);
    }
  });
}

listenToTable("campaignTableBody", {
  edit: openCampaignForm,
  delete: deleteCampaign
});

listenToTable("complaintsTable", {
  resolve: openArbitrateForm
});

document.getElementById("ordersTable").addEventListener("change", function (event) {
  const select = event.target;
  if (select.tagName === "SELECT") {
    updateOrderStatus(select.name, select.value);
  }
});
// START THE PAGE
syncManagerHeaderAndPhoto();
showDashboard();
showCampaigns();
showMonitoring();
showReports();
showProfile();
showSection("dashboard");
