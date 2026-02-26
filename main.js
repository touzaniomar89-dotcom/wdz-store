const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjwMU5fAB-_EsshT0JpPqP3RdWzA3mp0KsrN0GUgkh33ujesSP1DFfylfwKSfqa1qIxQ/exec";

/* =========================
   SELECT PRODUCT
========================= */

function orderProduct(productName){
  if(!productName) return;

  localStorage.setItem("selectedProduct", productName);
  window.location.href = "checkout.html";
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const productDisplay = document.getElementById("product-name");
  const form = document.getElementById("order-form");

  /* عرض المنتج */
  if(productDisplay){
    const product = localStorage.getItem("selectedProduct");
    productDisplay.textContent = product || "منتج غير معروف";
  }

  /* إرسال الطلب */
  if(form){

    form.addEventListener("submit", async function(e){
      e.preventDefault();

      const button = form.querySelector("button");
      if(button.disabled) return;

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const city = document.getElementById("city").value.trim();
      const address = document.getElementById("address").value.trim();
      const product = localStorage.getItem("selectedProduct");

      /* VALIDATION */

      if(!name || !phone || !city || !address){
        showToast("يرجى ملء جميع الحقول");
        return;
      }

      if(!/^[0-9]{9,15}$/.test(phone)){
        showToast("رقم الهاتف غير صالح");
        return;
      }

      if(!product){
        showToast("لا يوجد منتج محدد");
        return;
      }

      const data = {
        name,
        phone,
        city,
        address,
        product,
        orderDate: new Date().toISOString()
      };

      try{

        button.textContent = "جاري الإرسال...";
        button.disabled = true;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(SCRIPT_URL,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(data),
          signal:controller.signal
        });

        clearTimeout(timeout);

        if(!response.ok){
          throw new Error("Server Error");
        }

        const result = await response.json();

        if(result.result === "success"){
          localStorage.removeItem("selectedProduct");
          window.location.href = "thankyou.html";
        }else{
          throw new Error("Script Failed");
        }

      }catch(error){

        showToast("حدث خطأ في الاتصال. حاول مرة أخرى.");
        button.textContent = "تأكيد الطلب";
        button.disabled = false;

      }

    });

  }

});

/* =========================
   TOAST NOTIFICATION
========================= */

function showToast(message){
  const toast = document.getElementById("toast");
  if(!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },3000);
}
