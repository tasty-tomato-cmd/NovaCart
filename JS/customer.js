function clearActiveLinks() {
    document.getElementById("link-dash").className = "";
    document.getElementById("link-shop").className = "";
    document.getElementById("link-cart").className = "";
    document.getElementById("link-orders").className = "";
    document.getElementById("link-offers").className = "";
}

function hideAllPages() {
    document.getElementById("dash-page").style.display = "none";
    document.getElementById("shop-page").style.display = "none";
    document.getElementById("cart-page").style.display = "none";
    document.getElementById("orders-page").style.display = "none";
    document.getElementById("offers-page").style.display = "none";
    document.getElementById("notif-page").style.display = "none";
    document.getElementById("profile-page").style.display = "none";
    document.getElementById("pass-page").style.display = "none";
}

function showDash() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("dash-page").style.display = "block";
    document.getElementById("link-dash").className = "active-link";
}

function showShop() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("shop-page").style.display = "block";
    document.getElementById("link-shop").className = "active-link";
}

function showCart() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("cart-page").style.display = "block";
    document.getElementById("link-cart").className = "active-link";
}

function showOrders() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("orders-page").style.display = "block";
    document.getElementById("link-orders").className = "active-link";
}

function showOffers() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("offers-page").style.display = "block";
    document.getElementById("link-offers").className = "active-link";
}

// Shop Filter & Search
function filterItems(cat) {
    let cards = document.getElementsByClassName("product-card");
    for (let i = 0; i < cards.length; i++) {
        let c = cards[i].getAttribute("data-category");
        if (cat === "All" || c === cat) {
            cards[i].style.display = "inline-block";
        } else {
            cards[i].style.display = "none";
        }
    }
}

