class TarpaulinCustomization {
    constructor() {
        this.form = document.getElementById('tarpaulinForm');
        this.sizeSelect = document.getElementById('size');
        this.customSize = document.getElementById('customSize');
        this.widthInput = document.getElementById('width');
        this.heightInput = document.getElementById('height');
        this.materialSelect = document.getElementById('material');
        this.grommetsSelect = document.getElementById('grommets');
        this.customGrommets = document.getElementById('customGrommets');
        this.grommetCount = document.getElementById('grommetCount');
        this.grommetSpacing = document.getElementById('grommetSpacing');
        this.marginSelect = document.getElementById('margin');
        this.quantityInput = document.getElementById('quantity');
        this.fileUpload = document.getElementById('fileUpload');
        this.filePreview = document.getElementById('filePreview');
        this.instructions = document.getElementById('instructions');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.orderNowBtn = document.getElementById('orderNowBtn');

        // Price elements
        this.basePriceEl = document.getElementById('basePrice');
        this.materialUpgradeEl = document.getElementById('materialUpgrade');
        this.grommetsCostEl = document.getElementById('grommetsCost');
        this.totalPriceEl = document.getElementById('totalPrice');

        // Preview elements
        this.previewImage = document.getElementById('previewImage');
        this.productPreview = document.getElementById('productPreview');
        this.previewSizeLabel = document.querySelector('.preview-size-label');

        // Image orientation state
        this.imageRotation = 0;
        this.imageScaleX = 1;
        this.imageScaleY = 1;

        // Pricing configuration
        this.pricing = {
            base: {
                '2x3': 500,
                '3x5': 800,
                '4x6': 1200
            },
            material: {
                'vinyl': 0,
                'mesh': 200
            },
            grommets: {
                'none': 0,
                'standard': 50
            }
        };

        this.uploadedFiles = [];
        this.initializeEventListeners();
        this.updatePrice();
    }

    initializeEventListeners() {
        // Size selection
        this.sizeSelect.addEventListener('change', () => {
            this.customSize.style.display = this.sizeSelect.value === 'custom' ? 'block' : 'none';
            this.updatePrice();
            this.updatePreview();
        });

        // Custom size inputs
        this.widthInput.addEventListener('input', () => {
            this.updatePrice();
            this.updatePreview();
        });
        this.heightInput.addEventListener('input', () => {
            this.updatePrice();
            this.updatePreview();
        });

        // Material and grommets
        this.materialSelect.addEventListener('change', () => this.updatePrice());
        this.grommetsSelect.addEventListener('change', () => {
            this.customGrommets.style.display = this.grommetsSelect.value === 'custom' ? 'block' : 'none';
            this.updatePrice();
            this.updateGrommetMarkers();
        });

        // Quantity
        this.quantityInput.addEventListener('input', () => this.updatePrice());

        // File upload
        this.fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Cancel button
        this.cancelBtn.addEventListener('click', () => this.handleCancel());

        // Grommets
        this.grommetCount.addEventListener('input', () => this.updateGrommetMarkers());
        this.grommetSpacing.addEventListener('input', () => this.updateGrommetMarkers());

        // Margin
        this.marginSelect.addEventListener('change', () => {
            this.productPreview.setAttribute('data-margin', this.marginSelect.value);
        });

        // Image orientation controls
        this.rotateLeftBtn.addEventListener('click', () => this.rotateImage(-90));
        this.rotateRightBtn.addEventListener('click', () => this.rotateImage(90));
        this.flipHorizontalBtn.addEventListener('click', () => this.flipImage('horizontal'));
        this.flipVerticalBtn.addEventListener('click', () => this.flipImage('vertical'));
    }

    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        this.uploadedFiles = files;
        this.updateFilePreview();
        
