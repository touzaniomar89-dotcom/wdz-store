const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwNyKzMXxMWpwRPgC3UarCesxAeNkI_nhM1A0_XH3XLyF1kpKTrc-o7n8Hajr7GRFZQ/exec";

function viewProduct(name, price){
  localStorage.setItem("product", JSON.stringify({name, price}));
  window.location.href = "product.html";
}

if(window.location.pathname.includes("product.html")){
  const product = JSON.parse(localStorage.getItem("product"));
  document.getElementById("product-name").innerText = product.name;
  document.getElementById("product-price").innerText = "السعر: " + product.price + "$";
}

function addToCart(){
  const product = JSON.parse(localStorage.getItem("product"));
  const size = document.getElementById("size").value;
  const color = document.getElementById("color").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    name: product.name,
    price: product.price,
    size,
    color,
    quantity
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
}

if(window.location.pathname.includes("checkout.html")){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summary = document.getElementById("order-summary");
  const totalBox = document.getElementById("total-box");

  let totalAll = 0;

  cart.forEach(item=>{
    const total = item.price * item.quantity;
    totalAll += total;

    summary.innerHTML += `
      <div class="item">
        ${item.name} - ${item.quantity} × ${item.price}$
      </div>
    `;
  });

  totalBox.innerHTML = "المجموع الكلي: " + totalAll + "$";
}

document.getElementById("order-form")?.addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const city = document.getElementById("city").value;
  const address = document.getElementById("address").value;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  fetch(SCRIPT_URL,{
    method:"POST",
    body:JSON.stringify({name,phone,city,address,cart})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.result==="success"){
      localStorage.removeItem("cart");
      window.location.href="thankyou.html";
    }
  });
});
