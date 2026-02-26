const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjwMU5fAB-_EsshT0JpPqP3RdWzA3mp0KsrN0GUgkh33ujesSP1DFfylfwKSfqa1qIxQ/exec";

function orderProduct(productName){
  localStorage.setItem("selectedProduct", productName);
  window.location.href = "checkout.html";
}

if(window.location.pathname.includes("checkout.html")){
  const product = localStorage.getItem("selectedProduct");
  document.getElementById("product-name").innerText = product;
}

document.getElementById("order-form")?.addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const city = document.getElementById("city").value;
  const address = document.getElementById("address").value;
  const product = localStorage.getItem("selectedProduct");

  fetch(SCRIPT_URL,{
    method:"POST",
    body:JSON.stringify({
      name,
      phone,
      city,
      address,
      product
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.result==="success"){
      localStorage.removeItem("selectedProduct");
      window.location.href="thankyou.html";
    }else{
      alert("خطأ في الإرسال");
    }
  })
  .catch(()=>{
    alert("مشكلة في الاتصال");
  });
});
