const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjwMU5fAB-_EsshT0JpPqP3RdWzA3mp0KsrN0GUgkh33ujesSP1DFfylfwKSfqa1qIxQ/exec";

function orderProduct(productName){
  localStorage.setItem("selectedProduct", productName);
  window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {

  const productDisplay = document.getElementById("product-name");
  const form = document.getElementById("order-form");

  if(productDisplay){
    const product = localStorage.getItem("selectedProduct");
    productDisplay.textContent = product ? product : "منتج غير معروف";
  }

  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();

      const button = form.querySelector("button");
      button.textContent = "جاري الإرسال...";
      button.disabled = true;

      const data = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value,
        address: document.getElementById("address").value,
        product: localStorage.getItem("selectedProduct")
      };

      fetch(SCRIPT_URL,{
        method:"POST",
        body:JSON.stringify(data)
      })
      .then(res => res.json())
      .then(response => {
        if(response.result === "success"){
          localStorage.removeItem("selectedProduct");
          window.location.href="thankyou.html";
        } else {
          alert("حدث خطأ");
          button.textContent = "تأكيد الطلب";
          button.disabled = false;
        }
      })
      .catch(()=>{
        alert("مشكلة في الاتصال");
        button.textContent = "تأكيد الطلب";
        button.disabled = false;
      });
    });
  }

});
