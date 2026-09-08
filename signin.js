// ======================================================
// URBANBITE AUTHENTICATION
// auth.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // STORAGE KEYS
    // ==================================================


    const USERS_KEY = "urbanBiteUsers";
    const SESSION_KEY = "urbanBiteCurrentUser";
    const CART_KEY = "urbanBiteCart";
    const REDIRECT_KEY = "urbanBiteRedirectAfterLogin";

    // ==================================================
    // ADMIN ACCOUNT
    // ==================================================

    const ADMIN_ACCOUNT = {
        id: "ADMIN-001",
        firstName: "UrbanBite",
        lastName: "Admin",
        email: "admin@urbanbite.co.za",
        password: "Admin@123",
        phone: "",
        role: "admin"
    };

    // ==================================================
    // ELEMENTS
    // ==================================================

    const signinForm =
        document.getElementById("signinForm");

    const emailInput =
        document.getElementById("signinEmail");

    const passwordInput =
        document.getElementById("signinPassword");

    const rememberMe =
        document.getElementById("rememberMe");

    const signinBtn =
        document.getElementById("signinBtn");

    const authMessage =
        document.getElementById("authMessage");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const cartCount =
        document.getElementById("cartCount");


    // Forgot password

    const forgotPasswordBtn =
        document.getElementById("forgotPasswordBtn");

    const forgotPasswordModal =
        document.getElementById("forgotPasswordModal");

    const closeForgotModal =
        document.getElementById("closeForgotModal");

    const forgotPasswordForm =
        document.getElementById("forgotPasswordForm");

    const resetEmail =
        document.getElementById("resetEmail");

    const forgotMessage =
        document.getElementById("forgotMessage");


    // Mobile navigation

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    // ==================================================
    // GET USERS
    // ==================================================

    function getUsers() {

        try {

            const users =
                JSON.parse(
                    localStorage.getItem(USERS_KEY)
                );

            return Array.isArray(users)
                ? users
                : [];

        } catch (error) {

            console.error(
                "Unable to read UrbanBite users:",
                error
            );

            return [];
        }
    }


    // ==================================================
    // GET CART
    // ==================================================

    function getCart() {

        try {

            const cart =
                JSON.parse(
                    localStorage.getItem(CART_KEY)
                );

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            return [];
        }
    }


    // ==================================================
    // UPDATE CART COUNT
    // ==================================================

    function updateCartCount() {

        if (!cartCount) return;

        const cart = getCart();

        const totalQuantity =
            cart.reduce(
                (total, item) => {

                    return total +
                        Number(
                            item.quantity || 0
                        );

                },
                0
            );

        cartCount.textContent =
            totalQuantity;
    }


    // ==================================================
    // EMAIL VALIDATION
    // ==================================================

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);
    }


    // ==================================================
    // CLEAR ERRORS
    // ==================================================

    function clearErrors() {

        if (emailError) {
            emailError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        emailInput?.classList.remove("error");

        passwordInput?.classList.remove("error");

        emailInput
            ?.closest(".auth-input-box")
            ?.classList.remove("error");

        passwordInput
            ?.closest(".auth-input-box")
            ?.classList.remove("error");
    }


    // ==================================================
    // FIELD ERROR
    // ==================================================

    function showFieldError(
        input,
        errorElement,
        message
    ) {

        if (errorElement) {

            errorElement.textContent =
                message;
        }

        input?.classList.add("error");

        input
            ?.closest(".auth-input-box")
            ?.classList.add("error");
    }


    // ==================================================
    // AUTH MESSAGE
    // ==================================================

    function showAuthMessage(
        message,
        type = "error"
    ) {

        if (!authMessage) return;

        authMessage.textContent =
            message;

        authMessage.className =
            `auth-message ${type}`;

        authMessage.hidden = false;
    }


    function hideAuthMessage() {

        if (!authMessage) return;

        authMessage.hidden = true;

        authMessage.textContent = "";

        authMessage.className =
            "auth-message";
    }


    // ==================================================
    // PASSWORD VISIBILITY
    // ==================================================

    passwordToggle?.addEventListener(
        "click",
        () => {

            if (!passwordInput) return;

            const showingPassword =
                passwordInput.type === "text";

            passwordInput.type =
                showingPassword
                    ? "password"
                    : "text";


            const icon =
                passwordToggle.querySelector("i");


            if (!icon) return;


            if (showingPassword) {

                icon.classList.remove(
                    "fa-eye-slash"
                );

                icon.classList.add(
                    "fa-eye"
                );

                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

            } else {

                icon.classList.remove(
                    "fa-eye"
                );

                icon.classList.add(
                    "fa-eye-slash"
                );

                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );
            }
        }
    );


    // ==================================================
    // REMOVE ERRORS WHILE TYPING
    // ==================================================

    emailInput?.addEventListener(
        "input",
        () => {

            emailError.textContent = "";

            emailInput.classList.remove(
                "error"
            );

            emailInput
                .closest(".auth-input-box")
                ?.classList.remove("error");

            hideAuthMessage();
        }
    );


    passwordInput?.addEventListener(
        "input",
        () => {

            passwordError.textContent = "";

            passwordInput.classList.remove(
                "error"
            );

            passwordInput
                .closest(".auth-input-box")
                ?.classList.remove("error");

            hideAuthMessage();
        }
    );


    // ==================================================
    // VALIDATE SIGN IN
    // ==================================================

    function validateSignin() {

        clearErrors();

        hideAuthMessage();

        let valid = true;

        const email =
            emailInput?.value
                .trim()
                .toLowerCase() || "";

        const password =
            passwordInput?.value || "";


        // Email

        if (!email) {

            showFieldError(
                emailInput,
                emailError,
                "Please enter your email address."
            );

            valid = false;

        } else if (!isValidEmail(email)) {

            showFieldError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );

            valid = false;
        }


        // Password

        if (!password) {

            showFieldError(
                passwordInput,
                passwordError,
                "Please enter your password."
            );

            valid = false;

        } else if (password.length < 6) {

            showFieldError(
                passwordInput,
                passwordError,
                "Password must contain at least 6 characters."
            );

            valid = false;
        }


        return valid;
    }


