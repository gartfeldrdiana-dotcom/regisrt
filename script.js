// Получаем элементы
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

const toLogin = document.getElementById("to-login");
const toRegister = document.getElementById("to-register");

const authContainer = document.getElementById("auth-container");
const profile = document.getElementById("profile");
const welcome = document.getElementById("welcome");
const logoutBtn = document.getElementById("logout");

// Переключение форм
toLogin.onclick = () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
};

toRegister.onclick = () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
};

// Показ/скрытие пароля
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target);
    input.type = input.type === "password" ? "text" : "password";
  });
});

// Маска телефона (базовая проверка формата)
function validatePhone(phone) {
  const regex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
  return regex.test(phone);
}

// Регистрация
registerForm.addEventListener("submit", function(e) {
  e.preventDefault();

  // Сброс ошибок
  registerForm.querySelectorAll("input").forEach(input => {
    input.classList.remove("error");
  });
  const errorMessages = registerForm.querySelectorAll(".error-message");
  errorMessages.forEach(msg => msg.remove());

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value;
  const passwordConfirm = document.getElementById("reg-password-confirm").value;
  const termsChecked = document.getElementById("reg-terms").checked;

  let hasError = false;

  // Проверка имени
  if (!name) {
    const input = document.getElementById("reg-name");
    input.classList.add("error");
    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.textContent = "Введите имя";
    input.after(msg);
    hasError = true;
  }

  // Проверка email
  if (!email || !email.includes("@")) {
    const input = document.getElementById("reg-email");
    input.classList.add("error");
    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.textContent = "Введите корректный email";
    input.after(msg);
    hasError = true;
  }

  // Проверка телефона
  if (!validatePhone(phone)) {
    const input = document.getElementById("reg-phone");
    input.classList.add("error");
    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.textContent = "Телефон должен быть в формате +7 XXX XXX XX XX";
    input.after(msg);
    hasError = true;
  }

  // Проверка пароля
  if (!password) {
    const input = document.getElementById("reg-password");
    input.classList.add("error");
    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.textContent = "Введите пароль";
    input.after(msg);
    hasError = true;
  }

  // Проверка подтверждения пароля
  if (password !== passwordConfirm) {
    const input = document.getElementById("reg-password-confirm");
    input.classList.add("error");
    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.textContent = "Пароли не совпадают";
    input.after(msg);
    hasError = true;
  }

  // Проверка согласия с правилами
  if (!termsChecked) {
    const checkboxLabel = document.querySelector(".checkbox-label");
    checkboxLabel.classList.add("error");
    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.textContent = "Необходимо согласие с правилами";
    checkboxLabel.after(msg);
    hasError = true;
  }

  if (hasError) return;

  // Проверка на существующего пользователя
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.find(user => user.phone === phone);
  if (userExists) {
    alert("Пользователь уже зарегистрирован");
    return;
  }

  const newUser = { name, email, phone, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Регистрация успешна");
  registerForm.reset();
});

// Вход
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const phone = document.getElementById("login-phone").value.trim();
  const password = document.getElementById("login-password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(user => user.phone === phone);

  if (!user) {
    alert("Пользователь не найден");
    return;
  }

  if (password === user.password) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    showProfile(user);
  } else {
    alert("Неверный пароль");
  }
});

// Показ личного кабинета
function showProfile(user) {
  authContainer.classList.add("hidden");
  profile.classList.remove("hidden");
  welcome.textContent = "Добро пожаловать, " + user.name;
}

// Выход
logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser");
  profile.classList.add("hidden");
  authContainer.classList.remove("hidden");
};

// Если уже вошел
const savedUser = JSON.parse(localStorage.getItem("currentUser"));
if (savedUser) {
  showProfile(savedUser);
}