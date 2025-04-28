class OrderCustomization {
    constructor() {
        this.modal = document.querySelector('.customization-modal');
        this.form = document.querySelector('#customization-form');
        this.priceSummary = document.querySelector('.price-summary');
        this.basePrice = 0;
        this.currentProduct = null;
        this.uploadedFiles = [];

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Close modal button
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());

        // Form inputs
        this.form.addEventListener('change', (e) => this.updatePrice());
        this.form.addEventListener('input', (e) => this.updatePrice());

        // File upload
        document.querySelector('#file-upload').addEventListener('change', (e) => this.handleFileUpload(e));

        // Custom size toggle
        document.querySelector('#custom-size-toggle').addEventListener('change', (e) => {
            document.querySelector('.custom-size').style.display = e.target.checked ? 'grid' : 'none';
        });

        // Submit form
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    openModal(product) {
        this.currentProduct = product;
        this.basePrice = product.price;
        this.modal.classList.add('active');
        this.resetForm();
        this.updatePrice();
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
        this.uploadedFiles = [];
        this.updateFilePreview();
        document.querySelector('.custom-size').style.display = 'none';
    }

    updatePrice() {
        const quantity = parseInt(document.querySelector('#quantity').value) || 1;
        const paperType = document.querySelector('#paper-type').value;
        const paperWeight = document.querySelector('#paper-weight').value;
        const colorMode = document.querySelector('#color-mode').value;
        const printSides = document.querySelector('#print-sides').value;
        const finishingOptions = Array.from(document.querySelector('#finishing-options').selectedOptions)
            .map(option => option.value);

        let totalPrice = this.basePrice * quantity;
        let priceDetails = [
            { label: 'Base Price', value: `₱${(this.basePrice * quantity).toFixed(2)}` }
        ];

        // Paper type upgrade
        if (paperType !== 'standard') {
            const upgradePrice = 50 * quantity;
            totalPrice += upgradePrice;
            priceDetails.push({ label: 'Paper Upgrade', value: `₱${upgradePrice.toFixed(2)}` });
        }

        // Paper weight upgrade
        if (paperWeight !== 'standard') {
            const upgradePrice = 30 * quantity;
            totalPrice += upgradePrice;
            priceDetails.push({ label: 'Weight Upgrade', value: `₱${upgradePrice.toFixed(2)}` });
        }

        // Color mode
        if (colorMode === 'color') {
            const colorPrice = 20 * quantity;
            totalPrice += colorPrice;
            priceDetails.push({ label: 'Color Printing', value: `₱${colorPrice.toFixed(2)}` });
        }

        // Double-sided printing
        if (printSides === 'double') {
            const doubleSidedPrice = 15 * quantity;
            totalPrice += doubleSidedPrice;
            priceDetails.push({ label: 'Double-sided', value: `₱${doubleSidedPrice.toFixed(2)}` });
        }

        // Finishing options
        finishingOptions.forEach(option => {
            const optionPrice = 25 * quantity;
            totalPrice += optionPrice;
            priceDetails.push({ label: option.charAt(0).toUpperCase() + option.slice(1), value: `₱${optionPrice.toFixed(2)}` });
        });

        // Update price summary
        const priceDetailsHTML = priceDetails.map(detail => `
            <div class="price-item">
                <span>${detail.label}</span>
                <span>${detail.value}</span>
            </div>
        `).join('');

        this.priceSummary.innerHTML = `
            <div class="price-details">
                ${priceDetailsHTML}
                <div class="price-item total">
                    <span>Total</span>
                    <span>₱${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedFiles.push({
                        name: file.name,
                        url: e.target.result
                    });
                    this.updateFilePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updateFilePreview() {
        const previewContainer = document.querySelector('.file-preview');
        previewContainer.innerHTML = this.uploadedFiles.map((file, index) => `
            <div class="file-preview-item">
                <img src="${file.url}" alt="${file.name}">
                <button class="remove-file" onclick="orderCustomization.removeFile(${index})">×</button>
            </div>
        `).join('');
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.updateFilePreview();
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(this.form);
        const customizationData = {
            product: this.currentProduct,
            quantity: parseInt(formData.get('quantity')),
            size: formData.get('size'),
            customSize: {
                width: formData.get('custom-width'),
                height: formData.get('custom-height')
            },
            paperType: formData.get('paper-type'),
            paperWeight: formData.get('paper-weight'),
            colorMode: formData.get('color-mode'),
            printSides: formData.get('print-sides'),
            finishingOptions: Array.from(formData.getAll('finishing-options')),
            specialInstructions: formData.get('special-instructions'),
            files: this.uploadedFiles
        };

        // Add to cart
        this.addToCart(customizationData);
    }

    addToCart(customizationData) {
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Add new item to cart
        cart.push(customizationData);
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        this.showSuccess('Item added to cart successfully!');
        
        // Close modal
        this.closeModal();
        
        // Update cart count
        this.updateCartCount();
    }

    showSuccess(message) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }
}

// Initialize the order customization
const orderCustomization = new OrderCustomization();

// Product customization templates
const customizationTemplates = {
    business_cards: {
        options: [
            {
                id: 'paperType',
                label: 'Paper Type',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard (300gsm)', priceMultiplier: 1 },
                    { value: 'premium', label: 'Premium (400gsm)', priceMultiplier: 1.3 }
                ]
            },
            {
                id: 'finish',
                label: 'Finish',
                type: 'select',
                options: [
                    { value: 'matte', label: 'Matte', priceMultiplier: 1 },
                    { value: 'glossy', label: 'Glossy', priceMultiplier: 1.2 }
                ]
            },
            {
                id: 'sides',
                label: 'Print Sides',
                type: 'select',
                options: [
                    { value: 'single', label: 'Single Side', priceMultiplier: 1 },
                    { value: 'double', label: 'Double Side', priceMultiplier: 1.5 }
                ]
            }
        ]
    },
    flyers: {
        options: [
            {
                id: 'paperType',
                label: 'Paper Type',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard (100gsm)', priceMultiplier: 1 },
                    { value: 'premium', label: 'Premium (150gsm)', priceMultiplier: 1.3 }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                type: 'select',
                options: [
                    { value: 'a4', label: 'A4', priceMultiplier: 1 },
                    { value: 'a5', label: 'A5', priceMultiplier: 0.8 }
                ]
            },
            {
                id: 'color',
                label: 'Color',
                type: 'select',
                options: [
                    { value: 'bw', label: 'Black & White', priceMultiplier: 1 },
                    { value: 'color', label: 'Full Color', priceMultiplier: 1.5 }
                ]
            }
        ]
    },
    brochures: {
        options: [
            {
                id: 'paperType',
                label: 'Paper Type',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard (120gsm)', priceMultiplier: 1 },
                    { value: 'premium', label: 'Premium (170gsm)', priceMultiplier: 1.3 }
                ]
            },
            {
                id: 'folding',
                label: 'Folding',
                type: 'select',
                options: [
                    { value: 'none', label: 'No Folding', priceMultiplier: 1 },
                    { value: 'bi-fold', label: 'Bi-fold', priceMultiplier: 1.2 },
                    { value: 'tri-fold', label: 'Tri-fold', priceMultiplier: 1.3 }
                ]
            },
            {
                id: 'lamination',
                label: 'Lamination',
                type: 'select',
                options: [
                    { value: 'none', label: 'No Lamination', priceMultiplier: 1 },
                    { value: 'matte', label: 'Matte Lamination', priceMultiplier: 1.4 },
                    { value: 'glossy', label: 'Glossy Lamination', priceMultiplier: 1.4 }
                ]
            }
        ]
    },
    banners: {
        options: [
            {
                id: 'material',
                label: 'Material',
                type: 'select',
                options: [
                    { value: 'vinyl', label: 'Vinyl', priceMultiplier: 1 },
                    { value: 'fabric', label: 'Fabric', priceMultiplier: 1.5 }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                type: 'select',
                options: [
                    { value: 'small', label: 'Small (2x3 ft)', priceMultiplier: 1 },
                    { value: 'medium', label: 'Medium (3x5 ft)', priceMultiplier: 1.5 },
                    { value: 'large', label: 'Large (4x6 ft)', priceMultiplier: 2 }
                ]
            },
            {
                id: 'grommets',
                label: 'Grommets',
                type: 'select',
                options: [
                    { value: 'none', label: 'No Grommets', priceMultiplier: 1 },
                    { value: 'standard', label: 'Standard Grommets', priceMultiplier: 1.2 }
                ]
            }
        ]
    },
    stickers: {
        options: [
            {
                id: 'material',
                label: 'Material',
                type: 'select',
                options: [
                    { value: 'paper', label: 'Paper', priceMultiplier: 1 },
                    { value: 'vinyl', label: 'Vinyl', priceMultiplier: 1.3 },
                    { value: 'clear', label: 'Clear', priceMultiplier: 1.4 }
                ]
            },
            {
                id: 'finish',
                label: 'Finish',
                type: 'select',
                options: [
                    { value: 'matte', label: 'Matte', priceMultiplier: 1 },
                    { value: 'glossy', label: 'Glossy', priceMultiplier: 1.2 }
                ]
            },
            {
                id: 'shape',
                label: 'Shape',
                type: 'select',
                options: [
                    { value: 'square', label: 'Square', priceMultiplier: 1 },
                    { value: 'circle', label: 'Circle', priceMultiplier: 1.1 },
                    { value: 'custom', label: 'Custom Shape', priceMultiplier: 1.3 }
                ]
            }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const customizationOptions = document.getElementById('customizationOptions');
    const customizationSummary = document.getElementById('customizationSummary');
    const basePriceDisplay = document.getElementById('basePriceDisplay');
    const quantityDisplay = document.getElementById('quantityDisplay');
    const totalPrice = document.getElementById('totalPrice');
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');
    const quantityInput = document.getElementById('quantity');

    // Get product details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    let currentProduct = null;

    // Fetch product details
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            currentProduct = product;
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productDescription').textContent = product.description;
            document.getElementById('productPrice').textContent = product.base_price;
            document.getElementById('productImage').src = product.image_url;
            basePriceDisplay.textContent = product.base_price;

            // Display product features
            const featuresContainer = document.getElementById('productFeatures');
            if (product.features) {
                const featuresList = document.createElement('ul');
                product.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
                    featuresList.appendChild(li);
                });
                featuresContainer.appendChild(featuresList);
            }

            // Load customization options based on product category
            loadCustomizationOptions(product.category);
            updateTotalPrice();
        })
        .catch(error => console.error('Error fetching product:', error));

    // Load customization options based on product category
    function loadCustomizationOptions(category) {
        const template = customizationTemplates[category];
        if (!template) {
            console.error('No customization template found for category:', category);
            return;
        }

        customizationOptions.innerHTML = '';
        template.options.forEach(option => {
            const div = document.createElement('div');
            div.className = 'form-group';
            
            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.label;
            
            const select = document.createElement('select');
            select.id = option.id;
            select.name = option.id;
            select.required = true;
            
            option.options.forEach(opt => {
                const optionElement = document.createElement('option');
                optionElement.value = opt.value;
                optionElement.textContent = opt.label;
                select.appendChild(optionElement);
            });
            
            div.appendChild(label);
            div.appendChild(select);
            customizationOptions.appendChild(div);
        });

        // Add event listeners to all customization options
        const selects = customizationOptions.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => {
                updateCustomizationSummary();
                updateTotalPrice();
            });
        });
    }

    // Update customization summary
    function updateCustomizationSummary() {
        const template = customizationTemplates[currentProduct.category];
        if (!template) return;

        customizationSummary.innerHTML = '';
        template.options.forEach(option => {
            const select = document.getElementById(option.id);
            const selectedOption = option.options.find(opt => opt.value === select.value);
            
            const p = document.createElement('p');
            p.textContent = `${option.label}: ${selectedOption.label}`;
            customizationSummary.appendChild(p);
        });
    }

    // Handle quantity changes
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateTotalPrice();
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
        updateTotalPrice();
    });

    quantityInput.addEventListener('change', updateTotalPrice);

    // Calculate total price
    function updateTotalPrice() {
        const basePrice = parseFloat(basePriceDisplay.textContent);
        const quantity = parseInt(quantityInput.value);
        let total = basePrice * quantity;

        // Apply customization multipliers
        const template = customizationTemplates[currentProduct.category];
        if (template) {
            template.options.forEach(option => {
                const select = document.getElementById(option.id);
                const selectedOption = option.options.find(opt => opt.value === select.value);
                if (selectedOption) {
                    total *= selectedOption.priceMultiplier;
                }
            });
        }

        quantityDisplay.textContent = quantity;
        totalPrice.textContent = total.toFixed(2);
    }

    // Handle form submission
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            product_id: currentProduct.id,
            quantity: parseInt(quantityInput.value),
            special_instructions: document.getElementById('specialInstructions').value,
            shipping_address: document.getElementById('shippingAddress').value,
            payment_method: document.getElementById('paymentMethod').value
        };

        // Add customization options
        const template = customizationTemplates[currentProduct.category];
        if (template) {
            template.options.forEach(option => {
                const select = document.getElementById(option.id);
                formData[option.id] = select.value;
            });
        }

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await response.json();
            window.location.href = `/track-order.html?orderNumber=${orderData.orderNumber}`;
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        }
    });
}); 