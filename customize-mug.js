class MugCustomization extends CustomizationBase {
  constructor() {
    super();
    this.mugImage = document.querySelector('.mug-image');
    this.printArea = document.querySelector('.print-area');
    this.printText = document.querySelector('.print-text');
    this.uploadPreview = document.querySelector('.upload-preview');
    
    this.initializeMugSpecificListeners();
    this.updateMugPreview();
  }

  initializeMugSpecificListeners() {
    // Mug type selection
    document.querySelectorAll('.mug-type-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectMugType(option);
        this.updateMugPreview();
        this.updatePrice();
      });
    });

    // Handle color selection
    document.querySelectorAll('.handle-color-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectHandleColor(option);
        this.updateMugPreview();
      });
    });

    // Capacity selection
    document.querySelectorAll('.capacity-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectCapacity(option);
        this.updatePrice();
      });
    });

    // Print style selection
    document.querySelectorAll('.print-style-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectPrintStyle(option);
        this.updateMugPreview();
        this.updatePrice();
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

  selectMugType(option) {
    document.querySelectorAll('.mug-type-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  selectHandleColor(option) {
    document.querySelectorAll('.handle-color-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  selectCapacity(option) {
    document.querySelectorAll('.capacity-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  selectPrintStyle(option) {
    document.querySelectorAll('.print-style-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  updateMugPreview() {
    const type = document.querySelector('.mug-type-option.selected')?.dataset.type || 'classic';
    const handleColor = document.querySelector('.handle-color-option.selected')?.dataset.color || 'white';
    const printStyle = document.querySelector('.print-style-option.selected')?.dataset.style || 'full';

    // Update mug image based on type and handle color
    if (this.mugImage) {
      this.mugImage.src = `/images/mugs/${type}-${handleColor}.png`;
    }

    // Update print style
    if (this.printArea) {
      this.printArea.className = `print-area ${printStyle}`;
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
    const type = document.querySelector('.mug-type-option.selected')?.dataset.type || 'classic';
    const capacity = document.querySelector('.capacity-option.selected')?.dataset.capacity || '12oz';
    const printStyle = document.querySelector('.print-style-option.selected')?.dataset.style || 'full';
    const hasImage = this.uploadPreview.classList.contains('visible');
    
    const prices = {
      classic: {
        '12oz': 150,
        '16oz': 180,
        '20oz': 200
      },
      travel: {
        '12oz': 200,
        '16oz': 230,
        '20oz': 250
      }
    };

    const basePrice = prices[type]?.[capacity] || 150;
    const printStyleMultiplier = printStyle === 'full' ? 1.2 : 1;
    const imagePremium = hasImage ? 50 : 0;
    
    return (basePrice * printStyleMultiplier) + imagePremium;
  }

  validateForm(formData) {
    super.validateForm(formData);

    if (!formData.mugType) {
      throw new Error('Please select a mug type');
    }

    if (!formData.capacity) {
      throw new Error('Please select a capacity');
    }

    if (!formData.printStyle) {
      throw new Error('Please select a print style');
    }

    if (!formData.printText && !formData.printImage) {
      throw new Error('Please add text or upload an image for printing');
    }

    if (formData.printText && formData.printText.length > 50) {
      throw new Error('Print text must be 50 characters or less');
    }
  }
}

// Initialize the mug customization
document.addEventListener('DOMContentLoaded', () => {
  new MugCustomization();
}); 