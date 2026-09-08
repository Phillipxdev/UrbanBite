

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
// ACCOUNT / SIGN IN / SIGN OUT
// ======================================================

const SESSION_KEY = "urbanBiteCurrentUser";

const signInLink =
    document.getElementById("signInLink");

const userMenu =
    document.getElementById("userMenu");

const userMenuBtn =
    document.getElementById("userMenuBtn");

const userDropdown =
    document.getElementById("userDropdown");

const navUserName =
    document.getElementById("navUserName");

const navUserEmail =
    document.getElementById("navUserEmail");

const signOutBtn =
    document.getElementById("signOutBtn");


function getLoggedInUser() {

    try {

        const savedUser =
            localStorage.getItem(SESSION_KEY) ||
            sessionStorage.getItem(SESSION_KEY);

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    } catch (error) {

        return null;
    }
}


function updateAccountNavigation() {

    const user = getLoggedInUser();


    // NOT LOGGED IN
    if (!user) {

        if (signInLink) {
            signInLink.hidden = false;
        }

        if (userMenu) {
            userMenu.hidden = true;
        }

        return;
    }


    // LOGGED IN
    if (signInLink) {
        signInLink.hidden = true;
    }

    if (userMenu) {
        userMenu.hidden = false;
    }


    // Name
    if (navUserName) {

        const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`
                .trim();

        navUserName.textContent =
            fullName || "Customer";
    }


    // Email
    if (navUserEmail) {

        navUserEmail.textContent =
            user.email || "";
    }
}


// ======================================================
// OPEN ACCOUNT DROPDOWN
// ======================================================

userMenuBtn?.addEventListener("click", event => {

    event.stopPropagation();

    userDropdown?.classList.toggle("active");

});


// ======================================================
// CLOSE DROPDOWN WHEN CLICKING OUTSIDE
// ======================================================

document.addEventListener("click", event => {

    if (
        userMenu &&
        !userMenu.contains(event.target)
    ) {

        userDropdown?.classList.remove("active");
    }

});


// ======================================================
// SIGN OUT
// ======================================================

signOutBtn?.addEventListener("click", () => {

    // Remove persistent login
    localStorage.removeItem(SESSION_KEY);

    // Remove temporary login
    sessionStorage.removeItem(SESSION_KEY);


    // DO NOT remove urbanBiteCart.
    // Customer keeps their cart.


    // Update navbar
    updateAccountNavigation();


    // Close dropdown
    userDropdown?.classList.remove("active");


    // Return to homepage
    window.location.href = "index.html";

});


// ======================================================
// INITIALIZE ACCOUNT
// ======================================================

updateAccountNavigation();

    // ==================================================
    // ELEMENTS
    // ==================================================

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    const searchBtn = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    const categoryButtons = document.querySelectorAll(".category-card");
    const foodCards = document.querySelectorAll(".food-card");

    const addCartButtons = document.querySelectorAll(".add-cart-btn");
    const cartCount = document.getElementById("cartCount");

    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    const newsletterForm = document.querySelector(".newsletter-form");


    // ==================================================
    // SHOPPING CART
    // ==================================================

    let cart = JSON.parse(localStorage.getItem("urbanBiteCart")) || [];


    // ==================================================
    // MOBILE MENU
    // ==================================================

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("active");

            const icon = menuToggle.querySelector("i");

            if (navMenu.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });


        // Close mobile menu when clicking navigation link

        const navLinks = navMenu.querySelectorAll(".nav-link");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");

                const icon = menuToggle.querySelector("i");

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            });

        });

    }


    // ==================================================
    // SEARCH OVERLAY
    // ==================================================

    if (searchBtn && searchOverlay) {

        searchBtn.addEventListener("click", () => {

            searchOverlay.classList.add("active");

            setTimeout(() => {
                searchInput?.focus();
            }, 300);

        });

    }


    if (closeSearch && searchOverlay) {

        closeSearch.addEventListener("click", () => {
            searchOverlay.classList.remove("active");
        });

    }


    // Close search when clicking outside search box

    if (searchOverlay) {

        searchOverlay.addEventListener("click", event => {

            if (event.target === searchOverlay) {
                searchOverlay.classList.remove("active");
            }

        });

    }


    // Close search with ESC key

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            searchOverlay?.classList.remove("active");

            navMenu?.classList.remove("active");

            const icon = menuToggle?.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        }

    });


    // ==================================================
    // SEARCH FOOD
    // ==================================================

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const searchValue = searchInput.value
                .toLowerCase()
                .trim();

            foodCards.forEach(card => {

                const foodName =
                    card.querySelector("h3")
                        ?.textContent
                        .toLowerCase() || "";

                const description =
                    card.querySelector("p")
                        ?.textContent
                        .toLowerCase() || "";

                if (
                    foodName.includes(searchValue) ||
                    description.includes(searchValue)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });


        // Press Enter to close search and view results

        searchInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                searchOverlay?.classList.remove("active");

                document
                    .getElementById("menu")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }

        });

    }


    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedCategory =
                button.dataset.category;

            // Remove active class

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            // Add active class

            button.classList.add("active");


            // Filter products

            foodCards.forEach(card => {

                const foodCategory =
                    card.dataset.category;

                if (
                    selectedCategory === "all" ||
                    selectedCategory === foodCategory
                ) {

                    card.style.display = "";

                    // Small animation
                    card.animate(
                        [
                            {
                                opacity: 0,
                                transform: "translateY(20px)"
                            },
                            {
                                opacity: 1,
                                transform: "translateY(0)"
                            }
                        ],
                        {
                            duration: 350,
                            easing: "ease"
                        }
                    );

                } else {

                    card.style.display = "none";

                }

            });

        });

    });


    // ==================================================
    // ADD PRODUCT TO CART
    // ==================================================

    addCartButtons.forEach(button => {

        button.addEventListener("click", () => {

            const product = {

                id: Number(button.dataset.id),

                name: button.dataset.name,

                price: Number(button.dataset.price),

                image: button.dataset.image,

                quantity: 1

            };


            addToCart(product);


            // Button animation

            const icon = button.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-plus");
                icon.classList.add("fa-check");

                setTimeout(() => {

                    icon.classList.remove("fa-check");
                    icon.classList.add("fa-plus");

                }, 1000);

            }

        });

    });


    // ==================================================
    // ADD TO CART FUNCTION
    // ==================================================

    function addToCart(product) {

        const existingProduct = cart.find(
            item => item.id === product.id
        );


        // Product already exists

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push(product);

        }


        saveCart();

        updateCartCount();

        showNotification(
            `${product.name} added to your cart`
        );

    }


    // ==================================================
    // SAVE CART
    // ==================================================

    function saveCart() {

        localStorage.setItem(
            "urbanBiteCart",
            JSON.stringify(cart)
        );

    }


    // ==================================================
    // UPDATE CART COUNTER
    // ==================================================

    function updateCartCount() {

        if (!cartCount) return;


        const totalItems = cart.reduce(
            (total, item) => {
                return total + item.quantity;
            },
            0
        );


        cartCount.textContent = totalItems;


        // Animate counter

        cartCount.animate(
            [
                {
                    transform: "scale(1)"
                },
                {
                    transform: "scale(1.5)"
                },
                {
                    transform: "scale(1)"
                }
            ],
            {
                duration: 300
            }
        );

    }


    // ==================================================
    // FAVORITE BUTTON
    // ==================================================

    favoriteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const icon = button.querySelector("i");

            if (!icon) return;


            if (icon.classList.contains("fa-regular")) {

                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");

                button.classList.add("active");

                showNotification(
                    "Added to favourites"
                );

            } else {

                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");

                button.classList.remove("active");

                showNotification(
                    "Removed from favourites"
                );

            }

        });

    });


    // ==================================================
    // NEWSLETTER
    // ==================================================

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const emailInput =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );


                if (!emailInput) return;


                const email =
                    emailInput.value.trim();


                if (email === "") {

                    showNotification(
                        "Please enter your email address"
                    );

                    return;

                }


                showNotification(
                    "Thanks for subscribing!"
                );


                emailInput.value = "";

            }
        );

    }


    // ==================================================
    // ACTIVE NAVIGATION LINK
    // ==================================================

    const sections =
        document.querySelectorAll("section[id]");

    const navLinks =
        document.querySelectorAll(".nav-link");


    window.addEventListener("scroll", () => {

        let currentSection = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                    sectionTop + sectionHeight
            ) {

                currentSection = section.id;

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");


            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ) {

                link.classList.add("active");

            }

        });

    });


    // ==================================================
    // HEADER EFFECT ON SCROLL
    // ==================================================

    const header =
        document.querySelector(".header");


    window.addEventListener("scroll", () => {

        if (!header) return;


        if (window.scrollY > 50) {

            header.style.background =
                "rgba(8, 8, 8, 0.97)";

            header.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.25)";

        } else {

            header.style.background =
                "rgba(13, 13, 13, 0.88)";

            header.style.boxShadow =
                "none";

        }

    });


    // ==================================================
    // SCROLL REVEAL ANIMATION
    // ==================================================

    const revealElements =
        document.querySelectorAll(
            ".food-card, .category-card, .step, .about-feature"
        );


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "show"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });


    // ==================================================
    // NOTIFICATION
    // ==================================================

    function showNotification(message) {

        // Remove old notification

        const existingNotification =
            document.querySelector(
                ".cart-notification"
            );


        if (existingNotification) {
            existingNotification.remove();
        }


        // Create notification

        const notification =
            document.createElement("div");


        notification.className =
            "cart-notification";


        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fa-solid fa-check"></i>
            </div>

            <span>${message}</span>
        `;


        document.body.appendChild(notification);


        // Show

        setTimeout(() => {

            notification.classList.add("show");

        }, 10);


        // Hide

        setTimeout(() => {

            notification.classList.remove("show");

            setTimeout(() => {
                notification.remove();
            }, 300);

        }, 2500);

    }


    // ==================================================
    // INITIALIZE
    // ==================================================

    updateCartCount();

});