function searchItems() {
    let text = document.getElementById("search-box").value.toLowerCase();
    let cards = document.getElementsByClassName("product-card");
    for (let i = 0; i < cards.length; i++) {
        let name = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        if (name.includes(text)) {
            cards[i].style.display = "inline-block";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// Cart & Order Summary 
let cartCount = 0;
let subtotal = 0;
let discountRate = 0;
let couponCode = "None";
let cartRowsHtml = "";
let itemSummary = "";

function addItem(name, seller, price) {
    cartCount = cartCount + 1;
    subtotal = subtotal + price;
    itemSummary = itemSummary + name + " x 1, ";

    cartRowsHtml = cartRowsHtml +
        "<tr>" +
        "<td>" + name + "</td>" +
        "<td>" + seller + "</td>" +
        "<td>Tk " + price + "</td>" +
        "<td>1</td>" +
        "<td>Tk " + price + "</td>" +
        "<td><button class='btn-danger' onclick='clearCartTable()'>Delete</button></td>" +
        "</tr>";

    refreshCart();
    alert(name + " added to cart!");
}

function clearCartTable() {
    cartCount = 0;
    subtotal = 0;
    itemSummary = "";
    cartRowsHtml = "<tr><td colspan='6' class='sub-text'>Your cart is empty.</td></tr>";
    refreshCart();
}

function refreshCart() {
    document.getElementById("cart-table-body").innerHTML = cartRowsHtml;
    document.getElementById("cart-qty-text").innerText = cartCount;
    document.getElementById("nav-cart-count").innerText = cartCount;
    document.getElementById("dash-cart").innerText = cartCount;

    let discTk = Math.round(subtotal * discountRate);
    let finalTk = subtotal - discTk;

    document.getElementById("sum-sub").innerText = subtotal;
    document.getElementById("sum-disc").innerText = discTk;
    document.getElementById("sum-total").innerText = finalTk;
}

// Student Verification & Coupons
let studentVerified = false;

function saveStudent() {
    let n = document.getElementById("v-name").value;
    let id = document.getElementById("v-id").value;
    let u = document.getElementById("v-uni").value;

    if (n === "" || id === "" || u === "") {
        alert("Please fill Name, Student ID, and University!");
        return;
    }

    studentVerified = true;
    document.getElementById("stu-badge").innerText = "Verified";
    document.getElementById("stu-badge").className = "badge-green";
    document.getElementById("dash-stu-status").innerText = "Verified";
    document.getElementById("dash-stu-status").className = "badge-green";
    alert("Student verified!");
}

function removeStudent() {
    studentVerified = false;
    discountRate = 0;
    couponCode = "None";
    document.getElementById("v-name").value = "";
    document.getElementById("v-id").value = "";
    document.getElementById("v-uni").value = "";
    document.getElementById("stu-badge").innerText = "Not Verified";
    document.getElementById("stu-badge").className = "badge-red";
    document.getElementById("dash-stu-status").innerText = "Not Verified";
    document.getElementById("dash-stu-status").className = "badge-red";
    document.getElementById("dash-coupon").innerText = "None";
    refreshCart();
}

function useCoupon(code, rate) {
    if (code === "STUDENTS15" && !studentVerified) {
        alert("Please verify your student status first!");
        return;
    }
    discountRate = rate;
    couponCode = code;
    document.getElementById("dash-coupon").innerText = code;
    refreshCart();
    alert("Coupon " + code + " applied!");
}

// Place Order & Orders Table Actions
let nextOrderNo = 1004;
let totalOrdersCount = 3;
let spentAmount = 8250;

function submitOrder() {
    if (cartCount === 0) {
        alert("Your cart is empty!");
        return;
    }

    let addr = document.getElementById("del-address").value;
    let phone = document.getElementById("del-phone").value;
    let pay = document.getElementById("del-payment").value;
    let totalTk = document.getElementById("sum-total").innerText;

    if (addr === "") {
        alert("Please enter delivery address!");
        return;
    }
    if (phone.length !== 11 || isNaN(phone)) {
        alert("Phone number must be 11 digits!");
        return;
    }

    let idNum = nextOrderNo;
    nextOrderNo = nextOrderNo + 1;

    let newRow =
        "<tr id='row-" + idNum + "' data-status='Placed'>" +
        "<td>NC-" + idNum + "</td>" +
        "<td>2026-11-19</td>" +
        "<td>" + itemSummary + "</td>" +
        "<td>Tk " + totalTk + "</td>" +
        "<td>" + pay + "</td>" +
        "<td><span class='badge-purple' id='st-" + idNum + "'>Placed</span></td>" +
        "<td>" +
        "<button class='btn-light' onclick=\"alert('Address: " + addr + " | Phone: " + phone + "')\">View</button> " +
        "<button class='btn-light' onclick=\"updateOrderAddress('" + idNum + "')\">Edit Address</button> " +
        "<button class='btn-danger' onclick=\"cancelOrderRow('" + idNum + "', 'st-" + idNum + "')\">Cancel</button>" +
        "</td>" +
        "</tr>";

    document.getElementById("orders-table-body").innerHTML =
        newRow + document.getElementById("orders-table-body").innerHTML;

    totalOrdersCount = totalOrdersCount + 1;
    spentAmount = spentAmount + Number(totalTk);
    document.getElementById("dash-orders").innerText = totalOrdersCount;
    document.getElementById("dash-spent").innerText = spentAmount;

    document.getElementById("del-address").value = "";
    document.getElementById("del-phone").value = "";
    document.getElementById("del-note").value = "";

    clearCartTable();
    alert("Order NC-" + idNum + " placed!");
    showOrders();
}

function updateOrderAddress(idNum) {
    let updated = prompt("Enter new delivery address:");
    if (updated !== null && updated !== "") {
        alert("Address updated to: " + updated);
    }
}

function cancelOrderRow(idNum, statusId) {
    document.getElementById(statusId).innerText = "Cancelled";
    document.getElementById(statusId).className = "badge-red";
    document.getElementById("row-" + idNum).setAttribute("data-status", "Cancelled");
}

function filterOrders(statusName) {
    let rows = document.getElementById("orders-table-body").getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        let st = rows[i].getAttribute("data-status");
        if (statusName === "All" || st === statusName) {
            rows[i].style.display = "table-row";
        } else {
            rows[i].style.display = "none";
        }
    }
}
function togglePassView() {
    let isChecked = document.getElementById("show-pass-box").checked;
    let typeVal = "password";
    if (isChecked) {
        typeVal = "text";
    }
    document.getElementById("curr-pass").type = typeVal;
    document.getElementById("new-pass").type = typeVal;
    document.getElementById("conf-pass").type = typeVal;
}

function updatePassword() {
    let currP = document.getElementById("curr-pass").value;
    let newP = document.getElementById("new-pass").value;
    let confP = document.getElementById("conf-pass").value;

    if (currP === "" || newP === "" || confP === "") {
        alert("Please fill all password fields!");
        return;
    }
    if (newP.length < 8) {
        alert("New password must be at least 8 characters!");
        return;
    }
    if (newP === currP) {
        alert("New password must be different from current password!");
        return;
    }
    if (newP !== confP) {
        alert("New password and confirm password do not match!");
        return;
    }

    alert("Password changed successfully!");
    document.getElementById("curr-pass").value = "";
    document.getElementById("new-pass").value = "";
    document.getElementById("conf-pass").value = "";
}
function toggleMenu() {
    let menu = document.getElementById("user-menu");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

function showNotif() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("notif-page").style.display = "block";
}

function showProfile() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("user-menu").style.display = "none";
    document.getElementById("profile-page").style.display = "block";
}

function showPassPage() {
    hideAllPages();
    clearActiveLinks();
    document.getElementById("user-menu").style.display = "none";
    document.getElementById("pass-page").style.display = "block";
}

function toggleRead(statusId, btnId) {
    let st = document.getElementById(statusId);
    let btn = document.getElementById(btnId);

    if (st.innerText === "Unread") {
        st.innerText = "Read";
        st.className = "badge-green";
        btn.innerText = "Mark Unread";
    } else {
        st.innerText = "Unread";
        st.className = "badge-purple";
        btn.innerText = "Mark Read";
    }
}

function markAllRead() {
    document.getElementById("n-st-1").innerText = "Read";
    document.getElementById("n-st-1").className = "badge-green";
    document.getElementById("n-btn-1").innerText = "Mark Unread";

    document.getElementById("n-st-2").innerText = "Read";
    document.getElementById("n-st-2").className = "badge-green";
    document.getElementById("n-btn-2").innerText = "Mark Unread";

    document.getElementById("top-notif-count").innerText = "0";
}

function deleteNotif(rowId) {
    document.getElementById(rowId).style.display = "none";
}
function logOut() {
  alert("You have been logged out.");
  window.location.href = "../LOGIN/HTML/Login.html";
}
// Profile CRUD using a normal array
let profilesData = [
    {
        name: "Lubaba",
        email: "lubaba@novacart.com",
        phone: "+8801812345678",
        addr: "House 7, Road 3, Banani, Dhaka",
        role: "Customer",
        joined: "2025-01-15"
    }
];

let selectedIndex = 0;

function loadProfile(index) {
    if (profilesData.length === 0) {
        document.getElementById("p-badge").innerText = "-";
        document.getElementById("show-name").innerText = "None";
        document.getElementById("show-email").innerText = "-";
        document.getElementById("show-phone").innerText = "-";
        document.getElementById("show-addr").innerText = "-";
        document.getElementById("show-role").innerText = "-";
        document.getElementById("show-joined").innerText = "-";
        return;
    }

    selectedIndex = index;
    let item = profilesData[index];

    document.getElementById("p-badge").innerText = item.name.charAt(0).toUpperCase();
    document.getElementById("show-name").innerText = item.name;
    document.getElementById("show-email").innerText = item.email;
    document.getElementById("show-phone").innerText = item.phone;
    document.getElementById("show-addr").innerText = item.addr;
    document.getElementById("show-role").innerText = item.role;
    document.getElementById("show-joined").innerText = item.joined;

    document.getElementById("in-name").value = item.name;
    document.getElementById("in-email").value = item.email;
    document.getElementById("in-phone").value = item.phone;
    document.getElementById("in-addr").value = item.addr;
    document.getElementById("in-role").value = item.role;
    document.getElementById("in-joined").value = item.joined;
}

function showProfileTable() {
    let rows = "";
    for (let i = 0; i < profilesData.length; i++) {
        let p = profilesData[i];
        rows = rows +
            "<tr>" +
            "<td>" + p.name + "</td>" +
            "<td>" + p.email + "</td>" +
            "<td>" + p.phone + "</td>" +
            "<td>" + p.addr + "</td>" +
            "<td><span class='badge-purple'>" + p.role + "</span></td>" +
            "<td><button class='btn-light' onclick='loadProfile(" + i + ")'>View</button></td>" +
            "</tr>";
    }
    document.getElementById("all-profiles-body").innerHTML = rows;
}

function addProfile() {
    let n = document.getElementById("in-name").value;
    let e = document.getElementById("in-email").value;
    let ph = document.getElementById("in-phone").value;
    let a = document.getElementById("in-addr").value;
    let r = document.getElementById("in-role").value;
    let j = document.getElementById("in-joined").value;

    if (n === "" || e === "" || ph === "" || a === "") {
        alert("Please fill Name, Email, Contact No and Address!");
        return;
    }

    profilesData.push({
        name: n,
        email: e,
        phone: ph,
        addr: a,
        role: r,
        joined: j
    });

    let lastIndex = profilesData.length - 1;
    loadProfile(lastIndex);
    showProfileTable();
    alert("Profile created!");
}

function editProfileData() {
    if (profilesData.length === 0) {
        alert("No profile to update!");
        return;
    }

    profilesData[selectedIndex] = {
        name: document.getElementById("in-name").value,
        email: document.getElementById("in-email").value,
        phone: document.getElementById("in-phone").value,
        addr: document.getElementById("in-addr").value,
        role: document.getElementById("in-role").value,
        joined: document.getElementById("in-joined").value
    };

    loadProfile(selectedIndex);
    showProfileTable();
    alert("Profile updated!");
}

function removeProfile() {
    if (profilesData.length === 0) {
        alert("No profile to delete!");
        return;
    }

    profilesData.splice(selectedIndex, 1);

    if (profilesData.length > 0) {
        loadProfile(0);
    } else {
        loadProfile(0);
    }
    showProfileTable();
    alert("Profile deleted!");
}

loadProfile(0);
showProfileTable();