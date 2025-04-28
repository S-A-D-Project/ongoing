class EcoBagCustomization extends CustomizationBase {
  constructor() {
    super();
    this.basePrice = 50.00; // Base price for eco bag
    this.updatePreview();
    this.updatePrice();
  }

  getBasePrice() {
    return this.basePrice;
  }

  getProductType() {
    return 'eco_bag';
  }

  getCustomizationData() {
    const formData = new FormData(this.form);
    return {
      size: formData.get('size'),
      color: formData.get('color'),
      material: formData.get('material'),
      design: formData.get('design'),
      text: formData.get('text'),
      logo: formData.get('logo')
    };
  }

  updatePreview() {
    if (!this.previewImage) return;

    const formData = new FormData(this.form);
    const size = formData.get('size');
    const color = formData.get('color');
    const material = formData.get('material');
    const design = formData.get('design');
    const text = formData.get('text');
    const logo = formData.get('logo');

    // Update preview image based on selected options
    let previewUrl = `/images/eco-bag-preview/${size}-${color}-${material}.jpg`;
    
    // Add design overlay if selected
    if (design) {
      previewUrl += `?design=${design}`;
    }

    // Add text overlay if provided
    if (text) {
      previewUrl += `&text=${encodeURIComponent(text)}`;
    }

    // Add logo if provided
    if (logo) {
      previewUrl += `&logo=${encodeURIComponent(logo.name)}`;
    }

    this.previewImage.src = previewUrl;
  }

  validateForm(formData) {
    super.validateForm(formData);

    // Add eco bag-specific validation
    if (!formData.size) {
      throw new Error('Please select a size');
    }

    if (!formData.material) {
      throw new Error('Please select a material');
    }

    if (!formData.handle) {
      throw new Error('Please select a handle type');
    }

    if (!formData.text || formData.text.trim() === '') {
      throw new Error('Please enter text for the bag');
    }
  }
}

// Initialize the customization when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('customizationForm');
    const previewImage = document.getElementById('previewImage');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');

    // Base price for the eco bag
    const basePrice = 50.00;

    // Update preview image based on selected options
    function updatePreview() {
        const size = document.getElementById('size').value;
        const color = document.getElementById('color').value;
        const material = document.getElementById('material').value;
        const design = document.getElementById('design').value;
        const text = document.getElementById('text').value;
        const logo = document.getElementById('logo').files[0];

        // Update preview image based on selected options
        let previewUrl = `/images/eco-bag-preview/${size}-${color}-${material}.jpg`;
        
        // Add design overlay if selected
        if (design) {
            previewUrl += `?design=${design}`;
        }

        // Add text overlay if provided
        if (text) {
            previewUrl += `&text=${encodeURIComponent(text)}`;
        }

        // Add logo if provided
        if (logo) {
            previewUrl += `&logo=${encodeURIComponent(logo.name)}`;
        }

        previewImage.src = previewUrl;
    }

    // Update total price based on quantity
    function updatePrice() {
        const quantity = parseInt(quantityInput.value) || 1;
        const totalPrice = basePrice * quantity;
        totalPriceDisplay.textContent = totalPrice.toFixed(2);
    }

    // Handle quantity controls
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updatePrice();
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
        updatePrice();
    });

    // Update preview and price when any option changes
    const inputs = form.querySelectorAll('select, input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updatePreview();
            updatePrice();
        });
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            const orderData = {
                size: formData.get('size'),
                material: formData.get('material'),
                color: formData.get('color'),
                design: formData.get('design'),
                text: formData.get('text'),
                logo: formData.get('logo'),
                quantity: parseInt(formData.get('quantity')),
                totalPrice: parseFloat(totalPriceDisplay.textContent)
            };

            // Send order to server
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit order');
            }

            const result = await response.json();
            
            // Redirect to checkout page with order ID
            window.location.href = `/checkout.html?orderId=${result.orderId}`;
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order. Please try again.');
        }
    });

    // Initial preview and price update
    updatePreview();
    updatePrice();
}); 