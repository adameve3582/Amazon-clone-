document.addEventListener('DOMContentLoaded', () => {
    // Mock product data
    const products = [
        { id: 1, name: 'Echo Dot (5th Gen)', price: 49.99, image: 'https://via.placeholder.com/200x200.png?text=Echo+Dot', description: 'Our most popular smart speaker with Alexa.' },
        { id: 2, name: 'Kindle Paperwhite', price: 139.99, image: 'https://via.placeholder.com/200x200.png?text=Kindle', description: 'Thin, lightweight design so you can read comfortably for hours.' },
        { id: 3, name: 'Fire TV Stick 4K', price: 29.99, image: 'https://via.placeholder.com/200x200.png?text=Fire+TV', description: 'Cinematic experience with 4K Ultra HD.' },
        { id: 4, name: 'Amazon Basics AAA Batteries', price: 9.99, image: 'https://via.placeholder.com/200x200.png?text=Batteries', description: 'Pack of 20 AAA high-performance alkaline batteries.' },
        { id: 5, name: 'Instant Pot Duo 7-in-1', price: 89.00, image: 'https://via.placeholder.com/200x200.png?text=Instant+Pot', description: 'Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Saute, Yogurt Maker, Sterilizer, and Warmer.' },
        { id: 6, name: 'Logitech MX Master 3S Mouse', price: 99.99, image: 'https://via.placeholder.com/200x200.png?text=Logitech+Mouse', description: 'Advanced wireless mouse for power users.' }
    ];

    // Cart array (persisted in localStorage)
    let cart = JSON.parse(localStorage.getItem('amazonCloneCart')) || [];

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('amazonCloneCart', JSON.stringify(cart));
    }

    // Function to display products on the homepage
    function displayProducts() {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <a href="product_detail.html?id=${product.id}" class="product-link">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                </a>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productItem);
        });

        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        });
    }

    // Function to add a product to the cart
    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        if (!productToAdd) return;

        const existingCartItem = cart.find(item => item.id === productId);
        if (existingCartItem) {
            existingCartItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        saveCart();
        alert(`${productToAdd.name} added to cart!`);
        updateCartCount();
    }

    // Function to update cart item count in header (optional)
    function updateCartCount() {
        const cartLink = document.querySelector('nav ul li a[href="cart.html"]');
        if (cartLink) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartLink.textContent = `Cart (${totalItems})`;
        }
    }


    // Function to display cart items on the cart page
    function displayCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalContainer = document.getElementById('cart-total');
        if (!cartItemsContainer || !cartTotalContainer) return;

        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalContainer.innerHTML = '';
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 50px;"></p>
                </div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });

        cartTotalContainer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;

        // Add event listeners for quantity changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const newQuantity = parseInt(e.target.value);
                updateCartItemQuantity(productId, newQuantity);
            });
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                removeFromCart(productId);
            });
        });
    }

    // Function to update item quantity in cart
    function updateCartItemQuantity(productId, newQuantity) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (newQuantity > 0) {
                cartItem.quantity = newQuantity;
            } else {
                // If quantity is 0 or less, remove the item
                cart = cart.filter(item => item.id !== productId);
            }
            saveCart();
            displayCartItems(); // Re-render cart
            updateCartCount();
        }
    }

    // Function to remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        displayCartItems(); // Re-render cart
        updateCartCount();
    }


    // Function to display product details
    function displayProductDetails() {
        const productDetailContainer = document.querySelector('.product-detail-container');
        if (!productDetailContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            document.title = `${product.name} - Amazon Clone`; // Update page title
            productDetailContainer.innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            // Re-attach event listener for the new button
            productDetailContainer.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                const prodId = parseInt(e.target.dataset.id);
                addToCart(prodId);
            });
        } else {
            productDetailContainer.innerHTML = '<p>Product not found.</p>';
        }
    }

    // Mock Sign Up
    function handleSignUp() {
        const signupForm = document.getElementById('signup-form');
        if (!signupForm) return;

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.name.value;
            const email = signupForm.email.value;
            // In a real app, you'd send this to a backend.
            // For now, we'll just mock it and store in localStorage.
            localStorage.setItem('amazonCloneUser', JSON.stringify({ name, email }));
            alert('Account created successfully! (Mocked)');
            window.location.href = 'index.html'; // Redirect to home
        });
    }


    // Mock Orders Page
    function displayOrders() {
        const orderListContainer = document.getElementById('order-list');
        if (!orderListContainer) return;

        // This is a very basic mock. In a real app, orders would be fetched from a backend.
        // We'll simulate a previous order if the cart was "checked out".
        const mockOrder = JSON.parse(localStorage.getItem('amazonCloneLastOrder'));
        if (mockOrder && mockOrder.items && mockOrder.items.length > 0) {
            orderListContainer.innerHTML = `
                <div class="order">
                    <h3>Order #${Math.floor(Math.random() * 100000)} (Mock)</h3>
                    <p>Date: ${new Date(mockOrder.date).toLocaleDateString()}</p>
                    <h4>Items:</h4>
                    <ul>
                        ${mockOrder.items.map(item => `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
                    </ul>
                    <p><strong>Total: $${mockOrder.total.toFixed(2)}</strong></p>
                </div>
            `;
        } else {
            orderListContainer.innerHTML = '<p>You have no past orders. (This is a mock feature)</p>';
        }
    }

    // Mock Checkout
    function handleCheckout() {
        const checkoutButton = document.getElementById('checkout-button');
        if(!checkoutButton) return;

        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }
            // Mock order creation
            const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const lastOrder = {
                items: [...cart], // Create a copy of the cart items
                total: orderTotal,
                date: new Date().toISOString()
            };
            localStorage.setItem('amazonCloneLastOrder', JSON.stringify(lastOrder));

            // Clear the cart
            cart = [];
            saveCart();
            updateCartCount();
            displayCartItems(); // Re-render cart page to show it's empty

            alert('Checkout successful! (Mocked)\nYour order has been "placed".');
            window.location.href = 'orders.html';
        });
    }


    // Page-specific initializations
    if (document.querySelector('.product-grid')) {
        displayProducts();
    }
    if (document.getElementById('cart-items')) {
        displayCartItems();
        handleCheckout();
    }
    if (document.querySelector('.product-detail-container')) {
        displayProductDetails();
    }
    if (document.getElementById('signup-form')) {
        handleSignUp();
    }
    if (document.getElementById('order-list')) {
        displayOrders();
    }

    // Initial cart count update on all pages
    updateCartCount();
});