// ==================================================
// SIGN IN
// ==================================================

signinForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!validateSignin()) {
            return;
        }


        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;


        // ==================================================
        // ADMIN LOGIN
        // ==================================================

        if (
            email === ADMIN_ACCOUNT.email.toLowerCase() &&
            password === ADMIN_ACCOUNT.password
        ) {

            const adminSession = {

                id: ADMIN_ACCOUNT.id,

                firstName:
                    ADMIN_ACCOUNT.firstName,

                lastName:
                    ADMIN_ACCOUNT.lastName,

                email:
                    ADMIN_ACCOUNT.email,

                phone:
                    ADMIN_ACCOUNT.phone,

                role: "admin",

                signedInAt:
                    new Date().toISOString()
            };


            // Remove old sessions

            localStorage.removeItem(
                SESSION_KEY
            );

            sessionStorage.removeItem(
                SESSION_KEY
            );


            // Save admin session

            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(adminSession)
            );


            // Remove checkout redirect

            sessionStorage.removeItem(
                REDIRECT_KEY
            );


            // Go directly to Admin Panel

            window.location.replace(
                "admin.html"
            );

            return;
        }


        // ==================================================
        // CUSTOMER LOGIN
        // ==================================================

        const users =
            getUsers();


        const user =
            users.find(
                account =>
                    account.email
                        ?.toLowerCase() ===
                    email
            );


        // Account doesn't exist

        if (!user) {

            showAuthMessage(
                "No UrbanBite account was found with this email address.",
                "error"
            );

            return;
        }


        // Incorrect password

        if (user.password !== password) {

            showFieldError(
                passwordInput,
                passwordError,
                "Incorrect password."
            );

            showAuthMessage(
                "Your email or password is incorrect.",
                "error"
            );

            return;
        }


        // ==================================================
        // CREATE CUSTOMER SESSION
        // ==================================================

        const sessionUser = {

            id: user.id,

            firstName:
                user.firstName || "",

            lastName:
                user.lastName || "",

            email:
                user.email,

            phone:
                user.phone || "",

            role: "customer",

            signedInAt:
                new Date().toISOString()
        };


        // Remember me

        if (rememberMe?.checked) {

            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(sessionUser)
            );

            sessionStorage.removeItem(
                SESSION_KEY
            );

        } else {

            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify(sessionUser)
            );

            localStorage.removeItem(
                SESSION_KEY
            );
        }


        // ==================================================
        // SUCCESS MESSAGE
        // ==================================================

        showAuthMessage(
            `Welcome back${
                user.firstName
                    ? `, ${user.firstName}`
                    : ""
            }! Signing you in...`,
            "success"
        );


        if (signinBtn) {

            signinBtn.disabled = true;

            signinBtn.innerHTML = `
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                <span>Signing In...</span>
            `;
        }


        // ==================================================
        // CUSTOMER REDIRECT
        // ==================================================

        setTimeout(() => {

            const redirectPage =
                sessionStorage.getItem(
                    REDIRECT_KEY
                );


            if (redirectPage) {

                sessionStorage.removeItem(
                    REDIRECT_KEY
                );

                window.location.href =
                    redirectPage;

            } else {

                window.location.href =
                    "account.html";
            }

        }, 900);
    }
);

// ==================================================
// FORGOT PASSWORD MODAL
// ==================================================

function openForgotModal() {

    if (!forgotPasswordModal) return;

    forgotPasswordModal.classList.add("active");

    forgotPasswordModal.setAttribute(
        "aria-hidden",
        "false"
    );


    // Copy sign-in email into reset email field

    if (
        emailInput?.value &&
        resetEmail
    ) {

        resetEmail.value =
            emailInput.value;
    }


    setTimeout(() => {

        resetEmail?.focus();

    }, 200);
}


