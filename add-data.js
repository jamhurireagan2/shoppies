// add-data.js - Run this to add multiple categories and products at once
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Helper to read JSON
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

// Helper to write JSON
function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Read existing data
let categories = readJSON(CATEGORIES_FILE, []);
let products = readJSON(PRODUCTS_FILE, []);

// Get next IDs
let nextCategoryId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
let nextProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

console.log('========================================');
console.log('📊 CURRENT DATA STATUS');
console.log('========================================');
console.log(`Existing categories: ${categories.length}`);
console.log(`Existing products: ${products.length}`);
console.log('');

// ============ NEW CATEGORIES TO ADD ============
const newCategories = [
    { id: nextCategoryId++, name: "Fruits", icon: "fa-apple-alt", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Phones", icon: "fa-mobile-alt", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Drinks", icon: "fa-mug-hot", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Books", icon: "fa-book", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Toys", icon: "fa-gamepad", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Sports", icon: "fa-futbol", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Baby Products", icon: "fa-baby-carriage", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Pet Supplies", icon: "fa-paw", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Office Supplies", icon: "fa-building", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Automotive", icon: "fa-car", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Furniture", icon: "fa-couch", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Jewelry", icon: "fa-gem", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Shoes", icon: "fa-shoe-prints", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Watches", icon: "fa-clock", active: true, createdAt: new Date().toISOString() },
    { id: nextCategoryId++, name: "Cameras", icon: "fa-camera", active: true, createdAt: new Date().toISOString() }
];

// ============ NEW PRODUCTS TO ADD ============
const newProducts = [
    // Fruits
    { id: nextProductId++, name: "Fresh Mangoes", price: 300, category: "fruits", stock: 100, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200", description: "Sweet and juicy fresh mangoes", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Fresh Oranges", price: 200, category: "fruits", stock: 150, image: "https://images.unsplash.com/photo-1547514701-4278210179e1?w=200", description: "Fresh oranges rich in Vitamin C", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Fresh Pineapple", price: 400, category: "fruits", stock: 80, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200", description: "Sweet pineapples", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Fresh Watermelon", price: 500, category: "fruits", stock: 60, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200", description: "Refreshing watermelons", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Fresh Strawberries", price: 800, category: "fruits", stock: 40, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca5?w=200", description: "Fresh strawberries", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Fresh Grapes", price: 450, category: "fruits", stock: 70, image: "https://images.unsplash.com/photo-1537640538966-79f369c4cd1c?w=200", description: "Sweet grapes", createdAt: new Date().toISOString() },
    
    // Phones
    { id: nextProductId++, name: "iPhone 15 Pro", price: 155000, category: "phones", stock: 20, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200", description: "Latest iPhone 15 Pro", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "iPhone 15", price: 125000, category: "phones", stock: 25, image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=200", description: "iPhone 15", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Samsung Galaxy S24 Ultra", price: 165000, category: "phones", stock: 15, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200", description: "Samsung flagship phone", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Samsung Galaxy S24", price: 145000, category: "phones", stock: 25, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200", description: "Samsung Galaxy S24", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Tecno Spark 20", price: 15000, category: "phones", stock: 50, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=200", description: "Affordable smartphone", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Infinix Note 40", price: 32000, category: "phones", stock: 40, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=200", description: "Infinix Note series", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Google Pixel 8", price: 120000, category: "phones", stock: 18, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200", description: "Google Pixel 8", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Xiaomi 13 Pro", price: 95000, category: "phones", stock: 30, image: "https://images.unsplash.com/photo-1676127128648-09edf3d8d5f8?w=200", description: "Xiaomi flagship", createdAt: new Date().toISOString() },
    
    // Drinks
    { id: nextProductId++, name: "Coca-Cola (2L)", price: 250, category: "drinks", stock: 200, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200", description: "Coca-Cola 2 liter bottle", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Pepsi (2L)", price: 250, category: "drinks", stock: 180, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200", description: "Pepsi 2 liter bottle", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Fresh Juice (1L)", price: 350, category: "drinks", stock: 100, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200", description: "Mixed fruit juice", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Mineral Water (500ml)", price: 50, category: "drinks", stock: 500, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200", description: "Pure mineral water", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Red Bull (250ml)", price: 200, category: "drinks", stock: 150, image: "https://images.unsplash.com/photo-1584308666744-00d4c2cb5cdc?w=200", description: "Energy drink", createdAt: new Date().toISOString() },
    
    // Books
    { id: nextProductId++, name: "Atomic Habits", price: 1500, category: "books", stock: 30, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200", description: "Best-selling book by James Clear", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Rich Dad Poor Dad", price: 1200, category: "books", stock: 25, image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200", description: "Financial literacy book", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "The Psychology of Money", price: 1300, category: "books", stock: 20, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200", description: "Morgan Housel bestseller", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Think and Grow Rich", price: 1000, category: "books", stock: 35, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200", description: "Napoleon Hill classic", createdAt: new Date().toISOString() },
    
    // Toys
    { id: nextProductId++, name: "LEGO Classic Set", price: 2500, category: "toys", stock: 40, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200", description: "Creative building blocks", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Remote Control Car", price: 3500, category: "toys", stock: 20, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200", description: "RC car for kids", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Barbie Doll", price: 1800, category: "toys", stock: 50, image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200", description: "Barbie doll", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Teddy Bear", price: 1200, category: "toys", stock: 100, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200", description: "Soft teddy bear", createdAt: new Date().toISOString() },
    
    // Sports
    { id: nextProductId++, name: "Football", price: 2000, category: "sports", stock: 50, image: "https://images.unsplash.com/photo-1575361203943-0e5e4add37bc?w=200", description: "Professional football", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Tennis Racket", price: 4500, category: "sports", stock: 30, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1f0?w=200", description: "Tennis racket", createdAt: new Date().toISOString() },
    
    // Baby Products
    { id: nextProductId++, name: "Baby Diapers (Pack)", price: 800, category: "baby products", stock: 200, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200", description: "Premium baby diapers", createdAt: new Date().toISOString() },
    { id: nextProductId++, name: "Baby Wipes", price: 350, category: "baby products", stock: 150, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200", description: "Baby wipes", createdAt: new Date().toISOString() }
];

// ============ ADD CATEGORIES (skip if already exists) ============
let categoriesAdded = 0;
let categoriesSkipped = 0;

console.log('🏷️ ADDING CATEGORIES...');
console.log('========================================');

for (const newCat of newCategories) {
    const exists = categories.some(c => c.name.toLowerCase() === newCat.name.toLowerCase());
    if (!exists) {
        categories.push(newCat);
        categoriesAdded++;
        console.log(`✅ Added category: ${newCat.name} (ID: ${newCat.id})`);
    } else {
        categoriesSkipped++;
        console.log(`⏭️ Skipped (already exists): ${newCat.name}`);
    }
}

// ============ ADD PRODUCTS (skip if already exists) ============
let productsAdded = 0;
let productsSkipped = 0;

console.log('');
console.log('📦 ADDING PRODUCTS...');
console.log('========================================');

for (const newProd of newProducts) {
    const exists = products.some(p => p.name.toLowerCase() === newProd.name.toLowerCase());
    if (!exists) {
        products.push(newProd);
        productsAdded++;
        console.log(`✅ Added product: ${newProd.name} (Ksh ${newProd.price})`);
    } else {
        productsSkipped++;
        console.log(`⏭️ Skipped (already exists): ${newProd.name}`);
    }
}

// Save to files
writeJSON(CATEGORIES_FILE, categories);
writeJSON(PRODUCTS_FILE, products);

console.log('');
console.log('========================================');
console.log('📊 DATA ADDED SUMMARY');
console.log('========================================');
console.log(`📁 Categories file: ${CATEGORIES_FILE}`);
console.log(`📁 Products file: ${PRODUCTS_FILE}`);
console.log('');
console.log(`🏷️ Categories: ${categoriesAdded} added, ${categoriesSkipped} skipped`);
console.log(`📦 Products: ${productsAdded} added, ${productsSkipped} skipped`);
console.log('');
console.log(`📊 Final totals:`);
console.log(`   Total Categories: ${categories.length}`);
console.log(`   Total Products: ${products.length}`);
console.log('');
console.log('✅ All data added successfully!');
console.log('========================================');
console.log('');
console.log('🎯 Next steps:');
console.log('   1. Restart your backend: node backend.js');
console.log('   2. Refresh your admin page');
console.log('   3. Check Categories and Products tabs');
console.log('========================================');