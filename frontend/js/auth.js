function signup() {
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passInput.value;

  fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  }).then(() => location.href = "login.html");
}

function login() {
  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: emailInput.value, password: passInput.value })
  }).then(() => location.href = "dashboard.html");
}