// ==================================================
// CLOSE FORGOT PASSWORD MODAL
// ==================================================

function closeForgotPasswordModal() {

    if (!forgotPasswordModal) return;

    forgotPasswordModal.classList.remove(
        "active"
    );

    forgotPasswordModal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (forgotMessage) {

        forgotMessage.hidden = true;
        forgotMessage.textContent = "";
    }
}


// ==================================================
// OPEN MODAL BUTTON
// ==================================================

forgotPasswordBtn?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        openForgotModal();
    }
);


// ==================================================
// CLOSE MODAL BUTTON
// ==================================================

closeForgotModal?.addEventListener(
    "click",
    closeForgotPasswordModal
);


// ==================================================
// CLICK OUTSIDE MODAL
// ==================================================

forgotPasswordModal
    ?.querySelector(".auth-modal-overlay")
    ?.addEventListener(
        "click",
        closeForgotPasswordModal
    );


// ==================================================
// FORGOT PASSWORD FORM
// ==================================================

forgotPasswordForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (
            !resetEmail ||
            !forgotMessage
        ) {

            return;
        }


        const email =
            resetEmail.value
                .trim()
                .toLowerCase();


        // Validate email

        if (!isValidEmail(email)) {

            forgotMessage.hidden = false;

            forgotMessage.textContent =
                "Please enter a valid email address.";

            return;
        }


        const users =
            getUsers();


        const accountExists =
            users.some(
                user =>
                    user.email
                        ?.toLowerCase() ===
                    email
            );


        forgotMessage.hidden = false;


        if (accountExists) {

            forgotMessage.textContent =
                "Account found. Password reset emails require a backend, so no email has been sent in this demo.";

        } else {

            forgotMessage.textContent =
                "No UrbanBite demo account was found with this email address.";
        }
    }
);

// ==================================================
    // MOBILE MENU
    // ==================================================

    menuToggle?.addEventListener(
        "click",
        () => {

            navMenu?.classList.toggle(
                "active"
            );


            const icon =
                menuToggle.querySelector("i");


            const open =
                navMenu?.classList.contains(
                    "active"
                );


            if (open) {

                icon?.classList.remove(
                    "fa-bars"
                );

                icon?.classList.add(
                    "fa-xmark"
                );

            } else {

                icon?.classList.remove(
                    "fa-xmark"
                );

                icon?.classList.add(
                    "fa-bars"
                );
            }
        }
    );


    // Close mobile navigation after click

    document
        .querySelectorAll(".nav-menu a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu?.classList.remove(
                        "active"
                    );

                    const icon =
                        menuToggle
                            ?.querySelector("i");

                    icon?.classList.remove(
                        "fa-xmark"
                    );

                    icon?.classList.add(
                        "fa-bars"
                    );
                }
            );
        });


    // ==================================================
    // ESCAPE KEY
    // ==================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {

                return;
            }


            closeForgotPasswordModal();


            navMenu?.classList.remove(
                "active"
            );


            const icon =
                menuToggle
                    ?.querySelector("i");


            icon?.classList.remove(
                "fa-xmark"
            );

            icon?.classList.add(
                "fa-bars"
            );
        }
    );

// ==================================================
// GET CURRENT USER
// ==================================================

function getCurrentUser() {

    try {

        const savedUser =
            localStorage.getItem(SESSION_KEY) ||
            sessionStorage.getItem(SESSION_KEY);

        if (!savedUser) {
            return null;
        }

        return JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Unable to read current user:",
            error
        );

        return null;
    }
}

 // ==================================================
// CHECK EXISTING LOGIN
// ==================================================

const currentUser =
    getCurrentUser();


if (currentUser && signinForm) {

    // ==============================================
    // ADMIN ALREADY LOGGED IN
    // ==============================================

    if (currentUser.role === "admin") {

        showAuthMessage(
            "You're already signed in as Administrator.",
            "success"
        );


        if (signinBtn) {

            signinBtn.innerHTML = `
                <span>Go to Admin Panel</span>
                <i class="fa-solid fa-arrow-right"></i>
            `;


            signinBtn.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    window.location.href =
                        "admin.html";
                },
                {
                    once: true
                }
            );
        }

        return;
    }


    // ==============================================
    // CUSTOMER ALREADY LOGGED IN
    // ==============================================

    showAuthMessage(
        `You're already signed in${
            currentUser.firstName
                ? ` as ${currentUser.firstName}`
                : ""
        }.`,
        "success"
    );


    if (signinBtn) {

        signinBtn.innerHTML = `
            <span>Go to My Account</span>
            <i class="fa-solid fa-arrow-right"></i>
        `;


        signinBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                window.location.href =
                    "account.html";
            },
            {
                once: true
            }
        );
    }
}

    // ==================================================
    // INITIALIZE
    // ==================================================

    updateCartCount();

});