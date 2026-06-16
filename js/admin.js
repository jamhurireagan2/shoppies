// Admin state
let currentProductId = null;

// Load admin dashboard
async function loadAdminDashboard() {
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load stats
    try {
        const stats = await apiCall('/admin/stats');
        const statsContainer = document.getElementById('dashboardStats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card glass-card">
                    <i class="fas fa-users"></i>
                    <div class="stat-number">${stats.totalUsers || 0}</div>
                    <div>Total Users</div>
                </div>
                <div class="stat-card glass-card">
                    <i class="fas fa-box"></i>
                    <div class="stat-number">${stats.totalProducts || 0}</div>
                    <div>Total Products</div>
                </div>
                <div class="stat-card glass-card">
                    <i class="fas fa-shopping-cart"></i>
                    <div class="stat-number">${stats.totalOrders || 0}</div>
                    <div>Total Orders</div>
                </div>
                <div class="stat-card glass-card">
                    <i class="fas fa-clock"></i>
                    <div class="stat-number">${stats.pendingOrders || 0}</div>
                    <div>Pending Orders</div>
                </div>
                <div class="stat-card glass-card">
                    <i class="fas fa-chart-line"></i>
                    <div class="stat-number">Ksh ${(stats.totalRevenue || 0).toLocaleString()}</div>
                    <div>Revenue</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
    
    loadAdminProducts();
    loadAdminOrders();
    loadAdminUsers();
}

// Load admin products
async function loadAdminProducts() {
    try {
        const products = await apiCall('/products');
        const container = document.getElementById('adminProducts');
        if (container) {
            container.innerHTML = products.map(product => `
                <div class="product-card glass-card">
                    <div class="product-image">
                        <i class="fas ${getCategoryIcon(product.category)}"></i>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-price">Ksh ${product.price.toLocaleString()}</p>
                        <p>Stock: ${product.stock}</p>
                        <div class="product-actions">
                            <button class="btn-outline" onclick="editProduct('${product._id}')">Edit</button>
                            <button class="btn-outline" onclick="deleteProduct('${product._id}')">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

// Load admin orders
async function loadAdminOrders() {
    try {
        const orders = await apiCall('/admin/orders');
        const container = document.getElementById('adminOrders');
        if (container) {
            container.innerHTML = orders.map(order => `
                <div class="order-card glass-card">
                    <div class="order-header">
                        <div>
                            <span class="order-id">Order #${order._id.slice(-8)}</span>
                            <span>By: ${order.user?.name || 'Unknown'}</span>
                        </div>
                        <select onchange="updateOrderStatus('${order._id}', this.value)" class="order-status ${order.orderStatus}">
                            <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="approved" ${order.orderStatus === 'approved' ? 'selected' : ''}>Approved</option>
                            <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    <div class="order-items">
                        ${order.products.map(item => `
                            <div class="order-item">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>Ksh ${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-footer">
                        <div>${order.deliveryAddress}</div>
                        <div class="order-total">Total: Ksh ${order.totalAmount.toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

// Load admin users
async function loadAdminUsers() {
    try {
        const users = await apiCall('/admin/users');
        const container = document.getElementById('adminUsers');
        if (container) {
            container.innerHTML = users.map(user => `
                <div class="user-card glass-card">
                    <i class="fas fa-user-circle"></i>
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>${user.email}</p>
                        <p>${user.phone || 'No phone'}</p>
                    </div>
                    <button class="btn-outline" onclick="deleteUser('${user._id}')">Delete</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// Edit product
async function editProduct(id) {
    try {
        const products = await apiCall('/products');
        const product = products.find(p => p._id === id);
        if (product) {
            currentProductId = id;
            document.getElementById('productModalTitle').textContent = 'Edit Product';
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productDescription').value = product.description || '';
            showProductModal();
        }
    } catch (error) {
        showNotification('Failed to load product', 'error');
    }
}

// Delete product
async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await apiCall(`/products/${id}`, 'DELETE');
            showNotification('Product deleted', 'success');
            loadAdminProducts();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        await apiCall(`/admin/orders/${orderId}/status`, 'PUT', { orderStatus: status });
        showNotification('Order status updated', 'success');
        loadAdminOrders();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Delete user
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await apiCall(`/admin/users/${userId}`, 'DELETE');
            showNotification('User deleted', 'success');
            loadAdminUsers();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }
}

// Product form submission
async function saveProduct(event) {
    event.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value
    };
    
    try {
        if (currentProductId) {
            await apiCall(`/products/${currentProductId}`, 'PUT', productData);
            showNotification('Product updated', 'success');
        } else {
            await apiCall('/products', 'POST', productData);
            showNotification('Product added', 'success');
        }
        closeProductModal();
        loadAdminProducts();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Modal functions
function showProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'flex';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        currentProductId = null;
        document.getElementById('productModalTitle').textContent = 'Add Product';
        document.getElementById('productForm').reset();
    }
}

// Tab switching
function initAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
}

// Initialize admin page
if (document.querySelector('.admin-tabs')) {
    document.addEventListener('DOMContentLoaded', () => {
        loadAdminDashboard();
        initAdminTabs();
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', saveProduct);
        }
    });
}