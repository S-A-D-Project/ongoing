class DrySealCustomization extends CustomizationBase {
  constructor() {
    super();
    this.initializeDrySealSpecifics();
  }

  initializeDrySealSpecifics() {
    // Initialize dry seal-specific elements
    this.sizeSelect = document.querySelector('#size');
    this.materialSelect = document.querySelector('#material');
    this.handleSelect = document.querySelector('#handle');
    this.quantityInput = document.querySelector('#quantity');
    this.textInput = document.querySelector('#text');
    this.fontSelect = document.querySelector('#font');
    
    // Add event listeners for dry seal-specific elements
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

    if (this.handleSelect) {
      this.handleSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.textInput) {
      this.textInput.addEventListener('input', () => {
        this.updatePreview();
      });
    }

    if (this.fontSelect) {
      this.fontSelect.addEventListener('change', () => {
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
    let basePrice = 100; // Base price for dry seal

    // Add price based on size
    if (this.sizeSelect) {
      switch (this.sizeSelect.value) {
        case 'large':
          basePrice += 50;
          break;
        case 'medium':
          basePrice += 30;
          break;
        case 'small':
          basePrice += 20;
          break;
      }
    }

    // Add price based on material
    if (this.materialSelect) {
      switch (this.materialSelect.value) {
        case 'brass':
          basePrice += 100;
          break;
        case 'steel':
          basePrice += 80;
          break;
        case 'aluminum':
          basePrice += 60;
          break;
      }
    }

    // Add price based on handle
    if (this.handleSelect) {
      switch (this.handleSelect.value) {
        case 'wooden':
          basePrice += 40;
          break;
        case 'plastic':
          basePrice += 20;
          break;
        case 'metal':
          basePrice += 30;
          break;
      }
    }

    return basePrice;
  }

  updatePreview() {
    if (!this.previewImage) return;

    // Get selected options
    const size = this.sizeSelect ? this.sizeSelect.value : 'medium';
    const material = this.materialSelect ? this.materialSelect.value : 'steel';
    const handle = this.handleSelect ? this.handleSelect.value : 'plastic';
    const text = this.textInput ? this.textInput.value : 'Sample Text';
    const font = this.fontSelect ? this.fontSelect.value : 'serif';

    // Update preview image based on selections
    this.previewImage.style.width = size === 'large' ? '150px' : size === 'medium' ? '120px' : '100px';
    this.previewImage.style.height = size === 'large' ? '150px' : size === 'medium' ? '120px' : '100px';
    this.previewImage.style.backgroundColor = material === 'brass' ? '#b5a642' : 
                                           material === 'steel' ? '#71797E' : 
                                           '#C0C0C0';
    this.previewImage.style.border = '2px solid #000';
    this.previewImage.style.borderRadius = '50%';
    this.previewImage.style.fontFamily = font;
    this.previewImage.style.color = '#000';
    this.previewImage.style.display = 'flex';
    this.previewImage.style.alignItems = 'center';
    this.previewImage.style.justifyContent = 'center';
    this.previewImage.style.textAlign = 'center';
    this.previewImage.style.padding = '10px';
    this.previewImage.style.fontWeight = 'bold';
    this.previewImage.textContent = text;
  }

  validateForm(formData) {
    super.validateForm(formData);

    // Add dry seal-specific validation
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
      throw new Error('Please enter text for the seal');
    }
  }
}

// Initialize the dry seal customization functionality
document.addEventListener('DOMContentLoaded', () => {
  new DrySealCustomization();
}); 