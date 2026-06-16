// Load orders
async function loadOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading orders...</div>';
    
    try {
        const orders = await apiCall('/orders');
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <h3>No orders yet</h3>
                    <p>Start shopping to see your orders here</p>
                    <button class="btn-primary" onclick="window.location.href='products.html'">Start Shopping</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <div class="order-card glass-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${order._id.slice(-8)}</span>
                        <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span class="order-status ${order.orderStatus}">${order.orderStatus}</span>
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
                    <div>
                        <span>Delivery to: ${order.deliveryAddress}</span>
                    </div>
                    <div class="order-total">
                        Total: Ksh ${order.totalAmount.toLocaleString()}
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<div class="error-state"><i class="fas fa-exclamation-triangle"></i><h3>Failed to load orders</h3></div>';
    }
}

// Initialize orders page
if (document.getElementById('ordersContainer')) {
    document.addEventListener('DOMContentLoaded', loadOrders);
}