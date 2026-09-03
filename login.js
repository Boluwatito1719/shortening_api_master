const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");
const anima=document.getElementById("anima")

loginForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;


  const loginData = {
    email: email,
    password: password,
  };

  const projectIdentifier = "the_login_starters";
  const apiKey = "dev_pETzStdLHvwU3ik39bNrws3i";
  const url = `https://hisend.hunnovate.com/api/v1/projects/${projectIdentifier}/auth/login?api_key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    localStorage.setItem("token", data.token);

    anima.classList.remove("hidden")

    


    setTimeout(() => {
  anima.classList.add("hidden")
}, 4000);

   setTimeout(()=>{
     window.location.href = "index.html";
   },4100)
  } catch (error) {
    console.log("Error:", error);
    message.textContent = error.message;
  }


});
