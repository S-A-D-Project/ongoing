const Stripe = require('stripe');
const Paymongo = require('paymongo');
const axios = require('axios');

class PaymentService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        this.paymongo = new Paymongo(process.env.PAYMONGO_SECRET_KEY);
    }

    async createPaymentIntent(amount, currency = 'php', paymentMethod) {
        try {
            switch (paymentMethod) {
                case 'gcash':
                    return await this.createGCashPayment(amount);
                case 'card':
                    return await this.createStripePayment(amount, currency);
                case 'bank':
                    return await this.createBankTransfer(amount);
                default:
                    throw new Error('Unsupported payment method');
            }
        } catch (error) {
            throw new Error(`Payment creation failed: ${error.message}`);
        }
    }

    async createGCashPayment(amount) {
        try {
            const payment = await this.paymongo.paymentIntents.create({
                amount: amount * 100, // Convert to cents
                currency: 'PHP',
                payment_method_types: ['gcash'],
                description: 'OPSMS Payment'
            });

            return {
                paymentId: payment.id,
                status: payment.status,
                redirectUrl: payment.next_action.redirect_to_url.url
            };
        } catch (error) {
            throw new Error(`GCash payment creation failed: ${error.message}`);
        }
    }

    async createStripePayment(amount, currency) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100, // Convert to cents
                currency: currency,
                payment_method_types: ['card'],
                description: 'OPSMS Payment'
            });

            return {
                paymentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                status: paymentIntent.status
            };
        } catch (error) {
            throw new Error(`Stripe payment creation failed: ${error.message}`);
        }
    }

    async createBankTransfer(amount) {
        try {
            const payment = await this.paymongo.paymentIntents.create({
                amount: amount * 100, // Convert to cents
                currency: 'PHP',
                payment_method_types: ['bank_transfer'],
                description: 'OPSMS Payment'
            });

            return {
                paymentId: payment.id,
                status: payment.status,
                bankDetails: payment.next_action.bank_transfer
            };
        } catch (error) {
            throw new Error(`Bank transfer creation failed: ${error.message}`);
        }
    }

    async verifyPayment(paymentId, paymentMethod) {
        try {
            switch (paymentMethod) {
                case 'gcash':
                case 'bank':
                    const payment = await this.paymongo.paymentIntents.retrieve(paymentId);
                    return payment.status === 'succeeded';
                case 'card':
                    const intent = await this.stripe.paymentIntents.retrieve(paymentId);
                    return intent.status === 'succeeded';
                default:
                    throw new Error('Unsupported payment method');
            }
        } catch (error) {
            throw new Error(`Payment verification failed: ${error.message}`);
        }
    }
}

module.exports = new PaymentService(); 