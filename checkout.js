// ======================================================
// URBANBITE RESTAURANT E-COMMERCE
// checkout.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    // ======================================================
// CHECKOUT LOGIN SECURITY
// ======================================================

const SESSION_KEY = "urbanBiteCurrentUser";

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


// Customer MUST be logged in to access checkout

const currentUser = getCurrentUser();

if (!currentUser) {

    sessionStorage.setItem(
        "urbanBiteRedirectAfterLogin",
        "checkout.html"
    );

    window.location.replace("signin.html");

    return;
}

// ==================================================
// AUTO-FILL LOGGED-IN CUSTOMER DETAILS
// ==================================================

function fillCustomerDetails(user) {

    if (!user) return;

    const firstNameInput =
        document.getElementById("firstName");

    const lastNameInput =
        document.getElementById("lastName");

    const emailInput =
        document.getElementById("email");

    const phoneInput =
        document.getElementById("phone");


    if (firstNameInput) {
        firstNameInput.value =
            user.firstName || "";
    }


    if (lastNameInput) {
        lastNameInput.value =
            user.lastName || "";
    }


    if (emailInput) {
        emailInput.value =
            user.email || "";
    }


    if (phoneInput) {
        phoneInput.value =
            user.phone || "";
    }
}


// Fill checkout form with signed-in account
fillCustomerDetails(currentUser);


    // ==================================================
    // ELEMENTS
    // ==================================================

    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutItems = document.getElementById("checkoutItems");

    const subtotalElement = document.getElementById("checkoutSubtotal");
    const deliveryElement = document.getElementById("checkoutDelivery");
    const discountElement = document.getElementById("checkoutDiscount");
    const discountRow = document.getElementById("checkoutDiscountRow");
    const totalElement = document.getElementById("checkoutTotal");

    const cartCount = document.getElementById("cartCount");

    const deliveryOptions =
        document.querySelectorAll(".delivery-option");

    const deliveryInputs =
        document.querySelectorAll('input[name="deliveryMethod"]');

    const paymentOptions =
        document.querySelectorAll(".payment-option");

    const paymentInputs =
        document.querySelectorAll('input[name="paymentMethod"]');

    const cardDetails = document.getElementById("cardDetails");

    const cardName = document.getElementById("cardName");
    const cardNumber = document.getElementById("cardNumber");
    const expiry = document.getElementById("expiry");
    const cvv = document.getElementById("cvv");

    const placeOrderBtn = document.getElementById("placeOrderBtn");

    const successModal = document.getElementById("orderSuccessModal");
    const orderNumberElement = document.getElementById("orderNumber");

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
    // LOAD CART
    // ==================================================

    let cart =
        JSON.parse(
            localStorage.getItem("urbanBiteCart")
        ) || [];


    // ==================================================
    // FORMAT CURRENCY
    // ==================================================

    function formatCurrency(amount) {
        return `R${Number(amount).toFixed(2)}`;
    }


    // ==================================================
    // ESCAPE HTML
    // ==================================================

    function escapeHTML(value) {

        const element = document.createElement("div");

        element.textContent = value ?? "";

        return element.innerHTML;
    }


    // ==================================================
    // CART QUANTITY
    // ==================================================

    function getTotalQuantity() {

        return cart.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );
    }


    // ==================================================
    // UPDATE CART COUNTER
    // ==================================================

    function updateCartCount() {

        if (!cartCount) return;

        cartCount.textContent = getTotalQuantity();
    }


    // ==================================================
    // SUBTOTAL
    // ==================================================

    function calculateSubtotal() {

        return cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );
    }


    // ==================================================
    // DISCOUNT
    // ==================================================

    function calculateDiscount() {

        const savedPromo =
            localStorage.getItem("urbanBitePromo");

        if (savedPromo !== PROMO_CODE) {
            return 0;
        }

        // BURGER20 only applies to burger products.

        const burgerSubtotal =
            cart.reduce((total, item) => {

                const name =
                    String(item.name)
                        .toLowerCase();

                if (name.includes("burger")) {

                    return total +
                        Number(item.price) *
                        Number(item.quantity);
                }

                return total;

            }, 0);


        return burgerSubtotal *
            (PROMO_PERCENTAGE / 100);
    }


    // ==================================================
    // DELIVERY METHOD
    // ==================================================

    function getDeliveryMethod() {

        const selected =
            document.querySelector(
                'input[name="deliveryMethod"]:checked'
            );

        return selected
            ? selected.value
            : "standard";
    }


    // ==================================================
    // DELIVERY FEE
    // ==================================================

    function calculateDelivery(subtotal) {

        const method = getDeliveryMethod();

        // Restaurant pickup is free.

        if (method === "pickup") {
            return 0;
        }

        // No cart = no delivery.

        if (subtotal <= 0) {
            return 0;
        }

        // Free delivery over R300.

        if (subtotal >= FREE_DELIVERY_MINIMUM) {
            return 0;
        }

        return DELIVERY_FEE;
    }


    // ==================================================
    // RENDER CHECKOUT PRODUCTS
    // ==================================================

    function renderCheckoutItems() {

        if (!checkoutItems) return;

        checkoutItems.innerHTML = "";


        // Prevent checkout with empty cart.

        if (cart.length === 0) {

            checkoutItems.innerHTML = `
                <div class="checkout-empty">
                    <i class="fa-solid fa-bag-shopping"></i>

                    <p>
                        Your cart is empty.
                    </p>

                    <a href="index.html#menu">
                        Browse Menu
                    </a>
                </div>
            `;

            if (placeOrderBtn) {
                placeOrderBtn.disabled = true;
            }

            updateTotals();

            return;
        }


        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
        }


        cart.forEach(item => {

            const product =
                document.createElement("div");

            product.className =
                "checkout-product";


            product.innerHTML = `

                <div class="checkout-product-image">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                    >

                    <span class="checkout-product-quantity">
                        ${Number(item.quantity)}
                    </span>

                </div>


                <div class="checkout-product-info">

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <span>
                        ${Number(item.quantity)}
                        ×
                        ${formatCurrency(item.price)}
                    </span>

                </div>


                <strong class="checkout-product-price">

                    ${formatCurrency(
                        Number(item.price) *
                        Number(item.quantity)
                    )}

                </strong>
            `;


            checkoutItems.appendChild(product);
        });
    }


    // ==================================================
    // UPDATE TOTALS
    // ==================================================

    function updateTotals() {

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


        if (deliveryElement) {

            if (
                subtotal > 0 &&
                delivery === 0
            ) {

                deliveryElement.textContent =
                    "FREE";

            } else {

                deliveryElement.textContent =
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


        // Save latest summary.

        localStorage.setItem(
            "urbanBiteOrderSummary",
            JSON.stringify({
                subtotal,
                delivery,
                discount,
                total
            })
        );
    }


    // ==================================================
    // DELIVERY OPTION
    // ==================================================

    deliveryInputs.forEach(input => {

        input.addEventListener("change", () => {

            deliveryOptions.forEach(option => {

                option.classList.remove("active");
            });


            const selectedOption =
                input.closest(".delivery-option");


            selectedOption?.classList.add("active");


            updateTotals();
        });
    });


    // ==================================================
    // PAYMENT OPTION
    // ==================================================

    paymentInputs.forEach(input => {

        input.addEventListener("change", () => {

            paymentOptions.forEach(option => {

                option.classList.remove("active");
            });


            const selectedOption =
                input.closest(".payment-option");


            selectedOption?.classList.add("active");


            updatePaymentFields();
        });
    });


    // ==================================================
    // PAYMENT FIELDS
    // ==================================================

    function updatePaymentFields() {

        const selected =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        const paymentMethod =
            selected
                ? selected.value
                : "card";


        if (paymentMethod === "card") {

            if (cardDetails) {

                cardDetails.style.display =
                    "block";
            }


            if (cardName) {
                cardName.required = true;
            }

            if (cardNumber) {
                cardNumber.required = true;
            }

            if (expiry) {
                expiry.required = true;
            }

            if (cvv) {
                cvv.required = true;
            }

        } else {

            if (cardDetails) {

                cardDetails.style.display =
                    "none";
            }


            if (cardName) {
                cardName.required = false;
            }

            if (cardNumber) {
                cardNumber.required = false;
            }

            if (expiry) {
                expiry.required = false;
            }

            if (cvv) {
                cvv.required = false;
            }
        }
    }


    // ==================================================
    // CARD NUMBER FORMATTING
    // ==================================================

    if (cardNumber) {

        cardNumber.addEventListener("input", event => {

            let value =
                event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 16);


            value =
                value.replace(
                    /(\d{4})(?=\d)/g,
                    "$1 "
                );


            event.target.value = value;
        });
    }


    // ==================================================
    // EXPIRY FORMATTING
    // ==================================================

    if (expiry) {

        expiry.addEventListener("input", event => {

            let value =
                event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4);


            if (value.length >= 3) {

                value =
                    `${value.slice(0, 2)}/${value.slice(2)}`;
            }


            event.target.value = value;
        });
    }


    // ==================================================
    // CVV NUMBERS ONLY
    // ==================================================

    if (cvv) {

        cvv.addEventListener("input", event => {

            event.target.value =
                event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4);
        });
    }


    // ==================================================
    // PHONE FORMATTING
    // ==================================================

    const phone =
        document.getElementById("phone");


    if (phone) {

        phone.addEventListener("input", event => {

            event.target.value =
                event.target.value
                    .replace(/[^\d+\s]/g, "")
                    .slice(0, 16);
        });
    }


    // ==================================================
    // POSTAL CODE
    // ==================================================

    const postalCode =
        document.getElementById("postalCode");


    if (postalCode) {

        postalCode.addEventListener("input", event => {

            event.target.value =
                event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4);
        });
    }


    // ==================================================
    // VALIDATE CARD
    // ==================================================

    function validateCard() {

        const selectedPayment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        if (
            !selectedPayment ||
            selectedPayment.value !== "card"
        ) {

            return true;
        }


        const number =
            cardNumber
                ?.value
                .replace(/\s/g, "") || "";


        const expiryValue =
            expiry?.value || "";


        const cvvValue =
            cvv?.value || "";


        if (number.length !== 16) {

            showNotification(
                "Please enter a valid 16-digit card number.",
                "error"
            );

            cardNumber?.focus();

            return false;
        }


        if (!/^\d{2}\/\d{2}$/.test(expiryValue)) {

            showNotification(
                "Enter the expiry date as MM/YY.",
                "error"
            );

            expiry?.focus();

            return false;
        }


        const [month, year] =
            expiryValue
                .split("/")
                .map(Number);


        if (month < 1 || month > 12) {

            showNotification(
                "Please enter a valid expiry month.",
                "error"
            );

            expiry?.focus();

            return false;
        }


        const now = new Date();

        const currentYear =
            Number(
                String(
                    now.getFullYear()
                ).slice(-2)
            );

        const currentMonth =
            now.getMonth() + 1;


        if (
            year < currentYear ||
            (
                year === currentYear &&
                month < currentMonth
            )
        ) {

            showNotification(
                "This card has expired.",
                "error"
            );

            expiry?.focus();

            return false;
        }


        if (!/^\d{3,4}$/.test(cvvValue)) {

            showNotification(
                "Please enter a valid CVV.",
                "error"
            );

            cvv?.focus();

            return false;
        }


        return true;
    }
