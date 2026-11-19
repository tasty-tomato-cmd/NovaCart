// NovaCart login page (one login for every type of user)

// Accounts for the whole project. The other user types will be added here later.
const accounts = [
  { email: "lubaba@novacart.com", password: "customer123", role: "Customer" },
  { email: "sazin@novacart.com", password: "seller123", role: "Seller" },
  { email: "fahad@novacart.com", password: "manager123", role: "Manager" },
  { email: "ameya@novacart.com", password: "admin123", role: "Administrator" },
  { email: "razeen@novacart.com", password: "delivery123", role: "Delivery Partner" }
];

// The page each role opens after logging in (the path starts from this login page)
const roleHomePages = {
  Administrator: "../../HTML/admin.html",
  Customer: "../../HTML/customer.html",
  Seller: "../../HTML/seller.html",
  Manager: "../../HTML/manager.html",
  "Delivery Partner": "../../HTML/delivery.html"
};

function showLoginError(text) {
  const error = document.getElementById("loginError");
  error.innerText = text;
  error.style.color = "red";
}

// Show or hide the typed password (checkbox)
function togglePassword() {
  const type = document.getElementById("showPassword").checked ? "text" : "password";
  document.getElementById("password").type = type;
}

// Find the account that matches the email and password
function findAccount(email, password) {
  for (const account of accounts) {
    if (account.email === email && account.password === password) {
      return account;
    }
  }
  return null;
}

// The browser has already checked required and the email format
function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  showLoginError("");

  const account = findAccount(email, password);
  if (account === null) {
    showLoginError("Incorrect email or password");
    return;
  }

  const page = roleHomePages[account.role];
  if (page === undefined) {
    showLoginError("The " + account.role + " page is not available yet");
    return;
  }
  window.location.href = page;
}

// Events
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();   // stop the page from reloading
  login();
});
document.getElementById("showPassword").addEventListener("change", togglePassword);
