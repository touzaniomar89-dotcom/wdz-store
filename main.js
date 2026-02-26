const WEB_APP_URL = "PUT_YOUR_WEB_APP_URL_HERE";

/* اختيار المنتج */
function orderProduct(productName){
  if(!productName) return;

  localStorage.setItem("selectedProduct", productName);
  window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {

  const productSpan = document.getElementById("product-name");
  const form = document.getElementById("order-form");

  const selectedProduct = localStorage.getItem("selectedProduct");

  /* حماية صفحة الدفع */
  if(productSpan){
    if(!selectedProduct){
      window.location.href = "index.html";
      return;
    }
    productSpan.textContent = selectedProduct;
  }

  /* إرسال الطلب */
  if(form){

    form.addEventListener("submit", async function(e){
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const city = document.getElementById("city").value;
      const address = document.getElementById("address").value.trim();

      if(!name || !phone || !city || !address){
        alert("يرجى ملء جميع الحقول");
        return;
      }

      const data = {
        name: name,
        phone: phone,
        city: city,
        address: address,
        product: selectedProduct
      };

      try{

        const response = await fetch(WEB_APP_URL,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if(result.result === "success"){
          localStorage.removeItem("selectedProduct");
          window.location.href = "thankyou.html";
        }else{
          alert("حدث خطأ في الإرسال");
        }

      }catch(error){
        alert("فشل الاتصال بالسيرفر");
      }

    });

  }

});
