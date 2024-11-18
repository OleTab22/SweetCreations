// Navbar component
import { CartIcon } from './CartIcon.js'; // Ensure the path is correct

export function Navbar() {
    return `
        <nav class="site-nav">
            <ul class="home-parent">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="catalog.html" class="nav-link">Catalog</a></li>
                <li><a href="about.html" class="nav-link">About Us</a></li>
                <li><a href="contact.html" class="nav-link">Contact</a></li>
            </ul>
            <div class="header-right">
                <a href="cart.html" class="nav-link cart-link">
                    ${CartIcon({ itemCount: 0 })}
                    View Cart
                </a>
            </div>
        </nav>
    `;
}
