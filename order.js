class OrderSystem {
    constructor() {
        this.currentOrder = {
            items: [],
            files: [],
            total: 0
        };
        this.initializeEventListeners();
        this.initializeFileUpload();
    }

    initializeEventListeners() {
        // Quantity controls
        document.querySelectorAll('.quantity-controls').forEach(control => {
            control.addEventListener('click', (e) => {
                if (e.target.classList.contains('quantity-btn')) {
                    const input = control.querySelector('.quantity-input');
                    const action = e.target.dataset.action;
                    let value = parseInt(input.value);
                    
                    if (action === 'decrease' && value > 1) {
                        value--;
                    } else if (action === 'increase') {
                        value++;
                    }
                    
                    input.value = value;
                    this.updateItemQuantity(input.closest('.product-actions').dataset.productId, value);
                }
            });
        });

        // Cart dropdown toggle
        const cartBtn = document.querySelector('.cart-btn');
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (cartBtn && cartDropdown) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                cartDropdown.classList.toggle('show');
            });
        }

        // Close cart dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-container')) {
                cartDropdown?.classList.remove('show');
            }
        });
    }

    initializeFileUpload() {
        const uploadArea = document.querySelector('.upload-area');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.pdf,.jpg,.jpeg,.png,.ai,.psd';
        fileInput.style.display = 'none';

        uploadArea.appendChild(fileInput);

        // Drag and drop handlers
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    async handleFiles(files) {
        const uploadArea = document.querySelector('.upload-area');
        const previewContainer = document.querySelector('.upload-preview');
        
        for (let file of files) {
            if (file.size > 25 * 1024 * 1024) { // 25MB limit
                this.showNotification('File size exceeds 25MB limit', 'error');
                continue;
            }

            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/postscript', 'image/vnd.adobe.photoshop'];
            if (!allowedTypes.includes(file.type)) {
                this.showNotification('Invalid file type', 'error');
                continue;
            }

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Upload failed');

                const result = await response.json();
                this.currentOrder.files.push({
                    id: result.fileId,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });

                this.addFilePreview(file, previewContainer);
                this.showNotification('File uploaded successfully', 'success');
            } catch (error) {
                this.showNotification('Failed to upload file', 'error');
                console.error('Upload error:', error);
            }
        }
    }

    addFilePreview(file, container) {
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        
        const icon = document.createElement('i');
        icon.className = this.getFileIcon(file.type);
        
        const info = document.createElement('div');
        info.className = 'file-info';
        
        const name = document.createElement('span');
        name.className = 'file-name';
        name.textContent = file.name;
        
        const size = document.createElement('span');
        size.className = 'file-size';
        size.textContent = this.formatFileSize(file.size);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', () => {
            preview.remove();
            this.removeFile(file.name);
        });
        
        info.appendChild(name);
        info.appendChild(size);
        preview.appendChild(icon);
        preview.appendChild(info);
        preview.appendChild(removeBtn);
        container.appendChild(preview);
    }

    getFileIcon(type) {
        const icons = {
            'application/pdf': 'fas fa-file-pdf',
            'image/jpeg': 'fas fa-file-image',
            'image/png': 'fas fa-file-image',
            'application/postscript': 'fas fa-file-alt',
            'image/vnd.adobe.photoshop': 'fas fa-file-image'
        };
        return icons[type] || 'fas fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(filename) {
        this.currentOrder.files = this.currentOrder.files.filter(file => file.name !== filename);
    }

    async addToCart(productId, quantity) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`);
            if (!response.ok) throw new Error('Product not found');
            
            const product = await response.json();
            const existingItem = this.currentOrder.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.currentOrder.items.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                });
            }
            
            this.updateCart();
            this.showNotification('Item added to cart', 'success');
        } catch (error) {
            this.showNotification('Failed to add item to cart', 'error');
            console.error('Add to cart error:', error);
        }
    }

    updateItemQuantity(productId, quantity) {
        const item = this.currentOrder.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.updateCart();
        }
    }

    removeFromCart(productId) {
        this.currentOrder.items = this.currentOrder.items.filter(item => item.id !== productId);
        this.updateCart();
    }

    updateCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const cartTotalItems = document.querySelector('.cart-total-items');
        const totalAmount = document.querySelector('.total-amount');
        
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        let total = 0;
        let itemCount = 0;
        
        this.currentOrder.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₱${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-total">₱${itemTotal.toFixed(2)}</span>
                    <button class="remove-item" data-product-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                this.removeFromCart(item.id);
            });
            
            cartItems.appendChild(cartItem);
        });
        
        cartCount.textContent = itemCount;
        cartTotalItems.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
        totalAmount.textContent = `₱${total.toFixed(2)}`;
        this.currentOrder.total = total;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize the order system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.orderSystem = new OrderSystem();
}); 