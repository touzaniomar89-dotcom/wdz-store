if (window.location.pathname.includes("checkout.html")) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summary = document.getElementById("order-summary");
  const totalBox = document.getElementById("total-box");

  let totalAll = 0;

  cart.forEach(item => {

    const quantity = item.quantity || 1;
    const total = item.price * quantity;
    totalAll += total;

    summary.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>المقاس: ${item.size || "-"}</p>
        <p>اللون: ${item.color || "-"}</p>
        <p>الكمية: ${quantity}</p>
        <p>السعر: ${total} </p>
      </div>
    `;
  });

  totalBox.innerHTML = `المجموع الكلي: ${totalAll}`;
}
