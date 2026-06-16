// Load products
async function loadProducts(category = 'all') {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
    
    try {
        let url = `${API_URL}/products`;
        if (category !== 'all') {
            url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        const products = await response.json();
        
        if (products.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><h3>No products found</h3></div>';
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="product-card glass-card">
                <div class="product-image">
                    <i class="fas ${getCategoryIcon(product.category)}"></i>
                    ${product.stock < 10 ? '<span class="product-badge">Low Stock</span>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">Ksh ${product.price.toLocaleString()}</p>
                    <div class="product-actions">
                        <button class="btn-primary" onclick="addToCart('${product._id}', '${product.name}', ${product.price})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<div class="error-state"><i class="fas fa-exclamation-triangle"></i><h3>Failed to load products</h3></div>';
        showNotification('Failed to load products', 'error');
    }
}

function getCategoryIcon(category) {
    const icons = {
        electronics: 'fa-laptop',
        clothing: 'fa-tshirt',
        groceries: 'fa-apple-alt',
        beauty: 'fa-spa',
        pharmacy: 'fa-pills'
    };
    return icons[category] || 'fa-box';
}

// Filter products
function filterProducts(category) {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    loadProducts(category);
}

// Initialize products page
if (document.getElementById('productsContainer')) {
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        loadProducts(category);
        
        // Add filter event listeners
        const filters = document.querySelectorAll('.filter-btn');
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filterProducts(btn.dataset.category);
            });
        });
    });
}