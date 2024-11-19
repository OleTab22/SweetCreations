// Order processing

async function fetchOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        showNotification('Failed to fetch orders.', 'error');
    }
}

async function createOrder(orderData) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Order creation failed');

        showNotification('Order created successfully!', 'success');
    } catch (error) {
        console.error('Error creating order:', error);
        showNotification('Failed to create order.', 'error');
    }
}

async function initiateRefund(checkoutId, amount) {
    try {
        const response = await fetch('/api/yoco/refund', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkoutId, amount })
        });

        const data = await response.json();
        if (data.status === 'successful') {
            console.log('Refund processed successfully:', data);
            showNotification('Refund processed successfully', 'success');
        } else {
            console.error('Failed to process refund');
            showNotification('Failed to process refund', 'error');
        }
    } catch (error) {
        console.error('Error initiating refund:', error);
        showNotification('Error initiating refund', 'error');
    }
}