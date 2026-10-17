const signupForm = document.getElementById("signup-form");
const thePassword = document.getElementById("password");
const submitBtn = signupForm.querySelector('button[type="submit"]');
const checklist = document.getElementById("checklist");
const confirmPassword = document.getElementById("confirm-password");
const anima=document.getElementById("anima")

const reqLength = document.getElementById("req-length");
const reqUpper = document.getElementById("req-upper");
const reqLower = document.getElementById("req-lower");
const reqNumber = document.getElementById("req-number");
const reqSpecial = document.getElementById("req-special");

// 1. BETTER SHOW/HIDE UX
thePassword.addEventListener("focus", () => {
  checklist.classList.remove("hidden");
});

thePassword.addEventListener("blur", () => {
  checklist.classList.add("hidden");
});

// 2. LIVE PASSWORD VALIDATION
thePassword.addEventListener("input", () => {
  const value = thePassword.value;

  // Check conditions
  const isLengthValid = value.length >= 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  // Helper UI function
  function updateUI(element, isValid) {
    if (isValid) {
      element.classList.remove("invalid");
      element.classList.add("valid");
    } else {
      element.classList.remove("valid");
      element.classList.add("invalid");
    }
  }

  // Update UI elements
  updateUI(reqLength, isLengthValid);
  updateUI(reqUpper, hasUpperCase);
  updateUI(reqLower, hasLowerCase);
  updateUI(reqNumber, hasNumber);
  updateUI(reqSpecial, hasSpecial);

  // Enable/Disable submit button
  const isAllValid =
    isLengthValid && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

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
  const confirmPasswordVal = document.getElementById("confirm-password").value; // renamed variable to avoid re-declaration conflict

  if (password !== confirmPasswordVal) {
    alert("Passwords do not match!");
    return;
  }

  // 1. CHANGE BUTTON TEXT TO LOADING STATE
  submitBtn.innerHTML = '<i class="material-icons text-sm animate-spin mr-1">sync</i> Signing up...';
  submitBtn.disabled = true; // Prevent multiple clicks

  const user = {
    first_name: firstName,
    last_name: lastName,
    password: password,
    phone: phone,
    email: email,
    password_confirmation: confirmPasswordVal,
  };

  const project_identifier = "the_login_starters";
  const api_key = "dev_pETzStdLHvwU3ik39bNrws3i";

  const url = `https://hisend.hunnovate.com/api/v1/projects/${project_identifier}/auth/sign-up?api_key=${api_key}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    console.log("API Response:", data);
    console.log("Status:", response.status);

    // CHECK IF INFORMATION IS ALREADY REGISTERED
    if (response.status === 422) {
      alert(`${data.message} please log in ` || "This information has already been registered. Please log in instead.");
      
      // 2. RESET BUTTON IF REGISTRATION FAILS
      submitBtn.innerHTML = "Sign up";
      submitBtn.disabled = false;
      return;
    }

    // FIXED: CHECK 404 OR OTHER ERROR CODES
    if (response.status === 404) {
      alert("API Endpoint or Project not found.");
      submitBtn.innerHTML = "Sign up";
      submitBtn.disabled = false;
      return;
    }

    if (response.ok) {
      // SUCCESS!
      submitBtn.innerHTML = ` <div class="flex items-center justify-center gap-2">
    <i class="material-icons animate-bounce text-green-400">check_circle</i>
    <span>Redirecting...</span>
    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
`;
      alert("Registration successful!");
      window.location.href = "login.html"; // optional redirect
    } else {
      alert("Something went wrong. Please try again.");
      submitBtn.innerHTML = "Sign up";
      submitBtn.disabled = false;
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Network error. Please check your connection.");
    
    // RESET BUTTON ON NETWORK ERROR
    submitBtn.innerHTML = "Sign up";
    submitBtn.disabled = false;
  }
});
