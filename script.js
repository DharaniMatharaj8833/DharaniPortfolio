/* =========================================================
   DHARANISHWARI M - PORTFOLIO WEBSITE
   Main JavaScript
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

// LocalStorage version is used initially.
// Later, we will connect this to Google Apps Script.

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1Yj6klUMrkepFPWCL73T88mbnPJaqoJLvHKAWZCkHmV68pGi8tGBLI76sSDu2fspT/exec";
// Academic/demo admin password.
// IMPORTANT:
// A password stored in frontend JavaScript is NOT secure
// for a real production website.
const ADMIN_PASSWORD = "12345";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const themeToggle = document.getElementById("themeToggle");

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const adminLoginForm = document.getElementById("adminLoginForm");
const adminPassword = document.getElementById("adminPassword");

const adminLogin = document.getElementById("adminLogin");
const adminResponses = document.getElementById("adminResponses");

const loginMessage = document.getElementById("loginMessage");

const responseList = document.getElementById("responseList");

const logoutBtn = document.getElementById("logoutBtn");

const refreshResponses =
    document.getElementById("refreshResponses");

const clearResponses =
    document.getElementById("clearResponses");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const isOpen =
            navLinks.classList.contains("active");

        menuToggle.textContent =
            isOpen ? "✕" : "☰";

    });


    // Close mobile menu after clicking a link

    const navigationLinks =
        navLinks.querySelectorAll("a");

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            menuToggle.textContent = "☰";

        });

    });

}


/* =========================================================
   LIGHT / DARK THEME
   ========================================================= */

function applySavedTheme() {

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "light") {

        document.body.classList.add("light-theme");

        if (themeToggle) {
            themeToggle.textContent = "🌙";
        }

    } else {

        document.body.classList.remove("light-theme");

        if (themeToggle) {
            themeToggle.textContent = "☀️";
        }

    }

}


applySavedTheme();


if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-theme");

        const isLight =
            document.body.classList.contains("light-theme");

        localStorage.setItem(
            "theme",
            isLight ? "light" : "dark"
        );

        themeToggle.textContent =
            isLight ? "🌙" : "☀️";

    });

}


/* =========================================================
   HELPER - SHOW MESSAGE
   ========================================================= */

function showFormMessage(element, message, type) {

    if (!element) {
        return;
    }

    element.textContent = message;

    element.style.color =
        type === "success"
            ? "#22c55e"
            : "#ef4444";
}


/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* =========================================================
   SAFE HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   GET LOCAL STORAGE RESPONSES
   ========================================================= */

