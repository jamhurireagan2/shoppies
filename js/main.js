// User menu display
function updateUserMenu() {
    const user = getCurrentUser();
    const userMenu = document.getElementById('userMenu');
    const adminUserMenu = document.getElementById('adminUserMenu');
    
    if (userMenu) {
        if (user) {
            userMenu.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn">
                        <i class="fas fa-user-circle"></i>
                        ${user.name.split(' ')[0]}
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu">
                        ${user.isAdmin ? '<a href="admin.html"><i class="fas fa-crown"></i> Admin Panel</a>' : ''}
                        <a href="orders.html"><i class="fas fa-receipt"></i> My Orders</a>
                        <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
        } else {
            userMenu.innerHTML = `
                <button class="btn-login" onclick="openModal('login')">
                    <i class="fas fa-user"></i>
                    <span>Sign In</span>
                </button>
            `;
        }
    }
    
    if (adminUserMenu && user) {
        adminUserMenu.innerHTML = `
            <div class="user-dropdown">
                <button class="user-btn">
                    <i class="fas fa-user-circle"></i>
                    Admin: ${user.name.split(' ')[0]}
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                    <a href="index.html"><i class="fas fa-home"></i> Frontend</a>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
    }
}

// Add CSS for additional components
function addAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .user-dropdown {
            position: relative;
            display: inline-block;
        }
        
        .user-btn {
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-full);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            min-width: 180px;
            box-shadow: var(--shadow-lg);
            border-radius: var(--radius-md);
            margin-top: 0.5rem;
            z-index: 1000;
        }
        
        .user-dropdown:hover .dropdown-menu {
            display: block;
        }
        
        .dropdown-menu a {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            text-decoration: none;
            color: var(--dark);
            transition: background 0.3s;
        }
        
        .dropdown-menu a:hover {
            background: var(--light);
        }
        
        .admin-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid rgba(0,0,0,0.1);
            padding-bottom: 1rem;
        }
        
        .admin-tab {
            padding: 0.75rem 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 600;
            color: var(--gray);
            transition: all 0.3s;
        }
        
        .admin-tab.active {
            color: var(--primary);
            border-bottom: 2px solid var(--primary);
        }
        
        .admin-tab-content {
            display: none;
        }
        
        .admin-tab-content.active {
            display: block;
        }
        
        .stat-card {
            text-align: center;
            padding: 2rem;
        }
        
        .stat-card i {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 1rem;
        }
        
        .stat-card .stat-number {
            font-size: 2rem;
            font-weight: bold;
        }
        
        .user-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .user-card i {
            font-size: 3rem;
            color: var(--primary);
        }
        
        .user-info {
            flex: 1;
        }
        
        .empty-state, .error-state {
            text-align: center;
            padding: 4rem;
        }
        
        .empty-state i, .error-state i {
            font-size: 4rem;
            color: var(--gray);
            margin-bottom: 1rem;
        }
        
        .cart-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .cart-item {
            display: grid;
            grid-template-columns: 2fr auto auto auto;
            gap: 1rem;
            align-items: center;
            padding: 1rem;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .cart-item-quantity button {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid var(--gray);
            background: white;
            cursor: pointer;
        }
        
        .cart-item-remove {
            background: none;
            border: none;
            color: var(--danger);
            cursor: pointer;
            font-size: 1.2rem;
        }
        
        .cart-summary {
            margin-top: 2rem;
            padding: 1.5rem;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .summary-row.total {
            font-size: 1.2rem;
            font-weight: bold;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        .checkout-grid {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .payment-methods {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }
        
        .payment-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: var(--radius-md);
            cursor: pointer;
        }
        
        .payment-option input {
            margin: 0;
        }
        
        .checkout-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .order-card {
            margin-bottom: 1.5rem;
            padding: 1.5rem;
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .order-status {
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-full);
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .order-status.pending { background: #fef3c7; color: #92400e; }
        .order-status.approved { background: #dbeafe; color: #1e40af; }
        .order-status.shipped { background: #e0e7ff; color: #3730a3; }
        .order-status.delivered { background: #d1fae5; color: #065f46; }
        .order-status.cancelled { background: #fee2e2; color: #991b1b; }
        
        .order-items {
            margin-bottom: 1rem;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
        }
        
        .order-footer {
            display: flex;
            justify-content: space-between;
            padding-top: 1rem;
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        .order-total {
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
            .checkout-grid {
                grid-template-columns: 1fr;
            }
            .cart-item {
                grid-template-columns: 1fr;
                text-align: center;
            }
            .admin-tabs {
                flex-wrap: wrap;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateUserMenu();
    addAdditionalStyles();
    
    // Handle cart link
    const cartLink = document.getElementById('cartLink');
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
    
    // Handle orders link
    const ordersLink = document.getElementById('ordersLink');
    if (ordersLink) {
        ordersLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn()) {
                window.location.href = 'orders.html';
            } else {
                showNotification('Please login to view your orders', 'error');
                openModal('login');
            }
        });
    }
});