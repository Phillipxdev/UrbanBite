document.addEventListener("DOMContentLoaded", () => {

    const menuGrid = document.getElementById("fullMenuGrid");
    const products = Array.from(
        document.querySelectorAll(".menu-product")
    );

    const categoryButtons =
        document.querySelectorAll(".menu-category");

    const searchInput =
        document.getElementById("menuSearchInput");

    const clearSearchBtn =
        document.getElementById("clearMenuSearch");

    const navbarSearchBtn =
        document.getElementById("menuSearchBtn");

    const sortSelect =
        document.getElementById("menuSort");

    const resultCount =
        document.getElementById("menuResultCount");

    const menuTitle =
        document.getElementById("menuTitle");

    const noResults =
        document.getElementById("menuNoResults");

    const resetMenuBtn =
        document.getElementById("resetMenuBtn");

    const cartCount =
        document.getElementById("cartCount");

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");

    const favoriteButtons =
        document.querySelectorAll(".favorite-btn");

    const addCartButtons =
        document.querySelectorAll(".add-cart-btn");


    let cart =
        JSON.parse(
            localStorage.getItem("urbanBiteCart")
        ) || [];

    let favorites =
        JSON.parse(
            localStorage.getItem("urbanBiteFavorites")
        ) || [];


    let activeCategory = "all";
    let searchTerm = "";
    let currentSort = "default";


    function formatCurrency(amount) {

        return `R${Number(amount).toFixed(2)}`;
    }



    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    }


    function saveCart() {

        localStorage.setItem(
            "urbanBiteCart",
            JSON.stringify(cart)
        );

        updateCartCount();
    }

    function updateCartCount() {

        if (!cartCount) return;

        const quantity =
            cart.reduce(
                (total, item) =>
                    total + Number(item.quantity),
                0
            );

        cartCount.textContent = quantity;


        cartCount.classList.remove("cart-bump");

        void cartCount.offsetWidth;

        cartCount.classList.add("cart-bump");
    }


    addCartButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);

            const name =
                button.dataset.name;

            const price =
                Number(button.dataset.price);

            const image =
                button.dataset.image;


            if (
                !Number.isFinite(id) ||
                !name ||
                !Number.isFinite(price)
            ) {

                console.error(
                    "UrbanBite: Product information is invalid.",
                    button
                );

                return;
            }


            const existingProduct =
                cart.find(
                    product =>
                        Number(product.id) === id
                );


            if (existingProduct) {

                existingProduct.quantity =
                    Number(existingProduct.quantity) + 1;


                     existingProduct.name = name;
                     existingProduct.price = price;
                     existingProduct.image = image;

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


            animateCartButton(button);
        });
    });


    // ==================================================
    // ADD BUTTON ANIMATION
    // ==================================================

    function animateCartButton(button) {

        const originalHTML =
            button.innerHTML;


        button.innerHTML = `
            <i class="fa-solid fa-check"></i>
        `;


        button.classList.add("added");


        setTimeout(() => {

            button.innerHTML =
                originalHTML;

            button.classList.remove(
                "added"
            );

        }, 800);
    }


    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            activeCategory =
                button.dataset.category || "all";


            categoryButtons.forEach(btn => {

                btn.classList.remove("active");
            });


            button.classList.add("active");


            updateMenuTitle();

            filterProducts();
        });
    });


    // ==================================================
    // MENU TITLE
    // ==================================================

    function updateMenuTitle() {

        if (!menuTitle) return;


        const titles = {
            all: "All Meals",
            burger: "Burgers",
            pizza: "Pizza",
            chicken: "Chicken",
            drinks: "Drinks",
            dessert: "Desserts"
        };


        menuTitle.textContent =
            titles[activeCategory] ||
            "All Meals";
    }


    // ==================================================
    // SEARCH
    // ==================================================

    searchInput?.addEventListener(
        "input",
        () => {

            searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();

            filterProducts();
        }
    );


    // ==================================================
    // NAVBAR SEARCH BUTTON
    // ==================================================

    navbarSearchBtn?.addEventListener(
        "click",
        () => {

            searchInput?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            setTimeout(() => {

                searchInput?.focus();

            }, 400);
        }
    );


    // ==================================================
    // CLEAR SEARCH
    // ==================================================

    clearSearchBtn?.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value = "";
            }


            searchTerm = "";


            filterProducts();


            searchInput?.focus();
        }
    );


    // ==================================================
    // FILTER PRODUCTS
    // ==================================================

    function filterProducts() {

        let visibleCount = 0;


        products.forEach(product => {

            const category =
                product.dataset.category || "";

            const name =
                product.dataset.name
                    ?.toLowerCase() || "";

            const description =
                product
                    .querySelector(".food-content p")
                    ?.textContent
                    .toLowerCase() || "";


            // Category check

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;


            // Search check

            const matchesSearch =
                searchTerm === "" ||
                name.includes(searchTerm) ||
                description.includes(searchTerm) ||
                category.includes(searchTerm);


            const shouldShow =
                matchesCategory &&
                matchesSearch;


            if (shouldShow) {

                product.style.display = "";

                visibleCount++;

            } else {

                product.style.display = "none";
            }
        });


        updateResultCount(visibleCount);

        updateNoResults(visibleCount);
    }


    // ==================================================
    // RESULT COUNT
    // ==================================================

    function updateResultCount(count) {

        if (!resultCount) return;


        resultCount.textContent =
            count === 1
                ? "1 meal"
                : `${count} meals`;
    }


    // ==================================================
    // NO RESULTS
    // ==================================================

    function updateNoResults(count) {

        if (!noResults) return;


        noResults.hidden =
            count !== 0;


        if (menuGrid) {

            menuGrid.style.display =
                count === 0
                    ? "none"
                    : "";
        }
    }


    // ==================================================
    // RESET MENU
    // ==================================================

    resetMenuBtn?.addEventListener(
        "click",
        () => {

            activeCategory = "all";

            searchTerm = "";

            currentSort = "default";


            if (searchInput) {

                searchInput.value = "";
            }


            if (sortSelect) {

                sortSelect.value =
                    "default";
            }


            categoryButtons.forEach(
                button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.category === "all"
                    );
                }
            );


            updateMenuTitle();

            sortProducts();

            filterProducts();
        }
    );


    // ==================================================
    // SORT
    // ==================================================

    sortSelect?.addEventListener(
        "change",
        () => {

            currentSort =
                sortSelect.value;

            sortProducts();

            filterProducts();
        }
    );


    // ==================================================
    // SORT PRODUCTS
    // ==================================================

    function sortProducts() {

        if (!menuGrid) return;


        const sortedProducts =
            [...products];


        switch (currentSort) {

            // Price low to high

            case "low":

                sortedProducts.sort(
                    (a, b) =>
                        Number(a.dataset.price) -
                        Number(b.dataset.price)
                );

                break;


            // Price high to low

            case "high":

                sortedProducts.sort(
                    (a, b) =>
                        Number(b.dataset.price) -
                        Number(a.dataset.price)
                );

                break;


            // Highest rating

            case "rating":

                sortedProducts.sort(
                    (a, b) =>
                        Number(b.dataset.rating) -
                        Number(a.dataset.rating)
                );

                break;


            // Alphabetical

            case "name":

                sortedProducts.sort(
                    (a, b) => {

                        const nameA =
                            a.dataset.name || "";

                        const nameB =
                            b.dataset.name || "";


                        return nameA.localeCompare(
                            nameB
                        );
                    }
                );

                break;


            // Original HTML order

            default:

                sortedProducts.sort(
                    (a, b) => {

                        const buttonA =
                            a.querySelector(
                                ".add-cart-btn"
                            );

                        const buttonB =
                            b.querySelector(
                                ".add-cart-btn"
                            );


                        return (
                            Number(
                                buttonA?.dataset.id
                            ) -
                            Number(
                                buttonB?.dataset.id
                            )
                        );
                    }
                );
        }


        sortedProducts.forEach(product => {

            menuGrid.appendChild(product);
        });
    }


    // ==================================================
    // FAVORITES
    // ==================================================

    favoriteButtons.forEach(button => {

        const product =
            button.closest(".menu-product");


        const name =
            product?.dataset.name;


        if (!name) return;


        // Restore favorite state

        if (favorites.includes(name)) {

            setFavoriteState(
                button,
                true
            );
        }


        button.addEventListener(
            "click",
            () => {

                const isFavorite =
                    favorites.includes(name);


                if (isFavorite) {

                    favorites =
                        favorites.filter(
                            favorite =>
                                favorite !== name
                        );


                    setFavoriteState(
                        button,
                        false
                    );


                    showNotification(
                        `${name} removed from favorites`
                    );

                } else {

                    favorites.push(name);


                    setFavoriteState(
                        button,
                        true
                    );


                    showNotification(
                        `${name} added to favorites`
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
    });


    // ==================================================
    // FAVORITE UI
    // ==================================================

    function setFavoriteState(
        button,
        active
    ) {

        button.classList.toggle(
            "active",
            active
        );


        const icon =
            button.querySelector("i");


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


            const menuIsOpen =
                navMenu?.classList.contains(
                    "active"
                );


            if (menuIsOpen) {

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


    // ==================================================
    // CLOSE MOBILE MENU
    // ==================================================

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

            if (event.key === "Escape") {

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


                searchInput?.blur();
            }
        }
    );


    // ==================================================
    // HEADER SCROLL
    // ==================================================

    const header =
        document.querySelector(".header");


    function handleHeaderScroll() {

        if (!header) return;


        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    }


    window.addEventListener(
        "scroll",
        handleHeaderScroll
    );


    // ==================================================
    // NOTIFICATION
    // ==================================================

    function showNotification(message) {

        const existing =
            document.querySelector(
                ".cart-notification"
            );


        existing?.remove();


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
    // INITIALIZE
    // ==================================================

    updateCartCount();

    updateMenuTitle();

    filterProducts();

    handleHeaderScroll();

});