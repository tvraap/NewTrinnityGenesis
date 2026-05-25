// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
function RemoveFromCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    price = price.toString();
    cart = cart.filter(item => !(item.Name === name && item.Price === price));
    localStorage.setItem("cart", JSON.stringify(cart));
    UpdateCartBadge();
    displayCart();
}

function UpdateCartBadge() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalItems = 0;
    cart.forEach(item => {
        totalItems += (item.Quantity || 1);
    });
    document.getElementById("cartBadge").innerText = totalItems;
}

function AddToWinkelwagen(name, price, Productid) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    price = price.toString();

    let ExistingItem = cart.find(item => item.Name === name && item.Price === price);

    if (ExistingItem) {
        ExistingItem.Quantity = (ExistingItem.Quantity || 1) + 1;
    }
    else {
        cart.push({
            Name: name,
            ProductId: Productid,
            Price: price,
            Quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    UpdateCartBadge();
    alert(name + " is toegevoegd");

    if (document.getElementById("table")) {
        displayCart();
    }
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let table = document.getElementById("table");

    if (!table) return;

    // Clear existing rows (keep header)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    let totalAmount = 0;

    // Create a map to track unique products
    let uniqueProducts = {};

    cart.forEach(product => {
        let key = product.Name + "|" + product.Price;

        if (!uniqueProducts[key]) {
            uniqueProducts[key] = {
                Name: product.Name,
                Price: parseFloat(product.Price),
                Quantity: 0
            };
        }

        uniqueProducts[key].Quantity++;
    });

    // Display each unique product
    Object.keys(uniqueProducts).forEach(key => {
        let product = uniqueProducts[key];
        let itemTotal = product.Price * product.Quantity;

        let newRow = table.insertRow(-1);
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);

        cell1.innerHTML = product.Name;
        cell2.innerHTML = product.Quantity;
        cell3.innerHTML = "€" + product.Price.toFixed(2);
        cell4.innerHTML = "€" + itemTotal.toFixed(2);

        cell5.innerHTML = `<button onclick="RemoveFromCart('${product.Name}', '${product.Price}')" class="btn btn-sm btn-danger">Remove</button>`;

        totalAmount += itemTotal;
    });

    // Add total row
    if (Object.keys(uniqueProducts).length > 0) {
        let newRow = table.insertRow(-1);
        newRow.style.fontWeight = "bold";
        newRow.style.backgroundColor = "#f0f0f0";

        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);


        cell1.innerHTML = "TOTAL";
        cell2.innerHTML = "€" + totalAmount.toFixed(2);
        cell2.colSpan = 4;
        cell2.style.textAlign = "right";
    } else {
        // Show empty message
        let newRow = table.insertRow(-1);
        let cell1 = newRow.insertCell(0);
        cell1.innerHTML = "Your cart is empty";
        cell1.colSpan = 5;
        cell1.style.textAlign = "center";
    }
}

// Load cart when page loads
window.onload = function () {
    UpdateCartBadge();
    displayCart();
};


function submitOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    document.getElementById("cartData").value = JSON.stringify(cart);
    document.getElementById("checkoutForm").submit();



}
function clearCart() {
    if (confirm("Clear your cart?")) {
        localStorage.removeItem("cart");
        location.reload();
    }
}