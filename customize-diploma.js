class DiplomaCustomization extends CustomizationBase {
  constructor() {
    super();
    this.initializeDiplomaSpecifics();
  }

  initializeDiplomaSpecifics() {
    // Initialize diploma-specific elements
    this.paperTypeSelect = document.querySelector('#paperType');
    this.sizeSelect = document.querySelector('#size');
    this.borderSelect = document.querySelector('#border');
    this.fontSelect = document.querySelector('#font');
    this.textColorSelect = document.querySelector('#textColor');
    this.sealSelect = document.querySelector('#seal');
    
    // Add event listeners for diploma-specific elements
    if (this.paperTypeSelect) {
      this.paperTypeSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.sizeSelect) {
      this.sizeSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.borderSelect) {
      this.borderSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }

    if (this.fontSelect) {
      this.fontSelect.addEventListener('change', () => {
        this.updatePreview();
      });
    }

    if (this.textColorSelect) {
      this.textColorSelect.addEventListener('change', () => {
        this.updatePreview();
      });
    }

    if (this.sealSelect) {
      this.sealSelect.addEventListener('change', () => {
        this.updatePreview();
        this.updatePrice();
      });
    }
  }

  getBasePrice() {
    let basePrice = 50; // Base price for diploma

    // Add price based on paper type
    if (this.paperTypeSelect) {
      switch (this.paperTypeSelect.value) {
        case 'premium':
          basePrice += 30;
          break;
        case 'standard':
          basePrice += 15;
          break;
      }
    }

    // Add price based on size
    if (this.sizeSelect) {
      switch (this.sizeSelect.value) {
        case 'a4':
          basePrice += 10;
          break;
        case 'a3':
          basePrice += 20;
          break;
      }
    }

    // Add price based on border
    if (this.borderSelect) {
      switch (this.borderSelect.value) {
        case 'gold':
          basePrice += 25;
          break;
        case 'silver':
          basePrice += 20;
          break;
        case 'standard':
          basePrice += 10;
          break;
      }
    }

    // Add price based on seal
    if (this.sealSelect) {
      switch (this.sealSelect.value) {
        case 'gold':
          basePrice += 30;
          break;
        case 'silver':
          basePrice += 25;
          break;
        case 'standard':
          basePrice += 15;
          break;
      }
    }

    return basePrice;
  }

  updatePreview() {
    if (!this.previewImage) return;

    // Get selected options
    const paperType = this.paperTypeSelect ? this.paperTypeSelect.value : 'standard';
    const size = this.sizeSelect ? this.sizeSelect.value : 'a4';
    const border = this.borderSelect ? this.borderSelect.value : 'standard';
    const font = this.fontSelect ? this.fontSelect.value : 'serif';
    const textColor = this.textColorSelect ? this.textColorSelect.value : '#000000';
    const seal = this.sealSelect ? this.sealSelect.value : 'standard';

    // Update preview image based on selections
    // This is a placeholder - in a real implementation, you would have actual images
    // or generate a preview using canvas
    this.previewImage.style.backgroundColor = paperType === 'premium' ? '#fffaf0' : '#ffffff';
    this.previewImage.style.border = `2px solid ${border === 'gold' ? '#ffd700' : border === 'silver' ? '#c0c0c0' : '#000000'}`;
    this.previewImage.style.fontFamily = font;
    this.previewImage.style.color = textColor;
    this.previewImage.style.padding = size === 'a3' ? '40px' : '20px';
  }

  validateForm(formData) {
    super.validateForm(formData);

    // Add diploma-specific validation
    if (!formData.paperType) {
      throw new Error('Please select a paper type');
    }

    if (!formData.size) {
      throw new Error('Please select a size');
    }

    if (!formData.border) {
      throw new Error('Please select a border style');
    }

    if (!formData.seal) {
      throw new Error('Please select a seal type');
    }
  }
}

// Initialize the diploma customization functionality
document.addEventListener('DOMContentLoaded', () => {
  new DiplomaCustomization();
}); 