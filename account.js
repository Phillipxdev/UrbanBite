// ======================================================
// URBANBITE - MY ACCOUNT
// account.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // STORAGE KEYS
    // ==================================================

    const USERS_KEY = "urbanBiteUsers";
    const SESSION_KEY = "urbanBiteCurrentUser";
    const CART_KEY = "urbanBiteCart";
    const FAVORITES_KEY = "urbanBiteFavorites";
    const LAST_ORDER_KEY = "urbanBiteLastOrder";


    // ==================================================
    // SAFE JSON READER
    // ==================================================

    function readJSON(storage, key, fallback = null) {
        try {
            const value = storage.getItem(key);

            return value
                ? JSON.parse(value)
                : fallback;

        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return fallback;
        }
    }



    // ==================================================
    // GET CURRENT USER
    // ==================================================

    function getCurrentUser() {

        const localUser = readJSON(
            localStorage,
            SESSION_KEY,
            null
        );

        const sessionUser = readJSON(
            sessionStorage,
            SESSION_KEY,
            null
        );

        return localUser || sessionUser;
    }


    // ==================================================
    // PROTECT ACCOUNT PAGE
    // ==================================================

    let currentUser = getCurrentUser();

    if (!currentUser) {

        // Not logged in - go to sign in
        window.location.replace("signin.html");

        return;
    }

    // ==================================================
// ADMIN PANEL BUTTON
// ==================================================

const adminPanelBtn =
    document.getElementById("adminPanelBtn");

