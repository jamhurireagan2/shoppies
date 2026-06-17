const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Your MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://shoppies_admin:Reaganmadola254@shoppiescluster.ynf1ybt.mongodb.net/shoppies?retryWrites=true&w=majority&appName=shoppiesCluster';

const DATA_DIR = path.join(__dirname, 'data');

async function importData() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔐 Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas!');
        
        const db = client.db('shoppies');
        console.log('📊 Using database:', db.databaseName);
        
        const files = ['products', 'categories', 'users', 'orders', 'coupons'];
        let totalImported = 0;
        let totalSkipped = 0;
        
        for (const file of files) {
            const filePath = path.join(DATA_DIR, file + '.json');
            
            if (fs.existsSync(filePath)) {
                console.log('📁 Reading ' + file + '.json...');
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                if (data.length === 0) {
                    console.log('⚠️ ' + file + '.json is empty, skipping...');
                    continue;
                }
                
                const collection = db.collection(file);
                
                if (file === 'users') {
                    console.log('   🔍 Checking ' + data.length + ' users...');
                    let inserted = 0;
                    let skipped = 0;
                    
                    for (const user of data) {
                        try {
                            const existing = await collection.findOne({ email: user.email });
                            if (existing) {
                                console.log('   ⏭️ Skipped (already exists): ' + user.email);
                                skipped++;
                                continue;
                            }
                            await collection.insertOne(user);
                            inserted++;
                            console.log('   ✅ Inserted: ' + user.email);
                        } catch (error) {
                            if (error.code === 11000) {
                                console.log('   ⏭️ Skipped (duplicate): ' + user.email);
                                skipped++;
                            } else {
                                console.log('   ❌ Error: ' + user.email, error.message);
                            }
                        }
                    }
                    console.log('✅ Imported ' + inserted + ' users (' + skipped + ' skipped)');
                    totalImported += inserted;
                    totalSkipped += skipped;
                } else {
                    await collection.deleteMany({});
                    console.log('   🗑️ Cleared existing ' + file);
                    const result = await collection.insertMany(data);
                    console.log('✅ Imported ' + result.insertedCount + ' ' + file);
                    totalImported += result.insertedCount;
                }
            } else {
                console.log('❌ ' + file + '.json not found');
            }
        }
        
        console.log('\n========================================');
        console.log('🎉 Total imported: ' + totalImported);
        console.log('📊 Total skipped: ' + totalSkipped);
        console.log('========================================');
        
        console.log('\n📋 Verification:');
        for (const file of files) {
            const collection = db.collection(file);
            const count = await collection.countDocuments();
            console.log('   ' + file + ': ' + count + ' documents');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('🔒 Connection closed.');
    }
}

importData();