document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ELEMENTS
    // ==================================================

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");

    const cartCount = document.getElementById("cartCount");
    const cartItemText = document.getElementById("cartItemText");

    const subtotalElement = document.getElementById("subtotal");
    const deliveryFeeElement = document.getElementById("deliveryFee");
    const discountElement = document.getElementById("discount");
    const discountRow = document.getElementById("discountRow");
    const totalElement = document.getElementById("total");

    const clearCartBtn = document.getElementById("clearCartBtn");
    const clearCartModal = document.getElementById("clearCartModal");

    const cancelClearBtn = document.getElementById("cancelClearBtn");
    const confirmClearBtn = document.getElementById("confirmClearBtn");

    const promoInput = document.getElementById("promoInput");
    const applyPromoBtn = document.getElementById("applyPromoBtn");
    const promoMessage = document.getElementById("promoMessage");

    const checkoutBtn = document.getElementById("checkoutBtn");

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");


    // ==================================================
    // SETTINGS
    // ==================================================

    const DELIVERY_FEE = 35;
    const FREE_DELIVERY_MINIMUM = 300;

    const PROMO_CODE = "BURGER20";
    const PROMO_PERCENTAGE = 20;


    // ==================================================
    // CART DATA
    // ==================================================

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem("urbanBiteCart")
            ) || [];

    } catch (error) {

        console.error(
            "Unable to load cart:",
            error
        );

        cart = [];
    }


    let promoApplied = false;


    // ==================================================
    // FORMAT CURRENCY
    // ==================================================

    function formatCurrency(amount) {

        const number = Number(amount) || 0;

        return `R${number.toFixed(2)}`;

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
    // GET CURRENT USER
    // ==================================================

    function getCurrentUser() {

        try {

            const savedUser =
                localStorage.getItem(
                    "urbanBiteCurrentUser"
                ) ||
                sessionStorage.getItem(
                    "urbanBiteCurrentUser"
                );

            if (!savedUser) {

                return null;

            }

            return JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "Unable to read login session:",
                error
            );

            return null;
        }

    }


    // ==================================================
    // TOTAL CART QUANTITY
    // ==================================================

    function getTotalQuantity() {

        return cart.reduce(
            (total, item) => {

                return total +
                    (Number(item.quantity) || 0);

            },
            0
        );

    }


    // ==================================================
    // UPDATE CART COUNTER
    // ==================================================

    function updateCartCounter() {

        const quantity =
            getTotalQuantity();


        if (cartCount) {

            cartCount.textContent =
                quantity;

        }


        if (cartItemText) {

            cartItemText.textContent =
                quantity === 1
                    ? "1 item in your cart"
                    : `${quantity} items in your cart`;

        }

    }


    // ==================================================
    // CALCULATE SUBTOTAL
    // ==================================================

    function calculateSubtotal() {

        return cart.reduce(
            (total, item) => {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                return total +
                    price * quantity;

            },
            0
        );

    }


    // ==================================================
    // CALCULATE DISCOUNT
    // ==================================================

    function calculateDiscount() {

        if (!promoApplied) {

            return 0;

        }


        const burgerSubtotal =
            cart.reduce(
                (total, item) => {

                    const name =
                        String(
                            item.name || ""
                        ).toLowerCase();

                    if (
                        name.includes("burger")
                    ) {

                        return total +
                            (
                                Number(item.price) ||
                                0
                            ) *
                            (
                                Number(item.quantity) ||
                                0
                            );

                    }

                    return total;

                },
                0
            );


        return burgerSubtotal *
            (PROMO_PERCENTAGE / 100);

    }


    // ==================================================
    // CALCULATE DELIVERY
    // ==================================================

    function calculateDelivery(subtotal) {

        if (subtotal === 0) {

            return 0;

        }


        if (
            subtotal >=
            FREE_DELIVERY_MINIMUM
        ) {

            return 0;

        }


        return DELIVERY_FEE;

    }


    // ==================================================
    // UPDATE ORDER SUMMARY
    // ==================================================

    function updateSummary() {

        const subtotal =
            calculateSubtotal();

        const discount =
            calculateDiscount();

        const delivery =
            calculateDelivery(subtotal);

        const total =
            Math.max(
                0,
                subtotal +
                delivery -
                discount
            );


        if (subtotalElement) {

            subtotalElement.textContent =
                formatCurrency(subtotal);

        }


        if (deliveryFeeElement) {

            if (
                subtotal >=
                    FREE_DELIVERY_MINIMUM &&
                subtotal > 0
            ) {

                deliveryFeeElement.textContent =
                    "FREE";

            } else {

                deliveryFeeElement.textContent =
                    formatCurrency(delivery);

            }

        }


        if (discountElement) {

            discountElement.textContent =
                `-${formatCurrency(discount)}`;

        }


        if (discountRow) {

            discountRow.style.display =
                discount > 0
                    ? "flex"
                    : "none";

        }


        if (totalElement) {

            totalElement.textContent =
                formatCurrency(total);

        }


        // Save order summary for checkout page

        const orderSummary = {

            subtotal,
            delivery,
            discount,
            total

        };


        localStorage.setItem(
            "urbanBiteOrderSummary",
            JSON.stringify(orderSummary)
        );

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
    // RENDER CART
    // ==================================================

    function renderCart() {

        if (!cartItems) {

            return;

        }


        cartItems.innerHTML = "";


        // ----------------------------------------------
        // EMPTY CART
        // ----------------------------------------------

        if (cart.length === 0) {

            if (emptyCart) {

                emptyCart.style.display =
                    "flex";

            }


            if (clearCartBtn) {

                clearCartBtn.style.display =
                    "none";

            }


            if (checkoutBtn) {

                checkoutBtn.classList.add(
                    "disabled"
                );

            }


            updateCartCounter();
            updateSummary();

            return;

        }


        // ----------------------------------------------
        // CART HAS PRODUCTS
        // ----------------------------------------------

        if (emptyCart) {

            emptyCart.style.display =
                "none";

        }


        if (clearCartBtn) {

            clearCartBtn.style.display =
                "inline-flex";

        }


        if (checkoutBtn) {

            checkoutBtn.classList.remove(
                "disabled"
            );

        }


        // ----------------------------------------------
        // CREATE PRODUCT CARDS
        // ----------------------------------------------

        cart.forEach(item => {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "cart-item";


            const itemPrice =
                Number(item.price) || 0;

            const itemQuantity =
                Number(item.quantity) || 1;


            article.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                    >

                </div>


                <div class="cart-item-info">

                    <div class="cart-item-top">

                        <div>

                            <span class="cart-food-label">
                                Freshly Prepared
                            </span>

                            <h3>
                                ${escapeHTML(item.name)}
                            </h3>

                            <p class="cart-unit-price">
                                ${formatCurrency(itemPrice)}
                                each
                            </p>

                        </div>


                        <button
                            class="remove-item-btn"
                            data-id="${item.id}"
                            type="button"
                            aria-label="Remove ${escapeHTML(item.name)}"
                        >

                            <i class="fa-regular fa-trash-can"></i>

                        </button>

                    </div>


                    <div class="cart-item-bottom">

                        <div class="quantity-control">

                            <button
                                class="quantity-btn decrease-btn"
                                data-id="${item.id}"
                                type="button"
                                aria-label="Decrease quantity"
                            >

                                <i class="fa-solid fa-minus"></i>

                            </button>


                            <span>
                                ${itemQuantity}
                            </span>


                            <button
                                class="quantity-btn increase-btn"
                                data-id="${item.id}"
                                type="button"
                                aria-label="Increase quantity"
                            >

                                <i class="fa-solid fa-plus"></i>

                            </button>

                        </div>


                        <strong class="cart-item-total">

                            ${formatCurrency(
                                itemPrice *
                                itemQuantity
                            )}

                        </strong>

                    </div>

                </div>

            `;


            cartItems.appendChild(
                article
            );

        });


        addCartEventListeners();

        updateCartCounter();

        updateSummary();

    }


    // ==================================================
    // CART BUTTON EVENTS
    // ==================================================

    function addCartEventListeners() {

        const increaseButtons =
            document.querySelectorAll(
                ".increase-btn"
            );

        const decreaseButtons =
            document.querySelectorAll(
                ".decrease-btn"
            );

        const removeButtons =
            document.querySelectorAll(
                ".remove-item-btn"
            );


        // Increase quantity

        increaseButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );

                        increaseQuantity(id);

                    }
                );

            }
        );


        // Decrease quantity

        decreaseButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );

                        decreaseQuantity(id);

                    }
                );

            }
        );


        // Remove product

        removeButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );

                        removeItem(id);

                    }
                );

            }
        );

    }


    // ==================================================
    // INCREASE QUANTITY
    // ==================================================

    function increaseQuantity(id) {

        const product =
            cart.find(
                item =>
                    Number(item.id) === id
            );


        if (!product) {

            return;

        }


        product.quantity =
            (Number(product.quantity) || 0) + 1;


        saveCart();

        renderCart();

    }


    // ==================================================
    // DECREASE QUANTITY
    // ==================================================

    function decreaseQuantity(id) {

        const product =
            cart.find(
                item =>
                    Number(item.id) === id
            );


        if (!product) {

            return;

        }


        if (
            Number(product.quantity) > 1
        ) {

            product.quantity--;

        } else {

            cart =
                cart.filter(
                    item =>
                        Number(item.id) !== id
                );

        }


        saveCart();

        renderCart();

    }


    // ==================================================
    // REMOVE PRODUCT
    // ==================================================

    function removeItem(id) {

        const product =
            cart.find(
                item =>
                    Number(item.id) === id
            );


        cart =
            cart.filter(
                item =>
                    Number(item.id) !== id
            );


        saveCart();

        renderCart();


        if (product) {

            showNotification(
                `${product.name} removed from cart`
            );

        }

    }


    // ==================================================
    // CLEAR CART
    // ==================================================

    if (clearCartBtn) {

        clearCartBtn.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    return;

                }


                clearCartModal
                    ?.classList.add(
                        "active"
                    );

            }
        );

    }


    // ==================================================
    // CANCEL CLEAR CART
    // ==================================================

    if (cancelClearBtn) {

        cancelClearBtn.addEventListener(
            "click",
            () => {

                clearCartModal
                    ?.classList.remove(
                        "active"
                    );

            }
        );

    }


    // ==================================================
    // CONFIRM CLEAR CART
    // ==================================================

    if (confirmClearBtn) {

        confirmClearBtn.addEventListener(
            "click",
            () => {

                cart = [];

                promoApplied = false;


                saveCart();


                localStorage.removeItem(
                    "urbanBitePromo"
                );


                clearCartModal
                    ?.classList.remove(
                        "active"
                    );


                renderCart();


                showNotification(
                    "Your cart has been cleared"
                );

            }
        );

    }


    // ==================================================
    // CLOSE MODAL FROM BACKGROUND
    // ==================================================

    if (clearCartModal) {

        clearCartModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    clearCartModal
                ) {

                    clearCartModal
                        .classList.remove(
                            "active"
                        );

                }

            }
        );

    }


    // ==================================================
    // PROMO BUTTON
    // ==================================================

    if (applyPromoBtn) {

        applyPromoBtn.addEventListener(
            "click",
            applyPromoCode
        );

    }


    // ==================================================
    // PROMO ENTER KEY
    // ==================================================

    if (promoInput) {

        promoInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    applyPromoCode();

                }

            }
        );

    }


    // ==================================================
    // APPLY PROMO CODE
    // ==================================================

    function applyPromoCode() {

        if (!promoInput) {

            return;

        }


        const code =
            promoInput.value
                .trim()
                .toUpperCase();


        // Empty cart

        if (cart.length === 0) {

            setPromoMessage(
                "Add items to your cart first.",
                "error"
            );

            return;

        }


        // Empty promo input

        if (code === "") {

            setPromoMessage(
                "Enter a promo code.",
                "error"
            );

            return;

        }


        // Wrong promo code

        if (code !== PROMO_CODE) {

            promoApplied = false;


            localStorage.removeItem(
                "urbanBitePromo"
            );


            setPromoMessage(
                "That promo code is not valid.",
                "error"
            );


            updateSummary();

            return;

        }


        // Check for burger

        const containsBurger =
            cart.some(
                item => {

                    const name =
                        String(
                            item.name || ""
                        ).toLowerCase();

                    return name.includes(
                        "burger"
                    );

                }
            );


        if (!containsBurger) {

            promoApplied = false;


            localStorage.removeItem(
                "urbanBitePromo"
            );


            setPromoMessage(
                "BURGER20 only applies to burgers.",
                "error"
            );


            updateSummary();

            return;

        }


        // Promo successful

        promoApplied = true;


        localStorage.setItem(
            "urbanBitePromo",
            PROMO_CODE
        );


        setPromoMessage(
            "BURGER20 applied! You saved 20% on burgers.",
            "success"
        );


        updateSummary();

    }


    // ==================================================
    // PROMO MESSAGE
    // ==================================================

    function setPromoMessage(
        message,
        type
    ) {

        if (!promoMessage) {

            return;

        }


        promoMessage.textContent =
            message;


        promoMessage.classList.remove(
            "success",
            "error"
        );


        promoMessage.classList.add(
            type
        );

    }


    // ==================================================
    // RESTORE PROMO
    // ==================================================

    function restorePromo() {

        const savedPromo =
            localStorage.getItem(
                "urbanBitePromo"
            );


        if (
            savedPromo !== PROMO_CODE
        ) {

            return;

        }


        const containsBurger =
            cart.some(
                item => {

                    const name =
                        String(
                            item.name || ""
                        ).toLowerCase();

                    return name.includes(
                        "burger"
                    );

                }
            );


        if (!containsBurger) {

            localStorage.removeItem(
                "urbanBitePromo"
            );

            promoApplied = false;

            return;

        }


        promoApplied = true;


        if (promoInput) {

            promoInput.value =
                PROMO_CODE;

        }


        setPromoMessage(
            "BURGER20 is active.",
            "success"
        );

    }


    // ==================================================
    // CHECKOUT
    // ==================================================

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                // --------------------------------------
                // EMPTY CART
                // --------------------------------------

                if (cart.length === 0) {

                    showNotification(
                        "Your cart is empty"
                    );

                    return;

                }


                // Save latest order totals

                updateSummary();


                // --------------------------------------
                // CHECK LOGIN
                // --------------------------------------

                const currentUser =
                    getCurrentUser();


                // --------------------------------------
                // NOT LOGGED IN
                // --------------------------------------

                if (!currentUser) {

                    sessionStorage.setItem(
                        "urbanBiteRedirectAfterLogin",
                        "checkout.html"
                    );


                    window.location.href =
                        "signin.html";

                    return;

                }


                // --------------------------------------
                // LOGGED IN
                // --------------------------------------

                window.location.href =
                    "checkout.html";

            }
        );

    }


    // ==================================================
    // MOBILE NAVIGATION
    // ==================================================

    if (
        menuToggle &&
        navMenu
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                navMenu.classList.toggle(
                    "active"
                );


                const icon =
                    menuToggle.querySelector(
                        "i"
                    );


                if (
                    navMenu.classList.contains(
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

    }


    // ==================================================
    // ESCAPE KEY
    // ==================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            clearCartModal
                ?.classList.remove(
                    "active"
                );


            navMenu
                ?.classList.remove(
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
    // NOTIFICATION
    // ==================================================

    function showNotification(message) {

        const existing =
            document.querySelector(
                ".cart-notification"
            );


        existing?.remove();


        const notification =
            document.createElement(
                "div"
            );


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


        requestAnimationFrame(
            () => {

                notification.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );


                setTimeout(
                    () => {

                        notification.remove();

                    },
                    300
                );

            },
            2500
        );

    }


    // ==================================================
    // INITIALIZE CART
    // ==================================================

    restorePromo();

    renderCart();

});