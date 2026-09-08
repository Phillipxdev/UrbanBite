// ======================================================
// URBANBITE - ADMIN ORDERS
// admin-orders.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {


    // ==================================================
    // STORAGE KEYS
    // ==================================================

    const SESSION_KEY =
        "urbanBiteCurrentUser";

    const ORDERS_KEY =
        "urbanBiteOrders";


    // ==================================================
    // ADMIN SECURITY
    // ==================================================

    function getCurrentUser() {

        try {

            const savedUser =
                localStorage.getItem(SESSION_KEY) ||
                sessionStorage.getItem(SESSION_KEY);

            return savedUser
                ? JSON.parse(savedUser)
                : null;

        } catch (error) {

            console.error(
                "Unable to read admin session:",
                error
            );

            return null;
        }
    }


    const currentUser =
        getCurrentUser();


    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        window.location.replace(
            "signin.html"
        );

        return;
    }



    // ==================================================
    // ELEMENTS
    // ==================================================

    const ordersTableBody =
        document.getElementById(
            "ordersTableBody"
        );

    const emptyOrders =
        document.getElementById(
            "emptyOrders"
        );


    const totalOrders =
        document.getElementById(
            "totalOrders"
        );

    const pendingOrders =
        document.getElementById(
            "pendingOrders"
        );

    const completedOrders =
        document.getElementById(
            "completedOrders"
        );


    const orderSearch =
        document.getElementById(
            "orderSearch"
        );

    const orderStatusFilter =
        document.getElementById(
            "orderStatusFilter"
        );


    // Modal

    const orderModal =
        document.getElementById(
            "orderModal"
        );

    const orderModalOverlay =
        document.getElementById(
            "orderModalOverlay"
        );

    const closeOrderModal =
        document.getElementById(
            "closeOrderModal"
        );


    const modalOrderNumber =
        document.getElementById(
            "modalOrderNumber"
        );

    const modalCustomerName =
        document.getElementById(
            "modalCustomerName"
        );

    const modalCustomerEmail =
        document.getElementById(
            "modalCustomerEmail"
        );

    const modalCustomerPhone =
        document.getElementById(
            "modalCustomerPhone"
        );

    const modalDeliveryAddress =
        document.getElementById(
            "modalDeliveryAddress"
        );

    const modalOrderItems =
        document.getElementById(
            "modalOrderItems"
        );

    const modalOrderTotal =
        document.getElementById(
            "modalOrderTotal"
        );

    const modalOrderStatus =
        document.getElementById(
            "modalOrderStatus"
        );

    const saveOrderStatus =
        document.getElementById(
            "saveOrderStatus"
        );


    let selectedOrderNumber = null;



    // ==================================================
    // SAFE HTML
    // ==================================================

    function escapeHTML(value = "") {

        return String(value)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );
    }



    // ==================================================
    // GET ORDERS
    // ==================================================

    function getOrders() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        ORDERS_KEY
                    )
                ) || [];


            return Array.isArray(saved)
                ? saved
                : [];

        } catch (error) {

            console.error(
                "Unable to read orders:",
                error
            );

            return [];
        }
    }



    // ==================================================
    // SAVE ORDERS
    // ==================================================

    function saveOrders(orders) {

        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );
    }



    // ==================================================
    // FORMAT MONEY
    // ==================================================

    function formatCurrency(value) {

        return new Intl.NumberFormat(
            "en-ZA",
            {
                style: "currency",
                currency: "ZAR"
            }
        ).format(
            Number(value) || 0
        );
    }



    // ==================================================
    // FORMAT DATE
    // ==================================================

    function formatDate(value) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }


        return new Intl.DateTimeFormat(
            "en-ZA",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(date);
    }



    // ==================================================
    // CUSTOMER NAME
    // ==================================================

    function getCustomerName(order) {

        const firstName =
            order.customer?.firstName || "";

        const lastName =
            order.customer?.lastName || "";


        return (
            `${firstName} ${lastName}`.trim() ||
            "Customer"
        );
    }



    // ==================================================
    // ITEM QUANTITY
    // ==================================================

    function getItemQuantity(order) {

        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        return items.reduce(
            (total, item) => {

                return (
                    total +
                    Number(
                        item.quantity || 1
                    )
                );

            },
            0
        );
    }



    // ==================================================
    // ORDER TOTAL
    // ==================================================

    function getOrderTotal(order) {

        return (
            order.summary?.total ??
            order.total ??
            0
        );
    }



    // ==================================================
    // STATUS LABEL
    // ==================================================

    function statusLabel(status) {

        const labels = {

            pending:
                "Pending",

            preparing:
                "Preparing",

            "out-for-delivery":
                "Out for Delivery",

            completed:
                "Completed",

            cancelled:
                "Cancelled"
        };


        return (
            labels[status] ||
            "Pending"
        );
    }



    // ==================================================
    // UPDATE STATISTICS
    // ==================================================

    function updateStats() {

        const orders =
            getOrders();


        if (totalOrders) {

            totalOrders.textContent =
                orders.length;
        }


        if (pendingOrders) {

            pendingOrders.textContent =
                orders.filter(
                    order =>
                        (
                            order.status ||
                            "pending"
                        ) === "pending"
                ).length;
        }


        if (completedOrders) {

            completedOrders.textContent =
                orders.filter(
                    order =>
                        order.status ===
                        "completed"
                ).length;
        }
    }



    // ==================================================
    // GET FILTERED ORDERS
    // ==================================================

    function getFilteredOrders() {

        const orders =
            getOrders();


        const search =
            orderSearch
                ?.value
                .trim()
                .toLowerCase() || "";


        const status =
            orderStatusFilter
                ?.value ||
            "all";


        return orders.filter(order => {


            const orderNumber =
                String(
                    order.orderNumber || ""
                ).toLowerCase();


            const customerName =
                getCustomerName(order)
                    .toLowerCase();


            const email =
                String(
                    order.customer?.email ||
                    order.accountEmail ||
                    ""
                ).toLowerCase();


            const currentStatus =
                order.status ||
                "pending";


            const matchesSearch =
                !search ||
                orderNumber.includes(search) ||
                customerName.includes(search) ||
                email.includes(search);


            const matchesStatus =
                status === "all" ||
                currentStatus === status;


            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }



    // ==================================================
    // RENDER ORDERS
    // ==================================================

    function renderOrders() {

        if (!ordersTableBody) {
            return;
        }


        const orders =
            getFilteredOrders();


        ordersTableBody.innerHTML =
            "";


        if (!orders.length) {

            if (emptyOrders) {
                emptyOrders.hidden = false;
            }

            return;
        }


        if (emptyOrders) {
            emptyOrders.hidden = true;
        }


        ordersTableBody.innerHTML =
            orders.map(order => {


                const orderNumber =
                    order.orderNumber ||
                    "Unknown";


                const status =
                    order.status ||
                    "pending";


                return `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    orderNumber
                                )}
                            </strong>

                        </td>


                        <td>

                            <div class="order-customer">

                                <strong>
                                    ${escapeHTML(
                                        getCustomerName(
                                            order
                                        )
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        order.customer?.email ||
                                        order.accountEmail ||
                                        ""
                                    )}
                                </span>

                            </div>

                        </td>


                        <td>

                            ${escapeHTML(
                                formatDate(
                                    order.createdAt
                                )
                            )}

                        </td>


                        <td>

                            ${getItemQuantity(order)}

                        </td>


                        <td>

                            <strong>

                                ${escapeHTML(
                                    formatCurrency(
                                        getOrderTotal(
                                            order
                                        )
                                    )
                                )}

                            </strong>

                        </td>


                        <td>

                            <span
                                class="
                                    admin-order-status
                                    status-${escapeHTML(
                                        status
                                    )}
                                "
                            >

                                ${escapeHTML(
                                    statusLabel(
                                        status
                                    )
                                )}

                            </span>

                        </td>


                        <td>

                            <button
                                type="button"
                                class="admin-view-order"
                                data-order-number="${escapeHTML(
                                    orderNumber
                                )}"
                                aria-label="View order"
                            >

                                <i class="fa-regular fa-eye"></i>

                            </button>

                        </td>

                    </tr>
                `;

            }).join("");


        updateStats();
    }



    // ==================================================
    // DELIVERY ADDRESS
    // ==================================================

    function getAddress(order) {

        const address =
            order.address || {};


        const parts = [

            address.street,

            address.suburb,

            address.city,

            address.province,

            address.postalCode

        ].filter(Boolean);


        return parts.length
            ? parts.join(", ")
            : "No delivery address";
    }



    // ==================================================
    // OPEN ORDER
    // ==================================================

    function openOrder(orderNumber) {

        const orders =
            getOrders();


        const order =
            orders.find(
                item =>
                    String(
                        item.orderNumber
                    ) ===
                    String(
                        orderNumber
                    )
            );


        if (!order) {
            return;
        }


        selectedOrderNumber =
            order.orderNumber;


        modalOrderNumber.textContent =
            order.orderNumber ||
            "Order";


        modalCustomerName.textContent =
            getCustomerName(order);


        modalCustomerEmail.textContent =
            order.customer?.email ||
            order.accountEmail ||
            "-";


        modalCustomerPhone.textContent =
            order.customer?.phone ||
            "-";


        modalDeliveryAddress.textContent =
            getAddress(order);


        modalOrderTotal.textContent =
            formatCurrency(
                getOrderTotal(order)
            );


        modalOrderStatus.value =
            order.status ||
            "pending";


        renderModalItems(order);


        orderModal.classList.add(
            "active"
        );


        orderModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";
    }



    // ==================================================
    // MODAL ITEMS
    // ==================================================

    function renderModalItems(order) {

        if (!modalOrderItems) {
            return;
        }


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        if (!items.length) {

            modalOrderItems.innerHTML =
                "<p>No items available.</p>";

            return;
        }


        modalOrderItems.innerHTML =
            items.map(item => `

                <div class="admin-order-item">


                    ${
                        item.image
                            ? `
                                <img
                                    src="${escapeHTML(
                                        item.image
                                    )}"
                                    alt="${escapeHTML(
                                        item.name ||
                                        "Product"
                                    )}"
                                >
                            `
                            : ""
                    }


                    <div>

                        <strong>
                            ${escapeHTML(
                                item.name ||
                                "Product"
                            )}
                        </strong>

                        <span>

                            ${Number(
                                item.quantity || 1
                            )}

                            ×

                            ${escapeHTML(
                                formatCurrency(
                                    item.price
                                )
                            )}

                        </span>

                    </div>


                    <strong>

                        ${escapeHTML(
                            formatCurrency(
                                Number(
                                    item.price || 0
                                ) *
                                Number(
                                    item.quantity || 1
                                )
                            )
                        )}

                    </strong>


                </div>

            `).join("");
    }



    // ==================================================
    // CLOSE MODAL
    // ==================================================

    function closeModal() {

        orderModal?.classList.remove(
            "active"
        );


        orderModal?.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";


        selectedOrderNumber =
            null;
    }



    // ==================================================
    // VIEW ORDER BUTTON
    // ==================================================

    ordersTableBody?.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-order-number]"
                );


            if (!button) {
                return;
            }


            openOrder(
                button.dataset.orderNumber
            );
        }
    );



    // ==================================================
    // UPDATE ORDER STATUS
    // ==================================================

    saveOrderStatus?.addEventListener(
        "click",
        () => {

            if (!selectedOrderNumber) {
                return;
            }


            const orders =
                getOrders();


            const orderIndex =
                orders.findIndex(
                    order =>
                        String(
                            order.orderNumber
                        ) ===
                        String(
                            selectedOrderNumber
                        )
                );


            if (orderIndex === -1) {
                return;
            }


            orders[orderIndex].status =
                modalOrderStatus.value;


            orders[orderIndex].updatedAt =
                new Date().toISOString();


            saveOrders(orders);


            /*
             * Keep urbanBiteLastOrder synchronized
             * when this is the customer's latest order.
             */

            try {

                const lastOrder =
                    JSON.parse(
                        localStorage.getItem(
                            "urbanBiteLastOrder"
                        )
                    );


                if (
                    lastOrder &&
                    String(
                        lastOrder.orderNumber
                    ) ===
                    String(
                        selectedOrderNumber
                    )
                ) {

                    lastOrder.status =
                        modalOrderStatus.value;


                    lastOrder.updatedAt =
                        orders[orderIndex]
                            .updatedAt;


                    localStorage.setItem(
                        "urbanBiteLastOrder",
                        JSON.stringify(
                            lastOrder
                        )
                    );
                }

            } catch (error) {

                console.error(
                    "Unable to update latest order:",
                    error
                );
            }


            renderOrders();

            closeModal();
        }
    );



    // ==================================================
    // SEARCH
    // ==================================================

    orderSearch?.addEventListener(
        "input",
        renderOrders
    );



    // ==================================================
    // FILTER
    // ==================================================

    orderStatusFilter?.addEventListener(
        "change",
        renderOrders
    );



    // ==================================================
    // CLOSE EVENTS
    // ==================================================

    closeOrderModal?.addEventListener(
        "click",
        closeModal
    );


    orderModalOverlay?.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeModal();
            }
        }
    );



    // ==================================================
    // INITIALIZE
    // ==================================================

    updateStats();

    renderOrders();


});