class CustomizationBase {
  constructor() {
    this.form = document.querySelector('form');
    this.previewImage = document.querySelector('.preview-image');
    this.priceDisplay = document.querySelector('.price-display');
    this.quantityInput = document.querySelector('#quantity');
    this.decreaseBtn = document.querySelector('#decreaseQuantity');
    this.increaseBtn = document.querySelector('#increaseQuantity');
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Quantity controls
    if (this.decreaseBtn && this.quantityInput) {
      this.decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value);
        if (currentValue > 1) {
          this.quantityInput.value = currentValue - 1;
          this.updatePrice();
        }
      });
    }

    if (this.increaseBtn && this.quantityInput) {
      this.increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value);
        this.quantityInput.value = currentValue + 1;
        this.updatePrice();
      });
    }

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Add event listeners for all select and input elements
    const inputs = this.form.querySelectorAll('select, input');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    });
  }

  getBasePrice() {
    // This should be overridden by child classes
    return 0;
  }

  updatePrice() {
    const basePrice = this.getBasePrice();
    const quantity = parseInt(this.quantityInput.value) || 1;
    const totalPrice = basePrice * quantity;

    if (this.priceDisplay) {
      this.priceDisplay.textContent = `Total Price: ₱${totalPrice.toFixed(2)}`;
    }
  }

  updatePreview() {
    // This should be overridden by child classes
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    try {
      const formData = new FormData(this.form);
      const orderData = {
        product_type: this.getProductType(),
        quantity: parseInt(formData.get('quantity')),
        customization: this.getCustomizationData(),
        total_price: this.calculateTotalPrice()
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
      window.location.href = `/checkout.html?orderId=${result.orderId}`;
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  }

  getProductType() {
    // This should be overridden by child classes
    return '';
  }

  getCustomizationData() {
    // This should be overridden by child classes
    return {};
  }

  calculateTotalPrice() {
    const basePrice = this.getBasePrice();
    const quantity = parseInt(this.quantityInput.value) || 1;
    return basePrice * quantity;
  }
}

// Initialize the base customization functionality
document.addEventListener('DOMContentLoaded', () => {
  new CustomizationBase();
}); 