document.addEventListener("DOMContentLoaded", () => {
  // --- GET SHIPPING INFO ---
  const info = JSON.parse(localStorage.getItem("shippingInfo")) || {};

  // --- GET ITEM + QUANTITY FROM CART ---
  const item = localStorage.getItem("orderItem") || "No item";
  const quantity = localStorage.getItem("orderQuantity") || "0";

  // --- GET PAYMENT METHOD ---
  const method = localStorage.getItem("paymentMethod") || "N/A";

  // --- GET TOTAL PRICE ---
  const total = info.total ? `₱${info.total.toFixed(2)}` : "₱0.00";

  // --- DISPLAY TO ORDER COMPLETE PAGE ---
  document.getElementById("name").textContent = info.name || "Unknown";
  document.getElementById("address").textContent = info.address || "No address";
  document.getElementById("item").textContent = item;
  document.getElementById("quantity").textContent = quantity;
  document.getElementById("method").textContent = method.toUpperCase();
  document.getElementById("total").textContent = total;

  // --- SAVE ORDER TO ADMIN LIST ---
  let orders = JSON.parse(localStorage.getItem("allOrders")) || [];

  orders.push({
    name: info.name,
    address: info.address,
    item: item,
    quantity: quantity,
    total: total,
    payment: method.toUpperCase(),
    status: "Pending",
    date: new Date().toLocaleString()
  });

  localStorage.setItem("allOrders", JSON.stringify(orders));

  // --- CLEAR CART & DATA + GO HOME ---
 document.querySelector(".home-btn").addEventListener("click", () => {

localStorage.removeItem("shippingInfo");
localStorage.removeItem("paymentMethod");
localStorage.removeItem("orderItem");
localStorage.removeItem("orderQuantity");
localStorage.removeItem("orderPrice");

localStorage.removeItem("cartItems");      // << WALANG ITO KAYA DI NALILINIS
localStorage.removeItem("cartSubtotal");
localStorage.removeItem("cartItemCount");
localStorage.removeItem("cartTotal");
localStorage.removeItem("orderItems");     // selected items

    window.location.href = "HomePage.html";
  });
});
