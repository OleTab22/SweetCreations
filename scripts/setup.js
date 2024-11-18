const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Environment variables
const envContent = `
FIREBASE_API_KEY=AIzaSyBrWr2D61WE3G8Ea_NhthEspg4mkETf5KY
FIREBASE_AUTH_DOMAIN=graphic-cosmos-430712-m5.firebaseapp.com
FIREBASE_DATABASE_URL=https://graphic-cosmos-430712-m5-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=graphic-cosmos-430712-m5
FIREBASE_STORAGE_BUCKET=graphic-cosmos-430712-m5.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1075553029056
FIREBASE_APP_ID=1:1075553029056:web:6b0ad52ab754753bdf1625
MONGO_URI=mongodb+srv://serenopapi:Testing123@cluster0.ehte6.mongodb.net/sweet_creations?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=cf1f2031ac014a8e324e40cfc75bb7250d135bdd949952c4e51e6ccae5f826b8099bae933d14ab9dc670f0af20f3ed7425021671c6c2a66612c3001c5db51325
`.trim();

// Create necessary directories
const dirs = [
    'public_html/images/products',
    'public_html/js/utils',
    'public_html/css',
    'backend/config',
    'backend/controllers',
    'backend/middlewares',
    'backend/models',
    'backend/routes',
    'backend/scripts'
];

// Create directories
dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Write .env file
const envPath = path.join(__dirname, '../backend/.env');
fs.writeFileSync(envPath, envContent);
console.log('Created .env file');

// Install dependencies
console.log('\nInstalling dependencies...');
try {
    execSync('npm run install-deps', { stdio: 'inherit' });
    console.log('Dependencies installed successfully');
} catch (error) {
    console.error('Error installing dependencies:', error);
}

console.log('\nSetup complete! Next steps:');
console.log('1. Run "npm run seed" to populate the database with initial products');
console.log('2. Run "npm run dev" to start the development server'); 