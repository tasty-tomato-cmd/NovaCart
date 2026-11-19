// NovaCart registration page (one registration for Customer, Seller and Delivery Partner)

// The extra fields of each account type
const roleFieldIds = {
  "Customer": "customerFields",
  "Seller": "sellerFields",
  "Delivery Partner": "deliveryFields"
};

// Every error message next to a field
const errorIds = [
  "fullNameError", "emailError", "phoneError", "passwordError", "confirmPasswordError", "termsError",
  "customerAddressError", "universityError", "studentIdError",
  "storeNameError", "sellerAddressError", "storeInfoError", "deliveryAreaError"
];

let selectedRole = "Customer";

// ----- helper functions -----
function getValue(id) {
  return document.getElementById(id).value;
}

function setText(id, text) {
  document.getElementById(id).innerText = text;
}

function showError(id, text) {
  const error = document.getElementById(id);
  error.innerText = text;
  error.style.color = "red";
}

function clearErrors() {
  for (const id of errorIds) {
    setText(id, "");
  }
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

function hasNumber(text) {
  for (const character of text) {
    if ("0123456789".includes(character)) {
      return true;
    }
  }
  return false;
}

// ----- account type tabs -----
// Disabled fields are skipped by the browser's validation, so hidden fields never block the form
function showRole(role) {
  selectedRole = role;

  for (const name in roleFieldIds) {
    const fields = document.getElementById(roleFieldIds[name]);
    fields.style.display = (name === role) ? "block" : "none";
    fields.disabled = (name !== role);
  }
  for (const tab of document.querySelectorAll("#roleTabs button")) {
    tab.className = (tab.value === role) ? "tab active" : "tab";
  }
  setText("registerTitle", "Create a " + role + " Account");
  clearErrors();
  showStudentFields();
}

// University and student ID are only needed for students
function showStudentFields() {
  const isStudent = getRadio("isStudent") === "Yes";
  const fields = document.getElementById("studentFields");
  fields.style.display = isStudent ? "block" : "none";
  fields.disabled = !isStudent;
}

// Click "Terms and Conditions" to show the hidden text under it, click again to hide it
function toggleTerms() {
  const text = document.getElementById("termsText");
  const isHidden = (text.style.display !== "block");
  text.style.display = isHidden ? "block" : "none";
  document.getElementById("termsLink").setAttribute("aria-expanded", isHidden);
}

// Show or hide the typed passwords (checkbox)
function togglePasswords() {
  const type = document.getElementById("showPasswords").checked ? "text" : "password";
  document.getElementById("password").type = type;
  document.getElementById("confirmPassword").type = type;
}

// ----- validation (the browser checks required, minlength and pattern first) -----
function checkAccountDetails() {
  const name = getValue("fullName").trim();
  const email = getValue("email").trim();
  const password = getValue("password");
  let valid = true;

  if (name === "") {
    showError("fullNameError", "Name must be filled out");
    valid = false;
  }
  if (!email.includes("@")) {
    showError("emailError", "Email must contain an @");
    valid = false;
  }
  if (!isValidPhone(getValue("phone").trim())) {
    showError("phoneError", "Enter a valid number, for example +8801712345678");
    valid = false;
  }
  if (password.length < 8) {
    showError("passwordError", "Password must be at least 8 characters");
    valid = false;
  } else if (!hasNumber(password)) {
    showError("passwordError", "Password must contain at least one number");
    valid = false;
  }
  if (getValue("confirmPassword") !== password) {
    showError("confirmPasswordError", "Passwords do not match");
    valid = false;
  }
  if (!document.getElementById("terms").checked) {
    showError("termsError", "You must agree to the terms and conditions");
    valid = false;
  }
  return valid;
}

function checkCustomerDetails() {
  let valid = true;

  if (getValue("customerAddress").trim() === "") {
    showError("customerAddressError", "Address must be filled out");
    valid = false;
  }
  if (getRadio("isStudent") === "Yes") {
    if (getValue("university").trim() === "") {
      showError("universityError", "University must be filled out");
      valid = false;
    }
    if (getValue("studentId").trim() === "") {
      showError("studentIdError", "Student ID must be filled out");
      valid = false;
    }
  }
  return valid;
}

function checkSellerDetails() {
  let valid = true;

  if (getValue("storeName").trim() === "") {
    showError("storeNameError", "Store name must be filled out");
    valid = false;
  }
  if (getValue("sellerAddress").trim() === "") {
    showError("sellerAddressError", "Store address must be filled out");
    valid = false;
  }
  if (getValue("storeInfo").trim() === "") {
    showError("storeInfoError", "Store information must be filled out");
    valid = false;
  }
  return valid;
}

function checkDeliveryDetails() {
  if (getValue("deliveryArea").trim() === "") {
    showError("deliveryAreaError", "Delivery area must be filled out");
    return false;
  }
  return true;
}

// ----- register -----
function register() {
  clearErrors();
  let valid = checkAccountDetails();

  // Check the extra fields of the chosen account type
  let extraValid = true;
  if (selectedRole === "Customer") {
    extraValid = checkCustomerDetails();
  } else if (selectedRole === "Seller") {
    extraValid = checkSellerDetails();
  } else {
    extraValid = checkDeliveryDetails();
  }
  if (!valid || !extraValid) {
    return;
  }

  const name = getValue("fullName").trim();
  const newAccount = {
    name: name,
    email: getValue("email").trim().toLowerCase(),
    phone: "+880" + getPhoneDigits(getValue("phone").trim()),   // always kept in the +880 form
    role: selectedRole
  };
  console.log(newAccount);   // the password is never printed

  // A message for each account type
  let message = "";
  if (selectedRole === "Customer") {
    message = "Welcome to NovaCart, " + name + "! Your customer account has been created.";
  } else if (selectedRole === "Seller") {
    message = "Thank you, " + name + ". Your store " + getValue("storeName").trim() +
      " has been submitted. An administrator will verify it before you can start selling.";
  } else {
    message = "Thank you, " + name + ". Your delivery partner account has been created.";
  }
  setText("successText", message);
  document.getElementById("registerArea").style.display = "none";
  document.getElementById("successBox").style.display = "block";
}

// Go back to an empty form
function registerAnother() {
  document.getElementById("registerForm").reset();
  togglePasswords();
  document.getElementById("successBox").style.display = "none";
  document.getElementById("registerArea").style.display = "block";
  showRole("Customer");
}

// ----- events -----
for (const tab of document.querySelectorAll("#roleTabs button")) {
  tab.addEventListener("click", function () {
    showRole(tab.value);
  });
}
for (const radio of document.getElementsByName("isStudent")) {
  radio.addEventListener("change", showStudentFields);
}
document.getElementById("showPasswords").addEventListener("change", togglePasswords);
document.getElementById("termsLink").addEventListener("click", toggleTerms);
document.getElementById("registerAnotherBtn").addEventListener("click", registerAnother);
document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();   // stop the page from reloading
  register();
});

// Start with the Customer form
showRole("Customer");
