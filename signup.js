// ======================================================
// URBANBITE AUTHENTICATION
// auth.js
// Works with signin.html + signup.html
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // STORAGE KEYS
    // ==================================================

    const USERS_KEY = "urbanBiteUsers";
    const SESSION_KEY = "urbanBiteCurrentUser";
    const CART_KEY = "urbanBiteCart";


    // ==================================================
    // GENERAL HELPERS
    // ==================================================

    function getUsers() {
        try {
            const users = JSON.parse(
                localStorage.getItem(USERS_KEY)
            );

            return Array.isArray(users) ? users : [];
        } catch (error) {
            console.error("Unable to load users:", error);
            return [];
        }
    }


    function saveUsers(users) {
        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );
    }


    function getCart() {
        try {
            const cart = JSON.parse(
                localStorage.getItem(CART_KEY)
            );

            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    }


    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    function getCurrentUser() {
        try {
            const user =
                localStorage.getItem(SESSION_KEY) ||
                sessionStorage.getItem(SESSION_KEY);

            return user ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    }


    function createSession(user, remember = true) {

        // Never place the password inside the session.
        const sessionUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || "",
            signedInAt: new Date().toISOString()
        };

        if (remember) {

            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(sessionUser)
            );

            sessionStorage.removeItem(SESSION_KEY);

        } else {

            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify(sessionUser)
            );

            localStorage.removeItem(SESSION_KEY);
        }
    }


    // ==================================================
    // CART COUNTER
    // ==================================================

    const cartCount = document.getElementById("cartCount");


    function updateCartCount() {

        if (!cartCount) return;

        const cart = getCart();

        const total = cart.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );

        cartCount.textContent = total;
    }


    // ==================================================
    // ERROR HELPERS
    // ==================================================

    function showFieldError(input, errorElement, message) {

        if (errorElement) {
            errorElement.textContent = message;
        }

        input?.classList.add("error");

        input
            ?.closest(".auth-input-box")
            ?.classList.add("error");
    }


    function clearFieldError(input, errorElement) {

        if (errorElement) {
            errorElement.textContent = "";
        }

        input?.classList.remove("error");

        input
            ?.closest(".auth-input-box")
            ?.classList.remove("error");
    }


    function showMessage(element, message, type = "error") {

        if (!element) return;

        element.textContent = message;

        element.className =
            `auth-message ${type}`;

        element.hidden = false;
    }


    function hideMessage(element) {

        if (!element) return;

        element.hidden = true;
        element.textContent = "";
        element.className = "auth-message";
    }


    // ==================================================
    // PASSWORD TOGGLE
    // ==================================================

    function setupPasswordToggle(button, input) {

        if (!button || !input) return;

        button.addEventListener("click", () => {

            const currentlyHidden =
                input.type === "password";

            input.type =
                currentlyHidden ? "text" : "password";

            const icon = button.querySelector("i");

            if (!icon) return;

            icon.classList.toggle(
                "fa-eye",
                !currentlyHidden
            );

            icon.classList.toggle(
                "fa-eye-slash",
                currentlyHidden
            );

            button.setAttribute(
                "aria-label",
                currentlyHidden
                    ? "Hide password"
                    : "Show password"
            );
        });
    }


    // ==================================================
    // SIGN UP
    // ==================================================

    const signupForm =
        document.getElementById("signupForm");

    const signupMessage =
        document.getElementById("signupMessage");

    const firstName =
        document.getElementById("signupFirstName");

    const lastName =
        document.getElementById("signupLastName");

    const signupEmail =
        document.getElementById("signupEmail");

    const signupPhone =
        document.getElementById("signupPhone");

    const signupPassword =
        document.getElementById("signupPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const acceptTerms =
        document.getElementById("acceptTerms");

    const signupBtn =
        document.getElementById("signupBtn");


    // Errors

    const firstNameError =
        document.getElementById("firstNameError");

    const lastNameError =
        document.getElementById("lastNameError");

    const signupEmailError =
        document.getElementById("signupEmailError");

    const phoneError =
        document.getElementById("phoneError");

    const signupPasswordError =
        document.getElementById("signupPasswordError");

    const confirmPasswordError =
        document.getElementById("confirmPasswordError");

    const termsError =
        document.getElementById("termsError");


    // Password buttons

    const signupPasswordToggle =
        document.getElementById("signupPasswordToggle");

    const confirmPasswordToggle =
        document.getElementById("confirmPasswordToggle");


    setupPasswordToggle(
        signupPasswordToggle,
        signupPassword
    );

    setupPasswordToggle(
        confirmPasswordToggle,
        confirmPassword
    );


    // ==================================================
    // PHONE INPUT
    // ==================================================

    signupPhone?.addEventListener("input", () => {

        let value = signupPhone.value;

        // Keep numbers, spaces and +
        value = value.replace(/[^\d+\s]/g, "");

        signupPhone.value = value;

        clearFieldError(
            signupPhone,
            phoneError
        );
    });


    // ==================================================
    // PASSWORD STRENGTH
    // ==================================================

    const strengthBar =
        document.getElementById("passwordStrengthBar");

    const strengthText =
        document.getElementById("passwordStrengthText");


    function checkPasswordStrength(password) {

        let score = 0;

        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        return score;
    }


    function updatePasswordStrength() {

        if (
            !signupPassword ||
            !strengthBar ||
            !strengthText
        ) {
            return;
        }

        const password =
            signupPassword.value;

        if (!password) {

            strengthBar.style.width = "0%";
            strengthBar.style.background = "#ff6b00";

            strengthText.textContent =
                "Use at least 6 characters.";

            return;
        }


        const score =
            checkPasswordStrength(password);


        if (score <= 1) {

            strengthBar.style.width = "25%";
            strengthBar.style.background = "#e95454";

            strengthText.textContent =
                "Weak password";

        } else if (score === 2) {

            strengthBar.style.width = "50%";
            strengthBar.style.background = "#f0a43c";

            strengthText.textContent =
                "Fair password";

        } else if (score <= 4) {

            strengthBar.style.width = "75%";
            strengthBar.style.background = "#e4c94c";

            strengthText.textContent =
                "Good password";

        } else {

            strengthBar.style.width = "100%";
            strengthBar.style.background = "#49c879";

            strengthText.textContent =
                "Strong password";
        }
    }


    signupPassword?.addEventListener(
        "input",
        () => {

            clearFieldError(
                signupPassword,
                signupPasswordError
            );

            updatePasswordStrength();

            if (confirmPassword?.value) {

                if (
                    confirmPassword.value ===
                    signupPassword.value
                ) {

                    clearFieldError(
                        confirmPassword,
                        confirmPasswordError
                    );
                }
            }

            hideMessage(signupMessage);
        }
    );


    // ==================================================
    // CLEAR SIGNUP ERRORS WHILE TYPING
    // ==================================================

    firstName?.addEventListener("input", () => {
        clearFieldError(
            firstName,
            firstNameError
        );

        hideMessage(signupMessage);
    });


    lastName?.addEventListener("input", () => {
        clearFieldError(
            lastName,
            lastNameError
        );

        hideMessage(signupMessage);
    });


    signupEmail?.addEventListener("input", () => {
        clearFieldError(
            signupEmail,
            signupEmailError
        );

        hideMessage(signupMessage);
    });


    confirmPassword?.addEventListener("input", () => {

        clearFieldError(
            confirmPassword,
            confirmPasswordError
        );

        hideMessage(signupMessage);
    });


    acceptTerms?.addEventListener("change", () => {

        if (termsError) {
            termsError.textContent = "";
        }
    });


    // ==================================================
    // VALIDATE SIGN UP
    // ==================================================

    function validateSignup() {

        let valid = true;

        hideMessage(signupMessage);


        // First name

        if (!firstName.value.trim()) {

            showFieldError(
                firstName,
                firstNameError,
                "Please enter your first name."
            );

            valid = false;

        } else if (firstName.value.trim().length < 2) {

            showFieldError(
                firstName,
                firstNameError,
                "First name is too short."
            );

            valid = false;
        }


        // Last name

        if (!lastName.value.trim()) {

            showFieldError(
                lastName,
                lastNameError,
                "Please enter your last name."
            );

            valid = false;

        } else if (lastName.value.trim().length < 2) {

            showFieldError(
                lastName,
                lastNameError,
                "Last name is too short."
            );

            valid = false;
        }


        // Email

        const email =
            signupEmail.value
                .trim()
                .toLowerCase();


        if (!email) {

            showFieldError(
                signupEmail,
                signupEmailError,
                "Please enter your email address."
            );

            valid = false;

        } else if (!isValidEmail(email)) {

            showFieldError(
                signupEmail,
                signupEmailError,
                "Please enter a valid email address."
            );

            valid = false;
        }


        // Phone

        const phoneNumbers =
            signupPhone.value.replace(/\D/g, "");


        if (!signupPhone.value.trim()) {

            showFieldError(
                signupPhone,
                phoneError,
                "Please enter your phone number."
            );

            valid = false;

        } else if (
            phoneNumbers.length < 9 ||
            phoneNumbers.length > 12
        ) {

            showFieldError(
                signupPhone,
                phoneError,
                "Please enter a valid phone number."
            );

            valid = false;
        }


        // Password

        if (!signupPassword.value) {

            showFieldError(
                signupPassword,
                signupPasswordError,
                "Please create a password."
            );

            valid = false;

        } else if (
            signupPassword.value.length < 6
        ) {

            showFieldError(
                signupPassword,
                signupPasswordError,
                "Password must contain at least 6 characters."
            );

            valid = false;
        }


        // Confirm password

        if (!confirmPassword.value) {

            showFieldError(
                confirmPassword,
                confirmPasswordError,
                "Please confirm your password."
            );

            valid = false;

        } else if (
            signupPassword.value !==
            confirmPassword.value
        ) {

            showFieldError(
                confirmPassword,
                confirmPasswordError,
                "Passwords do not match."
            );

            valid = false;
        }


        // Terms

        if (!acceptTerms.checked) {

            if (termsError) {

                termsError.textContent =
                    "You must accept the Terms and Privacy Policy.";
            }

            valid = false;
        }


        return valid;
    }


    // ==================================================
    // CREATE ACCOUNT
    // ==================================================

    signupForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!validateSignup()) {
                return;
            }


            const users = getUsers();

            const email =
                signupEmail.value
                    .trim()
                    .toLowerCase();


            // Check duplicate email

            const accountExists =
                users.some(
                    user =>
                        user.email
                            ?.toLowerCase() === email
                );


            if (accountExists) {

                showFieldError(
                    signupEmail,
                    signupEmailError,
                    "An account already exists with this email."
                );

                showMessage(
                    signupMessage,
                    "This email is already registered. Please sign in instead.",
                    "error"
                );

                return;
            }


            // ==================================================
            // NEW USER
            // ==================================================

            const newUser = {

                id:
                    "UBUSER-" +
                    Date.now(),

                firstName:
                    firstName.value.trim(),

                lastName:
                    lastName.value.trim(),

                email,

                phone:
                    signupPhone.value.trim(),

                // DEMO ONLY
                password:
                    signupPassword.value,

                createdAt:
                    new Date().toISOString()
            };


            users.push(newUser);

            saveUsers(users);


            // Automatically sign in
            createSession(
                newUser,
                true
            );


            showMessage(
                signupMessage,
                `Welcome, ${newUser.firstName}! Your account has been created.`,
                "success"
            );


            // Loading button

            if (signupBtn) {

                signupBtn.disabled = true;

                signupBtn.innerHTML = `
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Creating Account...</span>
                `;
            }


            // Redirect to account page

            setTimeout(() => {

                window.location.href =
                    "account.html";

            }, 1000);
        }
    );


    // ==================================================
    // SIGN IN
    // ==================================================

    const signinForm =
        document.getElementById("signinForm");

    const signinEmail =
        document.getElementById("signinEmail");

    const signinPassword =
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


    setupPasswordToggle(
        passwordToggle,
        signinPassword
    );


    signinEmail?.addEventListener("input", () => {

        clearFieldError(
            signinEmail,
            emailError
        );

        hideMessage(authMessage);
    });


    signinPassword?.addEventListener("input", () => {

        clearFieldError(
            signinPassword,
            passwordError
        );

        hideMessage(authMessage);
    });


    // ==================================================
    // SIGN IN SUBMIT
    // ==================================================

    signinForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            hideMessage(authMessage);


            const email =
                signinEmail.value
                    .trim()
                    .toLowerCase();

            const password =
                signinPassword.value;


            let valid = true;


            // Email validation

            if (!email) {

                showFieldError(
                    signinEmail,
                    emailError,
                    "Please enter your email address."
                );

                valid = false;

            } else if (!isValidEmail(email)) {

                showFieldError(
                    signinEmail,
                    emailError,
                    "Please enter a valid email address."
                );

                valid = false;
            }


            // Password validation

            if (!password) {

                showFieldError(
                    signinPassword,
                    passwordError,
                    "Please enter your password."
                );

                valid = false;

            } else if (password.length < 6) {

                showFieldError(
                    signinPassword,
                    passwordError,
                    "Password must contain at least 6 characters."
                );

                valid = false;
            }


            if (!valid) return;


            // ==================================================
            // FIND USER
            // ==================================================

            const users = getUsers();


            const user =
                users.find(
                    account =>
                        account.email
                            ?.toLowerCase() === email
                );


            if (!user) {

                showMessage(
                    authMessage,
                    "No UrbanBite account was found with this email.",
                    "error"
                );

                return;
            }


            // Password

            if (user.password !== password) {

                showFieldError(
                    signinPassword,
                    passwordError,
                    "Incorrect password."
                );

                showMessage(
                    authMessage,
                    "Your email or password is incorrect.",
                    "error"
                );

                return;
            }


            // ==================================================
            // LOGIN SUCCESS
            // ==================================================

            createSession(
                user,
                rememberMe?.checked
            );


            showMessage(
                authMessage,
                `Welcome back, ${user.firstName}!`,
                "success"
            );


            if (signinBtn) {

                signinBtn.disabled = true;

                signinBtn.innerHTML = `
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Signing In...</span>
                `;
            }


            setTimeout(() => {

                window.location.href =
                    "account.html";

            }, 800);
        }
    );


    // ==================================================
    // FORGOT PASSWORD
    // ==================================================

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


    function openForgotModal() {

        if (!forgotPasswordModal) return;

        forgotPasswordModal.classList.add(
            "active"
        );

        forgotPasswordModal.setAttribute(
            "aria-hidden",
            "false"
        );


        if (
            signinEmail?.value &&
            resetEmail
        ) {
            resetEmail.value =
                signinEmail.value;
        }


        setTimeout(
            () => resetEmail?.focus(),
            150
        );
    }


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


    forgotPasswordBtn?.addEventListener(
        "click",
        openForgotModal
    );


    closeForgotModal?.addEventListener(
        "click",
        closeForgotPasswordModal
    );


    forgotPasswordModal
        ?.querySelector(".auth-modal-overlay")
        ?.addEventListener(
            "click",
            closeForgotPasswordModal
        );


    forgotPasswordForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (!resetEmail || !forgotMessage) {
                return;
            }


            const email =
                resetEmail.value
                    .trim()
                    .toLowerCase();


            forgotMessage.hidden = false;


            if (!isValidEmail(email)) {

                forgotMessage.textContent =
                    "Please enter a valid email address.";

                return;
            }


            const users = getUsers();

            const exists =
                users.some(
                    user =>
                        user.email
                            ?.toLowerCase() === email
                );


            if (exists) {

                forgotMessage.textContent =
                    "Account found. This demo does not send real password reset emails.";

            } else {

                forgotMessage.textContent =
                    "No UrbanBite account was found with that email.";
            }
        }
    );


    // ==================================================
    // MOBILE NAVIGATION
    // ==================================================

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    function closeMobileMenu() {

        navMenu?.classList.remove("active");

        const icon =
            menuToggle?.querySelector("i");

        icon?.classList.remove("fa-xmark");
        icon?.classList.add("fa-bars");
    }


    menuToggle?.addEventListener(
        "click",
        () => {

            navMenu?.classList.toggle("active");

            const icon =
                menuToggle.querySelector("i");

            const opened =
                navMenu?.classList.contains("active");


            icon?.classList.toggle(
                "fa-bars",
                !opened
            );

            icon?.classList.toggle(
                "fa-xmark",
                opened
            );
        }
    );


    document
        .querySelectorAll(".nav-menu a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
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

            closeMobileMenu();
            closeForgotPasswordModal();
        }
    );


    // ==================================================
    // ALREADY LOGGED IN
    // ==================================================

    const currentUser =
        getCurrentUser();


    if (currentUser) {

        /*
         * If the customer visits signin.html while
         * already logged in, change the button.
         */

        if (signinBtn) {

            showMessage(
                authMessage,
                `You're signed in as ${currentUser.firstName}.`,
                "success"
            );

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