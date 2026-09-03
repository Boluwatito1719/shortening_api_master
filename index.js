

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
            <div class="w-[78%] mx-auto bg-white h-13 p-2 rounded mt-3">
                <div class="flex items-center justify-center">
                    <h1 class="text-black w-10 text-balance text-pretty">
                        ${theInput.value}
                    </h1>
                    <h1 class="ms-auto text-[hsl(180,96%,29%)] w-[30%]">
                        ${dataUrl}
                    </h1>
                    <button class="bg-[hsl(180,66%,49%)] rounded p-1 px-4 copied">
                       <span class="material-symbols-outlined">content_copy</span>
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
    e.preventDefault();

    if (clicks >= 2) {
        return;
    }

    clicks++;
    console.log(`Click ${clicks}`);

    if (clicks === 1) {
        mySubmit.disabled = true;
        setTimeout(() => {
            clicks = 0;
            mySubmit.disabled = false;
            console.log("You can click again!");
        }, 25000);
    }

    shorten(theInput.value);
});

