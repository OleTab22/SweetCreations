async function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.querySelector('.cart-list');
    let totalCost = 0;

    if (cartItems.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty. Start adding some delicious items!</p>';
        document.getElementById('total-cost').textContent = 'Total: 0 ZAR';
        document.querySelector('.checkout-btn').style.display = 'none';
        return;
    }

    cartList.innerHTML = cartItems.map(item => {
        totalCost += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x ${item.price.toFixed(2)} ZAR</p>
                    <button onclick="removeItem('${item.id}')">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('total-cost').textContent = `Total: ${totalCost.toFixed(2)} ZAR`;
    document.querySelector('.checkout-btn').style.display = 'block';
}

function removeItem(id) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCart();
}

function toggleCheckoutForm() {
    const checkoutForm = document.querySelector('.checkout-form');
    checkoutForm.style.display = checkoutForm.style.display === 'none' ? 'block' : 'none';
}

document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.closest('.quantity-controls').querySelector('input');
        input.value = parseInt(input.value) + (btn.dataset.action === 'increment' ? 1 : -1);
        updateCartTotal();
    });
});

document.addEventListener('DOMContentLoaded', loadCart);

async function initiateCheckout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100; // Convert to cents
    const totalDiscount = 100; // Example discount in cents
    const subtotalAmount = totalAmount + totalDiscount;
    const totalTaxAmount = totalAmount - (totalAmount / 1.15);

    try {
        const response = await fetch('/api/yoco/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: totalAmount,
                totalDiscount,
                totalTaxAmount,
                subtotalAmount
            })
        });

        const data = await response.json();
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            console.error('Failed to initiate checkout');
        }
    } catch (error) {
        console.error('Error initiating checkout:', error);
    }
}

document.querySelector('.checkout-btn').addEventListener('click', initiateCheckout); 