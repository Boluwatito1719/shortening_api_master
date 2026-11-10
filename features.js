const name = localStorage.getItem("userName") || localStorage.getItem("username") || "User";

const sign = document.getElementById("sign");
const loading = document.getElementById("loading");

const feature=document.getElementById("feature")

feature.addEventListener("click",()=>{
    loading.classList.remove("hidden");
        setTimeout(() => {
            loading.classList.add("hidden");
            window.location.href = "features.html";
        }, 3000)
})

if (sign && loading) {
    sign.addEventListener("click", () => {
        loading.classList.remove("hidden");
        setTimeout(() => {
            loading.classList.add("hidden");
            window.location.href = "index.html";
        }, 4000);
    });
}
