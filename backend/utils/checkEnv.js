const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Error: Missing required environment variable ${varName}`);
        process.exit(1);
    }
}); 