// ==================================================
// CHECKOUT FORM
// ==================================================

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            // Empty cart
            if (cart.length === 0) {

                showNotification(
                    "Your cart is empty.",
                    "error"
                );

                return;
            }

            // Browser required field validation
            if (!checkoutForm.checkValidity()) {

                checkoutForm.reportValidity();

                return;
            }

            // Validate card
            if (!validateCard()) {
                return;
            }

            // Place order
            placeOrder();
        }
    );
}


// ==================================================
// PLACE ORDER
// ==================================================

function placeOrder() {

    // Security check
    const loggedInUser = getCurrentUser();

    if (!loggedInUser) {

        sessionStorage.setItem(
            "urbanBiteRedirectAfterLogin",
            "checkout.html"
        );

        window.location.href = "signin.html";

        return;
    }

    const formData =
        new FormData(checkoutForm);

    const summary =
        JSON.parse(
            localStorage.getItem(
                "urbanBiteOrderSummary"
            )
        ) || {};

    const orderNumber =
        generateOrderNumber();

    const order = {

        orderNumber,

        // Link order to logged-in account
        userId: loggedInUser.id,

        accountEmail: loggedInUser.email,

        customer: {

            firstName:
                formData.get("firstName"),

            lastName:
                formData.get("lastName"),

            email:
                formData.get("email"),

            phone:
                formData.get("phone")
        },

        address: {

            street:
                formData.get("address"),

            suburb:
                formData.get("suburb"),

            city:
                formData.get("city"),

            province:
                formData.get("province"),

            postalCode:
                formData.get("postalCode"),

            instructions:
                formData.get("instructions")
        },

        deliveryMethod:
            formData.get("deliveryMethod"),

        paymentMethod:
            formData.get("paymentMethod"),

        items: cart,

        summary,

        createdAt:
            new Date().toISOString()
    };


    // Never store card number/CVV
    localStorage.setItem(
        "urbanBiteLastOrder",
        JSON.stringify(order)
    );


    // Display order number
    if (orderNumberElement) {

        orderNumberElement.textContent =
            orderNumber;
    }


    // Clear cart
    localStorage.removeItem(
        "urbanBiteCart"
    );

    localStorage.removeItem(
        "urbanBitePromo"
    );

    localStorage.removeItem(
        "urbanBiteOrderSummary"
    );

    cart = [];

updateCartCount();


// Show success modal
successModal?.classList.add(
    "active"
);

document.body.style.overflow =
    "hidden";

} // <-- closes placeOrder()





    // ==================================================
    // ORDER NUMBER
    // ==================================================

    function generateOrderNumber() {

        const randomNumber =
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        return `#UB${randomNumber}`;
    }


    // ==================================================
    // MOBILE MENU
    // ==================================================

    if (menuToggle && navMenu) {

        menuToggle.addEventListener(
            "click",
            () => {

                navMenu.classList.toggle(
                    "active"
                );


                const icon =
                    menuToggle.querySelector("i");


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
    // NOTIFICATION
    // ==================================================

    function showNotification(
        message,
        type = "success"
    ) {

        const existing =
            document.querySelector(
                ".cart-notification"
            );


        existing?.remove();


        const notification =
            document.createElement("div");


        notification.className =
            "cart-notification";


        const icon =
            type === "error"
                ? "fa-circle-exclamation"
                : "fa-check";


        notification.innerHTML = `

            <div class="notification-icon">

                <i class="fa-solid ${icon}"></i>

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

        }, 3000);
    }


    // ==================================================
    // INITIALIZE
    // ==================================================

    renderCheckoutItems();

    updateCartCount();

    updatePaymentFields();

    updateTotals();

});