class KeychainCustomization {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.updatePrice();
  }

  initializeElements() {
    // Preview elements
    this.keychainPreview = document.querySelector('.keychain-preview');
    this.keychainImage = document.querySelector('.keychain-image');
    this.printArea = document.querySelector('.print-area');
    this.printText = document.querySelector('.print-text');
    this.uploadPreview = document.querySelector('.upload-preview');

    // Form elements
    this.keychainTypeOptions = document.querySelectorAll('.keychain-type-option');
    this.shapeOptions = document.querySelectorAll('.shape-option');
    this.materialOptions = document.querySelectorAll('.material-option');
    this.sizeOptions = document.querySelectorAll('.size-option');
    this.textInput = document.querySelector('input[name="printText"]');
    this.imageInput = document.querySelector('input[name="printImage"]');
    this.priceAmount = document.querySelector('.price-amount');
    this.addToCartBtn = document.querySelector('.add-to-cart-btn');
  }

  initializeEventListeners() {
    // Keychain type selection
    this.keychainTypeOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.selectOption(this.keychainTypeOptions, option);
        this.updateKeychainPreview();
        this.updatePrice();
      });
    });

    // Shape selection
    this.shapeOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.selectOption(this.shapeOptions, option);
        this.updateKeychainPreview();
      });
    });

    // Material selection
    this.materialOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.selectOption(this.materialOptions, option);
        this.updateKeychainPreview();
        this.updatePrice();
      });
    });

    // Size selection
    this.sizeOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.selectOption(this.sizeOptions, option);
        this.updatePrice();
      });
    });

    // Text input
    this.textInput.addEventListener('input', () => {
      this.updatePrintText();
    });

    // Image upload
    this.imageInput.addEventListener('change', (e) => {
      this.handleImageUpload(e);
    });

    // Add to cart
    this.addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.addToCart();
    });
  }

  selectOption(options, selectedOption) {
    options.forEach(option => option.classList.remove('selected'));
    selectedOption.classList.add('selected');
  }

  updateKeychainPreview() {
    const type = document.querySelector('.keychain-type-option.selected').dataset.type;
    const shape = document.querySelector('.shape-option.selected').dataset.shape;
    const material = document.querySelector('.material-option.selected').dataset.material;

    // Update keychain image based on selections
    this.keychainImage.src = `/images/keychains/${type}-${shape}-${material}.png`;
  }

  updatePrintText() {
    const text = this.textInput.value;
    this.printText.textContent = text || 'Your text here';
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadPreview.src = e.target.result;
        this.uploadPreview.style.display = 'block';
        this.printText.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  }

  updatePrice() {
    const type = document.querySelector('.keychain-type-option.selected').dataset.type;
    const material = document.querySelector('.material-option.selected').dataset.material;
    const size = document.querySelector('.size-option.selected').dataset.size;
    const hasImage = this.uploadPreview.style.display === 'block';

    // Base prices
    const prices = {
      standard: {
        plastic: { small: 50, medium: 60, large: 70 },
        metal: { small: 80, medium: 90, large: 100 }
      },
      premium: {
        plastic: { small: 70, medium: 80, large: 90 },
        metal: { small: 100, medium: 110, large: 120 }
      }
    };

    // Calculate total price
    let totalPrice = prices[type][material][size];
    if (hasImage) {
      totalPrice += 30; // Additional charge for image printing
    }

    this.priceAmount.textContent = `₹${totalPrice}`;
  }

  addToCart() {
    const customization = {
      type: document.querySelector('.keychain-type-option.selected').dataset.type,
      shape: document.querySelector('.shape-option.selected').dataset.shape,
      material: document.querySelector('.material-option.selected').dataset.material,
      size: document.querySelector('.size-option.selected').dataset.size,
      text: this.textInput.value,
      image: this.uploadPreview.src,
      price: parseInt(this.priceAmount.textContent.replace('₹', ''))
    };

    // Add to cart logic here
    console.log('Adding to cart:', customization);
    alert('Keychain added to cart!');
  }
}

// Initialize the customization when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new KeychainCustomization();
}); 