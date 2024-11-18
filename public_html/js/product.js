import { formatPrice } from './utils/formatPrice.js';

async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        
        const product = await response.json();
        const productDetails = document.getElementById("product-details");

        productDetails.innerHTML = `
            <div class="product-gallery">
                <img src="${product.imageUrl}" alt="${product.name}" class="main-image">
                ${product.additionalImages ? 
                    `<div class="thumbnail-container">
                        ${product.additionalImages.map(img => 
                            `<img src="${img}" alt="${product.name}" class="thumbnail">`
                        ).join('')}
                    </div>` : ''
                }
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="price">${formatPrice(product.price)}</p>
                <p class="description">${product.description}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(-1)" class="qty-btn">-</button>
                    <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                    <button onclick="updateQuantity(1)" class="qty-btn">+</button>
                </div>
                <span class="stock-status">${product.stock} available</span>
                <button id="add-to-cart-btn" 
                        class="btn-primary add-to-cart"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;

        setupQuantityControls(product.stock);
    } catch (error) {
        console.error("Error loading product:", error);
        productDetails.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't find this product.</p>
                <a href="catalog.html" class="btn-primary">Return to Catalog</a>
            </div>
        `;
    }
}

function setupQuantityControls(maxStock) {
    const quantityInput = document.getElementById('quantity');
    
    function validateQuantity() {
        let value = parseInt(quantityInput.value);
        value = Math.max(1, Math.min(value, maxStock));
        quantityInput.value = value;
    }

    quantityInput.addEventListener('change', validateQuantity);
    quantityInput.addEventListener('keyup', validateQuantity);
}

function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    const newValue = parseInt(quantityInput.value) + change;
    quantityInput.value = newValue;
    quantityInput.dispatchEvent(new Event('change'));
}

loadProduct();
