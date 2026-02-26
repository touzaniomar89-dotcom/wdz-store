const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjwMU5fAB-_EsshT0JpPqP3RdWzA3mp0KsrN0GUgkh33ujesSP1DFfylfwKSfqa1qIxQ/exec";

/* =========================
   اختيار المنتج
========================= */

function orderProduct(productName){
  if(!productName || typeof productName !== "string") return;

  localStorage.setItem("selectedProduct", productName.trim());
  window.location.href = "checkout.html";
}

/* =========================
   تشغيل الصفحة
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const productDisplay = document.getElementById("product-name");
  const form = document.getElementById("order-form");
  const selectedProduct = localStorage.getItem("selectedProduct");

  /* =========================
     حماية صفحة الدفع
  ========================= */

  if(productDisplay){
    if(!selectedProduct){
      window.location.href = "index.html";
      return;
    }
    productDisplay.textContent = selectedProduct;
  }

  /* =========================
     إرسال الطلب
  ========================= */

  if(form){

    form.addEventListener("submit", async function(e){
      e.preventDefault();

      const button = form.querySelector("button[type='submit']");
      if(button.disabled) return;

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const city = document.getElementById("city").value.trim();
      const address = document.getElementById("address").value.trim();

      /* التحقق من البيانات */

      if(!name || !phone || !city || !address){
        showToast("يرجى ملء جميع الحقول");
        return;
      }

      if(!/^[0-9]{9,15}$/.test(phone)){
        showToast("رقم الهاتف غير صالح");
        return;
      }

      if(!selectedProduct){
        showToast("لا يوجد منتج محدد");
        return;
      }

      const data = {
        name,
        phone,
        city,
        address,
        product: selectedProduct,
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
          throw new Error("فشل الاتصال بالسيرفر");
        }

        let result;

        try{
          result = await response.json();
        }catch{
          throw new Error("رد غير صالح من السيرفر");
        }

        if(result.result === "success"){
          localStorage.removeItem("selectedProduct");
          form.reset();
          window.location.href = "thankyou.html";
        }else{
          throw new Error("فشل في تنفيذ السكربت");
        }

      }catch(error){

        console.error(error);
        showToast("حدث خطأ في الاتصال. حاول مرة أخرى.");
        button.textContent = "تأكيد الطلب";
        button.disabled = false;

      }

    });

  }

});

/* =========================
   نظام الإشعارات Toast
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
