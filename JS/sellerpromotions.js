const promotions = [];
let editIndex = -1;

// ----- Get HTML elements -----
const promotionForm = document.getElementById("promotionForm");
const campaignName = document.getElementById("campaignName");
const discount = document.getElementById("discount");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const promotionButton = document.getElementById("promotionButton");
const cancelPromotion = document.getElementById("cancelPromotion");
const promotionTable = document.getElementById("promotionTable");
const promotionCount = document.getElementById("promotionCount");

// ----- Display all promotion requests -----
function displayPromotions() {
    promotionTable.innerHTML = "";

    for (let i = 0; i < promotions.length; i++) {
        const row = "<tr>" +
            "<td>" + promotions[i].name + "</td>" +
            "<td>" + promotions[i].discount + "%</td>" +
            "<td>" + promotions[i].start + "</td>" +
            "<td>" + promotions[i].end + "</td>" +
            '<td><span class="status status-pending">' + promotions[i].status + "</span></td>" +
            '<td><button class="small" onclick="editPromotion(' + i + ')">Edit</button>' +
            '<button class="small danger" onclick="deletePromotion(' + i + ')">Delete</button></td>' +
            "</tr>";

        promotionTable.innerHTML += row;
    }

    if (promotions.length == 0) {
        promotionTable.innerHTML = '<tr><td colspan="6">No promotion requests.</td></tr>';
    }

    promotionCount.innerHTML = promotions.length;
}

// ----- Add or update a promotion request -----
promotionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const start = startDate.value;
    const end = endDate.value;

    // End date cannot be before start date
    if (end < start) {
        alert("End date must be after start date.");
        return;
    }

    const promotion = {
        name: campaignName.value,
        discount: discount.value,
        start: start,
        end: end,
        status: "Pending Approval"
    };

    if (editIndex == -1) {
        // ADD
        promotions.push(promotion);
    } else {
        // UPDATE (keep the old status)
        promotion.status = promotions[editIndex].status;
        promotions[editIndex] = promotion;
        editIndex = -1;
        promotionButton.innerHTML = "Add Request";
        cancelPromotion.style.display = "none";
    }

    promotionForm.reset();
    displayPromotions();
});

// ----- Put a request into the form for editing -----
function editPromotion(index) {
    campaignName.value = promotions[index].name;
    discount.value = promotions[index].discount;
    startDate.value = promotions[index].start;
    endDate.value = promotions[index].end;
    editIndex = index;

    promotionButton.innerHTML = "Update Request";
    cancelPromotion.style.display = "inline";
}

// ----- Withdraw (delete) a request -----
function deletePromotion(index) {
    const answer = confirm("Withdraw this promotion request?");

    if (answer == true) {
        promotions.splice(index, 1);
        displayPromotions();
    }
}

// ----- Cancel editing -----
cancelPromotion.addEventListener("click", function() {
    editIndex = -1;
    promotionForm.reset();
    promotionButton.innerHTML = "Add Request";
    cancelPromotion.style.display = "none";
});

// ----- Show everything when the page opens -----
displayPromotions();