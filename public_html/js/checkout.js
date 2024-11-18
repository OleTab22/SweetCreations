// Checkout and payment logic

async function processCheckout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) {
        showNotification('Your cart is empty.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ items: cartItems })
        });

        if (!response.ok) throw new Error('Checkout failed');

        showNotification('Checkout successful!', 'success');
        localStorage.removeItem('cart');
        window.location.href = 'order-confirmation.html';
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Checkout failed. Please try again.', 'error');
    }
}
