

let theInput = document.getElementById("theInput");let mySubmit = document.getElementById("myForm");let clicks = 0;
let theShow = document.querySelector(".theShow");let errorMessage = document.getElementById("errorMessage");let hambuger = document.getElementById("hambuger");let menu = document.getElementById("menu");let close = document.getElementById("close");

hambuger.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});
function theboxed(dataUrl) {
    if (!theInput.value.trim()) {
        theInput.classList.remove("placeholder-gray-400");
        theInput.classList.add("placeholder-red-400");
        theInput.style.borderColor = "red";
        theInput.style.borderStyle = "solid";
        errorMessage.classList.remove("hidden");
    } else if (!theInput.value.includes("https://") && !theInput.value.includes(".com")) {
        errorMessage.classList.add("hidden");
        alert("Enter the right input that includes https:// and .com ");
    } else {
        errorMessage.classList.add("hidden");
        theInput.classList.remove("placeholder-red-400");
        theInput.classList.add("placeholder-gray-400");

        theInput.style.borderColor = "";
        theInput.style.borderStyle = "";

        theShow.classList.remove("hidden");

        theShow.innerHTML += `
<div class="w-full max-w-4xl mx-auto bg-white p-3 md:p-4 rounded-lg mt-3 shadow-sm">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
    
    <!-- Input Value / Original Text -->
    <h1 class="text-black text-sm md:text-base font-medium break-all flex-1">
      ${theInput.value}
    </h1>
    
    <!-- Shortened Data URL -->
    <h1 class="text-[hsl(180,96%,29%)] text-sm md:text-base font-semibold break-all sm:text-right max-w-xs">
      ${dataUrl}
    </h1>
    
    <!-- Copy Button -->
    <button class="bg-[hsl(180,66%,49%)] hover:bg-[hsl(180,66%,40%)] text-white rounded-md p-2 flex items-center justify-center transition-colors sm:w-auto w-full copied">
      <span class="material-symbols-outlined text-lg">content_copy</span>
    </button>

  </div>
</div>
`;


        let copied = document.querySelectorAll(".copied");
        copied.forEach((button) => {
            button.addEventListener("click", () => {
                navigator.clipboard.writeText(dataUrl);
                button.innerHTML = `<span class="material-symbols-outlined">check</span>`;
            });
        });
    }
}
const shorten = async (longUrl) => {
    const apiUrl = "https://api.tinyurl.com/create";
    const apiToken = "A2eD35Z8Pb0n9EhAB8fk3DgOPUv13pQreOsvFlq4Cc7g48EH41FfCr7HDsFF"; 

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                url: longUrl,
                domain: "tinyurl.com"
            })
        });

        const result = await res.json();
        console.log("API Response Object:", result);

        if (!res.ok) {
            console.log(`Error: ${res.status}`);
            return;
        }

        // Fix 1: Access the nested tiny_url property from the API response structure
        if (result.data && result.data.tiny_url) {
            theboxed(result.data.tiny_url);
        } else {
            console.error("Unexpected response format", result);
        }

    } catch (error) {
        console.log("Fetch error:", error);
    }
};
// Fix 2 & 3: Call shorten() and pass the input field's value
theInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        shorten(theInput.value); 
    }
});

mySubmit.addEventListener("click", (e) => {
    if (clicks >= 2) { return; } clicks++; console.log(`Click ${clicks}`); if (clicks === 1) { mySubmit.disabled = true; setTimeout(() => { clicks = 0; mySubmit.disabled = false; console.log("You can click again!"); }, 25000); }
    e.preventDefault();
    setTimeout(()=>{
        mySubmit.innerHTML = `<span class="material-symbols-outlined animate-spin">autorenew</span>`;
    },500)
    setTimeout(()=>{
        mySubmit.innerHTML=` Shorten it!`
        shorten(theInput.value)
      
    },3000);
    
});

