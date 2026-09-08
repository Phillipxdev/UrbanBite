document.addEventListener("DOMContentLoaded", () => {

    const PRODUCTS_KEY = "urbanBiteProducts";


    // ==========================================
    // DEFAULT URBANBITE PRODUCTS
    // ==========================================

    const defaultProducts = [

        {
            id: 1,
            name: "Classic Beef Burger",
            description:
                "Beef patty, cheddar cheese, lettuce, tomato and our signature sauce.",
            price: 89.99,
            category: "burger",
            image: "beef burger.jpg",
            rating: 4.9
        },

        {
            id: 2,
            name: "Pepperoni Pizza",
            description:
                "Mozzarella cheese, pepperoni, tomato sauce and Italian herbs.",
            price: 129.99,
            category: "pizza",
            image: "pepperoni pizza.jpg",
            rating: 4.8
        },

        {
            id: 3,
            name: "Grilled Chicken",
            description:
                "Flame-grilled chicken served with crispy fries and fresh salad.",
            price: 109.99,
            category: "chicken",
            image: "whole-grilled-chicken.jpg",
            rating: 4.7
        },

        {
            id: 4,
            name: "Crispy Chicken Burger",
            description:
                "Crispy chicken, lettuce, pickles and creamy UrbanBite sauce.",
            price: 84.99,
            category: "burger",
            image:
                "Crispiest-buttermilk-fried-chicken-burgers-90854e5.jpg",
            rating: 4.9
        },

        {
            id: 7,
            name: "Coca Cola",
            description:
                "Ice-cold Coca Cola served chilled.",
            price: 24.99,
            category: "drinks",
            image: "cola.jpg",
            rating: 4.8
        },

        {
            id: 8,
            name: "Fresh Orange Juice",
            description:
                "Freshly squeezed orange juice served chilled.",
            price: 34.99,
            category: "drinks",
            image: "lemonade.jpg",
            rating: 4.7
        },

        {
            id: 9,
            name: "Chocolate Cake",
            description:
                "Rich chocolate cake layered with smooth chocolate frosting.",
            price: 49.99,
            category: "dessert",
            image: "chocolate cake.jpg",
            rating: 4.9
        },

        {
            id: 10,
            name: "Vanilla Ice Cream",
            description:
                "Creamy vanilla ice cream topped with chocolate sauce and crunchy sprinkles.",
            price: 39.99,
            category: "dessert",
            image: "vanilla-ice-cream.jpg",
            rating: 4.8
        }

    ];


    // ==========================================
    // ELEMENTS
    // ==========================================

    const table =
        document.getElementById("productsTable");

    const productForm =
        document.getElementById("productForm");

    const productModal =
        document.getElementById("productModal");

    const deleteModal =
        document.getElementById("deleteModal");

    const productModalTitle =
        document.getElementById("productModalTitle");

    const productId =
        document.getElementById("productId");

    const productName =
        document.getElementById("productName");

    const productDescription =
        document.getElementById(
            "productDescription"
        );

    const productPrice =
        document.getElementById("productPrice");

    const productCategory =
        document.getElementById(
            "productCategory"
        );

    const productImage =
        document.getElementById("productImage");

    const productRating =
        document.getElementById(
            "productRating"
        );

    const productSearch =
        document.getElementById(
            "productSearch"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    let productToDelete = null;


    // ==========================================
    // INITIALIZE DATABASE
    // ==========================================

    function initializeProducts() {

        const existing =
            localStorage.getItem(
                PRODUCTS_KEY
            );


        if (!existing) {

            localStorage.setItem(
                PRODUCTS_KEY,
                JSON.stringify(
                    defaultProducts
                )
            );

        }

    }


    // ==========================================
    // READ
    // ==========================================

    function getProducts() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    PRODUCTS_KEY
                )
            ) || [];

        } catch (error) {

            console.error(
                "Unable to load products.",
                error
            );

            return [];

        }

    }


    // ==========================================
    // SAVE DATABASE
    // ==========================================

    function saveProducts(products) {

        localStorage.setItem(
            PRODUCTS_KEY,
            JSON.stringify(products)
        );

    }


    // ==========================================
    // READ ONE
    // ==========================================

    function getProductById(id) {

        return getProducts().find(
            product =>
                String(product.id) ===
                String(id)
        );

    }


    // ==========================================
    // CREATE
    // ==========================================

    function createProduct(productData) {

        const products =
            getProducts();


        const product = {

            id: Date.now(),

            ...productData,

            createdAt:
                new Date().toISOString()

        };


        products.push(product);


        saveProducts(products);


        return product;

    }


    // ==========================================
    // UPDATE
    // ==========================================

    function updateProduct(
        id,
        updatedData
    ) {

        const products =
            getProducts();


        const index =
            products.findIndex(
                product =>
                    String(product.id) ===
                    String(id)
            );


        if (index === -1) {

            return false;

        }


        products[index] = {

            ...products[index],

            ...updatedData,

            updatedAt:
                new Date().toISOString()

        };


        saveProducts(products);


        return true;

    }


    // ==========================================
    // DELETE
    // ==========================================

    function deleteProduct(id) {

        const products =
            getProducts();


        const updatedProducts =
            products.filter(
                product =>
                    String(product.id) !==
                    String(id)
            );


        saveProducts(
            updatedProducts
        );

    }


    // ==========================================
    // SAFE HTML
    // ==========================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;

    }


    // ==========================================
    // RENDER PRODUCTS
    // ==========================================

    function renderProducts(
        products = getProducts()
    ) {

        table.innerHTML = "";


        if (!products.length) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-table"
                    >
                        No products found.
                    </td>

                </tr>

            `;

            updateStatistics();

            return;

        }


        products.forEach(product => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="table-product">

                        <img
                            src="${escapeHTML(
                                product.image
                            )}"
                            alt="${escapeHTML(
                                product.name
                            )}"
                        >

                        <div>

                            <strong>
                                ${escapeHTML(
                                    product.name
                                )}
                            </strong>

                            <small>
                                ID: ${product.id}
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="category-tag">

                        ${escapeHTML(
                            product.category
                        )}

                    </span>

                </td>


                <td>

                    R${Number(
                        product.price
                    ).toFixed(2)}

                </td>


                <td>

                    <span class="rating">

                        <i class="fa-solid fa-star"></i>

                        ${Number(
                            product.rating
                        ).toFixed(1)}

                    </span>

                </td>


                <td>

                    <div class="table-actions">


                        <!-- READ ONE -->

                        <button
                            type="button"
                            class="action-btn view"
                            data-action="view"
                            data-id="${product.id}"
                            title="View product"
                        >

                            <i class="fa-regular fa-eye"></i>

                        </button>


                        <!-- UPDATE -->

                        <button
                            type="button"
                            class="action-btn edit"
                            data-action="edit"
                            data-id="${product.id}"
                            title="Edit product"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <!-- DELETE -->

                        <button
                            type="button"
                            class="action-btn delete"
                            data-action="delete"
                            data-id="${product.id}"
                            title="Delete product"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>


                    </div>

                </td>

            `;


            table.appendChild(row);

        });


        updateStatistics();

    }


    // ==========================================
    // OPEN CREATE FORM
    // ==========================================

    function openCreateProduct() {

        productForm.reset();

        productId.value = "";

        productRating.value = "4.5";

        productModalTitle.textContent =
            "Add Product";


        productModal.classList.add(
            "active"
        );

    }


    // ==========================================
    // OPEN EDIT FORM
    // ==========================================

    function openEditProduct(id) {

        const product =
            getProductById(id);


        if (!product) return;


        productId.value =
            product.id;

        productName.value =
            product.name;

        productDescription.value =
            product.description;

        productPrice.value =
            product.price;

        productCategory.value =
            product.category;

        productImage.value =
            product.image;

        productRating.value =
            product.rating;


        productModalTitle.textContent =
            "Edit Product";


        productModal.classList.add(
            "active"
        );

    }


    // ==========================================
    // CLOSE PRODUCT MODAL
    // ==========================================

    function closeProductModal() {

        productModal.classList.remove(
            "active"
        );

    }


    // ==========================================
    // CREATE / UPDATE FORM
    // ==========================================

    productForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const data = {

                name:
                    productName.value.trim(),

                description:
                    productDescription
                        .value
                        .trim(),

                price:
                    Number(
                        productPrice.value
                    ),

                category:
                    productCategory.value,

                image:
                    productImage.value.trim(),

                rating:
                    Number(
                        productRating.value
                    )

            };


            if (productId.value) {

                updateProduct(
                    productId.value,
                    data
                );

            } else {

                createProduct(data);

            }


            closeProductModal();

            renderProducts();

        }
    );


    // ==========================================
    // TABLE ACTIONS
    // ==========================================

    table.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) return;


            const id =
                button.dataset.id;

            const action =
                button.dataset.action;


            // READ / VIEW

            if (action === "view") {

                window.location.href =
                    `admin-product-view.html?id=${id}`;

                return;

            }


            // UPDATE

            if (action === "edit") {

                openEditProduct(id);

                return;

            }


            // DELETE

            if (action === "delete") {

                const product =
                    getProductById(id);


                if (!product) return;


                productToDelete = id;


                document.getElementById(
                    "deleteProductName"
                ).textContent =
                    product.name;


                deleteModal.classList.add(
                    "active"
                );

            }

        }
    );


    // ==========================================
    // DELETE CONFIRM
    // ==========================================

    document.getElementById(
        "confirmDelete"
    ).addEventListener(
        "click",
        () => {

            if (productToDelete) {

                deleteProduct(
                    productToDelete
                );

            }


            productToDelete = null;


            deleteModal.classList.remove(
                "active"
            );


            renderProducts();

        }
    );


    document.getElementById(
        "cancelDelete"
    ).addEventListener(
        "click",
        () => {

            productToDelete = null;

            deleteModal.classList.remove(
                "active"
            );

        }
    );


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    function filterProducts() {

        const search =
            productSearch
                .value
                .trim()
                .toLowerCase();


        const category =
            categoryFilter.value;


        const products =
            getProducts();


        const filtered =
            products.filter(product => {

                const matchesName =
                    product.name
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all" ||
                    product.category ===
                    category;


                return (
                    matchesName &&
                    matchesCategory
                );

            });


        renderProducts(filtered);

    }


    productSearch.addEventListener(
        "input",
        filterProducts
    );


    categoryFilter.addEventListener(
        "change",
        filterProducts
    );


    // ==========================================
    // STATISTICS
    // ==========================================

    function updateStatistics() {

        const products =
            getProducts();


        document.getElementById(
            "totalProducts"
        ).textContent =
            products.length;


        document.getElementById(
            "burgerProducts"
        ).textContent =
            products.filter(
                product =>
                    product.category ===
                    "burger"
            ).length;


        document.getElementById(
            "drinkProducts"
        ).textContent =
            products.filter(
                product =>
                    product.category ===
                    "drinks"
            ).length;


        document.getElementById(
            "dessertProducts"
        ).textContent =
            products.filter(
                product =>
                    product.category ===
                    "dessert"
            ).length;

    }


    // ==========================================
    // BUTTONS
    // ==========================================

    document.getElementById(
        "addProductBtn"
    ).addEventListener(
        "click",
        openCreateProduct
    );


    document.getElementById(
        "closeProductModal"
    ).addEventListener(
        "click",
        closeProductModal
    );


    // ==========================================
    // START
    // ==========================================

    initializeProducts();

    renderProducts();

});

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ADMIN PROTECTION
    // ==========================================

    const currentUser = JSON.parse(
        localStorage.getItem("urbanBiteCurrentUser")
    );

    if (!currentUser || currentUser.role !== "admin") {
        window.location.replace("signin.html");
        return;
    }


    // ==========================================
    // PRODUCT CRUD CODE
    // ==========================================

    const PRODUCTS_KEY = "urbanBiteProducts";

    // Rest of your CRUD code...
});