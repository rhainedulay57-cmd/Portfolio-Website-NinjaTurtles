document.addEventListener("DOMContentLoaded", () => {
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const form = document.getElementById("paymentForm");
  const backBtn = document.querySelector(".back-btn");

  const subtotal = parseFloat(localStorage.getItem("cartSubtotal")) || 0;
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  shippingEl.textContent = `₱${shipping.toFixed(2)}`;
  totalEl.textContent = `₱${total.toFixed(2)}`;

  // Show/hide payment details
form.addEventListener("change", (e) => {
  if (e.target.name === "payment") {
      const method = e.target.value;
      document.getElementById("gcashDetails").style.display = method === "gcash" ? "block" : "none";
      document.getElementById("cardDetails").style.display = method === "card" ? "block" : "none";
  }
  });

  // Confirm payment
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const method = form.payment.value;
    localStorage.setItem("paymentMethod", method);
    alert("Payment confirmed via " + method.toUpperCase() + " ✅");
    window.location.href = "indexOrderComplete.html";
  });

  // Back button
  backBtn.addEventListener("click", () => {
    window.location.href = "indexPlaceOrder.html";
  });

  const fileInput = document.getElementById("fileInput");
  const fileName = document.getElementById("fileName");

  fileInput.addEventListener("change", () => {
    fileName.textContent = fileInput.files.length > 0 
      ? fileInput.files[0].name 
      : "No file chosen";
  });
});



