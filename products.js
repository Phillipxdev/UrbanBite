document.addEventListener(
    "DOMContentLoaded",
    () => {

        const STORAGE_KEY =
            "urbanBiteProducts";


        // ==========================================
        // DEFAULT PRODUCTS
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

        const tableBody =
            document.getElementById(
                "productTableBody"
            );

        const productForm =
            document.getElementById(
                "productForm"
            );

        const productModal =
            document.getElementById(
                "productModal"
            );

        const modalTitle =
            document.getElementById(
                "modalTitle"
            );

        const productId =
            document.getElementById(
                "productId"
            );

        const productName =
            document.getElementById(
                "productName"
            );

        const productDescription =
            document.getElementById(
                "productDescription"
            );

        const productPrice =
            document.getElementById(
                "productPrice"
            );

        const productCategory =
            document.getElementById(
                "productCategory"
            );

        const productImage =
            document.getElementById(
                "productImage"
            );

        const productRating =
            document.getElementById(
                "productRating"
            );

        const searchInput =
            document.getElementById(
                "productSearch"
            );

        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );

        const deleteModal =
            document.getElementById(
                "deleteModal"
            );


        let deleteProductId = null;


        // ==========================================
        // READ PRODUCTS
        // ==========================================

        function getProducts() {

            try {

                const saved =
                    JSON.parse(
                        localStorage.getItem(
                            STORAGE_KEY
                        )
                    );

                if (
                    Array.isArray(saved) &&
                    saved.length
                ) {

                    return saved;
                }

            } catch (error) {

                console.error(
                    "Unable to load products:",
                    error
                );
            }


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    defaultProducts
                )
            );

            return [...defaultProducts];
        }


        let products =
            getProducts();


        // ==========================================
        // SAVE PRODUCTS
        // ==========================================

        function saveProducts() {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(products)
            );
        }


        // ==========================================
        // RENDER / READ
        // ==========================================

        function renderProducts(
            list = products
        ) {

            tableBody.innerHTML = "";


            if (!list.length) {

                tableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            class="empty-products"
                        >
                            No products found.
                        </td>

                    </tr>

                `;

                return;
            }


            list.forEach(product => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <div class="product-info">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                            <div>

                                <strong>
                                    ${product.name}
                                </strong>

                                <span>
                                    #${product.id}
                                </span>

                            </div>

                        </div>

                    </td>


                    <td>

                        <span class="category-badge">
                            ${product.category}
                        </span>

                    </td>


                    <td>

                        <strong>
                            R${Number(
                                product.price
                            ).toFixed(2)}
                        </strong>

                    </td>


                    <td>

                        <span class="rating">

                            <i class="fa-solid fa-star"></i>

                            ${product.rating}

                        </span>

                    </td>


                    <td>

                        <div class="product-actions">


                            <button
                                type="button"
                                class="view-btn"
                                data-action="view"
                                data-id="${product.id}"
                                title="View"
                            >

                                <i class="fa-regular fa-eye"></i>

                            </button>


                            <button
                                type="button"
                                class="edit-btn"
                                data-action="edit"
                                data-id="${product.id}"
                                title="Edit"
                            >

                                <i class="fa-solid fa-pen"></i>

                            </button>


                            <button
                                type="button"
                                class="remove-btn"
                                data-action="delete"
                                data-id="${product.id}"
                                title="Delete"
                            >

                                <i class="fa-solid fa-trash"></i>

                            </button>


                        </div>

                    </td>

                `;


                tableBody.appendChild(row);

            });


            updateStats();
        }


        // ==========================================
        // CREATE PRODUCT
        // ==========================================

        function createProduct(data) {

            const product = {

                id: Date.now(),

                ...data

            };


            products.push(product);

            saveProducts();

            renderProducts();

            return product;
        }


        // ==========================================
        // UPDATE PRODUCT
        // ==========================================

        function updateProduct(
            id,
            updatedData
        ) {

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

                ...updatedData

            };


            saveProducts();

            renderProducts();

            return true;
        }


        // ==========================================
        // DELETE PRODUCT
        // ==========================================

        function deleteProduct(id) {

            products =
                products.filter(
                    product =>
                        String(product.id) !==
                        String(id)
                );


            saveProducts();

            renderProducts();
        }


        // ==========================================
        // GET ONE PRODUCT
        // ==========================================

        function getProductById(id) {

            return products.find(
                product =>
                    String(product.id) ===
                    String(id)
            );
        }


        // ==========================================
        // OPEN CREATE MODAL
        // ==========================================

        function openCreateModal() {

            productForm.reset();

            productId.value = "";

            modalTitle.textContent =
                "Add Product";

            productModal.classList.add(
                "active"
            );
        }


        // ==========================================
        // OPEN EDIT MODAL
        // ==========================================

        function openEditModal(id) {

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


            modalTitle.textContent =
                "Edit Product";


            productModal.classList.add(
                "active"
            );
        }


        // ==========================================
        // CLOSE MODAL
        // ==========================================

        function closeModal() {

            productModal.classList.remove(
                "active"
            );
        }


        // ==========================================
        // FORM SUBMIT
        // CREATE + UPDATE
        // ==========================================

        productForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const data = {

                    name:
                        productName.value.trim(),

                    description:
                        productDescription.value.trim(),

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


                closeModal();

            }
        );


        // ==========================================
        // ACTION BUTTONS
        // ==========================================

        tableBody.addEventListener(
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


                // VIEW

                if (action === "view") {

                    window.location.href =
                        `product.html?id=${id}`;

                    return;
                }


                // EDIT

                if (action === "edit") {

                    openEditModal(id);

                    return;
                }


                // DELETE

                if (action === "delete") {

                    deleteProductId = id;

                    deleteModal.classList.add(
                        "active"
                    );
                }

            }
        );


        // ==========================================
        // DELETE CONFIRMATION
        // ==========================================

        document
            .getElementById(
                "confirmDelete"
            )
            .addEventListener(
                "click",
                () => {

                    if (
                        deleteProductId !==
                        null
                    ) {

                        deleteProduct(
                            deleteProductId
                        );
                    }


                    deleteProductId = null;

                    deleteModal.classList.remove(
                        "active"
                    );

                }
            );


        document
            .getElementById(
                "cancelDelete"
            )
            .addEventListener(
                "click",
                () => {

                    deleteProductId = null;

                    deleteModal.classList.remove(
                        "active"
                    );

                }
            );


        // ==========================================
        // SEARCH
        // ==========================================

        function filterProducts() {

            const search =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const category =
                categoryFilter.value;


            const filtered =
                products.filter(product => {

                    const matchesSearch =
                        product.name
                            .toLowerCase()
                            .includes(search);


                    const matchesCategory =
                        category === "all" ||
                        product.category ===
                        category;


                    return (
                        matchesSearch &&
                        matchesCategory
                    );

                });


            renderProducts(filtered);
        }


        searchInput.addEventListener(
            "input",
            filterProducts
        );


        categoryFilter.addEventListener(
            "change",
            filterProducts
        );


        // ==========================================
        // STATS
        // ==========================================

        function updateStats() {

            document.getElementById(
                "totalProducts"
            ).textContent =
                products.length;


            document.getElementById(
                "burgerCount"
            ).textContent =
                products.filter(
                    product =>
                        product.category ===
                        "burger"
                ).length;


            document.getElementById(
                "drinkCount"
            ).textContent =
                products.filter(
                    product =>
                        product.category ===
                        "drinks"
                ).length;


            document.getElementById(
                "dessertCount"
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

        document
            .getElementById(
                "openProductModal"
            )
            .addEventListener(
                "click",
                openCreateModal
            );


        document
            .getElementById(
                "closeProductModal"
            )
            .addEventListener(
                "click",
                closeModal
            );


        // ==========================================
        // INITIALIZE
        // ==========================================

        renderProducts();

    }
);