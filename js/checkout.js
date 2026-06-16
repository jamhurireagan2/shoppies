// Load checkout summary
function loadCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const orderItems = document.getElementById('orderItems');
    const subtotalSpan = document.getElementById('subtotal');
    const deliveryFeeSpan = document.getElementById('deliveryFee');
    const totalSpan = document.getElementById('total');
    
    if (!orderItems) return;
    
    let subtotal = 0;
    let itemsHtml = '';
    
    for (const item of cart) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsHtml += `
            <div class="checkout-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>Ksh ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    }
    
    const deliveryFee = subtotal > 5000 ? 0 : 200;
    const total = subtotal + deliveryFee;
    
    orderItems.innerHTML = itemsHtml || '<p>No items in cart</p>';
    if (subtotalSpan) subtotalSpan.textContent = `Ksh ${subtotal.toLocaleString()}`;
    if (deliveryFeeSpan) deliveryFeeSpan.textContent = `Ksh ${deliveryFee.toLocaleString()}`;
    if (totalSpan) totalSpan.textContent = `Ksh ${total.toLocaleString()}`;
}

// Place order
async function placeOrder(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to place order', 'error');
        openModal('login');
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const fullName = document.getElementById('fullName')?.value;
    const phone = document.getElementById('phone')?.value;
    const email = document.getElementById('email')?.value;
    const address = document.getElementById('address')?.value;
    const city = document.getElementById('city')?.value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    if (!fullName || !phone || !email || !address || !city) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    let subtotal = 0;
    const products = cart.map(item => {
        subtotal += item.price * item.quantity;
        return {
            product: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        };
    });
    
    const deliveryFee = subtotal > 5000 ? 0 : 200;
    const totalAmount = subtotal + deliveryFee;
    
    const orderData = {
        products,
        totalAmount,
        deliveryAddress: `${address}, ${city}`,
        paymentMethod: paymentMethod || 'cash'
    };
    
    try {
        const result = await apiCall('/orders', 'POST', orderData);
        localStorage.removeItem('cart');
        updateCartCount();
        showNotification('Order placed successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 1500);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Initialize checkout page
if (document.getElementById('checkoutForm')) {
    document.addEventListener('DOMContentLoaded', () => {
        loadCheckoutSummary();
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('submit', placeOrder);
        }
    });
}