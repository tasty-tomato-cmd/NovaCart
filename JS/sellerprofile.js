const defaultProfile = {
    name: "NovaCart",
    owner: "Mahir",
    email: "store@example.com",
    phone: "01700000000",
    address: "Dhaka, Bangladesh",
    description: "Affordable everyday products."
};

// Current profile (starts as a copy of the default one)
let profile = {
    name: defaultProfile.name,
    owner: defaultProfile.owner,
    email: defaultProfile.email,
    phone: defaultProfile.phone,
    address: defaultProfile.address,
    description: defaultProfile.description
};

let photoData = localStorage.getItem("seller_photo") || "";   // uploaded photo (empty = show first letter)
let password = "seller123";         // demo password
const policies = [];
let editIndex = -1;

// ----- Remember the profile between pages (plain text, no JSON) -----
const profileKeys = ["name", "owner", "email", "phone", "address", "description"];

function saveProfile() {
    for (let i = 0; i < profileKeys.length; i++) {
        localStorage.setItem("seller_" + profileKeys[i], profile[profileKeys[i]]);
    }
}

// Use the saved values if there are any
for (let i = 0; i < profileKeys.length; i++) {
    const saved = localStorage.getItem("seller_" + profileKeys[i]);
    if (saved !== null) {
        profile[profileKeys[i]] = saved;
    }
}

// ----- Get HTML elements -----
const profileForm = document.getElementById("profileForm");
const storeName = document.getElementById("storeName");
const ownerName = document.getElementById("ownerName");
const storeEmail = document.getElementById("storeEmail");
const storePhone = document.getElementById("storePhone");
const storeAddress = document.getElementById("storeAddress");
const storeDescription = document.getElementById("storeDescription");
const profileMessage = document.getElementById("profileMessage");
const resetProfile = document.getElementById("resetProfile");

const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileStore = document.getElementById("profileStore");
const photoInput = document.getElementById("photoInput");
const removePhoto = document.getElementById("removePhoto");

const passwordForm = document.getElementById("passwordForm");
const passwordMessage = document.getElementById("passwordMessage");

const policyForm = document.getElementById("policyForm");
const policyTitle = document.getElementById("policyTitle");
const policyDetails = document.getElementById("policyDetails");
const policyButton = document.getElementById("policyButton");
const cancelPolicy = document.getElementById("cancelPolicy");
const policyTable = document.getElementById("policyTable");

// ----- Profile -----
// Put the profile data into the form
function loadProfile() {
    storeName.value = profile.name;
    ownerName.value = profile.owner;
    storeEmail.value = profile.email;
    storePhone.value = profile.phone;
    storeAddress.value = profile.address;
    storeDescription.value = profile.description;
}

// Show the circular avatar, name and store name
function showAvatar() {
    if (photoData != "") {
        profileAvatar.style.backgroundImage = 'url("' + photoData + '")';
        profileAvatar.innerHTML = "";
    } else {
        profileAvatar.style.backgroundImage = "none";
        profileAvatar.innerHTML = profile.owner.charAt(0).toUpperCase();
    }

    profileName.innerHTML = profile.owner;
    profileStore.innerHTML = profile.name;

    // Update the name and photo in the top bar too
    if (typeof refreshTopbar == "function") {
        refreshTopbar();
    }
}

// Save profile
profileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    profile.name = storeName.value;
    profile.owner = ownerName.value;
    profile.email = storeEmail.value;
    profile.phone = storePhone.value;
    profile.address = storeAddress.value;
    profile.description = storeDescription.value;

    saveProfile();
    showAvatar();
    profileMessage.innerHTML = "Profile saved successfully.";
});

// Restore the sample profile
resetProfile.addEventListener("click", function() {
    const answer = confirm("Restore sample profile?");

    if (answer == true) {
        profile.name = defaultProfile.name;
        profile.owner = defaultProfile.owner;
        profile.email = defaultProfile.email;
        profile.phone = defaultProfile.phone;
        profile.address = defaultProfile.address;
        profile.description = defaultProfile.description;

        saveProfile();
        loadProfile();
        showAvatar();
        profileMessage.innerHTML = "Sample profile restored.";
    }
});

// ----- Profile photo -----
photoInput.addEventListener("change", function() {
    const file = photoInput.files[0];

    if (!file) {
        return;
    }

    if (file.size > 500 * 1024) {
        alert("Please choose an image smaller than 500 KB.");
        photoInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        photoData = reader.result;
        localStorage.setItem("seller_photo", photoData);
        showAvatar();
        profileMessage.innerHTML = "Photo updated.";
    };
    reader.readAsDataURL(file);
});

removePhoto.addEventListener("click", function() {
    photoData = "";
    localStorage.removeItem("seller_photo");
    photoInput.value = "";
    showAvatar();
    profileMessage.innerHTML = "Photo removed.";
});

// ----- Change password -----
passwordForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const current = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    passwordMessage.className = "message error";

    if (current != password) {
        passwordMessage.innerHTML = "Current password is incorrect.";
    } else if (newPass.length < 6) {
        passwordMessage.innerHTML = "New password must be at least 6 characters.";
    } else if (newPass != confirmPass) {
        passwordMessage.innerHTML = "New passwords do not match.";
    } else {
        password = newPass;
        passwordMessage.className = "message";
        passwordMessage.innerHTML = "Password changed successfully.";
        passwordForm.reset();
    }
});

// ----- Policies -----
function displayPolicies() {
    policyTable.innerHTML = "";

    for (let i = 0; i < policies.length; i++) {
        const row = "<tr>" +
            "<td>" + policies[i].title + "</td>" +
            "<td>" + policies[i].details + "</td>" +
            '<td><button class="small" onclick="editPolicy(' + i + ')">Edit</button>' +
            '<button class="small danger" onclick="deletePolicy(' + i + ')">Delete</button></td>' +
            "</tr>";

        policyTable.innerHTML += row;
    }

    if (policies.length == 0) {
        policyTable.innerHTML = '<tr><td colspan="3">No policies yet.</td></tr>';
    }
}

// Add or update a policy
policyForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const policy = {
        title: policyTitle.value,
        details: policyDetails.value
    };

    if (editIndex == -1) {
        policies.push(policy);
    } else {
        policies[editIndex] = policy;
        editIndex = -1;
        policyButton.innerHTML = "Add Policy";
        cancelPolicy.style.display = "none";
    }

    policyForm.reset();
    displayPolicies();
});

// Put policy into the form for editing
function editPolicy(index) {
    policyTitle.value = policies[index].title;
    policyDetails.value = policies[index].details;
    editIndex = index;

    policyButton.innerHTML = "Update Policy";
    cancelPolicy.style.display = "inline";
}

// Delete a policy
function deletePolicy(index) {
    const answer = confirm("Delete this policy?");

    if (answer == true) {
        policies.splice(index, 1);
        displayPolicies();
    }
}

// Cancel editing
cancelPolicy.addEventListener("click", function() {
    editIndex = -1;
    policyForm.reset();
    policyButton.innerHTML = "Add Policy";
    cancelPolicy.style.display = "none";
});

// ----- Show everything when the page opens -----
loadProfile();
showAvatar();
displayPolicies();