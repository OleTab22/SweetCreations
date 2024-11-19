const express = require('express');
const axios = require('axios');
const router = express.Router();
const crypto = require('crypto');

function verifyWebhookSignature(req, secret) {
    const signature = req.headers['x-yoco-signature'];
    const hash = crypto.createHmac('sha256', secret)
                       .update(req.rawBody)
                       .digest('hex');
    return signature === hash;
}

// Create a checkout session with discounts and tax
router.post('/create-checkout', async (req, res) => {
    try {
        const { amount, totalDiscount, totalTaxAmount, subtotalAmount } = req.body;

        const response = await axios.post('https://payments.yoco.com/api/checkouts', {
            amount, // Amount in cents
            currency: 'ZAR',
            totalDiscount, // Total discount in cents
            totalTaxAmount, // Total tax amount in cents
            subtotalAmount, // Subtotal amount in cents
            cancelUrl: 'https://yourdomain.com/cancel',
            successUrl: 'https://yourdomain.com/success',
            failureUrl: 'https://yourdomain.com/failure'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Failed to create checkout' });
    }
});

// Webhook to handle payment and refund events
router.post('/webhook', (req, res) => {
    const secret = 'whsec_M0U0MDI3QjYzMEQ0NTK5NDNCIjVFMENCMDEzNzc1QkE='; // Replace with your actual secret
    if (!verifyWebhookSignature(req, secret)) {
        return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    if (event.metadata && event.metadata.checkoutId === 'your-checkout-id') {
        if (event.type === 'payment.succeeded') {
            // Handle successful payment
            console.log('Payment succeeded:', event.data);
            // Update order status, notify user, etc.
        } else if (event.type === 'refund.succeeded') {
            // Handle successful refund
            console.log('Refund succeeded:', event.data);
            // Update order status, notify user, etc.
        }
    }

    // Respond with a 2xx status code to confirm receipt
    res.status(200).send('Webhook received');
});

// Initiate a refund
router.post('/refund', async (req, res) => {
    const { checkoutId, amount } = req.body; // Expecting checkoutId and optional amount in the request body

    try {
        const response = await axios.post(`https://payments.yoco.com/api/checkouts/${checkoutId}/refund`, {
            amount // Amount in cents, optional
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
                'Idempotency-Key': `refund-${checkoutId}-${Date.now()}` // Unique idempotency key
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error processing refund:', error);
        res.status(500).json({ error: 'Failed to process refund' });
    }
});

async function registerWebhook() {
    try {
        const response = await axios.post('https://payments.yoco.com/api/webhooks', {
            name: 'my-webhook',
            url: 'https://yourdomain.com/api/yoco/webhook' // Replace with your actual webhook URL
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`
            }
        });

        console.log('Webhook registered:', response.data);
    } catch (error) {
        console.error('Error registering webhook:', error);
    }
}

registerWebhook();

module.exports = router;
