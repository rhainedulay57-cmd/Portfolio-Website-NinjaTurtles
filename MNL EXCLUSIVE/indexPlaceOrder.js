document.addEventListener("DOMContentLoaded", () => {
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const form = document.getElementById("shippingForm");
  const backBtn = document.querySelector(".back-btn");

  // Load total from previous cart page (saved in localStorage)
  const savedTotal = localStorage.getItem("cartTotal");
  const subtotal = savedTotal ? parseFloat(savedTotal) : 0;
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  shippingEl.textContent = `₱${shipping.toFixed(2)}`;
  totalEl.textContent = `₱${total.toFixed(2)}`;

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const postal = document.getElementById("postal").value.trim();

    if (!name || !phone || !address || !postal) {
      alert("Please fill in all fields before continuing.");
      return;
    }

    // Save order info to localStorage for the next step (Pay)
    localStorage.setItem("shippingInfo", JSON.stringify({ name, phone, address, postal, total }));
    alert("Proceeding to payment...");
  });
});
