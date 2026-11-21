// ----- Storage helpers (plain text, no JSON) -----
// Remove characters we use as separators
function cleanText(text) {
    return text.split("|").join("").split("\n").join("");
}

// Save orders: one line per order  ->  id|customer|product|amount|status
function saveOrders() {
    const lines = [];

    for (let i = 0; i < orders.length; i++) {
        lines.push(orders[i].id + "|" + orders[i].customer + "|" + orders[i].product + "|" + orders[i].amount + "|" + orders[i].status);
    }

    localStorage.setItem("sellerOrders", lines.join("\n"));
        // Update the bell in the top bar
    if (typeof refreshNotifications == "function") {
        refreshNotifications();
    }
}

// Load orders (returns null if nothing was saved yet)
function loadOrders() {
    const saved = localStorage.getItem("sellerOrders");
    const list = [];

    if (saved === null) {
        return null;
    }

    if (saved !== "") {
        const lines = saved.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split("|");
            list.push({ id: parts[0], customer: parts[1], product: parts[2], amount: Number(parts[3]), status: parts[4] });
        }
    }

    return list;
}

// Save notes: one line per note  ->  order|text
function saveNotes() {
    const lines = [];

    for (let i = 0; i < notes.length; i++) {
        lines.push(notes[i].order + "|" + notes[i].text);
    }

    localStorage.setItem("sellerOrderNotes", lines.join("\n"));
}

function loadNotes() {
    const saved = localStorage.getItem("sellerOrderNotes");
    const list = [];

    if (saved !== null && saved !== "") {
        const lines = saved.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split("|");
            list.push({ order: parts[0], text: parts[1] });
        }
    }

    return list;
}

// ----- Data -----
let orders = loadOrders();

// First time only: start with sample orders
if (orders === null) {
    orders = [
        { id: "NC1001", customer: "Ayesha", product: "Wireless Mouse", amount: 850, status: "Pending" },
        { id: "NC1002", customer: "Rahim", product: "Keyboard", amount: 1450, status: "Processing" },
        { id: "NC1003", customer: "Nadia", product: "Headphones", amount: 2200, status: "Completed" }
    ];
    saveOrders();
}

const notes = loadNotes();
let orderEditIndex = -1;
let noteEditIndex = -1;

// ----- Get HTML elements -----
const orderTable = document.getElementById("orderTable");
const orderCount = document.getElementById("orderCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const orderForm = document.getElementById("orderForm");
const orderFormTitle = document.getElementById("orderFormTitle");
const orderId = document.getElementById("orderId");
const customerName = document.getElementById("customerName");
const productName = document.getElementById("productName");
const orderAmount = document.getElementById("orderAmount");
const orderStatus = document.getElementById("orderStatus");
const orderButton = document.getElementById("orderButton");
const cancelOrder = document.getElementById("cancelOrder");
const orderMessage = document.getElementById("orderMessage");

const noteForm = document.getElementById("noteForm");
const noteOrder = document.getElementById("noteOrder");
const noteText = document.getElementById("noteText");
const noteButton = document.getElementById("noteButton");
const cancelNote = document.getElementById("cancelNote");
const noteTable = document.getElementById("noteTable");

// ----- Orders: READ -----
function displayOrders() {
    orderTable.innerHTML = "";

    let pending = 0;
    let completed = 0;

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].status == "Pending") {
            pending++;
        }
        if (orders[i].status == "Completed") {
            completed++;
        }

        const row = "<tr>" +
            "<td>" + orders[i].id + "</td>" +
            "<td>" + orders[i].customer + "</td>" +
            "<td>" + orders[i].product + "</td>" +
            "<td>" + orders[i].amount + "</td>" +
            '<td><span class="status status-' + statusClass(orders[i].status) + '">' + orders[i].status + "</span></td>" + 
            "<td>" + statusDropdown(i) +
            '<button class="small" onclick="editOrder(' + i + ')">Edit</button>' +
            '<button class="small danger" onclick="deleteOrder(' + i + ')">Delete</button></td>' +
            "</tr>";

        orderTable.innerHTML += row;
    }

    if (orders.length == 0) {
        orderTable.innerHTML = '<tr><td colspan="6">No orders.</td></tr>';
    }

    orderCount.innerHTML = orders.length;
    pendingCount.innerHTML = pending;
    completedCount.innerHTML = completed;
}

