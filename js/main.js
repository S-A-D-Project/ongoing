// Services data
const services = [
    {
        id: 1,
        title: 'Tarpaulin',
        description: 'High-quality tarpaulin printing for events, advertisements and promotions.',
        icon: 'fas fa-image',
        imageUrl: 'https://images.unsplash.com/photo-1588412079929-791b9f563339?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 2,
        title: 'T-shirt Printing',
        description: 'Custom t-shirt printing for individuals, teams, and organizations.',
        icon: 'fas fa-tshirt',
        imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 3,
        title: 'Sintra Board',
        description: 'Durable Sintra board printing for indoor and outdoor signage.',
        icon: 'fas fa-th',
        imageUrl: 'https://images.unsplash.com/photo-1586767003402-8ade266deb64?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 4,
        title: 'Mugs',
        description: 'Personalized mug printing for gifts, promotions, and special occasions.',
        icon: 'fas fa-mug-hot'
    },
    {
        id: 5,
        title: 'Dry Seal',
        description: 'Professional dry seal production for documents and certificates.',
        icon: 'fas fa-stamp'
    },
    {
        id: 6,
        title: 'Button Pin',
        description: 'Custom button pins for promotions, events, and personal expression.',
        icon: 'fas fa-tag'
    },
    {
        id: 7,
        title: 'Lanyard/Lace',
        description: 'Custom printed lanyards for ID badges, events, and promotions.',
        icon: 'fas fa-tag'
    },
    {
        id: 8,
        title: 'Ecobag/Totebag Printing',
        description: 'Eco-friendly tote bag printing with custom designs.',
        icon: 'fas fa-shopping-bag'
    },
    {
        id: 9,
        title: 'Plaque',
        description: 'Custom plaques for awards, recognition, and commemorations.',
        icon: 'fas fa-award'
    },
    {
        id: 10,
        title: 'Medal (KAGAWARAN)',
        description: 'High-quality medals for various organizational needs.',
        icon: 'fas fa-medal'
    },
    {
        id: 11,
        title: 'Personalized Medal',
        description: 'Custom medals for sports events, competitions, and awards.',
        icon: 'fas fa-medal'
    },
    {
        id: 12,
        title: 'Collar Pin',
        description: 'Professional collar pins for organizations and individuals.',
        icon: 'fas fa-tag'
    },
    {
        id: 13,
        title: 'Rubber Stamp',
        description: 'Custom rubber stamps for business and personal use.',
        icon: 'fas fa-stamp'
    },
    {
        id: 14,
        title: 'Certificate Holder',
        description: 'Elegant certificate holders for diplomas and awards.',
        icon: 'fas fa-award'
    },
    {
        id: 15,
        title: 'Foldable Fan',
        description: 'Custom printed foldable fans for promotions and events.',
        icon: 'fas fa-fan'
    },
    {
        id: 16,
        title: 'Umbrella',
        description: 'Custom umbrella printing with your designs and logos.',
        icon: 'fas fa-umbrella'
    }
];

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    // Toggle aria-expanded for accessibility
    const isExpanded = mobileMenu.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after clicking a link
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
});

// Add scroll event listener for navbar
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll Down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll Up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Form validation for login and register forms
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (isValid) {
            // Here you would typically send the data to your server
            console.log('Form data:', data);
            // For demo purposes, show success message
            alert('Form submitted successfully!');
            form.reset();
        }
    });
});

// Add error class styles
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #ef4444 !important;
    }
    .error:focus {
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
    }
`;
document.head.appendChild(style);

// Services search functionality
const serviceSearch = document.getElementById('serviceSearch');
const servicesGrid = document.getElementById('servicesGrid');
const filterSelect = document.getElementById('serviceFilter');

if (serviceSearch && servicesGrid) {
    // Initial render of services
    renderServices(services);

    // Search and filter functionality
    function filterServices() {
        const query = serviceSearch.value.toLowerCase();
        const filter = filterSelect ? filterSelect.value : 'all';
        
        const filteredServices = services.filter(service => {
            const matchesSearch = service.title.toLowerCase().includes(query) || 
                                service.description.toLowerCase().includes(query);
            
            if (filter === 'all') return matchesSearch;
            
            // Add more filter categories as needed
            switch(filter) {
                case 'printing':
                    return matchesSearch && (service.title.toLowerCase().includes('print') || 
                                           service.title.toLowerCase().includes('document'));
                case 'promotional':
                    return matchesSearch && (service.title.toLowerCase().includes('t-shirt') || 
                                           service.title.toLowerCase().includes('mug') ||
                                           service.title.toLowerCase().includes('ecobag'));
                case 'awards':
                    return matchesSearch && (service.title.toLowerCase().includes('medal') || 
                                           service.title.toLowerCase().includes('plaque') ||
                                           service.title.toLowerCase().includes('certificate'));
                default:
                    return matchesSearch;
            }
        });
        
        renderServices(filteredServices);
    }

    serviceSearch.addEventListener('input', filterServices);
    if (filterSelect) {
        filterSelect.addEventListener('change', filterServices);
    }
}

// Render services to the grid
function renderServices(servicesToRender) {
    if (!servicesGrid) return;

    servicesGrid.innerHTML = servicesToRender.map(service => `
        <div class="service-card">
            ${service.imageUrl ? `
                <img src="${service.imageUrl}" alt="${service.title}" class="service-image">
            ` : `
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
            `}
            <div class="service-content">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="service-actions">
                    <a href="./view-${service.title.toLowerCase().replace(/\s+/g, '-')}.html" class="btn btn-outline">View Details</a>
                    <a href="./customize-${service.title.toLowerCase().replace(/\s+/g, '-')}.html" class="btn btn-primary">Order Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Form validation
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Here you would typically make an API call to authenticate
        console.log('Login attempt:', { email, password });
        alert('Login functionality will be implemented with backend integration');
    });
}

// Track order functionality
const trackForm = document.getElementById('trackForm');
const orderStatus = document.getElementById('orderStatus');

if (trackForm && orderStatus) {
    trackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderNumber = document.getElementById('orderNumber').value;
        
        // Here you would typically make an API call to get the order status
        console.log('Tracking order:', orderNumber);
        orderStatus.classList.add('active');
        orderStatus.scrollIntoView({ behavior: 'smooth' });
    });
} 