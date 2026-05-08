document.addEventListener("DOMContentLoaded", () => {

  const info = JSON.parse(localStorage.getItem("shippingInfo")) || {};
  const item = localStorage.getItem("orderItem") || "No item";
  const quantity = localStorage.getItem("orderQuantity") || "0";
  const method = localStorage.getItem("paymentMethod") || "N/A";
  const rawTotal = info.total || localStorage.getItem("orderTotal") || 0;
  const total = `₱${parseFloat(rawTotal).toFixed(2)}`;

  document.getElementById("name").textContent = info.name || "Unknown";
  document.getElementById("address").textContent = info.address || "No address";
  document.getElementById("item").textContent = item;
  document.getElementById("quantity").textContent = quantity;
  document.getElementById("method").textContent = method.toUpperCase();
  document.getElementById("total").textContent = total;

  // Save order to admin list
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

  // Go home and clear cart
  document.querySelector(".home-btn").addEventListener("click", () => {
    localStorage.removeItem("shippingInfo");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("orderItem");
    localStorage.removeItem("orderQuantity");
    localStorage.removeItem("orderPrice");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartSubtotal");
    localStorage.removeItem("cartItemCount");
    localStorage.removeItem("cartTotal");
    localStorage.removeItem("orderItems");
    window.location.href = "./HomePage.html";
  });

  // ✅ FIXED: LoginPage.html → LoginPage.php
  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (localStorage.getItem("isLoggedIn") === "true") {
        window.location.href = "./profile.html";
      } else {
        window.location.href = "./LoginPage.php";
      }
    });
  }
});
