class ButtonPinCustomization extends CustomizationBase {
  constructor() {
    super();
    this.initializeButtonPinSpecifics();
  }

  initializeButtonPinSpecifics() {
    // Initialize button pin-specific elements
    this.sizeSelect = document.querySelector('#size');
    this.materialSelect = document.querySelector('#material');
    this.backingSelect = document.querySelector('#backing');
    this.quantityInput = document.querySelector('#quantity');
    this.pinTypeSelect = document.querySelector('#pinType');
    this.colorPicker = document.querySelector('#colorPicker');
    
    // Add event listeners for button pin-specific elements
    if (this.sizeSelect) {
      this.sizeSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.materialSelect) {
      this.materialSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.backingSelect) {
      this.backingSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.pinTypeSelect) {
      this.pinTypeSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.colorPicker) {
      this.colorPicker.addEventListener('input', () => {
        this.updatePreview();
      });
    }

    // Initialize quantity controls
    const decreaseBtn = document.querySelector('#decreaseQuantity');
    const increaseBtn = document.querySelector('#increaseQuantity');
    
    if (decreaseBtn && this.quantityInput) {
      decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value);
        if (currentValue > 1) {
          this.quantityInput.value = currentValue - 1;
          this.updatePrice();
        }
      });
    }

    if (increaseBtn && this.quantityInput) {
      increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value);
        this.quantityInput.value = currentValue + 1;
        this.updatePrice();
      });
    }
  }

  getBasePrice() {
    let basePrice = 20; // Base price for button pin

    // Add price based on size
    if (this.sizeSelect) {
      switch (this.sizeSelect.value) {
        case 'large':
          basePrice += 15;
          break;
        case 'medium':
          basePrice += 10;
          break;
        case 'small':
          basePrice += 5;
          break;
      }
    }

    // Add price based on material
    if (this.materialSelect) {
      switch (this.materialSelect.value) {
        case 'metal':
          basePrice += 20;
          break;
        case 'plastic':
          basePrice += 10;
          break;
      }
    }

    // Add price based on backing
    if (this.backingSelect) {
      switch (this.backingSelect.value) {
        case 'safety':
          basePrice += 5;
          break;
        case 'magnetic':
          basePrice += 8;
          break;
        case 'standard':
          basePrice += 3;
          break;
      }
    }

    // Add price based on pin type
    if (this.pinTypeSelect) {
      switch (this.pinTypeSelect.value) {
        case 'custom':
          basePrice += 25;
          break;
        case 'standard':
          basePrice += 10;
          break;
      }
    }

    return basePrice;
  }

  updatePreview() {
    if (!this.previewImage) return;

    // Get selected options
    const size = this.sizeSelect ? this.sizeSelect.value : 'medium';
    const material = this.materialSelect ? this.materialSelect.value : 'plastic';
    const backing = this.backingSelect ? this.backingSelect.value : 'standard';
    const pinType = this.pinTypeSelect ? this.pinTypeSelect.value : 'standard';
    const color = this.colorPicker ? this.colorPicker.value : '#000000';

    // Update preview image based on selections
    this.previewImage.style.width = size === 'large' ? '100px' : size === 'medium' ? '80px' : '60px';
    this.previewImage.style.height = size === 'large' ? '100px' : size === 'medium' ? '80px' : '60px';
    this.previewImage.style.backgroundColor = color;
    this.previewImage.style.border = `2px solid ${material === 'metal' ? '#c0c0c0' : '#ffffff'}`;
    this.previewImage.style.borderRadius = '50%';
    this.previewImage.style.boxShadow = backing === 'magnetic' ? '0 0 10px rgba(0,0,0,0.2)' : 'none';
  }

  validateForm(formData) {
    super.validateForm(formData);

    // Add button pin-specific validation
    if (!formData.size) {
      throw new Error('Please select a size');
    }

    if (!formData.material) {
      throw new Error('Please select a material');
    }

    if (!formData.backing) {
      throw new Error('Please select a backing type');
    }

    if (!formData.pinType) {
      throw new Error('Please select a pin type');
    }
  }
}

// Initialize the button pin customization functionality
document.addEventListener('DOMContentLoaded', () => {
  new ButtonPinCustomization();
}); 