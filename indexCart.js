// indexCart.js
document.addEventListener("DOMContentLoaded", () => {
  // Helpers to find UI elements (support both class and id variants)
  const findEl = (selClass, selId) => document.querySelector(selClass) || document.getElementById(selId);

  const subtotalEl = findEl(".subtotal-value", "subtotal");
  const shippingEl = findEl(".shipping-value", "shipping");
  const totalEl = findEl(".total-value", "total");
  const discountEl = findEl(".discount-value", "discount"); // optional element showing discount
  const voucherInput = findEl(".voucher-input", "voucher");
  const applyVoucherBtn = findEl(".apply-voucher", "apply");
  const checkoutBtn = findEl(".checkout-btn", "checkout");

  let discount = 0; // decimal (e.g., 0.1 for 10%)

  // Utility: return current cart item elements (in case items are removed/added)
  function getCartItems() {
    return Array.from(document.querySelectorAll(".cart-item"));
  }

  // Parse a price string like "₱1,234.56" into a number 1234.56
  function parsePrice(text) {
    if (!text && text !== 0) return 0;
    // Remove anything except digits, dot, minus and keep decimal
    const cleaned = String(text).replace(/[^0-9.\-]+/g, "");
    const v = parseFloat(cleaned);
    return Number.isFinite(v) ? v : 0;
  }

  // Recalculate subtotal, discount, shipping and total
  function calculateTotals() {
    const items = getCartItems();
    let rawSubtotal = 0; // sum(price * qty) for selected items

    items.forEach(item => {
      const checkbox = item.querySelector(".select-item");
      // if checkbox doesn't exist, treat item as selected
      const selected = checkbox ? checkbox.checked : true;

      const priceEl = item.querySelector(".item-price");
      const qtyEl = item.querySelector(".qty");

      const price = parsePrice(priceEl ? priceEl.textContent : priceEl?.value);
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 0 : 0;

      if (selected && qty > 0) rawSubtotal += price * qty;
    });

    // discount amount and discounted subtotal
    const discountAmount = rawSubtotal * discount;
    const discountedSubtotal = rawSubtotal - discountAmount;

    // shipping rule: free when rawSubtotal is 0 (no items), otherwise fixed fee
    const shippingFee = rawSubtotal > 0 ? 99 : 0;

    const total = discountedSubtotal + shippingFee;

    // Update DOM (use fallbacks if certain elements don't exist)
    if (subtotalEl) subtotalEl.textContent = `₱${discountedSubtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `₱${shippingFee.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${total.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-₱${discountAmount.toFixed(2)}`;
  }

  // Event delegation for qty buttons, checkboxes and remove buttons
  document.addEventListener("click", (e) => {
    const inc = e.target.closest(".increase");
    const dec = e.target.closest(".decrease");
    const remove = e.target.closest(".remove-item");

    if (inc || dec) {
      const btn = inc || dec;
      const item = btn.closest(".cart-item");
      const qtyEl = item.querySelector(".qty");
      let qty = parseInt(qtyEl.textContent, 10) || 0;

      if (btn.classList.contains("increase")) qty++;
      if (btn.classList.contains("decrease") && qty > 1) qty--;

      qtyEl.textContent = qty;
      calculateTotals();
    }

    if (remove) {
      const item = remove.closest(".cart-item");
      if (!item) return;
      item.classList.add("fade-out");
      setTimeout(() => {
        item.remove();
        calculateTotals();
      }, 260);
    }
  });

  // Listen to checkbox changes
  document.addEventListener("change", (e) => {
    if (e.target && e.target.matches(".select-item")) {
      calculateTotals();
    }
  });

  // Voucher application
  if (applyVoucherBtn && voucherInput) {
    applyVoucherBtn.addEventListener("click", () => {
      const code = voucherInput.value.trim().toUpperCase();
      if (!code) {
        discount = 0;
        alert("Please enter a voucher code.");
        calculateTotals();
        return;
      }

      // Example voucher rules
      if (code === "MNL10") {
        discount = 0.10;
        alert("Voucher applied: 10% off ✅");
      } else if (code === "MNL50") {
        // fixed 50 pesos off example (handled as percentage relative to subtotal isn't ideal,
        // but we can simulate fixed discount by computing it as a fraction — better to handle separately)
        // we'll implement MNL50 as fixed 50 PHP discount
        // to support fixed discount we set discount to 0 and store fixedDiscount separately
        discount = 0;
        // store fixed discount in a data attribute on the voucher input for calculation
        voucherInput.dataset.fixedDiscount = "50";
        alert("Voucher applied: ₱50 off ✅");
      } else {
        discount = 0;
        delete voucherInput.dataset.fixedDiscount;
        alert("Invalid voucher code ❌");
      }

      calculateTotals();
    });
  }

  // If fixed discount token is present, adapt calculateTotals to include it.
  // We'll wrap the original calculateTotals with support for fixed discount:
  const originalCalculate = calculateTotals;
  calculateTotals = function () {
    // compute values like before
    const items = getCartItems();
    let rawSubtotal = 0;
    items.forEach(item => {
      const checkbox = item.querySelector(".select-item");
      const selected = checkbox ? checkbox.checked : true;
      const price = parsePrice(item.querySelector(".item-price")?.textContent);
      const qty = parseInt(item.querySelector(".qty")?.textContent, 10) || 0;
      if (selected && qty > 0) rawSubtotal += price * qty;
    });

    // percentage discount:
    const discountAmountPercent = rawSubtotal * discount;

    // fixed discount (if any)
    const fixedDiscount = (voucherInput && voucherInput.dataset.fixedDiscount) ? parseFloat(voucherInput.dataset.fixedDiscount) || 0 : 0;

    // total discount is percent + fixed (but not exceeding subtotal)
    let totalDiscount = discountAmountPercent + fixedDiscount;
    if (totalDiscount > rawSubtotal) totalDiscount = rawSubtotal;

    const discountedSubtotal = rawSubtotal - totalDiscount;
    const shippingFee = rawSubtotal > 0 ? 99 : 0;
    const total = discountedSubtotal + shippingFee;

    if (subtotalEl) subtotalEl.textContent = `₱${discountedSubtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `₱${shippingFee.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${total.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-₱${totalDiscount.toFixed(2)}`;
  };

  // Fix: reassign the updated calculateTotals back into the scope
  // (if above reassignment didn't run because applyVoucherBtn missing, ensure we still have calculateTotals)
  // If calculateTotals was replaced, this does nothing harmful.
  calculateTotals = calculateTotals;

  // Checkout handler
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "indexPlaceOrder.html";
    });
  }
      // get numeric total
      const totalText = (totalEl && totalEl.textContent) ? totalEl.textContent : null;
      const totalNum = totalText ? parsePrice(totalText) : 0;
      if (!totalNum || totalNum <= 0) {
        alert("Please select at least one item before checking out.");
        return;
      }
      alert(`Checkout OK — Total: ₱${totalNum.toFixed(2)}`);
    });

  // Initialize
  calculateTotals();