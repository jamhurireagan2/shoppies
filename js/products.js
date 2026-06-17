const API_URL = 'https://shoppies-backend.onrender.com/api';

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
        
        console.log('Fetching from:', url);
        const response = await fetch(url);
        const products = await response.json();
        
        console.log('Products loaded:', products.length);
        
        if (!products || products.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><h3>No products found</h3><p>Check back later for new items!</p></div>';
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="product-card glass-card">
                <div class="product-image">
                    <img src="${product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'">
                    ${product.stock < 10 ? '<span class="product-badge">Low Stock</span>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">Ksh ${product.price.toLocaleString()}</p>
                    <div class="product-actions">
                        <button class="btn-primary" onclick="addToCart('${product.id || product._id}', '${product.name}', ${product.price})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="error-state"><i class="fas fa-exclamation-triangle"></i><h3>Cannot connect to backend</h3><p>Make sure backend is running</p></div>';
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

if (document.getElementById('productsContainer')) {
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        loadProducts(category);
        
        const filters = document.querySelectorAll('.filter-btn');
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filterProducts(btn.dataset.category);
            });
        });
    });
}