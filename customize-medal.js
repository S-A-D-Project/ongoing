class MedalCustomization extends CustomizationBase {
  constructor() {
    super();
    this.medalImage = document.querySelector('.medal-image');
    this.ribbonPreview = document.querySelector('.ribbon-preview');
    this.engravingPreview = document.querySelector('.engraving-preview');
    this.engravingText = document.querySelector('.engraving-text');
    
    this.initializeMedalSpecificListeners();
    this.updateMedalPreview();
  }

  initializeMedalSpecificListeners() {
    // Material selection
    document.querySelectorAll('.material-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectMaterial(option);
        this.updateMedalPreview();
        this.updatePrice();
      });
    });

    // Shape selection
    document.querySelectorAll('.shape-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectShape(option);
        this.updateMedalPreview();
        this.updatePrice();
      });
    });

    // Engraving text input
    const engravingInput = document.querySelector('input[name="engraving"]');
    if (engravingInput) {
      engravingInput.addEventListener('input', () => {
        this.updateEngravingPreview(engravingInput.value);
      });
    }
  }

  selectMaterial(option) {
    document.querySelectorAll('.material-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  selectShape(option) {
    document.querySelectorAll('.shape-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  }

  updateMedalPreview() {
    const material = document.querySelector('.material-option.selected')?.dataset.material || 'metal';
    const shape = document.querySelector('.shape-option.selected')?.dataset.shape || 'round';
    const ribbonColor = document.querySelector('.color-option.selected')?.dataset.color || 'blue';

    // Update medal image based on material and shape
    if (this.medalImage) {
      this.medalImage.src = `/images/medals/${material}-${shape}.png`;
    }

    // Update ribbon color
    if (this.ribbonPreview) {
      this.ribbonPreview.style.backgroundColor = this.getColorCode(ribbonColor);
    }
  }

  updateEngravingPreview(text) {
    if (this.engravingText) {
      this.engravingText.textContent = text || 'Your text here';
    }
  }

  getColorCode(color) {
    const colors = {
      blue: '#1e88e5',
      red: '#e53935',
      yellow: '#fdd835',
      green: '#43a047',
      purple: '#8e24aa'
    };
    return colors[color] || colors.blue;
  }

  getBasePrice() {
    const material = document.querySelector('.material-option.selected')?.dataset.material || 'metal';
    const shape = document.querySelector('.shape-option.selected')?.dataset.shape || 'round';
    
    const prices = {
      metal: {
        round: 150,
        star: 180
      },
      plastic: {
        round: 100,
        star: 120
      }
    };

    return prices[material]?.[shape] || 150;
  }

  validateForm(formData) {
    super.validateForm(formData);

    if (!formData.material) {
      throw new Error('Please select a material');
    }

    if (!formData.shape) {
      throw new Error('Please select a shape');
    }

    if (!formData.ribbonColor) {
      throw new Error('Please select a ribbon color');
    }

    if (formData.engraving && formData.engraving.length > 50) {
      throw new Error('Engraving text must be 50 characters or less');
    }
  }
}

// Initialize the medal customization
document.addEventListener('DOMContentLoaded', () => {
  new MedalCustomization();
}); 