document.addEventListener('DOMContentLoaded', function() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentForms = document.querySelectorAll('.payment-form');
    const payButton = document.getElementById('payButton');

    // Handle payment method selection
    paymentOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        const method = option.dataset.method;

        radio.addEventListener('change', () => {
            // Hide all payment forms
            paymentForms.forEach(form => {
                form.style.display = 'none';
            });

            // Show selected payment form
            const selectedForm = document.querySelector(`.${method}-form`);
            if (selectedForm) {
                selectedForm.style.display = 'block';
            }
        });
    });

    // Handle payment submission
    payButton.addEventListener('click', async function(e) {
        e.preventDefault();

        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }

        const paymentMethod = selectedPayment.value;
        let paymentData = {
            method: paymentMethod,
            amount: 1600.00, // This should come from your order data
            currency: 'PHP'
        };

        // Add payment method specific data
        switch (paymentMethod) {
            case 'gcash':
                const gcashNumber = document.getElementById('gcash-number').value;
                const gcashName = document.getElementById('gcash-name').value;
                if (!gcashNumber || !gcashName) {
                    alert('Please fill in all GCash details');
                    return;
                }
                paymentData.accountNumber = gcashNumber;
                paymentData.accountName = gcashName;
                break;

            case 'maya':
                const mayaNumber = document.getElementById('maya-number').value;
                const mayaName = document.getElementById('maya-name').value;
                if (!mayaNumber || !mayaName) {
                    alert('Please fill in all Maya details');
                    return;
                }
                paymentData.accountNumber = mayaNumber;
                paymentData.accountName = mayaName;
                break;

            case 'bank':
                const bank = document.getElementById('bank-select').value;
                const accountNumber = document.getElementById('account-number').value;
                const accountName = document.getElementById('account-name').value;
                if (!bank || !accountNumber || !accountName) {
                    alert('Please fill in all bank details');
                    return;
                }
                paymentData.bank = bank;
                paymentData.accountNumber = accountNumber;
                paymentData.accountName = accountName;
                break;
        }

        try {
            // Show loading state
            payButton.disabled = true;
            payButton.textContent = 'Processing...';

            // Send payment request to server
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const result = await response.json();

            // Redirect to success page
            window.location.href = `/payment-success.html?orderId=${result.orderId}`;
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
            payButton.disabled = false;
            payButton.textContent = 'Pay Now';
        }
    });

    // Input validation
    const inputs = document.querySelectorAll('input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // Remove non-numeric characters
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    });
}); 