// Elementləri seçirik
const qeydiyyatFormu = document.getElementById("qeydiyyatFormu");
const girisFormu = document.getElementById("girisFormu");
const navPaneli = document.querySelector(".istifadeci-paneli"); 

document.addEventListener("DOMContentLoaded", () => {
  const aktivIstifadeci = localStorage.getItem("aktivIstifadeci");
  if (aktivIstifadeci) {
    ekraniYenile(aktivIstifadeci);
  }
});

qeydiyyatFormu.addEventListener("submit", (e) => {
  e.preventDefault(); 

  const ad = document.getElementById("yeniAd").value;
  const email = document.getElementById("yeniEmail").value;
  const sifre = document.getElementById("yeniSifre").value;


  const istifadeciMelumati = {
    ad: ad,
    email: email,
    sifre: sifre,
  };

  localStorage.setItem("qeydiyyatliIstifadeci", JSON.stringify(istifadeciMelumati));

  alert("Təbriklər! Qeydiyyat uğurla tamamlandı. İndi daxil ola bilərsiniz.");
  
  // Modalı bağlamaq üçün (Bootstrap funksiyası)
  const modalElement = document.getElementById('qeydiyyatModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
  
  qeydiyyatFormu.reset();
});

girisFormu.addEventListener("submit", (e) => {
  e.preventDefault();

  const girisEmail = document.getElementById("girisEmail").value;
  const girisSifre = document.getElementById("girisSifre").value;

  const yaddasdakiUser = JSON.parse(localStorage.getItem("qeydiyyatliIstifadeci"));

  if (yaddasdakiUser && girisEmail === yaddasdakiUser.email && girisSifre === yaddasdakiUser.sifre) {
    // Giriş uğurludur
    alert(`Xoş gəldiniz, ${yaddasdakiUser.ad}!`);
    
    localStorage.setItem("aktivIstifadeci", yaddasdakiUser.ad);

    // Modalı bağla
    const modalElement = document.getElementById('girisModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // Ekranı dəyiş
    ekraniYenile(yaddasdakiUser.ad);
    girisFormu.reset();

  } else {
    alert("Email və ya şifrə yanlışdır! (Və ya qeydiyyatdan keçməmisiniz)");
  }
});

function ekraniYenile(ad) {
  navPaneli.innerHTML = `
    <div class="istifadeci-adi-stili">
      <i class="fa-solid fa-user"></i>
      <span>${ad}</span>
      <i class="fa-solid fa-right-from-bracket cixis-iconu" onclick="cixisEt()" title="Çıxış"></i>
    </div>
  `;
}

window.cixisEt = function() {
  if(confirm("Hesabdan çıxmaq istəyirsiniz?")) {
    localStorage.removeItem("aktivIstifadeci");
    window.location.reload(); 
  }
}
/* --- 1. AXTARIŞ SİSTEMİ --- */
const axtarisInputu = document.getElementById("search");

axtarisInputu.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); 
    alert("Məhsul tapılmadı");
    axtarisInputu.value = ""; 
  }
});


const urekler = document.querySelectorAll(".urek-iconu");

urekler.forEach((urek) => {
  urek.addEventListener("click", function () {
    this.classList.toggle("qirmizi-urek");
  });
});


let sebet = []; 

const sebetBtnleri = document.querySelectorAll(".sebete-at-btn");
const sebetSiyahisiHTML = document.getElementById("sebetSiyahisi");
const sebetCemiHTML = document.getElementById("sebetCemi");
const sebetSayiHTML = document.getElementById("sebetSayi");

sebetBtnleri.forEach((btn) => {
  btn.addEventListener("click", function () {
    const ad = this.getAttribute("data-ad");
    const qiymet = parseFloat(this.getAttribute("data-qiymet"));

    sebet.push({ ad: ad, qiymet: qiymet });

    sebetiGuncelle();
    
    let originalText = this.innerText;
    this.innerText = "Əlavə edildi ✔";
    this.style.backgroundColor = "#28a745";
    setTimeout(() => {
        this.innerText = originalText;
        this.style.backgroundColor = ""; 
    }, 1000);
  });
});

function sebetiGuncelle() {
  // 1. Siyahını təmizlə
  sebetSiyahisiHTML.innerHTML = "";
  let umumiQiymet = 0;

  if (sebet.length === 0) {
     sebetSiyahisiHTML.innerHTML = '<li class="list-group-item bg-transparent text-white">Səbət boşdur</li>';
  } else {
    sebet.forEach((mal, index) => {
      umumiQiymet += mal.qiymet;
      
      const li = document.createElement("li");
      li.className = "list-group-item bg-transparent text-white d-flex justify-content-between align-items-center";
      li.innerHTML = `
        ${mal.ad} 
        <span>
            ${mal.qiymet.toFixed(2)} ₼ 
            <i class="fa-solid fa-trash text-danger ms-2" style="cursor:pointer" onclick="maliSil(${index})"></i>
        </span>
      `;
      sebetSiyahisiHTML.appendChild(li);
    });
  }

  sebetCemiHTML.innerText = umumiQiymet.toFixed(2) + " ₼";
  sebetSayiHTML.innerText = sebet.length;
}

window.maliSil = function(index) {
    sebet.splice(index, 1); 
    sebetiGuncelle(); 
}

window.sifarisiTamamla = function() {
    if (sebet.length === 0) {
        alert("Səbətiniz boşdur!");
    } else {
        alert("Sifariş qəbul olundu!");
        sebet = []; 
        sebetiGuncelle(); 
        
        const modalElement = document.getElementById('sebetModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
    }
}