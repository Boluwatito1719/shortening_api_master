const signupForm = document.getElementById("signup-form");
const thePassword = document.getElementById("password");
const submitBtn = signupForm.querySelector('button[type="submit"]');
const checklist = document.getElementById('checklist');
const confirmPassword = document.getElementById("confirm-password");
let clicks = 0; // Initialize click counter

const reqLength = document.getElementById('req-length');
const reqUpper = document.getElementById('req-upper');
const reqLower = document.getElementById('req-lower');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

// 1. BETTER SHOW/HIDE UX (Triggers via keyboard tabs OR mouse clicks)
thePassword.addEventListener('focus', () => {
    checklist.classList.remove("hidden");
});

// Hides the checklist when the user leaves the password input field entirely
thePassword.addEventListener('blur', () => {
    checklist.classList.add("hidden");
});

// 2. LIVE PASSWORD VALIDATION (Fixed the missing 'value' variable)
thePassword.addEventListener('input', () => {
    const value = thePassword.value; // FIXED: Grab the actual string value from the input field

    // Check conditions
    const isLengthValid = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    // Helper UI function
    function updateUI(element, isValid) {
        if (isValid) {
            element.classList.remove('invalid');
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
            element.classList.add('invalid');
        }
    }

    // Update UI elements
    updateUI(reqLength, isLengthValid);
    updateUI(reqUpper, hasUpperCase);
    updateUI(reqLower, hasLowerCase);
    updateUI(reqNumber, hasNumber);
    updateUI(reqSpecial, hasSpecial);

    // Enable/Disable the submit button depending on validation rules
    const isAllValid = isLengthValid && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
    submitBtn.disabled = !isAllValid;
});

// 3. FORM SUBMISSION HANDLING
signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const user = {
        first_name: firstName,
        last_name: lastName,
        password: password,
        phone: phone,
        email: email,
        password_confirmation: confirmPassword
    };
    
    const project_identifier = "the_login_starters";
    const api_key = "dev_pETzStdLHvwU3ik39bNrws3i";
    const url = `https://hisend.hunnovate.com/api/v1/projects/${project_identifier}/auth/sign-up?api_key=${api_key}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
    
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
            console.log("Welcome! Registration successful.");
            
            if (data && data.data && data.data.token) {
                localStorage.setItem("token", data.data.token);
            }
            const successMessage = data.message || "Registration Successful!"; 
            alert(successMessage); 
            window.location.href = "login.html";

 if (clicks >= 2) {
        return;
    }

    clicks++;

    console.log(`Click ${clicks}`);

    if (clicks === 1) {
        signupForm.disabled = true;

        setTimeout(() => {
            clicks = 0;
            signupForm.disabled = false;
            console.log("You can click again!");
        }, 20000);
    }




        } else {
            console.log("Registration failed:", data);
            alert(`Sign-up failed: ${data.message || "Please check your inputs."}`);
        }

    } catch (error) {
        console.error("Network or execution error:", error);
        alert("Something went wrong. Please check your internet connection.");
    }
});
