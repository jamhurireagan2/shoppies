const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 5000;

// File paths for data storage
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

function readJSON(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        return defaultValue;
    } catch (error) {
        console.error('Error reading file:', error);
        return defaultValue;
    }
}

function writeJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing file:', error);
        return false;
    }
}

// Initialize data
let products = readJSON(PRODUCTS_FILE, [
    { id: 1, name: "Fresh Kales", price: 100, category: "groceries", stock: 100, image: "https://images.unsplash.com/photo-1579113800032-c3bd7c7fd6b4?w=200", description: "Fresh organic kales" },
    { id: 2, name: "Cabbage", price: 200, category: "groceries", stock: 100, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200", description: "Fresh cabbage" },
    { id: 3, name: "iPhone 15 Pro", price: 155000, category: "phones", stock: 20, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200", description: "Latest iPhone" },
    { id: 4, name: "Samsung Galaxy S24", price: 145000, category: "phones", stock: 25, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200", description: "Samsung flagship" },
    { id: 5, name: "Denim Jeans", price: 3000, category: "clothing", stock: 50, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200", description: "Premium denim" }
]);

let categories = readJSON(CATEGORIES_FILE, [
    { id: 1, name: "Electronics", icon: "fa-laptop" },
    { id: 2, name: "Clothing", icon: "fa-tshirt" },
    { id: 3, name: "Groceries", icon: "fa-apple-alt" },
    { id: 4, name: "Beauty", icon: "fa-spa" },
    { id: 5, name: "Pharmacy", icon: "fa-pills" },
    { id: 6, name: "Phones", icon: "fa-mobile-alt" },
    { id: 7, name: "Fruits", icon: "fa-apple-alt" }
]);

let users = readJSON(USERS_FILE, [
    { id: 1, email: "admin@shoppies.com", password: "admin123", name: "Admin User", phone: "0712345678", isAdmin: true, createdAt: new Date().toISOString() }
]);

let orders = readJSON(ORDERS_FILE, []);
let coupons = readJSON(COUPONS_FILE, []);

// Get next IDs
let nextProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
let nextOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
let nextUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
let nextCategoryId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
let nextCouponId = coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1;

function saveAllData() {
    writeJSON(PRODUCTS_FILE, products);
    writeJSON(CATEGORIES_FILE, categories);
    writeJSON(USERS_FILE, users);
    writeJSON(ORDERS_FILE, orders);
    writeJSON(COUPONS_FILE, coupons);
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true'
    });
    res.end(JSON.stringify(data));
}

function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            callback(JSON.parse(body || '{}'));
        } catch (e) {
            console.error('Parse error:', e);
            callback({});
        }
    });
}

// ============ USER VALIDATION FUNCTIONS ============

// Validate Kenyan phone number
function validateKenyanPhone(phone) {
    // Remove any spaces or special characters
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Check if it's a valid Kenyan phone number
    // Valid formats: 0712345678, 0112345678, 254712345678, +254712345678
    const phoneRegex = /^(?:\+254|254|0)(7|1)\d{8}$/;
    return phoneRegex.test(cleanPhone);
}

// Format phone number to standard format
function formatPhoneNumber(phone) {
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.startsWith('0')) {
        return '254' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('+254')) {
        return cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('254')) {
        return cleanPhone;
    }
    return cleanPhone;
}

// Check if email has reached max accounts (2 per email)
function canRegisterWithEmail(email) {
    const existingUsers = users.filter(u => u.email === email);
    return existingUsers.length < 2;
}

// Get remaining account slots for email
function getRemainingSlots(email) {
    const existingUsers = users.filter(u => u.email === email);
    return 2 - existingUsers.length;
}

// M-Pesa Simulation (for demo)
function processMpesaPayment(phone, amount, orderId) {
    return new Promise((resolve) => {
        console.log(`📱 M-Pesa Payment initiated: ${phone} for Ksh ${amount}`);
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate for demo
            resolve({
                success: success,
                transactionId: success ? 'MP' + Date.now().toString().slice(-8) : null,
                message: success ? 'Payment successful!' : 'Payment failed. Please try again.'
            });
        }, 3000);
    });
}

