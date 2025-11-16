document.addEventListener("DOMContentLoaded", () => {
  const itemSubtotalEl = document.getElementById("itemSubtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const form = document.getElementById("shippingForm");
  const backBtn = document.querySelector(".back-btn");

  const orderTitleEl = document.getElementById("orderTitle");
  const count = localStorage.getItem("cartItemCount") || 0;
  orderTitleEl.textContent = `ORDER SUMMARY | ${count} ITEM(S)`;

  // Load subtotal
  const savedSubtotal = localStorage.getItem("cartSubtotal");
  const subtotal = savedSubtotal ? parseFloat(savedSubtotal) : 0;

  // Compute shipping fee
  const shipping = subtotal > 0 ? 99 : 0;

  // Total
  const total = subtotal + shipping;

  // Display numeric totals
  itemSubtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  shippingEl.textContent = `₱${shipping.toFixed(2)}`;
  totalEl.textContent = `₱${total.toFixed(2)}`;

  // --------------------------
  // 🔥 DISPLAY SELECTED ITEMS
  // --------------------------
  const selectedItems = JSON.parse(localStorage.getItem("orderItems")) || [];
  const summaryContainer = document.getElementById("orderSummaryItems");

  if (summaryContainer) {
    summaryContainer.innerHTML = "";

    if (selectedItems.length === 0) {
      summaryContainer.innerHTML = "<p>No selected item.</p>";
    } else {
      selectedItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "summary-item";

        div.innerHTML = `
          <p><b>${item.name}</b></p>
          <p>${item.color}</p>
          <p>Qty: ${item.quantity}</p>
          <p>₱${item.price.toFixed(2)}</p>
        `;

        summaryContainer.appendChild(div);
      });
    }
  }

  // --------------------------
  //  FORM SUBMIT (SAVE ALL DATA)
  // --------------------------
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

    // SAVE EVERYTHING FOR PAY + FINAL PAGE
    const shippingInfo = {
      name,
      phone,
      address,
      postal,
      total,
      items: selectedItems   // <-- IMPORTANT: Added this!
    };

    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

    alert("Proceeding to payment...");
    window.location.href = "indexPay.html";
  });
});
