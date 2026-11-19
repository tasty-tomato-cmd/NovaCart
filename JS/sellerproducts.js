// Starting product data
const products = [
    { name: "Wireless Headphones", category: "Electronics", price: 2500, stock: 20 },
    { name: "Running Shoes", category: "Footwear", price: 3500, stock: 15 },
    { name: "Smart Watch", category: "Electronics", price: 4200, stock: 3 }
];

// Get HTML elements
const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const formMessage = document.getElementById("formMessage");

// Display all products in the table
function displayProducts(list) {
    productTable.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
        let status = "";
        let statusClass = "";

        if (list[i].stock == 0) {
            status = "Out of Stock";
            statusClass = "out-stock";
        } else if (list[i].stock <= 5) {
            status = "Low Stock";
            statusClass = "low-stock";
        } else {
            status = "In Stock";
            statusClass = "in-stock";
        }

        // Real position of this product in the full products list
        const realIndex = products.indexOf(list[i]);

        const row = "<tr>" +
            "<td>" + list[i].name + "</td>" +
            "<td>" + list[i].category + "</td>" +
            "<td>৳" + list[i].price + "</td>" +
            "<td>" + list[i].stock + "</td>" +
            '<td><span class="stock-status ' + statusClass + '">' + status + "</span></td>" +
            '<td><button class="edit-btn" onclick="editProduct(' + realIndex + ')">Edit</button>' +
            '<button class="delete-btn" onclick="deleteProduct(' + realIndex + ')">Delete</button></td>' +
            "</tr>";

        productTable.innerHTML += row;
    }

    updateSummary();

    if (list.length == 0) {
        document.getElementById("emptyMessage").innerHTML = "No products found.";
    } else {
        document.getElementById("emptyMessage").innerHTML = "";
    }
}

// Update the three summary cards
function updateSummary() {
    const total = products.length;
    let inStockCount = 0;
    let lowStockCount = 0;

    for (let i = 0; i < products.length; i++) {
        if (products[i].stock > 0) {
            inStockCount++;
        }

        if (products[i].stock > 0 && products[i].stock <= 5) {
            lowStockCount++;
        }
    }

    document.getElementById("totalProducts").innerHTML = total;
    document.getElementById("inStock").innerHTML = inStockCount;
    document.getElementById("lowStock").innerHTML = lowStockCount;
}

// Create or update a product
productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value;
    const category = document.getElementById("category").value;
    const price = Number(document.getElementById("price").value);
    const stock = Number(document.getElementById("stock").value);
    const editIndex = document.getElementById("editIndex").value;

    const product = {
        name: name,
        category: category,
        price: price,
        stock: stock
    };

    if (editIndex == "") {
        // CREATE
        products.push(product);
        formMessage.innerHTML = "Product added successfully!";
    } else {
        // UPDATE
        products[Number(editIndex)] = product;
        formMessage.innerHTML = "Product updated successfully!";
    }

    productForm.reset();
    document.getElementById("editIndex").value = "";
    formTitle.innerHTML = "Add New Product";
    saveButton.innerHTML = "Add Product";

    displayProducts(products);
});

// Put selected product details into the form for editing
function editProduct(index) {
    document.getElementById("productName").value = products[index].name;
    document.getElementById("category").value = products[index].category;
    document.getElementById("price").value = products[index].price;
    document.getElementById("stock").value = products[index].stock;
    document.getElementById("editIndex").value = index;

    formTitle.innerHTML = "Edit Product";
    saveButton.innerHTML = "Update Product";
    formMessage.innerHTML = "Edit the details and click Update Product.";

    window.scrollTo(0, 0);
}

// Delete a product
function deleteProduct(index) {
    const answer = confirm("Are you sure you want to delete this product?");

    if (answer == true) {
        products.splice(index, 1);
        displayProducts(products);
        formMessage.innerHTML = "Product deleted successfully!";
    }
}

// Search products
searchInput.addEventListener("keyup", function() {
    const searchText = searchInput.value.toLowerCase();
    const filteredProducts = [];

    for (let i = 0; i < products.length; i++) {
        if (products[i].name.toLowerCase().includes(searchText) ||
            products[i].category.toLowerCase().includes(searchText)) {
            filteredProducts.push(products[i]);
        }
    }

    displayProducts(filteredProducts);
});

// Clear form and return to Add Product mode
document.getElementById("cancelButton").addEventListener("click", function() {
    document.getElementById("editIndex").value = "";
    formTitle.innerHTML = "Add New Product";
    saveButton.innerHTML = "Add Product";
    formMessage.innerHTML = "";
});

// Show initial products when page opens
displayProducts(products);