// Generate Invoice
function generateInvoice(order) {
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-6) + '-' + order.id;
    const invoice = {
        invoiceNumber: invoiceNumber,
        orderId: order.id,
        date: new Date().toISOString(),
        customerName: order.customerName || 'Customer',
        customerEmail: order.customerEmail || 'customer@example.com',
        customerPhone: order.customerPhone || 'N/A',
        deliveryAddress: order.deliveryAddress || 'Nairobi, Kenya',
        items: order.products || [],
        subtotal: order.totalAmount || 0,
        discount: order.discount || 0,
        total: order.totalAmount || 0,
        paymentMethod: order.paymentMethod || 'Cash on Delivery',
        paymentStatus: order.paymentStatus || 'Pending',
        orderStatus: order.orderStatus || 'Pending',
        trackingNumber: order.trackingNumber || 'TRK-' + Date.now().toString().slice(-6)
    };
    return invoice;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    
    console.log(`${method} ${path}`);
    
    if (method === 'OPTIONS') {
        sendJSON(res, 204, {});
        return;
    }
    
    // ============ PRODUCTS ============
    if (path === '/api/products' && method === 'GET') {
        const category = parsedUrl.query.category;
        const search = parsedUrl.query.search;
        let filtered = products;
        
        if (category && category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(s) || 
                (p.description && p.description.toLowerCase().includes(s))
            );
        }
        sendJSON(res, 200, filtered);
    }
    
    else if (path === '/api/products' && method === 'POST') {
        parseBody(req, (body) => {
            const newProduct = {
                id: nextProductId++,
                _id: String(nextProductId - 1),
                name: body.name,
                price: parseInt(body.price),
                category: body.category,
                stock: parseInt(body.stock),
                image: body.image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200`,
                description: body.description || '',
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
            saveAllData();
            console.log('✅ Product added:', newProduct.name);
            sendJSON(res, 201, newProduct);
        });
    }
    
    else if (path.match(/^\/api\/products\/\d+$/) && method === 'PUT') {
        const id = parseInt(path.split('/')[3]);
        parseBody(req, (body) => {
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...body };
                saveAllData();
                sendJSON(res, 200, products[index]);
            } else {
                sendJSON(res, 404, { error: 'Product not found' });
            }
        });
    }
    
    else if (path.match(/^\/api\/products\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/')[3]);
        products = products.filter(p => p.id !== id);
        saveAllData();
        sendJSON(res, 200, { message: 'Product deleted' });
    }
    
    // ============ CATEGORIES ============
    else if (path === '/api/categories' && method === 'GET') {
        sendJSON(res, 200, categories);
    }
    
    else if (path === '/api/categories' && method === 'POST') {
        parseBody(req, (body) => {
            const newCategory = { id: nextCategoryId++, name: body.name, icon: body.icon || 'fa-tag', createdAt: new Date().toISOString() };
            categories.push(newCategory);
            saveAllData();
            sendJSON(res, 201, newCategory);
        });
    }
    
    else if (path.match(/^\/api\/categories\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/')[3]);
        categories = categories.filter(c => c.id !== id);
        saveAllData();
        sendJSON(res, 200, { message: 'Category deleted' });
    }
    
    // ============ COUPONS ============
    // GET all coupons
    else if (path === '/api/coupons' && method === 'GET') {
        sendJSON(res, 200, coupons);
    }
    
    // POST - Create new coupon
    else if (path === '/api/coupons' && method === 'POST') {
        parseBody(req, (body) => {
            // Check if coupon code already exists
            const existing = coupons.find(c => c.code === body.code.toUpperCase());
            if (existing) {
                sendJSON(res, 400, { error: 'Coupon code already exists' });
                return;
            }
            
            const newCoupon = {
                id: nextCouponId++,
                code: body.code.toUpperCase(),
                discount: parseInt(body.discount),
                validUntil: body.validUntil || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
                active: body.active !== undefined ? body.active : true,
                createdAt: new Date().toISOString()
            };
            coupons.push(newCoupon);
            saveAllData();
            console.log('✅ Coupon created:', newCoupon.code);
            sendJSON(res, 201, newCoupon);
        });
    }
    
    // PUT - Update coupon
    else if (path.match(/^\/api\/coupons\/\d+$/) && method === 'PUT') {
        const id = parseInt(path.split('/')[3]);
        parseBody(req, (body) => {
            const index = coupons.findIndex(c => c.id === id);
            if (index !== -1) {
                coupons[index] = {
                    ...coupons[index],
                    code: body.code.toUpperCase(),
                    discount: parseInt(body.discount),
                    validUntil: body.validUntil,
                    active: body.active !== undefined ? body.active : coupons[index].active
                };
                saveAllData();
                console.log('✅ Coupon updated:', coupons[index].code);
                sendJSON(res, 200, coupons[index]);
            } else {
                sendJSON(res, 404, { error: 'Coupon not found' });
            }
        });
    }
    
    // DELETE - Remove coupon
    else if (path.match(/^\/api\/coupons\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/')[3]);
        coupons = coupons.filter(c => c.id !== id);
        saveAllData();
        console.log('✅ Coupon deleted');
        sendJSON(res, 200, { message: 'Coupon deleted successfully' });
    }
    
    // POST - Validate coupon
    else if (path === '/api/coupons/validate' && method === 'POST') {
        parseBody(req, (body) => {
            const code = body.code.toUpperCase();
            const coupon = coupons.find(c => c.code === code && c.active === true);
            
            if (!coupon) {
                sendJSON(res, 400, { valid: false, error: 'Invalid coupon code' });
                return;
            }
            
            const now = new Date();
            const validUntil = new Date(coupon.validUntil);
            if (now > validUntil) {
                sendJSON(res, 400, { valid: false, error: 'Coupon has expired' });
                return;
            }
            
            sendJSON(res, 200, {
                valid: true,
                discount: coupon.discount,
                code: coupon.code,
                message: `🎉 ${coupon.discount}% discount applied!`
            });
        });
    }
    
    // ============ AUTH - LOGIN ============
    else if (path === '/api/auth/login' && method === 'POST') {
        parseBody(req, (body) => {
            console.log('🔐 Login attempt:', body.email);
            const user = users.find(u => u.email === body.email && u.password === body.password);
            if (user) {
                // Check if account is active
                if (user.isActive === false) {
                    sendJSON(res, 403, { error: 'Account deactivated. Please contact admin.' });
                    return;
                }
                sendJSON(res, 200, {
                    token: 'token_' + Date.now() + '_' + user.id,
                    user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin, phone: user.phone }
                });
            } else {
                sendJSON(res, 401, { error: 'Invalid email or password' });
            }
        });
    }
    
    // ============ AUTH - REGISTER WITH VALIDATION ============
    else if (path === '/api/auth/register' && method === 'POST') {
        parseBody(req, (body) => {
            console.log('========================================');
            console.log('📝 REGISTER ATTEMPT:');
            console.log('   Name:', body.name);
            console.log('   Email:', body.email);
            console.log('   Phone:', body.phone);
            console.log('========================================');
            
            // ============ VALIDATE EMAIL ============
            if (!body.email || !body.email.includes('@')) {
                sendJSON(res, 400, { error: 'Please enter a valid email address' });
                return;
            }
            
            // Check if email has reached max accounts (2 per email)
            const emailUsers = users.filter(u => u.email === body.email);
            if (emailUsers.length >= 2) {
                sendJSON(res, 400, { 
                    error: 'This email already has 2 registered accounts. Maximum 2 accounts per email.' 
                });
                return;
            }
            
            // ============ VALIDATE PHONE NUMBER ============
            if (!body.phone) {
                sendJSON(res, 400, { error: 'Phone number is required' });
                return;
            }
            
            // Check if phone number is valid Kenyan format
            if (!validateKenyanPhone(body.phone)) {
                sendJSON(res, 400, { 
                    error: 'Please enter a valid Kenyan phone number (e.g., 0712345678 or 0112345678)' 
                });
                return;
            }
            
            // Format phone number
            const formattedPhone = formatPhoneNumber(body.phone);
            
            // Check if phone number is already registered
            const existingPhone = users.find(u => u.phone === formattedPhone);
            if (existingPhone) {
                sendJSON(res, 400, { error: 'This phone number is already registered. Please use a different number.' });
                return;
            }
            
            // ============ CREATE NEW USER ============
            const newUser = {
                id: nextUserId++,
                email: body.email,
                password: body.password,
                name: body.name,
                phone: formattedPhone,
                isAdmin: false,
                isActive: true,
                accountNumber: `ACC-${String(nextUserId - 1).padStart(6, '0')}`,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            saveAllData();
            
            console.log('✅ New user registered successfully!');
            console.log(`   ID: ${newUser.id}`);
            console.log(`   Email: ${newUser.email}`);
            console.log(`   Phone: ${newUser.phone}`);
            console.log(`   Account: ${newUser.accountNumber}`);
            
            const remainingSlots = getRemainingSlots(newUser.email);
            
            sendJSON(res, 201, {
                token: 'token_' + Date.now() + '_' + newUser.id,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    phone: newUser.phone,
                    isAdmin: false,
                    accountNumber: newUser.accountNumber
                },
                message: `Registration successful! You can create ${remainingSlots} more account(s) with this email.`
            });
        });
    }
    
    // ============ ORDERS WITH TRACKING & INVOICE ============
    else if (path === '/api/orders' && method === 'POST') {
        parseBody(req, async (body) => {
            const trackingNumber = 'TRK-' + Date.now().toString().slice(-6) + '-' + (orders.length + 1);
            
            const newOrder = {
                id: nextOrderId++,
                _id: 'order_' + Date.now(),
                ...body,
                orderStatus: 'pending',
                paymentStatus: 'pending',
                trackingNumber: trackingNumber,
                createdAt: new Date().toISOString()
            };
            
            // Generate invoice
            const invoice = generateInvoice(newOrder);
            newOrder.invoice = invoice;
            
            // Process M-Pesa if selected
            if (body.paymentMethod === 'mpesa') {
                const mpesaResult = await processMpesaPayment(body.customerPhone, body.totalAmount, newOrder.id);
                if (mpesaResult.success) {
                    newOrder.paymentStatus = 'paid';
                    newOrder.mpesaTransactionId = mpesaResult.transactionId;
                    newOrder.orderStatus = 'approved';
                    console.log('✅ M-Pesa payment successful for order #' + newOrder.id);
                } else {
                    newOrder.paymentStatus = 'failed';
                    newOrder.mpesaError = mpesaResult.message;
                }
            }
            
            orders.push(newOrder);
            saveAllData();
            console.log('✅ Order placed: #' + newOrder.id);
            sendJSON(res, 201, { 
                message: 'Order placed successfully!', 
                order: newOrder,
                invoice: invoice
            });
        });
    }
    
    else if (path === '/api/orders' && method === 'GET') {
        sendJSON(res, 200, orders);
    }
    
    else if (path.match(/^\/api\/orders\/track\/\d+$/) && method === 'GET') {
        const orderId = parseInt(path.split('/')[4]);
        const order = orders.find(o => o.id === orderId);
        if (order) {
            sendJSON(res, 200, { 
                orderId: order.id,
                trackingNumber: order.trackingNumber,
                orderStatus: order.orderStatus,
                orderStatuses: [
                    { status: 'pending', description: 'Order received', date: order.createdAt },
                    { status: 'approved', description: 'Order confirmed', date: order.createdAt },
                    { status: 'shipped', description: 'Order shipped', date: order.createdAt },
                    { status: 'delivered', description: 'Order delivered', date: order.createdAt }
                ]
            });
        } else {
            sendJSON(res, 404, { error: 'Order not found' });
        }
    }
    
    else if (path.match(/^\/api\/orders\/\d+\/invoice$/) && method === 'GET') {
        const orderId = parseInt(path.split('/')[3]);
        const order = orders.find(o => o.id === orderId);
        if (order && order.invoice) {
            sendJSON(res, 200, order.invoice);
        } else {
            sendJSON(res, 404, { error: 'Invoice not found' });
        }
    }
    
    // ============ MPESA ORDER PLACEMENT ============
    else if (path === '/api/orders/mpesa' && method === 'POST') {
        parseBody(req, (body) => {
            const { phone, amount, orderData } = body;
            
            console.log('========================================');
            console.log('📱 M-Pesa STK Push Request');
            console.log('   Phone:', phone);
            console.log('   Amount: Ksh', amount);
            console.log('   Order Data:', orderData);
            console.log('========================================');
            
            // Validate phone number
            if (!phone || phone.length < 10) {
                sendJSON(res, 400, { 
                    success: false, 
                    message: 'Please enter a valid phone number (e.g., 0712345678)' 
                });
                return;
            }
            
            // Format phone number (remove leading 0 if present)
            let formattedPhone = phone;
            if (phone.startsWith('0')) {
                formattedPhone = '254' + phone.substring(1);
            } else if (!phone.startsWith('254')) {
                formattedPhone = '254' + phone;
            }
            
            // Simulate M-Pesa STK Push
            const orderId = nextOrderId++;
            
            processMpesaPayment(formattedPhone, amount, orderId).then((result) => {
                if (result.success) {
                    // Create order with payment confirmed
                    const newOrder = {
                        id: orderId,
                        _id: 'order_' + Date.now(),
                        ...orderData,
                        orderStatus: 'approved',
                        paymentStatus: 'paid',
                        paymentMethod: 'mpesa',
                        mpesaTransactionId: result.transactionId,
                        trackingNumber: 'TRK-' + Date.now().toString().slice(-6) + '-' + orderId,
                        createdAt: new Date().toISOString()
                    };
                    
                    // Generate invoice
                    const invoice = generateInvoice(newOrder);
                    newOrder.invoice = invoice;
                    
                    orders.push(newOrder);
                    saveAllData();
                    
                    sendJSON(res, 200, {
                        success: true,
                        message: '✅ M-Pesa payment successful!',
                        transactionId: result.transactionId,
                        order: newOrder,
                        invoice: invoice
                    });
                } else {
                    // Create order as pending (payment failed)
                    const newOrder = {
                        id: orderId,
                        _id: 'order_' + Date.now(),
                        ...orderData,
                        orderStatus: 'pending',
                        paymentStatus: 'failed',
                        paymentMethod: 'mpesa',
                        trackingNumber: 'TRK-' + Date.now().toString().slice(-6) + '-' + orderId,
                        createdAt: new Date().toISOString()
                    };
                    
                    orders.push(newOrder);
                    saveAllData();
                    
                    sendJSON(res, 400, {
                        success: false,
                        message: '❌ M-Pesa payment failed. Please try again.',
                        order: newOrder
                    });
                }
            });
        });
    }
    
    // ============ ADMIN ============
    else if (path === '/api/admin/stats' && method === 'GET') {
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const pendingOrders = orders.filter(o => o.orderStatus === 'pending');
        const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
        
        sendJSON(res, 200, {
            totalUsers: users.length,
            totalProducts: products.length,
            totalOrders: orders.length,
            pendingOrders: pendingOrders.length,
            paidOrders: paidOrders.length,
            totalRevenue: totalRevenue,
            averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
        });
    }
    
    else if (path === '/api/admin/orders' && method === 'GET') {
        sendJSON(res, 200, orders);
    }
    
    else if (path.match(/^\/api\/admin\/orders\/\d+\/status$/) && method === 'PUT') {
        const orderId = parseInt(path.split('/')[4]);
        parseBody(req, (body) => {
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.orderStatus = body.orderStatus;
                if (body.orderStatus === 'delivered') {
                    order.deliveredAt = new Date().toISOString();
                }
                // Regenerate invoice with new status
                order.invoice = generateInvoice(order);
                saveAllData();
                sendJSON(res, 200, order);
            } else {
                sendJSON(res, 404, { error: 'Order not found' });
            }
        });
    }
    
    else if (path === '/api/admin/users' && method === 'GET') {
        const safeUsers = users.map(u => ({ 
            id: u.id, 
            name: u.name, 
            email: u.email, 
            phone: u.phone, 
            isAdmin: u.isAdmin, 
            isActive: u.isActive !== false,
            accountNumber: u.accountNumber || 'N/A',
            createdAt: u.createdAt 
        }));
        sendJSON(res, 200, safeUsers);
    }
    
    else if (path.match(/^\/api\/admin\/users\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/')[4]);
        const userToDelete = users.find(u => u.id === id);
        
        if (!userToDelete) {
            sendJSON(res, 404, { error: 'User not found' });
        } else if (userToDelete.isAdmin) {
            sendJSON(res, 400, { error: 'Cannot delete admin user' });
        } else {
            users = users.filter(u => u.id !== id);
            saveAllData();
            console.log('✅ User deleted:', userToDelete.email);
            sendJSON(res, 200, { message: 'User deleted successfully' });
        }
    }
    
    else {
        console.log('❌ Endpoint not found:', path);
        sendJSON(res, 404, { error: 'Endpoint not found: ' + path });
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log('🚀 Shoppies Backend Server Running!');
    console.log('========================================');
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`📦 Products: ${products.length}`);
    console.log(`🏷️ Categories: ${categories.length}`);
    console.log(`👥 Users: ${users.length}`);
    console.log(`📋 Orders: ${orders.length}`);
    console.log(`🎫 Coupons: ${coupons.length}`);
    console.log('');
    console.log('🔐 Admin Login: admin@shoppies.com / admin123');
    console.log('');
    console.log('📝 VALIDATION RULES:');
    console.log('   ✅ Max 2 accounts per email');
    console.log('   ✅ Valid Kenyan phone number required');
    console.log('   ✅ Phone number must be unique');
    console.log('========================================');
});