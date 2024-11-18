// Product card component
import { formatPrice } from '../utils/formatPrice.js'; // Ensure the path is correct

export function ProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${formatPrice(product.price)}</p>
                <p class="description">${product.description.substring(0, 100)}...</p>
                <a href="product.html?id=${product._id}" class="btn btn-primary">View Details</a>
            </div>
        </div>
    `;
}
