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



// Safely update welcome messages without breaking if one is missing in HTML
const welcomeLower = document.getElementById("welcome");
if (welcomeLower) welcomeLower.textContent = ` ${name}`;

const welcomeUpper = document.getElementById("Welcome");
if (welcomeUpper) welcomeUpper.textContent = `Welcome, ${name}`;

let theInput = document.getElementById("theInput");
let mySubmit = document.getElementById("myForm"); 
let clicks = 0; 
let theShow = document.querySelector(".theShow"); 
let errorMessage = document.getElementById("errorMessage"); 
let hambuger = document.getElementById("hambuger"); 
let menu = document.getElementById("menu");
let close = document.getElementById("close"); 
let login = document.getElementById("login");

// Mobile Menu Toggle
if (hambuger && menu) {
    hambuger.addEventListener("click", () => { 
        menu.classList.toggle("hidden"); 
    }); 
}

if (close && menu) {
    close.addEventListener("click", () => {
        menu.classList.add("hidden");
    });
}

// Helper function to append URL templates and manage individual click actions safely
function theboxed(longUrl, dataUrl) { 
    if (!theInput.value.trim()) { 
        theInput.classList.remove("placeholder-gray-400"); 
        theInput.classList.add("placeholder-red-400"); 
        theInput.style.borderColor = "red"; 
        theInput.style.borderStyle = "solid"; 
        if (errorMessage) errorMessage.classList.remove("hidden"); 
        return;
    } 
    
    if (!theInput.value.includes("https://") && !theInput.value.includes(".com")) { 
        if (errorMessage) errorMessage.classList.add("hidden"); 
        alert("Enter the right input that includes https:// and .com "); 
        return;
    } else {
        if (errorMessage) errorMessage.classList.add("hidden"); 
        theInput.classList.remove("placeholder-red-400"); 
        theInput.classList.add("placeholder-gray-400"); 
        theInput.style.borderColor = ""; 
        theInput.style.borderStyle = ""; 
        if (theShow) theShow.classList.remove("hidden"); 
    }

    // Create a wrapper for the new shortened element
    const container = document.createElement("div");
    container.className = "w-full max-w-4xl mx-auto bg-white p-3 md:p-4 rounded-lg mt-3 shadow-sm";
    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"> 
            <!-- Input Value / Original Text --> 
            <h1 class="text-black text-sm md:text-base font-medium break-all flex-1">${longUrl}</h1> 
            <!-- Shortened Data URL --> 
            <h1 class="text-[hsl(180,96%,29%)] text-sm md:text-base font-semibold break-all sm:text-right max-w-xs">${dataUrl}</h1> 
            <!-- Copy Button --> 
            <button class="bg-[hsl(180,66%,49%)] hover:bg-[hsl(180,66%,40%)] text-white rounded-md p-2 flex items-center justify-center transition-colors sm:w-auto w-full copy-btn"> 
                <span class="material-symbols-outlined text-lg">content_copy</span> 
            </button> 
        </div>
    `;

    // Target the specific button inside this element only to prevent stacking event listeners
    const copyBtn = container.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => { 
        navigator.clipboard.writeText(dataUrl); 
        copyBtn.innerHTML = `<span class="material-symbols-outlined">check</span>`; 
    });

    if (theShow) {
        theShow.appendChild(container);
    }
    
    // Clear input field for next use
    theInput.value = "";
} 


const shorten = async (longUrl) => {
    longUrl = longUrl.trim();

    if (
        !longUrl ||
        (!longUrl.startsWith("https://") &&
         !longUrl.startsWith("http://"))
    ) {
        alert("Please enter a valid URL starting with https:// or http://");
        return;
    }

    const apiKey = "pk_Xi0MzQRQiiiFB4Xu";
  const apiUrl = "https://api.short.io/links/public";

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "authorization": apiKey
            },
            body: JSON.stringify({
                domain: "ttech.s.gy",
                originalURL: longUrl,
                allowDuplicates: false
            })
        });

        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(
                data.error?.message ||
                data.message ||
                `Request failed: ${res.status}`
            );
        }

        const originalUrl = longUrl;
        const shortUrl = data.secureShortURL || data.shortURL;

        if (!shortUrl) {
            throw new Error("Short.io did not return a short URL.");
        }

        // Display the result using your existing function
        theboxed(originalUrl, shortUrl);

        // Save to the existing user's history
        const email =
            localStorage.getItem("userEmail") ||
            localStorage.getItem("useremail");

        if (email) {
            const history = JSON.parse(
                localStorage.getItem(`history_${email}`) || "[]"
            );

            history.push({
                originalUrl,
                shortUrl,
                date: new Date().toLocaleDateString()
            });

            localStorage.setItem(
                `history_${email}`,
                JSON.stringify(history)
            );
        }

   } catch (error) {
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    alert("Check the browser console for the detailed error.");
}
};

 
// Enter key trigger 
if (theInput) {
    theInput.addEventListener("keydown", (e) => {  
        if (e.key === "Enter") {  
            e.preventDefault();  
            shorten(theInput.value);  
        }  
    });  
}
 
if (mySubmit) {
    mySubmit.addEventListener("click", (e) => {  
        e.preventDefault(); 
        if (clicks >= 1) return; 
     
        clicks++;  
        mySubmit.disabled = true;  
         
        setTimeout(() => {  
            mySubmit.innerHTML = `<span class="material-symbols-outlined animate-spin">autorenew</span>`;  
        }, 500);  
     
        setTimeout(() => {  
            mySubmit.innerHTML = `Shorten it!`;  
            shorten(theInput.value);  
             
            clicks = 0;  
            mySubmit.disabled = false;  
        }, 2500);  
    });
}
