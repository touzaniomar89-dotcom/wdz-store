// ===============================
// تحميل السلة من localStorage
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// حفظ السلة
// ===============================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


// ===============================
// إضافة منتج إلى السلة
// ===============================
function addToCart(product) {
  cart.push(product);
  saveCart();
  alert("تمت إضافة المنتج إلى السلة");
}


// ===============================
// عرض ملخص الطلب في checkout
// ===============================
if (window.location.pathname.includes("checkout.html")) {

  const summary = document.getElementById("order-summary");

  if (summary && cart.length > 0) {

    let totalAll = 0;

    cart.forEach(item => {

      const quantity = item.quantity || 1;
      const total = item.price * quantity;
      totalAll += total;

      summary.innerHTML += `
        <div class="product-item">
          <p><strong>المنتج:</strong> ${item.name}</p>
          <p><strong>المقاس:</strong> ${item.size || "-"}</p>
          <p><strong>اللون:</strong> ${item.color || "-"}</p>
          <p><strong>الكمية:</strong> ${quantity}</p>
          <p><strong>السعر:</strong> ${total}</p>
        </div>
      `;
    });

    summary.innerHTML += `
      <div class="total-box">
        المجموع الكلي: ${totalAll}
      </div>
    `;
  }
}


// ===============================
// إرسال الطلب إلى Google Sheet
// ===============================
const form = document.getElementById("order-form");

if (form) {

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (cart.length === 0) {
      alert("السلة فارغة");
      return;
    }

    const orderData = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      city: document.getElementById("city").value,
      address: document.getElementById("address").value,
      cart: cart
    };

    fetch("https://script.google.com/macros/s/AKfycbwNyKzMXxMWpwRPgC3UarCesxAeNkI_nhM1A0_XH3XLyF1kpKTrc-o7n8Hajr7GRFZQ/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(response => {

      if (response.result === "success") {

        alert("تم إرسال الطلب بنجاح");

        localStorage.removeItem("cart");
        cart = [];

        window.location.href = "index.html";

      } else {
        alert("حدث خطأ أثناء الإرسال");
        console.log(response);
      }

    })
    .catch(error => {
      console.error("Error:", error);
      alert("فشل الاتصال بالسيرفر");
    });

  });
}
