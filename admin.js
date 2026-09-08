document.addEventListener("DOMContentLoaded", () => {

    // ADMIN PROTECTION
    const currentUser = JSON.parse(
        localStorage.getItem("urbanBiteCurrentUser")
    );

    if (!currentUser || currentUser.role !== "admin") {
        window.location.replace("signin.html");
        return;
    }

    // Your dashboard code continues here...
});