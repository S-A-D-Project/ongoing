class ProductManagement {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.currentProduct = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.renderProducts();
    }

    initializeElements() {
        this.productsGrid = document.getElementById('productsGrid');
        this.productModal = document.getElementById('productModal');
        this.productForm = document.getElementById('productForm');
        this.addProductBtn = document.getElementById('addProductBtn');
        this.searchProduct = document.getElementById('searchProduct');
        this.productCategory = document.getElementById('productCategory');
        this.optionsList = document.getElementById('optionsList');
        this.addOptionBtn = document.getElementById('addOptionBtn');
    }

    initializeEventListeners() {
        this.addProductBtn.addEventListener('click', () => this.openModal());
        this.productForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.searchProduct.addEventListener('input', () => this.filterProducts());
        this.productCategory.addEventListener('change', () => this.filterProducts());
        this.addOptionBtn.addEventListener('click', () => this.addOption());
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
    }

    openModal(product = null) {
        this.currentProduct = product;
        this.productModal.style.display = 'block';
        document.getElementById('modalTitle').textContent = product ? 'Edit Product' : 'Add New Product';
        
        if (product) {
            this.populateForm(product);
        } else {
            this.productForm.reset();
            this.optionsList.innerHTML = '';
        }
    }

    closeModal() {
        this.productModal.style.display = 'none';
        this.currentProduct = null;
        this.productForm.reset();
        this.optionsList.innerHTML = '';
    }

    populateForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        
        this.optionsList.innerHTML = '';
        product.options.forEach(option => {
            this.addOption(option);
        });
    }

    addOption(option = null) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.innerHTML = `
            <div class="option-header">
                <input type="text" class="option-name" placeholder="Option Name" value="${option?.name || ''}" required>
                <button type="button" class="btn btn-icon remove-option">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="option-values">
                <input type="text" class="option-value" placeholder="Value 1" value="${option?.values?.[0] || ''}" required>
                <input type="text" class="option-value" placeholder="Value 2" value="${option?.values?.[1] || ''}" required>
                <button type="button" class="btn btn-outline add-value">
                    <i class="fas fa-plus"></i> Add Value
                </button>
            </div>
        `;

        optionDiv.querySelector('.remove-option').addEventListener('click', () => {
            optionDiv.remove();
        });

        optionDiv.querySelector('.add-value').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'option-value';
            input.placeholder = 'New Value';
            input.required = true;
            optionDiv.querySelector('.option-values').insertBefore(input, optionDiv.querySelector('.add-value'));
        });

        this.optionsList.appendChild(optionDiv);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const product = {
            id: this.currentProduct?.id || Date.now().toString(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            image: this.currentProduct?.image || null,
            options: this.getOptions()
        };

        if (this.currentProduct) {
            const index = this.products.findIndex(p => p.id === this.currentProduct.id);
            this.products[index] = product;
        } else {
            this.products.push(product);
        }

        localStorage.setItem('products', JSON.stringify(this.products));
        this.renderProducts();
        this.closeModal();
    }

    getOptions() {
        const options = [];
        this.optionsList.querySelectorAll('.option-item').forEach(item => {
            const name = item.querySelector('.option-name').value;
            const values = Array.from(item.querySelectorAll('.option-value'))
                .map(input => input.value)
                .filter(value => value.trim() !== '');
            
            if (name && values.length > 0) {
                options.push({ name, values });
            }
        });
        return options;
    }

    filterProducts() {
        const searchTerm = this.searchProduct.value.toLowerCase();
        const category = this.productCategory.value;
        
        const filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || product.category === category;
            return matchesSearch && matchesCategory;
        });

        this.renderProducts(filteredProducts);
    }

    renderProducts(products = this.products) {
        this.productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<i class="fas fa-box"></i>'}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <p class="description">${product.description}</p>
                    <p class="price">₱${product.price.toFixed(2)}</p>
                </div>
                <div class="product-actions">
                    <button class="btn btn-icon edit-product" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon delete-product" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            productCard.querySelector('.edit-product').addEventListener('click', () => {
                this.openModal(product);
            });

            productCard.querySelector('.delete-product').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this product?')) {
                    this.deleteProduct(product.id);
                }
            });

            this.productsGrid.appendChild(productCard);
        });
    }

    deleteProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        localStorage.setItem('products', JSON.stringify(this.products));
        this.renderProducts();
    }
}

// Initialize product management
document.addEventListener('DOMContentLoaded', () => {
    new ProductManagement();
}); 