if (
    adminPanelBtn &&
    currentUser.role === "admin"
) {
    adminPanelBtn.style.display = "flex";
}

    // ==================================================
    // GET ELEMENTS
    // ==================================================

    const accountInitials =
        document.getElementById("accountInitials");

    const accountUserName =
        document.getElementById("accountUserName");

    const accountUserEmail =
        document.getElementById("accountUserEmail");

    const overviewFirstName =
        document.getElementById("overviewFirstName");


    // Stats

    const totalOrders =
        document.getElementById("totalOrders");

    const totalFavorites =
        document.getElementById("totalFavorites");

    const accountCartItems =
        document.getElementById("accountCartItems");

    const cartCount =
        document.getElementById("cartCount");


    // Profile

    const profileForm =
        document.getElementById("profileForm");

    const profileFirstName =
        document.getElementById("profileFirstName");

    const profileLastName =
        document.getElementById("profileLastName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePhone =
        document.getElementById("profilePhone");

    const profileMessage =
        document.getElementById("profileMessage");


    // Orders

    const recentOrderContainer =
        document.getElementById("recentOrderContainer");

    const ordersList =
        document.getElementById("ordersList");


    // Favorites

    const accountFavorites =
        document.getElementById("accountFavorites");


    // Sign Out

    const accountSignOutBtn =
        document.getElementById("accountSignOutBtn");

    const signOutModal =
        document.getElementById("signOutModal");

    const cancelSignOutBtn =
        document.getElementById("cancelSignOutBtn");

    const confirmSignOutBtn =
        document.getElementById("confirmSignOutBtn");


    // Navigation

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    // ==================================================
    // GET USERS
    // ==================================================

    function getUsers() {

        const users = readJSON(
            localStorage,
            USERS_KEY,
            []
        );

        return Array.isArray(users)
            ? users
            : [];
    }


    // ==================================================
    // GET CART
    // ==================================================

    function getCart() {

        const cart = readJSON(
            localStorage,
            CART_KEY,
            []
        );

        return Array.isArray(cart)
            ? cart
            : [];
    }


    // ==================================================
    // GET FAVORITES
    // ==================================================

    function getFavorites() {

        const favorites = readJSON(
            localStorage,
            FAVORITES_KEY,
            []
        );

        return Array.isArray(favorites)
            ? favorites
            : [];
    }


    // ==================================================
    // GET LAST ORDER
    // ==================================================

    function getLastOrder() {

        return readJSON(
            localStorage,
            LAST_ORDER_KEY,
            null
        );
    }


    // ==================================================
    // ESCAPE HTML
    // ==================================================

    function escapeHTML(value = "") {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    // ==================================================
    // FORMAT MONEY
    // ==================================================

    function formatCurrency(value) {

        const amount = Number(value) || 0;

        return new Intl.NumberFormat(
            "en-ZA",
            {
                style: "currency",
                currency: "ZAR"
            }
        ).format(amount);
    }


    // ==================================================
    // FORMAT DATE
    // ==================================================

    function formatDate(value) {

        if (!value) {
            return "Date unavailable";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return new Intl.DateTimeFormat(
            "en-ZA",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(date);
    }


    // ==================================================
    // USER INITIALS
    // ==================================================

    function getInitials(firstName, lastName) {

        const first =
            firstName
                ?.trim()
                .charAt(0)
                .toUpperCase() || "";

        const last =
            lastName
                ?.trim()
                .charAt(0)
                .toUpperCase() || "";

        return `${first}${last}` || "UB";
    }


    // ==================================================
    // RENDER USER INFORMATION
    // ==================================================

    function renderUser() {

        const firstName =
            currentUser.firstName || "";

        const lastName =
            currentUser.lastName || "";

        const fullName =
            `${firstName} ${lastName}`.trim()
            || "UrbanBite Customer";


        if (accountInitials) {

            accountInitials.textContent =
                getInitials(
                    firstName,
                    lastName
                );
        }


        if (accountUserName) {

            accountUserName.textContent =
                fullName;
        }


        if (accountUserEmail) {

            accountUserEmail.textContent =
                currentUser.email || "";
        }


        if (overviewFirstName) {

            overviewFirstName.textContent =
                firstName || "Customer";
        }


        // Fill profile form

        if (profileFirstName) {

            profileFirstName.value =
                firstName;
        }


        if (profileLastName) {

            profileLastName.value =
                lastName;
        }


        if (profileEmail) {

            profileEmail.value =
                currentUser.email || "";
        }


        if (profilePhone) {

            profilePhone.value =
                currentUser.phone || "";
        }
    }


    // ==================================================
    // CART COUNT
    // ==================================================

    function getCartQuantity() {

        const cart = getCart();

        return cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );
    }


    function updateCartCount() {

        const quantity =
            getCartQuantity();


        if (cartCount) {

            cartCount.textContent =
                quantity;
        }


        if (accountCartItems) {

            accountCartItems.textContent =
                quantity;
        }
    }


    // ==================================================
    // ACCOUNT TABS
    // ==================================================

    const accountMenuItems =
        document.querySelectorAll(
            "[data-account-tab]"
        );

    const accountPanels =
        document.querySelectorAll(
            "[data-panel]"
        );

    const openTabButtons =
        document.querySelectorAll(
            "[data-open-tab]"
        );


    function openAccountTab(tabName) {

        // Hide all panels

        accountPanels.forEach(panel => {

            panel.classList.remove("active");

        });


        // Show selected panel

        const selectedPanel =
            document.querySelector(
                `[data-panel="${tabName}"]`
            );


        selectedPanel?.classList.add(
            "active"
        );


        // Remove active from sidebar buttons

        accountMenuItems.forEach(button => {

            button.classList.remove(
                "active"
            );

        });


        // Activate correct sidebar button

        const selectedButton =
            document.querySelector(
                `[data-account-tab="${tabName}"]`
            );


        selectedButton?.classList.add(
            "active"
        );


        // Change URL hash

        if (history.replaceState) {

            history.replaceState(
                null,
                "",
                `#${tabName}`
            );
        }


        // Scroll to content on mobile

        if (window.innerWidth <= 800) {

            document
                .querySelector(
                    ".account-content"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }
    }


    // Sidebar buttons

    accountMenuItems.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openAccountTab(
                    button.dataset.accountTab
                );
            }
        );
    });


    // Quick action buttons

    openTabButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openAccountTab(
                    button.dataset.openTab
                );
            }
        );
    });


    // ==================================================
    // URL HASH
    // ==================================================

    const allowedTabs = [
        "overview",
        "profile",
        "orders",
        "favorites"
    ];


    const urlTab =
        window.location.hash
            .replace("#", "")
            .toLowerCase();


    if (allowedTabs.includes(urlTab)) {

        openAccountTab(urlTab);

    } else {

        openAccountTab("overview");
    }


    // ==================================================
    // PROFILE MESSAGE
    // ==================================================

    function showProfileMessage(
        message,
        type = "success"
    ) {

        if (!profileMessage) {
            return;
        }


        profileMessage.textContent =
            message;


        profileMessage.className =
            `profile-message ${type}`;


        profileMessage.hidden =
            false;
    }


    function hideProfileMessage() {

        if (!profileMessage) {
            return;
        }


        profileMessage.hidden = true;

        profileMessage.textContent = "";

        profileMessage.className =
            "profile-message";
    }


    // ==================================================
    // EMAIL VALIDATION
    // ==================================================

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    // ==================================================
    // PHONE INPUT
    // ==================================================

    profilePhone?.addEventListener(
        "input",
        () => {

            profilePhone.value =
                profilePhone.value.replace(
                    /[^\d+\s]/g,
                    ""
                );
        }
    );


    // ==================================================
    // SAVE PROFILE
    // ==================================================

    profileForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            hideProfileMessage();


            const firstName =
                profileFirstName
                    ?.value
                    .trim() || "";

            const lastName =
                profileLastName
                    ?.value
                    .trim() || "";

            const email =
                profileEmail
                    ?.value
                    .trim()
                    .toLowerCase() || "";

            const phone =
                profilePhone
                    ?.value
                    .trim() || "";


            // Validation

            if (firstName.length < 2) {

                showProfileMessage(
                    "Please enter a valid first name.",
                    "error"
                );

                profileFirstName?.focus();

                return;
            }


            if (lastName.length < 2) {

                showProfileMessage(
                    "Please enter a valid last name.",
                    "error"
                );

                profileLastName?.focus();

                return;
            }


            if (!isValidEmail(email)) {

                showProfileMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                profileEmail?.focus();

                return;
            }


            // ==================================================
            // FIND USER IN REGISTERED USERS
            // ==================================================

            const users =
                getUsers();


            let userIndex =
                users.findIndex(
                    user =>
                        String(user.id) ===
                        String(currentUser.id)
                );


            // Backup search using email

            if (userIndex === -1) {

                userIndex =
                    users.findIndex(
                        user =>
                            user.email
                                ?.toLowerCase() ===
                            currentUser.email
                                ?.toLowerCase()
                    );
            }


            if (userIndex === -1) {

                showProfileMessage(
                    "Your UrbanBite account could not be found.",
                    "error"
                );

                return;
            }


            // ==================================================
            // CHECK EMAIL ISN'T USED BY SOMEONE ELSE
            // ==================================================

            const emailExists =
                users.some(
                    (user, index) => {

                        return (
                            index !== userIndex &&
                            user.email
                                ?.toLowerCase() ===
                            email
                        );

                    }
                );


            if (emailExists) {

                showProfileMessage(
                    "Another UrbanBite account already uses this email.",
                    "error"
                );

                profileEmail?.focus();

                return;
            }


            // ==================================================
            // UPDATE USER ACCOUNT
            // ==================================================

            users[userIndex] = {

                ...users[userIndex],

                firstName,
                lastName,
                email,
                phone,

                updatedAt:
                    new Date()
                        .toISOString()
            };


            localStorage.setItem(
                USERS_KEY,
                JSON.stringify(users)
            );


            // ==================================================
            // UPDATE CURRENT SESSION
            // ==================================================

            currentUser = {

                ...currentUser,

                firstName,
                lastName,
                email,
                phone
            };


            // Remember Me session

            if (
                localStorage.getItem(
                    SESSION_KEY
                )
            ) {

                localStorage.setItem(
                    SESSION_KEY,
                    JSON.stringify(
                        currentUser
                    )
                );

            } else {

                sessionStorage.setItem(
                    SESSION_KEY,
                    JSON.stringify(
                        currentUser
                    )
                );
            }


            // Refresh user information

            renderUser();


            showProfileMessage(
                "Your profile has been updated successfully.",
                "success"
            );
        }
    );


    // ==================================================
    // GET USER ORDERS
    // ==================================================

    function getUserOrders() {

        const lastOrder =
            getLastOrder();


        if (!lastOrder) {

            return [];
        }


        /*
         * If checkout.js saved a userId,
         * only show the order to that user.
         */

        if (
            lastOrder.userId &&
            String(lastOrder.userId) !==
            String(currentUser.id)
        ) {

            return [];
        }


        /*
         * If checkout.js saved customer email,
         * check that too.
         */

        if (
            lastOrder.email &&
            currentUser.email &&
            lastOrder.email
                .toLowerCase() !==
            currentUser.email
                .toLowerCase()
        ) {

            return [];
        }


        return [lastOrder];
    }


    // ==================================================
    // ORDER CARD
    // ==================================================

    function createOrderCard(order) {

        const orderNumber =
            order.orderNumber ||
            order.number ||
            order.id ||
            "UrbanBite Order";


        const orderDate =
            order.createdAt ||
            order.date ||
            order.orderedAt;


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        const quantity =
            items.reduce(
                (total, item) => {

                    return total +
                        Number(
                            item.quantity || 1
                        );

                },
                0
            );


        const total =
            order.summary?.total ??
            order.total ??
            0;


        const status =
            order.status ||
            "Order Placed";


        return `
            <article class="account-order-card">

                <div class="account-order-top">

                    <div class="account-order-number">

                        <div class="account-order-number-icon">

                            <i class="fa-solid fa-bag-shopping"></i>

                        </div>


                        <div>

                            <strong>
                                ${escapeHTML(orderNumber)}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    formatDate(orderDate)
                                )}
                            </span>

                        </div>

                    </div>


                    <span class="order-status">

                        ${escapeHTML(status)}

                    </span>

                </div>


                <div class="account-order-details">

                    <span>

                        ${quantity}

                        ${
                            quantity === 1
                                ? "item"
                                : "items"
                        }

                    </span>


                    <strong>

                        ${formatCurrency(total)}

                    </strong>

                </div>

            </article>
        `;
    }


    // ==================================================
    // EMPTY ORDER
    // ==================================================

    function emptyOrderHTML() {

        return `
            <div class="account-empty">

                <div class="account-empty-icon">

                    <i class="fa-solid fa-receipt"></i>

                </div>


                <h3>
                    No Orders Yet
                </h3>


                <p>
                    You haven't placed an UrbanBite
                    order yet. Browse our menu and
                    order something delicious.
                </p>


                <a href="menu.html">

                    Browse Menu

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>
        `;
    }


    // ==================================================
    // RENDER ORDERS
    // ==================================================

    function renderOrders() {

        const orders =
            getUserOrders();


        // Number of orders

        if (totalOrders) {

            totalOrders.textContent =
                orders.length;
        }


        // No orders

        if (!orders.length) {

            if (ordersList) {

                ordersList.innerHTML =
                    emptyOrderHTML();
            }


            if (recentOrderContainer) {

                recentOrderContainer.innerHTML =
                    emptyOrderHTML();
            }

            return;
        }


        // All available orders

        if (ordersList) {

            ordersList.innerHTML =
                orders
                    .map(createOrderCard)
                    .join("");
        }


        // Latest order

        if (recentOrderContainer) {

            recentOrderContainer.innerHTML =
                createOrderCard(
                    orders[0]
                );
        }
    }


    // ==================================================
    // FAVORITE NAME
    // ==================================================

    function getFavoriteName(favorite) {

        if (
            typeof favorite === "object" &&
            favorite !== null
        ) {

            return (
                favorite.name ||
                favorite.title ||
                "Favourite Meal"
            );
        }


        /*
         * Your current menu favorites may store
         * product IDs instead of product objects.
         */

        const productNames = {

            1: "Classic Beef Burger",
            2: "Pepperoni Pizza",
            3: "Grilled Chicken",
            4: "Crispy Chicken Burger",
            5: "BBQ Bacon Burger",
            6: "Margherita Pizza",
            7: "Spicy Chicken Wings",
            8: "Crispy Chicken Strips",
            9: "Ice Cold Cola",
            10: "Fresh Lemonade",
            11: "Chocolate Cake",
            12: "Vanilla Ice Cream"
        };


        return (
            productNames[favorite] ||
            String(favorite)
        );
    }


    // ==================================================
    // FAVORITE PRODUCT DATA
    // ==================================================

    const productData = {

        1: {
            name: "Classic Beef Burger",
            price: 89.99,
            image: "images/classic-burger.jpg"
        },

        2: {
            name: "Pepperoni Pizza",
            price: 129.99,
            image: "images/pepperoni-pizza.jpg"
        },

        3: {
            name: "Grilled Chicken",
            price: 109.99,
            image: "images/grilled-chicken.jpg"
        },

        4: {
            name: "Crispy Chicken Burger",
            price: 84.99,
            image: "images/chicken-burger.jpg"
        },

        5: {
            name: "BBQ Bacon Burger",
            price: 104.99,
            image: "images/bbq-burger.jpg"
        },

        6: {
            name: "Margherita Pizza",
            price: 99.99,
            image: "images/margherita-pizza.jpg"
        },

        7: {
            name: "Spicy Chicken Wings",
            price: 94.99,
            image: "images/chicken-wings.jpg"
        },

        8: {
            name: "Crispy Chicken Strips",
            price: 79.99,
            image: "images/chicken-strips.jpg"
        },

        9: {
            name: "Ice Cold Cola",
            price: 24.99,
            image: "images/cola.jpg"
        },

        10: {
            name: "Fresh Lemonade",
            price: 34.99,
            image: "images/lemonade.jpg"
        },

        11: {
            name: "Chocolate Cake",
            price: 59.99,
            image: "images/chocolate-cake.jpg"
        },

        12: {
            name: "Vanilla Ice Cream",
            price: 44.99,
            image: "images/vanilla-icecream.jpg"
        }
    };


    // ==================================================
    // NORMALIZE FAVORITE
    // ==================================================

    function normalizeFavorite(favorite) {

        // Full product object

        if (
            typeof favorite === "object" &&
            favorite !== null
        ) {

            return {

                name:
                    favorite.name ||
                    favorite.title ||
                    "Favourite Meal",

                price:
                    favorite.price ?? null,

                image:
                    favorite.image || ""
            };
        }


        // Product ID

        const product =
            productData[favorite];


        if (product) {

            return product;
        }


        // String fallback

        return {

            name:
                getFavoriteName(favorite),

            price: null,

            image: ""
        };
    }


    // ==================================================
    // EMPTY FAVORITES
    // ==================================================

    function emptyFavoritesHTML() {

        return `
            <div
                class="account-empty"
                style="grid-column: 1 / -1;"
            >

                <div class="account-empty-icon">

                    <i class="fa-regular fa-heart"></i>

                </div>


                <h3>
                    No Favourites Yet
                </h3>


                <p>
                    Tap the heart icon on a meal
                    you love and it will appear
                    here.
                </p>


                <a href="menu.html">

                    Explore Menu

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>
        `;
    }


    // ==================================================
    // RENDER FAVORITES
    // ==================================================

    function renderFavorites() {

        const favorites =
            getFavorites();


        if (totalFavorites) {

            totalFavorites.textContent =
                favorites.length;
        }


        if (!accountFavorites) {

            return;
        }


        if (!favorites.length) {

            accountFavorites.innerHTML =
                emptyFavoritesHTML();

            return;
        }


        accountFavorites.innerHTML =
            favorites
                .map(
                    (favorite, index) => {

                        const product =
                            normalizeFavorite(
                                favorite
                            );


                        return `
                            <article class="account-favorite-card">

                                ${
                                    product.image
                                        ? `
                                            <div class="account-favorite-image">

                                                <img
                                                    src="${escapeHTML(product.image)}"
                                                    alt="${escapeHTML(product.name)}"
                                                >


                                                <button
                                                    type="button"
                                                    class="remove-favorite-btn"
                                                    data-remove-favorite="${index}"
                                                    aria-label="Remove ${escapeHTML(product.name)}"
                                                >

                                                    <i class="fa-solid fa-heart"></i>

                                                </button>

                                            </div>
                                        `
                                        : ""
                                }


                                <div class="account-favorite-content">

                                    <h3>
                                        ${escapeHTML(product.name)}
                                    </h3>


                                    ${
                                        product.price !== null

                                            ? `
                                                <p>
                                                    ${formatCurrency(product.price)}
                                                </p>
                                            `

                                            : `
                                                <p>
                                                    Saved meal
                                                </p>
                                            `
                                    }


                                    ${
                                        !product.image

                                            ? `
                                                <button
                                                    type="button"
                                                    class="remove-favorite-btn"
                                                    data-remove-favorite="${index}"
                                                    style="
                                                        position: static;
                                                        margin-top: 12px;
                                                    "
                                                >

                                                    <i class="fa-solid fa-heart"></i>

                                                </button>
                                            `

                                            : ""
                                    }

                                </div>

                            </article>
                        `;
                    }
                )
                .join("");
    }


    // ==================================================
    // REMOVE FAVORITE
    // ==================================================

    accountFavorites?.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-remove-favorite]"
                );


            if (!button) {

                return;
            }


            const index =
                Number(
                    button.dataset
                        .removeFavorite
                );


            const favorites =
                getFavorites();


            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= favorites.length
            ) {

                return;
            }


            favorites.splice(
                index,
                1
            );


            localStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(favorites)
            );


            renderFavorites();
        }
    );


    // ==================================================
    // OPEN SIGN OUT MODAL
    // ==================================================

    function openSignOutModal() {

        if (!signOutModal) {

            return;
        }


        signOutModal.classList.add(
            "active"
        );


        signOutModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";
    }


    // ==================================================
    // CLOSE SIGN OUT MODAL
    // ==================================================

    function closeSignOutModal() {

        if (!signOutModal) {

            return;
        }


        signOutModal.classList.remove(
            "active"
        );


        signOutModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";
    }


    // Sign out button

    accountSignOutBtn?.addEventListener(
        "click",
        openSignOutModal
    );


    // Cancel

    cancelSignOutBtn?.addEventListener(
        "click",
        closeSignOutModal
    );


    // Click dark overlay

    signOutModal
        ?.querySelector(
            ".account-modal-overlay"
        )
        ?.addEventListener(
            "click",
            closeSignOutModal
        );


    // ==================================================
    // CONFIRM SIGN OUT
    // ==================================================

    confirmSignOutBtn?.addEventListener(
        "click",
        () => {

            // Remove persistent login

            localStorage.removeItem(
                SESSION_KEY
            );


            // Remove session login

            sessionStorage.removeItem(
                SESSION_KEY
            );


            /*
             * IMPORTANT:
             *
             * Do NOT delete:
             *
             * urbanBiteUsers
             * urbanBiteCart
             * urbanBiteFavorites
             *
             * We only log the customer out.
             */


            // Go back to homepage

            window.location.replace(
                "index.html"
            );
        }
    );


    // ==================================================
    // MOBILE NAVIGATION
    // ==================================================

    function closeMobileMenu() {

        navMenu?.classList.remove(
            "active"
        );


        const icon =
            menuToggle
                ?.querySelector("i");


        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );
        }
    }


    menuToggle?.addEventListener(
        "click",
        () => {

            if (!navMenu) {

                return;
            }


            navMenu.classList.toggle(
                "active"
            );


            const isOpen =
                navMenu.classList.contains(
                    "active"
                );


            const icon =
                menuToggle.querySelector(
                    "i"
                );


            if (icon) {

                icon.classList.toggle(
                    "fa-bars",
                    !isOpen
                );


                icon.classList.toggle(
                    "fa-xmark",
                    isOpen
                );
            }
        }
    );


    // Close menu after link click

    document
        .querySelectorAll(
            ".nav-menu a"
        )
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


            closeSignOutModal();

            closeMobileMenu();
        }
    );


    // ==================================================
    // STORAGE CHANGES
    // ==================================================
    // Useful if another UrbanBite tab changes the cart.

    window.addEventListener(
        "storage",
        event => {

            if (event.key === CART_KEY) {

                updateCartCount();
            }


            if (
                event.key ===
                FAVORITES_KEY
            ) {

                renderFavorites();
            }


            if (
                event.key ===
                SESSION_KEY
            ) {

                const user =
                    getCurrentUser();


                if (!user) {

                    window.location.replace(
                        "signin.html"
                    );

                    return;
                }


                currentUser = user;

                renderUser();
            }
        }
    );


    // ==================================================
    // INITIALIZE ACCOUNT
    // ==================================================

    renderUser();

    updateCartCount();

    renderOrders();

    renderFavorites();

});