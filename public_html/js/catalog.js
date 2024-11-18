import { formatPrice } from './utils/formatPrice.js';
import { debounce } from './utils/debounce.js';

let currentPage = 1;
let currentSearch = '';
let currentCategory = '';
let currentSort = 'price-asc';

// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Improved error handling with a utility function
function handleFetchError(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

async function loadProducts() {
    try {
        const queryParams = new URLSearchParams({
            page: currentPage,
            limit: 12,
            search: currentSearch,
            category: currentCategory,
            sort: currentSort
        });

        const response = await fetch(`/api/products?${queryParams}`);
        if (!response.ok) throw new Error('Failed to load products');
        
        const { data, pagination } = await response.json();
        displayProducts(data);
        updatePagination(pagination.totalPages);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>${formatPrice(product.price)}</p>
            <button class="add-to-cart" data-id="${product._id}">Add to Cart</button>
        </div>
    `).join('');
}

function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <button class="page-btn" data-page="${i + 1}">${i + 1}</button>
    `).join('');
}

function updateUrlParams() {
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    url.searchParams.set('search', currentSearch);
    url.searchParams.set('category', currentCategory);
    url.searchParams.set('sort', currentSort);
    window.history.pushState({}, '', url);
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    currentPage = parseInt(params.get('page')) || 1;
    currentSearch = params.get('search') || '';
    currentCategory = params.get('category') || '';
    currentSort = params.get('sort') || 'price-asc';

    document.getElementById('search-input').value = currentSearch;
    document.getElementById('category-filter').value = currentCategory;
    document.getElementById('sort-filter').value = currentSort;

    document.getElementById('search-input').addEventListener('input', debounce((e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        loadProducts();
    }, 300));

    document.getElementById('category-filter').addEventListener('change', (e) => {
        loadProducts({ category: e.target.value });
        document.querySelector('.catalog-header .active').classList.remove('active');
        e.target.classList.add('active');
    });

    document.getElementById('sort-filter').addEventListener('change', (e) => {
        currentSort = e.target.value;
        loadProducts();
    });

    updateCartIcon();

    loadProducts();

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.dataset.id;
            addToCart(productId);
        }
    });
});

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function addToCart(productId) {
    fetchProductData(productId)
        .then(product => {
            const parsedProduct = parseProductData(product);
            const existingProduct = cart.find(item => item.id === parsedProduct.id);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    ...parsedProduct,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            showNotification('Product added to cart', 'success');
            updateCartIcon();
        })
        .catch(error => console.error('Error fetching product data:', error));
}

// Update cart icon with item count
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.cart-icon .item-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartIcon) {
        cartIcon.textContent = totalItems;
    }
}
