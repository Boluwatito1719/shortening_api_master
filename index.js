let theInput = document.getElementById("theInput");
let mySubmit = document.getElementById("myForm"); 
let clicks = 0; 
let theShow = document.querySelector(".theShow"); 
let errorMessage = document.getElementById("errorMessage"); 
let hambuger = document.getElementById("hambuger"); 
let menu = document.getElementById("menu");
let close = document.getElementById("close"); 

// Mobile Menu Toggle
hambuger.addEventListener("click", () => { 
    menu.classList.toggle("hidden"); 
}); 

// Helper function to append URL templates and manage individual click actions safely
function theboxed(longUrl, dataUrl) { 
    if (!theInput.value.trim()) { 
        theInput.classList.remove("placeholder-gray-400"); 
        theInput.classList.add("placeholder-red-400"); 
        theInput.style.borderColor = "red"; 
        theInput.style.borderStyle = "solid"; 
        errorMessage.classList.remove("hidden"); 
        return;
    } 
    
    if (!theInput.value.includes("https://") && !theInput.value.includes(".com")) { 
        errorMessage.classList.add("hidden"); 
        alert("Enter the right input that includes https:// and .com "); 
        return;
    }else{
          errorMessage.classList.add("hidden"); 
    theInput.classList.remove("placeholder-red-400"); 
    theInput.classList.add("placeholder-gray-400"); 
    theInput.style.borderColor = ""; 
    theInput.style.borderStyle = ""; 
    theShow.classList.remove("hidden"); 
    }

  

    // Create a wrapper wrapper for the new shortened element
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

    theShow.appendChild(container);
} 

const shorten = async (longUrl) => { 
    if (!longUrl.trim() || (!longUrl.includes("https://") && !longUrl.includes(".com"))) {
        theboxed(longUrl, "");
        
        return;
    }

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
            body: JSON.stringify({ url: longUrl, domain: "tinyurl.com" }) 
        }); 
        
        const data = await res.json(); 
        console.log("API Response Object:", data); 

          if (res.status === 400) {
                errorMessage.textContent = "Bad Request: Check your URL format.";
                alert("No internet connection")
                return
            }
        
        if (!res.ok) { 
            console.log(`Error Status: ${res.status}`); 
            return
          
        }
        
        // FIXED: Using "data" instead of "result"
        if (data && data.data && data.data.tiny_url) {
            theboxed(longUrl, data.data.tiny_url); 
        } else { 
            console.error("Unexpected response format", data); 
        } 
    } catch (error) { 
        console.log("Fetch error:", error); 
    } 
}; 

// Enter key trigger
theInput.addEventListener("keydown", (e) => { 
    if (e.key === "Enter") { 
        e.preventDefault(); 
        shorten(theInput.value); 
    } 
}); 

// Form submit trigger with debouncer
mySubmit.addEventListener("click", (e) => { 
    e.preventDefault();
    if (clicks >= 1) return; // Prevent clicking while loading/disabled

    clicks++; 
    console.log(`Click ${clicks}`); 
    
    mySubmit.disabled = true; 
    
    setTimeout(() => { 
        mySubmit.innerHTML = `<span class="material-symbols-outlined animate-spin">autorenew</span>`; 
    }, 500); 

    setTimeout(() => { 
        mySubmit.innerHTML = `Shorten it!`; 
        shorten(theInput.value); 
        
    
        clicks = 0; 
        mySubmit.disabled = false; 
        console.log("You can click again!"); 
    }, 2500); 
});
