// Get HTML elements

const registerSection = document.getElementById("registerSection");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const logoutBtn = document.getElementById("logoutBtn");


// Get registered users from LocalStorage

let users = JSON.parse(localStorage.getItem("users")) || [];


// Password hashing using SHA-256

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// Show login section

showLogin.addEventListener("click", function () {

    registerSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

    registerMessage.textContent = "";

});


// Show registration section

showRegister.addEventListener("click", function () {

    loginSection.classList.add("hidden");

    registerSection.classList.remove("hidden");

    loginMessage.textContent = "";

});


// Registration

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Validate name

    if (name.length < 3) {

        registerMessage.textContent =
            "Name must contain at least 3 characters.";

        registerMessage.style.color = "red";

        return;
    }


    // Validate password

    if (password.length < 6) {

        registerMessage.textContent =
            "Password must contain at least 6 characters.";

        registerMessage.style.color = "red";

        return;
    }


    // Check password confirmation

    if (password !== confirmPassword) {

        registerMessage.textContent =
            "Passwords do not match.";

        registerMessage.style.color = "red";

        return;
    }


    // Check duplicate email

    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {

        registerMessage.textContent =
            "An account with this email already exists.";

        registerMessage.style.color = "red";

        return;
    }


    // Hash password

    const hashedPassword =
        await hashPassword(password);


    // Create new user

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: hashedPassword

    };


    users.push(newUser);


    // Save user

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // Success message

    registerMessage.textContent =
        "Registration successful! You can now login.";

    registerMessage.style.color = "green";


    // Clear form

    registerForm.reset();

});


// Login

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    // Find user

    const user = users.find(
        user => user.email === email
    );


    if (!user) {

        loginMessage.textContent =
            "Invalid email or password.";

        loginMessage.style.color = "red";

        return;
    }


    // Hash entered password

    const hashedPassword =
        await hashPassword(password);


    // Check password

    if (hashedPassword !== user.password) {

        loginMessage.textContent =
            "Invalid email or password.";

        loginMessage.style.color = "red";

        return;
    }


    // Save logged-in user

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        })
    );


    // Show dashboard

    showDashboard();

});


// Show dashboard

function showDashboard() {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );


    if (!loggedInUser) {

        return;
    }


    registerSection.classList.add("hidden");

    loginSection.classList.add("hidden");

    dashboardSection.classList.remove("hidden");


    userName.textContent =
        loggedInUser.name;

    userEmail.textContent =
        loggedInUser.email;
}


// Logout

logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("loggedInUser");

    dashboardSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

    loginForm.reset();

    loginMessage.textContent = "";

});


// Check login status when page loads

window.addEventListener("load", function () {

    const loggedInUser =
        localStorage.getItem("loggedInUser");


    if (loggedInUser) {

        showDashboard();

    }

});