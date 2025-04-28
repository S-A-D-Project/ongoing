class TShirtCustomization extends CustomizationBase {
  constructor() {
    super();
    this.tshirtImage = document.querySelector('.tshirt-image');
    this.printPreview = document.querySelector('.print-preview');
    this.printText = document.querySelector('.print-text');
    this.uploadPreview = document.querySelector('.upload-preview');
    
    this.initializeTShirtSpecificListeners();
    this.updateTShirtPreview();
  }

  initializeTShirtSpecificListeners() {
    // Size selection
    document.querySelectorAll('.size-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectSize(option);
        this.updatePrice();
      });
    });

    // Print position selection
    document.querySelectorAll('.position-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectPosition(option);
        this.updateTShirtPreview();
      });
    });

    // Font selection
    document.querySelectorAll('.font-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectFont(option);
        this.updateTShirtPreview();
      });
    });

    // Text input
    const textInput = document.querySelector('input[name="printText"]');
    if (textInput) {
      textInput.addEventListener('input', () => {
        this.updatePrintText(textInput.value);
      });
    }

    // Image upload
    const imageUpload = document.querySelector('input[name="printImage"]');
    if (imageUpload) {
      imageUpload.addEventListener('change', (e) => {
        this.handleImageUpload(e);
      });
    }
  }

  selectSize(option) {
    document.querySelectorAll('.size-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  selectPosition(option) {
    document.querySelectorAll('.position-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  selectFont(option) {
    document.querySelectorAll('.font-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  updateTShirtPreview() {
    const color = document.querySelector('.color-option.selected')?.dataset.color || 'white';
    const position = document.querySelector('.position-option.selected')?.dataset.position || 'center';
    const font = document.querySelector('.font-option.selected')?.dataset.font || 'arial';

    // Update t-shirt color
    if (this.tshirtImage) {
      this.tshirtImage.src = `/images/tshirts/${color}.png`;
    }

    // Update print position
    if (this.printPreview) {
      this.printPreview.style.position = position;
    }

    // Update font
    if (this.printText) {
      this.printText.style.fontFamily = font;
    }
  }

  updatePrintText(text) {
    if (this.printText) {
      this.printText.textContent = text || 'Your text here';
    }
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadPreview.src = e.target.result;
        this.uploadPreview.classList.add('visible');
        this.printText.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  }

  getBasePrice() {
    const size = document.querySelector('.size-option.selected')?.dataset.size || 'M';
    const hasImage = this.uploadPreview.classList.contains('visible');
    
    const prices = {
      S: 250,
      M: 280,
      L: 300,
      XL: 320,
      XXL: 350
    };

    const basePrice = prices[size] || 280;
    return hasImage ? basePrice + 50 : basePrice;
  }

  validateForm(formData) {
    super.validateForm(formData);

    if (!formData.size) {
      throw new Error('Please select a size');
    }

    if (!formData.color) {
      throw new Error('Please select a color');
    }

    if (!formData.printText && !formData.printImage) {
      throw new Error('Please add text or upload an image for printing');
    }

    if (formData.printText && formData.printText.length > 50) {
      throw new Error('Print text must be 50 characters or less');
    }
  }
}

// Initialize the t-shirt customization
document.addEventListener('DOMContentLoaded', () => {
  new TShirtCustomization();
}); 