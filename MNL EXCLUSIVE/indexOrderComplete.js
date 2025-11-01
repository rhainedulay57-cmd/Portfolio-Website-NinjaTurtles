document.addEventListener("DOMContentLoaded", () => {
  const info = JSON.parse(localStorage.getItem("shippingInfo")) || {};
  const method = localStorage.getItem("paymentMethod") || "N/A";
  const total = info.total ? `₱${info.total.toFixed(2)}` : "₱0.00";

  document.getElementById("name").textContent = info.name || "Unknown";
  document.getElementById("address").textContent = info.address || "No address";
  document.getElementById("method").textContent = method.toUpperCase();
  document.getElementById("total").textContent = total;

  document.querySelector(".home-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "HomePage.html";
  });
});
