document.addEventListener("DOMContentLoaded", () => {
  const itemSubtotalEl = document.getElementById("itemSubtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const form = document.getElementById("shippingForm");
  const backBtn = document.querySelector(".back-btn");

  const orderTitleEl = document.getElementById("orderTitle");
  const count = localStorage.getItem("cartItemCount") || 0;
  orderTitleEl.textContent = `ORDER SUMMARY | ${count} ITEM(S)`;

  // Load subtotal from previous page (cart)
 const savedSubtotal = localStorage.getItem("cartSubtotal");
 const subtotal = savedSubtotal ? parseFloat(savedSubtotal) : 0;
  // Shipping fee
  const shipping = subtotal > 0 ? 99 : 0; // pwede mong baguhin kung gusto mo exact 99

  // Compute correct total
  const total = subtotal + shipping;

  // Display values
  itemSubtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
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

    // Save to localStorage for next page
    localStorage.setItem("shippingInfo", JSON.stringify({ name, phone, address, postal, total }));
    alert("Proceeding to payment...");
    window.location.href = "indexPay.html";
  });
});