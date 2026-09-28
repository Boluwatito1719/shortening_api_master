
const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");
const mySubmit = document.getElementById("mySubmit");


// ===============================
// PASSWORD EYE TOGGLE
// ===============================

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";
        eyeIcon.textContent = "visibility_off";

    } else {

        password.type = "password";
        eyeIcon.textContent = "visibility";

    }

});


// ===============================
// INTERNET CONNECTION STATUS
// ===============================

window.addEventListener("online", () => {

    message.textContent = "Internet connection restored";
    message.classList.remove("text-red-700");

});


window.addEventListener("offline", () => {

    message.textContent = "You are offline";
    message.classList.add("text-red-700");

});


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Get values
    const email = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;



   



    mySubmit.innerHTML = `
        <span class="material-symbols-outlined animate-spin">
            autorenew
        </span>
    `;


    mySubmit.disabled = true;


    const loginData = {
        email: email,
        password: passwordValue
    };


    const projectIdentifier = "the_login_starters";
    const apiKey = "dev_pETzStdLHvwU3ik39bNrws3i";

    const url =
        `https://hisend.hunnovate.com/api/v1/projects/${projectIdentifier}/auth/login?api_key=${apiKey}`;


    try {

        // ===============================
        // SEND LOGIN REQUEST
        // ===============================

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                accept: "application/json"
            },

            body: JSON.stringify(loginData)

        });


        const data = await response.json();

        console.log(data);


        // ===============================
        // CHECK LOGIN
        // ===============================

        if (!response.ok) {

            throw new Error(
                data.message || "Login failed"
            );

        }


        // ===============================
        // SAVE TOKEN
        // ===============================

        localStorage.setItem(
            "token",
            data.data.token
        );
         localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);


        // ===============================
        // SAVE USERNAME
        // ===============================

        const firstName =
            data.data.user.first_name;

        localStorage.setItem(
            "username",
            firstName
        );


        // ===============================
        // REDIRECT
        // ===============================

        setTimeout(() => {

            window.location.href = "dashBoard.html";

        }, 1000);


    } catch (error) {

        console.log("Error:", error);

        message.textContent = error.message;


        // If login fails, bring button back
        mySubmit.disabled = false;

        mySubmit.innerHTML = "Log In";

    }

});