        // Update product preview with the first image file
        const imageFile = files.find(file => file.type.startsWith('image/'));
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImage.src = e.target.result;
                this.updatePreview();
            };
            reader.readAsDataURL(imageFile);
        }
    }

    updateFilePreview() {
        this.filePreview.innerHTML = '';
        
        this.uploadedFiles.forEach((file, index) => {
            const fileContainer = document.createElement('div');
            fileContainer.className = 'file-preview-item';
            
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                fileContainer.appendChild(img);
            } else {
                const icon = document.createElement('i');
                icon.className = 'fas fa-file';
                fileContainer.appendChild(icon);
            }
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileContainer.appendChild(fileName);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.onclick = () => this.removeFile(index);
            fileContainer.appendChild(removeBtn);
            
            this.filePreview.appendChild(fileContainer);
        });
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.updateFilePreview();
    }

    calculateBasePrice() {
        if (this.sizeSelect.value === 'custom') {
            const width = parseFloat(this.widthInput.value) || 0;
            const height = parseFloat(this.heightInput.value) || 0;
            const area = width * height;
            return area * 100; // ₱100 per square foot for custom sizes
        }
        return this.pricing.base[this.sizeSelect.value] || 0;
    }

    updatePrice() {
        const basePrice = this.calculateBasePrice();
        const quantity = parseInt(this.quantityInput.value) || 1;
        const materialUpgrade = this.pricing.material[this.materialSelect.value] || 0;
        
        // Calculate grommet cost
        let grommetsCost = 0;
        if (this.grommetsSelect.value === 'standard') {
            grommetsCost = this.pricing.grommets.standard;
        } else if (this.grommetsSelect.value === 'custom') {
            const count = parseInt(this.grommetCount.value) || 0;
            grommetsCost = count * 10; // ₱10 per grommet
        }

        // Calculate margin cost
        const marginCosts = {
            none: 0,
            small: 50,
            medium: 100,
            large: 150
        };
        const marginCost = marginCosts[this.marginSelect.value] || 0;

        const total = (basePrice + materialUpgrade + grommetsCost + marginCost) * quantity;

        this.basePriceEl.textContent = `₱${basePrice.toFixed(2)}`;
        this.materialUpgradeEl.textContent = `₱${materialUpgrade.toFixed(2)}`;
        this.grommetsCostEl.textContent = `₱${grommetsCost.toFixed(2)}`;
        this.totalPriceEl.textContent = `₱${total.toFixed(2)}`;
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if (this.uploadedFiles.length === 0) {
            alert('Please upload your design file');
            return;
        }

        const formData = new FormData(this.form);
        const orderData = {
            size: this.sizeSelect.value === 'custom' 
                ? `${this.widthInput.value}x${this.heightInput.value} ft`
                : this.sizeSelect.value,
            material: this.materialSelect.value,
            grommets: {
                type: this.grommetsSelect.value,
                count: this.grommetsSelect.value === 'custom' ? parseInt(this.grommetCount.value) : 4,
                spacing: this.grommetsSelect.value === 'custom' ? parseFloat(this.grommetSpacing.value) : 6
            },
            margin: this.marginSelect.value,
            quantity: parseInt(this.quantityInput.value),
            files: this.uploadedFiles,
            instructions: this.instructions.value,
            imageOrientation: {
                rotation: this.imageRotation,
                scaleX: this.imageScaleX,
                scaleY: this.imageScaleY
            },
            totalPrice: parseFloat(this.totalPriceEl.textContent.replace('₱', ''))
        };

        // Store order data temporarily
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    }

    handleCancel() {
        if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
            window.location.href = 'index.html';
        }
    }

    updatePreview() {
        let sizeText = '';
        let aspectRatio = 1;

        if (this.sizeSelect.value === 'custom') {
            const width = parseFloat(this.widthInput.value) || 0;
            const height = parseFloat(this.heightInput.value) || 0;
            if (width && height) {
                sizeText = `${width}x${height} ft`;
                aspectRatio = height / width;
            }
        } else {
            const [width, height] = this.sizeSelect.value.split('x');
            sizeText = `${width}x${height} ft`;
            aspectRatio = parseInt(height) / parseInt(width);
        }

        // Update size label
        this.previewSizeLabel.textContent = sizeText;

        // Update preview container aspect ratio
        this.productPreview.setAttribute('data-size', this.sizeSelect.value);
        if (this.sizeSelect.value === 'custom') {
            const previewContainer = this.productPreview.querySelector('.preview-image-container');
            previewContainer.style.paddingTop = `${aspectRatio * 100}%`;
        }
    }

    updateGrommetMarkers() {
        this.grommetMarkers.innerHTML = '';
        
        if (this.grommetsSelect.value === 'none') return;

        const count = this.grommetsSelect.value === 'standard' ? 4 : parseInt(this.grommetCount.value);
        const spacing = this.grommetsSelect.value === 'standard' ? 6 : parseFloat(this.grommetSpacing.value);
        
        if (count <= 0) return;

        // Calculate positions for grommet holes
        const container = this.productPreview;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Convert spacing from inches to pixels (assuming 1 inch = 96 pixels)
        const spacingPx = spacing * 96;
        
        // Calculate positions for each grommet
        for (let i = 0; i < count; i++) {
            const marker = document.createElement('div');
            marker.className = 'grommet-marker';
            
            // Position markers along the edges
            if (i < count / 2) {
                // Top edge
                marker.style.left = `${(i * spacingPx) + spacingPx}px`;
                marker.style.top = '0';
            } else {
                // Bottom edge
                marker.style.left = `${((i - count/2) * spacingPx) + spacingPx}px`;
                marker.style.bottom = '0';
            }
            
            this.grommetMarkers.appendChild(marker);
        }
    }

    rotateImage(degrees) {
        this.imageRotation = (this.imageRotation + degrees) % 360;
        this.updateImageTransform();
    }

    flipImage(direction) {
        if (direction === 'horizontal') {
            this.imageScaleX *= -1;
        } else {
            this.imageScaleY *= -1;
        }
        this.updateImageTransform();
    }

    updateImageTransform() {
        this.previewImage.style.transform = `rotate(${this.imageRotation}deg) scaleX(${this.imageScaleX}) scaleY(${this.imageScaleY})`;
    }
}

// Initialize the customization
document.addEventListener('DOMContentLoaded', () => {
    new TarpaulinCustomization();
}); 