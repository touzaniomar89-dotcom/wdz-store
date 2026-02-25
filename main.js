// ==========================
// عرض الطلب كجدول مطابق لـ Google Sheet
// ==========================
if (window.location.pathname.includes("checkout.html")) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const table = document.getElementById("order-table");

  const today = new Date().toLocaleString();

  cart.forEach(item => {

    const quantity = item.quantity || 1;
    const total = item.price * quantity;

    table.innerHTML += `
      <tr>
        <td>${today}</td>
        <td id="preview-name">-</td>
        <td id="preview-phone">-</td>
        <td id="preview-city">-</td>
        <td id="preview-address">-</td>
        <td>${item.name}</td>
        <td>New</td>
        <td>${item.size || "-"}</td>
        <td>${item.color || "-"}</td>
        <td>${quantity}</td>
        <td>${total}</td>
      </tr>
    `;
  });

  // تحديث بيانات العميل مباشرة في الجدول
  document.getElementById("name").addEventListener("input", function(){
    document.querySelectorAll("#preview-name").forEach(e => e.innerText = this.value);
  });

  document.getElementById("phone").addEventListener("input", function(){
    document.querySelectorAll("#preview-phone").forEach(e => e.innerText = this.value);
  });

  document.getElementById("city").addEventListener("input", function(){
    document.querySelectorAll("#preview-city").forEach(e => e.innerText = this.value);
  });

  document.getElementById("address").addEventListener("input", function(){
    document.querySelectorAll("#preview-address").forEach(e => e.innerText = this.value);
  });

}
