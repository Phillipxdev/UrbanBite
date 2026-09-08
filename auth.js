// ==========================================
// URBANBITE AUTHENTICATION
// auth.js
// ==========================================

const SESSION_KEY = "urbanBiteCurrentUser";
const REDIRECT_KEY = "urbanBiteRedirectAfterLogin";


// ==========================================
// GET CURRENT LOGGED-IN USER
// ==========================================

function getCurrentUser() {

    try {

        const localUser =
            localStorage.getItem(SESSION_KEY);

        const sessionUser =
            sessionStorage.getItem(SESSION_KEY);

        if (localUser) {
            return JSON.parse(localUser);
        }

        if (sessionUser) {
            return JSON.parse(sessionUser);
        }

        return null;

    } catch (error) {

        console.error(
            "Unable to read login session:",
            error
        );

        return null;
    }
}


// ==========================================
// CHECK LOGIN
// ==========================================

function isLoggedIn() {

    return getCurrentUser() !== null;
}


// ==========================================
// REQUIRE LOGIN
// ==========================================

function requireLogin(redirectPage = "checkout.html") {

    const user = getCurrentUser();

    if (!user) {

        sessionStorage.setItem(
            REDIRECT_KEY,
            redirectPage
        );

        window.location.replace(
            "signin.html"
        );

        return null;
    }

    return user;
}

const ADMIN_ACCOUNT = {
    id: "ADMIN-001",
    firstName: "UrbanBite",
    lastName: "Admin",
    email: "admin@urbanbite.co.za",
    password: "Admin@123",
    phone: "",
    role: "admin"
};