// Cart icon component
export function CartIcon({ itemCount }) {
    return `
        <div class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="item-count">${itemCount}</span>
        </div>
    `;
}
