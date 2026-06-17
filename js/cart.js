// API Configuration
const API_URL = 'https://shoppies-backend.onrender.com/api';

// Add to cart
async function addToCart(productId, name, price) {
    if (!isLoggedIn()) {
        showNotification('Please login to add items to cart', 'error');
        openModal('login');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.productId === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ productId, name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${name} added to cart!`, 'success');
}

// Remove from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
    showNotification('Item removed from cart', 'success');
}

// Update quantity
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.productId !== productId);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

// Load cart page
async function loadCart() {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    cartContainer.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';
    
    let subtotal = 0;
    let cartHtml = '<div class="cart-items">';
    
    for (const item of cart) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHtml += `
            <div class="cart-item glass-card">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Ksh ${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.productId}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.productId}', 1)">+</button>
                </div>
                <div class="cart-item-total">
                    Ksh ${itemTotal.toLocaleString()}
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.productId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
    
    const deliveryFee = subtotal > 5000 ? 0 : 200;
    const total = subtotal + deliveryFee;
    
    cartHtml += `
        </div>
        <div class="cart-summary glass-card">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>Ksh ${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Fee:</span>
                <span>Ksh ${deliveryFee.toLocaleString()}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>Ksh ${total.toLocaleString()}</span>
            </div>
            <button class="btn-primary btn-full" onclick="proceedToCheckout()">
                Proceed to Checkout
            </button>
        </div>
    `;
    
    cartContainer.innerHTML = cartHtml;
}

// Proceed to checkout with token validation
function proceedToCheckout() {
    const token = localStorage.getItem('token');
    console.log('Token for checkout:', token ? 'Present' : 'Missing');
    
    if (!token) {
        showNotification('Please login first', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    // Verify token is valid by checking user
    const user = getCurrentUser();
    if (!user) {
        showNotification('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Place order function (to be called from checkout page)
async function placeOrder(orderData) {
    const token = localStorage.getItem('token');
    console.log('Token for order:', token ? 'Present' : 'Missing');
    
    if (!token) {
        showNotification('Please login to place order', 'error');
        window.location.href = 'index.html';
        return { success: false, error: 'Not logged in' };
    }
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        console.log('Order response:', result);
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to place order');
        }
        
        return { success: true, data: result };
    } catch (error) {
        console.error('Order error:', error);
        showNotification(error.message, 'error');
        return { success: false, error: error.message };
    }
}

// Initialize cart page
if (document.getElementById('cartContainer')) {
    document.addEventListener('DOMContentLoaded', loadCart);
}