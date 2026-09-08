document.addEventListener(
    "DOMContentLoaded",
    () => {

        const PRODUCTS_KEY =
            "urbanBiteProducts";


        const container =
            document.getElementById(
                "adminProductDetail"
            );


        // ==========================================
        // PRODUCT ID
        // ==========================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const id =
            params.get("id");


        // ==========================================
        // READ PRODUCTS
        // ==========================================

        function getProducts() {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        PRODUCTS_KEY
                    )
                ) || [];

            } catch {

                return [];

            }

        }


        // ==========================================
        // READ ONE PRODUCT
        // ==========================================

        function getProductById(id) {

            return getProducts().find(
                product =>
                    String(product.id) ===
                    String(id)
            );

        }


        // ==========================================
        // ESCAPE HTML
        // ==========================================

        function escapeHTML(value) {

            const element =
                document.createElement("div");

            element.textContent =
                value ?? "";

            return element.innerHTML;

        }


        const product =
            getProductById(id);


        // ==========================================
        // NOT FOUND
        // ==========================================

        if (!product) {

            container.innerHTML = `

                <div class="admin-empty">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <h2>
                        Product not found
                    </h2>

                    <a href="admin-products.html">
                        Return to Products
                    </a>

                </div>

            `;

            return;

        }


        // ==========================================
        // DISPLAY PRODUCT
        // ==========================================

        container.innerHTML = `

            <div class="admin-product-image">

                <img
                    src="${escapeHTML(
                        product.image
                    )}"
                    alt="${escapeHTML(
                        product.name
                    )}"
                >

            </div>


            <div class="admin-product-information">


                <span class="category-tag">

                    ${escapeHTML(
                        product.category
                    )}

                </span>


                <h1>

                    ${escapeHTML(
                        product.name
                    )}

                </h1>


                <p class="product-id">

                    Product ID:
                    <strong>
                        #${product.id}
                    </strong>

                </p>


                <div class="product-meta">


                    <div>

                        <span>Price</span>

                        <strong>

                            R${Number(
                                product.price
                            ).toFixed(2)}

                        </strong>

                    </div>


                    <div>

                        <span>Rating</span>

                        <strong>

                            ⭐ ${Number(
                                product.rating
                            ).toFixed(1)}

                        </strong>

                    </div>


                </div>


                <div class="description-section">

                    <h3>
                        Description
                    </h3>

                    <p>

                        ${escapeHTML(
                            product.description
                        )}

                    </p>

                </div>


                <a
                    href="admin-products.html"
                    class="primary-btn"
                >

                    <i class="fa-solid fa-arrow-left"></i>

                    Back to Products

                </a>

            </div>

        `;

    }
);

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
    // VIEW PRODUCT CODE
    // ==========================================

    const PRODUCTS_KEY = "urbanBiteProducts";

    // Rest of your view-product code...
});