// Colour class for the status pill
function statusClass(status) {
    if (status == "Pending") {
        return "pending";
    } else if (status == "Processing") {
        return "processing";
    } else if (status == "Ready for Dispatch") {
        return "ready";
    }
    return "completed";
}
// Build the status dropdown for one order
function statusDropdown(index) {
    const statuses = ["Pending", "Processing", "Ready for Dispatch", "Completed"];
    let html = '<select onchange="changeStatus(' + index + ', this.value)">';

    for (let i = 0; i < statuses.length; i++) {
        let selected = "";
        if (orders[index].status == statuses[i]) {
            selected = " selected";
        }
        html += "<option" + selected + ">" + statuses[i] + "</option>";
    }

    html += "</select>";
    return html;
}

// ----- Orders: UPDATE status from the dropdown -----
function changeStatus(index, newStatus) {
    orders[index].status = newStatus;
    saveOrders();
    displayOrders();
}

// ----- Orders: CREATE and UPDATE (form) -----
orderForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const order = {
        id: cleanText(orderId.value.trim()),
        customer: cleanText(customerName.value.trim()),
        product: cleanText(productName.value.trim()),
        amount: Number(orderAmount.value),
        status: orderStatus.value
    };

    // Order ID must be unique
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id == order.id && i != orderEditIndex) {
            orderMessage.innerHTML = "This Order ID already exists.";
            return;
        }
    }

    if (orderEditIndex == -1) {
        orders.push(order);
        orderMessage.innerHTML = "Order added successfully!";
    } else {
        orders[orderEditIndex] = order;
        orderMessage.innerHTML = "Order updated successfully!";
    }

    resetOrderForm();
    saveOrders();
    displayOrders();
});

// Put an order into the form for editing
function editOrder(index) {
    orderId.value = orders[index].id;
    customerName.value = orders[index].customer;
    productName.value = orders[index].product;
    orderAmount.value = orders[index].amount;
    orderStatus.value = orders[index].status;
    orderEditIndex = index;

    orderFormTitle.innerHTML = "Edit Order";
    orderButton.innerHTML = "Update Order";
    cancelOrder.style.display = "inline";
    orderMessage.innerHTML = "";

    orderForm.scrollIntoView();
}

// ----- Orders: DELETE -----
function deleteOrder(index) {
    const answer = confirm("Are you sure you want to delete this order?");

    if (answer == true) {
        orders.splice(index, 1);
        saveOrders();
        resetOrderForm();
        displayOrders();
        orderMessage.innerHTML = "Order deleted successfully!";
    }
}

// Clear the order form and go back to Add mode
function resetOrderForm() {
    orderEditIndex = -1;
    orderForm.reset();
    orderFormTitle.innerHTML = "Add New Order";
    orderButton.innerHTML = "Add Order";
    cancelOrder.style.display = "none";
}

cancelOrder.addEventListener("click", function() {
    resetOrderForm();
    orderMessage.innerHTML = "";
});

// ----- Notes -----
function displayNotes() {
    noteTable.innerHTML = "";

    for (let i = 0; i < notes.length; i++) {
        const row = "<tr>" +
            "<td>" + notes[i].order + "</td>" +
            "<td>" + notes[i].text + "</td>" +
            '<td><button class="small" onclick="editNote(' + i + ')">Edit</button>' +
            '<button class="small danger" onclick="deleteNote(' + i + ')">Delete</button></td>' +
            "</tr>";

        noteTable.innerHTML += row;
    }

    if (notes.length == 0) {
        noteTable.innerHTML = '<tr><td colspan="3">No notes.</td></tr>';
    }
}

// Add or update a note
noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const note = {
        order: cleanText(noteOrder.value),
        text: cleanText(noteText.value)
    };

    if (noteEditIndex == -1) {
        notes.push(note);
    } else {
        notes[noteEditIndex] = note;
        noteEditIndex = -1;
        noteButton.innerHTML = "Add Note";
        cancelNote.style.display = "none";
    }

    noteForm.reset();
    saveNotes();
    displayNotes();
});

// Put note into the form for editing
function editNote(index) {
    noteOrder.value = notes[index].order;
    noteText.value = notes[index].text;
    noteEditIndex = index;

    noteButton.innerHTML = "Update Note";
    cancelNote.style.display = "inline";
}

// Delete a note
function deleteNote(index) {
    const answer = confirm("Delete note?");

    if (answer == true) {
        notes.splice(index, 1);
        saveNotes();
        displayNotes();
    }
}

// Cancel editing a note
cancelNote.addEventListener("click", function() {
    noteEditIndex = -1;
    noteForm.reset();
    noteButton.innerHTML = "Add Note";
    cancelNote.style.display = "none";
});

// ----- Show everything when the page opens -----
displayOrders();
displayNotes();