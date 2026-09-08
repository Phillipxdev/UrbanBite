// ======================================================
// URBANBITE - MAIN JAVASCRIPT
// script.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ELEMENTS
    // ==================================================

    const header = document.querySelector(".header");

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    const searchBtn = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    const categoryButtons =
        document.querySelectorAll(".category-card");

    const foodCards =
        document.querySelectorAll(".food-card");

    const addCartButtons =
        document.querySelectorAll(".add-cart-btn");

    const favoriteButtons =
        document.querySelectorAll(".favorite-btn");

    const cartCount =
        document.getElementById("cartCount");

    const newsletterForm =
        document.querySelector(".newsletter-form");


    // ==================================================
    // LOCAL STORAGE
    // ==================================================

    let cart =
        JSON.parse(
            localStorage.getItem("urbanBiteCart")
        ) || [];


    let favorites =
        JSON.parse(
            localStorage.getItem("urbanBiteFavorites")
        ) || [];


    // ==================================================
    // SAVE CART
    // ==================================================

    function saveCart() {

        localStorage.setItem(
            "urbanBiteCart",
            JSON.stringify(cart)
        );

        updateCartCount();
    }


    // ==================================================
    // CART COUNTER
    // ==================================================

    function updateCartCount() {

        if (!cartCount) return;

        const totalQuantity =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        cartCount.textContent =
            totalQuantity;


        // Counter animation

        cartCount.classList.remove(
            "cart-bump"
        );

        void cartCount.offsetWidth;

        cartCount.classList.add(
            "cart-bump"
        );
    }


    // ==================================================
    // ADD TO CART
    // ==================================================

    addCartButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(button.dataset.id);

                const name =
                    button.dataset.name;

                const price =
                    Number(button.dataset.price);

                /*
                 * IMPORTANT:
                 *
                 * Your current data-image paths do not match
                 * some of your visible <img> paths.
                 *
                 * This code first tries to use the actual image
                 * displayed inside the food card.
                 */

                const foodCard =
                    button.closest(".food-card");

                const displayedImage =
                    foodCard?.querySelector(
                        ".food-image img"
                    );


                const image =
                    displayedImage?.getAttribute("src") ||
                    button.dataset.image ||
                    "";


                if (
                    !id ||
                    !name ||
                    Number.isNaN(price)
                ) {

                    console.error(
                        "UrbanBite: Invalid product data.",
                        button
                    );

                    return;
                }


                const existingProduct =
                    cart.find(
                        item => item.id === id
                    );


                if (existingProduct) {

                    existingProduct.quantity++;

                } else {

                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }


                saveCart();


                showNotification(
                    `${name} added to your cart`
                );


                animateAddButton(button);
            }
        );
    });


    // ==================================================
    // ADD BUTTON ANIMATION
    // ==================================================

    function animateAddButton(button) {

        const originalHTML =
            button.innerHTML;


        button.innerHTML =
            `<i class="fa-solid fa-check"></i>`;


        button.classList.add(
            "added"
        );


        setTimeout(() => {

            button.innerHTML =
                originalHTML;

            button.classList.remove(
                "added"
            );

        }, 900);
    }


    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;


                // Active category

                categoryButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );
                });


                button.classList.add(
                    "active"
                );


                // Filter products

                foodCards.forEach(card => {

                    const productCategory =
                        card.dataset.category;


                    const shouldShow =
                        category === "all" ||
                        productCategory === category;


                    if (shouldShow) {

                        card.style.display =
                            "block";


                        requestAnimationFrame(
                            () => {

                                card.style.opacity =
                                    "1";

                                card.style.transform =
                                    "translateY(0)";
                            }
                        );

                    } else {

                        card.style.opacity =
                            "0";

                        card.style.transform =
                            "translateY(15px)";


                        setTimeout(() => {

                            card.style.display =
                                "none";

                        }, 200);
                    }
                });


                // Move to menu

                document
                    .getElementById("menu")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }
        );
    });


    // ==================================================
    // SEARCH OPEN
    // ==================================================

    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            () => {

                searchOverlay?.classList.add(
                    "active"
                );


                document.body.style.overflow =
                    "hidden";


                setTimeout(() => {

                    searchInput?.focus();

                }, 200);
            }
        );
    }


    // ==================================================
    // SEARCH CLOSE
    // ==================================================

    function closeSearchOverlay() {

        searchOverlay?.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";
    }


    closeSearch?.addEventListener(
        "click",
        closeSearchOverlay
    );


    // Click outside search box

    searchOverlay?.addEventListener(
        "click",
        event => {

            if (
                event.target === searchOverlay
            ) {

                closeSearchOverlay();
            }
        }
    );


    // ==================================================
    // SEARCH FOOD
    // ==================================================

    searchInput?.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            foodCards.forEach(card => {

                const title =
                    card
                        .querySelector("h3")
                        ?.textContent
                        .toLowerCase() || "";


                const description =
                    card
                        .querySelector(
                            ".food-content p"
                        )
                        ?.textContent
                        .toLowerCase() || "";


                const category =
                    card.dataset.category
                        ?.toLowerCase() || "";


                const matches =
                    title.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    category.includes(searchTerm);


                card.style.display =
                    matches
                        ? "block"
                        : "none";
            });
        }
    );


    // Press Enter while searching

    searchInput?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                closeSearchOverlay();


                document
                    .getElementById("menu")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        }
    );


    // ==================================================
    // FAVORITES
    // ==================================================

    favoriteButtons.forEach(
        (button, index) => {

            const card =
                button.closest(".food-card");

            const productName =
                card
                    ?.querySelector("h3")
                    ?.textContent
                    .trim();


            if (
                productName &&
                favorites.includes(productName)
            ) {

                setFavoriteState(
                    button,
                    true
                );
            }


            button.addEventListener(
                "click",
                () => {

                    if (!productName) return;


                    const isFavorite =
                        favorites.includes(
                            productName
                        );


                    if (isFavorite) {

                        favorites =
                            favorites.filter(
                                item =>
                                    item !==
                                    productName
                            );


                        setFavoriteState(
                            button,
                            false
                        );


                        showNotification(
                            `${productName} removed from favorites`
                        );

                    } else {

                        favorites.push(
                            productName
                        );


                        setFavoriteState(
                            button,
                            true
                        );


                        showNotification(
                            `${productName} added to favorites`
                        );
                    }


                    localStorage.setItem(
                        "urbanBiteFavorites",
                        JSON.stringify(
                            favorites
                        )
                    );
                }
            );
        }
    );


    function setFavoriteState(
        button,
        active
    ) {

        const icon =
            button.querySelector("i");


        button.classList.toggle(
            "active",
            active
        );


        if (!icon) return;


        if (active) {

            icon.classList.remove(
                "fa-regular"
            );

            icon.classList.add(
                "fa-solid"
            );

        } else {

            icon.classList.remove(
                "fa-solid"
            );

            icon.classList.add(
                "fa-regular"
            );
        }
    }


    // ==================================================
    // MOBILE NAVIGATION
    // ==================================================

    menuToggle?.addEventListener(
        "click",
        () => {

            navMenu?.classList.toggle(
                "active"
            );


            const icon =
                menuToggle.querySelector("i");


            if (
                navMenu?.classList.contains(
                    "active"
                )
            ) {

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


    // Close mobile navigation after clicking link

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navMenu?.classList.remove(
                    "active"
                );


                const icon =
                    menuToggle?.querySelector(
                        "i"
                    );


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
    // SMOOTH SCROLL
    // ==================================================

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute("href");


                    if (
                        !href ||
                        href === "#"
                    ) {

                        return;
                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) return;


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        });


    // ==================================================
    // ACTIVE NAV LINK
    // ==================================================

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    function updateActiveNavigation() {

        const scrollPosition =
            window.scrollY + 180;


        sections.forEach(section => {

            const top =
                section.offsetTop;

            const height =
                section.offsetHeight;

            const id =
                section.getAttribute("id");


            if (
                scrollPosition >= top &&
                scrollPosition <
                top + height
            ) {

                navLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );


                    if (
                        link.getAttribute(
                            "href"
                        ) === `#${id}`
                    ) {

                        link.classList.add(
                            "active"
                        );
                    }
                });
            }
        });
    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );


    // ==================================================
    // HEADER SCROLL EFFECT
    // ==================================================

    function updateHeader() {

        if (!header) return;


        if (window.scrollY > 40) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );
        }
    }


    window.addEventListener(
        "scroll",
        updateHeader
    );


    // ==================================================
    // NEWSLETTER
    // ==================================================

    newsletterForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const emailInput =
                newsletterForm.querySelector(
                    'input[type="email"]'
                );


            const email =
                emailInput?.value.trim();


            if (!email) return;


            showNotification(
                "Thanks for subscribing to UrbanBite!"
            );


            newsletterForm.reset();
        }
    );


    // ==================================================
    // SCROLL REVEAL
    // ==================================================

    const revealElements =
        document.querySelectorAll(
            ".food-card, " +
            ".category-card, " +
            ".step, " +
            ".about-feature, " +
            ".promotion-container, " +
            ".newsletter-box"
        );


    revealElements.forEach(element => {

        element.classList.add(
            "reveal"
        );
    });


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList.add(
                                    "show"
                                );


                            observer.unobserve(
                                entry.target
                            );
                        }
                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "show"
                );
            }
        );
    }


    // ==================================================
    // TOAST NOTIFICATION
    // ==================================================

    function showNotification(message) {

        const oldNotification =
            document.querySelector(
                ".cart-notification"
            );


        oldNotification?.remove();


        const notification =
            document.createElement("div");


        notification.className =
            "cart-notification";


        notification.innerHTML = `

            <div class="notification-icon">

                <i class="fa-solid fa-check"></i>

            </div>

            <span>
                ${escapeHTML(message)}
            </span>
        `;


        document.body.appendChild(
            notification
        );


        requestAnimationFrame(() => {

            notification.classList.add(
                "show"
            );
        });


        setTimeout(() => {

            notification.classList.remove(
                "show"
            );


            setTimeout(() => {

                notification.remove();

            }, 300);

        }, 2500);
    }


    // ==================================================
    // ESCAPE HTML
    // ==================================================

    function escapeHTML(value) {

        const element =
            document.createElement("div");


        element.textContent =
            value ?? "";


        return element.innerHTML;
    }


    // ==================================================
    // ESCAPE KEY
    // ==================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            closeSearchOverlay();


            navMenu?.classList.remove(
                "active"
            );


            const icon =
                menuToggle?.querySelector(
                    "i"
                );


            icon?.classList.remove(
                "fa-xmark"
            );

            icon?.classList.add(
                "fa-bars"
            );
        }
    );


    // ==================================================
    // INITIALIZE
    // ==================================================

    updateCartCount();

    updateHeader();

    updateActiveNavigation();

});