function getLocalResponses() {

    try {

        const storedResponses =
            localStorage.getItem("responses");

        if (!storedResponses) {
            return [];
        }

        const responses =
            JSON.parse(storedResponses);

        if (!Array.isArray(responses)) {
            return [];
        }

        return responses;

    } catch (error) {

        console.error(
            "Unable to read responses:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE LOCAL STORAGE RESPONSES
   ========================================================= */

function saveLocalResponses(responses) {

    try {

        localStorage.setItem(
            "responses",
            JSON.stringify(responses)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save responses:",
            error
        );

        return false;

    }

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* ---------- GET FORM VALUES ---------- */

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const subject =
                document
                    .getElementById("subject")
                    .value
                    .trim();

            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            /* ---------- VALIDATION ---------- */

            if (!name || !email || !subject || !message) {

                showFormMessage(
                    formMessage,
                    "Please fill in all fields.",
                    "error"
                );

                return;
            }


            if (!isValidEmail(email)) {

                showFormMessage(
                    formMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            if (name.length > 100) {

                showFormMessage(
                    formMessage,
                    "Name is too long.",
                    "error"
                );

                return;
            }


            if (email.length > 160) {

                showFormMessage(
                    formMessage,
                    "Email is too long.",
                    "error"
                );

                return;
            }


            if (subject.length > 160) {

                showFormMessage(
                    formMessage,
                    "Subject is too long.",
                    "error"
                );

                return;
            }


            if (message.length > 3000) {

                showFormMessage(
                    formMessage,
                    "Message is too long.",
                    "error"
                );

                return;
            }


            /* ---------- CREATE RESPONSE OBJECT ---------- */

            const response = {

                id: Date.now(),

                name: name,

                email: email,

                subject: subject,

                message: message,

                timestamp:
                    new Date().toISOString()

            };


            /* =================================================
               GOOGLE APPS SCRIPT
               ================================================= */

            if (GOOGLE_SCRIPT_URL.trim() !== "") {

                try {

                    showFormMessage(
                        formMessage,
                        "Sending your message...",
                        "success"
                    );


                    const responseFromServer =
    await fetch(
    GOOGLE_SCRIPT_URL,
    {
        method: "POST",

        mode: "no-cors",

        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8"
        },

        body:
            "action=submit&payload=" +
            encodeURIComponent(
                JSON.stringify(response)
            )
    }
);

showFormMessage(
    formMessage,
    "Message sent successfully!",
    "success"
);

contactForm.reset();

return;
            }


            /* =================================================
               LOCAL STORAGE
               ================================================= */

            const responses =
                getLocalResponses();


            responses.push(response);


            const saved =
                saveLocalResponses(responses);


            if (saved) {

                showFormMessage(
                    formMessage,
                    "Message sent successfully!",
                    "success"
                );

                contactForm.reset();

            } else {

                showFormMessage(
                    formMessage,
                    "Unable to save your message.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const password =
                adminPassword.value;


            if (password === ADMIN_PASSWORD) {

                adminLogin.classList.add("hidden");

                adminResponses.classList.remove("hidden");

                adminPassword.value = "";

                showFormMessage(
                    loginMessage,
                    "",
                    "success"
                );

                displayResponses();

            } else {

                showFormMessage(
                    loginMessage,
                    "Invalid admin password.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   DISPLAY RESPONSES
   ========================================================= */

function displayResponses() {

    if (!responseList) {
        return;
    }


    const responses =
        getLocalResponses();


    responseList.innerHTML = "";


    if (responses.length === 0) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "empty-message";

        emptyMessage.textContent =
            "No responses received yet.";

        responseList.appendChild(
            emptyMessage
        );

        return;
    }


    // Latest response first

    const sortedResponses =
        [...responses].reverse();


    sortedResponses.forEach((response) => {

        const card =
            document.createElement("article");

        card.className =
            "response-card";


        const heading =
            document.createElement("h4");

        heading.textContent =
            response.name;


        const email =
            document.createElement("p");

        email.className =
            "response-email";

        email.textContent =
            response.email;


        const subject =
            document.createElement("p");

        subject.className =
            "response-subject";

        subject.textContent =
            "Subject: " + response.subject;


        const message =
            document.createElement("p");

        message.className =
            "response-message";

        message.textContent =
            response.message;


        const time =
            document.createElement("p");

        time.className =
            "response-time";


        const date =
            new Date(response.timestamp);


        time.textContent =
            "Received: " +
            (
                isNaN(date.getTime())
                    ? "Unknown time"
                    : date.toLocaleString()
            );


        card.appendChild(heading);

        card.appendChild(email);

        card.appendChild(subject);

        card.appendChild(message);

        card.appendChild(time);


        responseList.appendChild(card);

    });

}


/* =========================================================
   REFRESH RESPONSES
   ========================================================= */

if (refreshResponses) {

    refreshResponses.addEventListener(
        "click",
        function () {

            displayResponses();

        }
    );

}


/* =========================================================
   CLEAR ALL RESPONSES
   ========================================================= */

if (clearResponses) {

    clearResponses.addEventListener(
        "click",
        function () {

            const responses =
                getLocalResponses();


            if (responses.length === 0) {

                alert(
                    "There are no responses to clear."
                );

                return;
            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete all responses?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "responses"
            );


            displayResponses();


            alert(
                "All responses have been cleared."
            );

        }
    );

}


/* =========================================================
   ADMIN LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            adminResponses.classList.add("hidden");

            adminLogin.classList.remove("hidden");

            loginMessage.textContent = "";

        }
    );

}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   INITIAL SETUP
   ========================================================= */

// Make sure the response area starts hidden.

if (adminResponses) {

    adminResponses.classList.add("hidden");

}


// Display current local response count internally.
// This also verifies that localStorage is readable.

console.log(
    "Portfolio application loaded successfully."
);

console.log(
    "Local responses:",
    getLocalResponses()
);