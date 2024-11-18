require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

async function testConnection() {
    // Debug: Print environment variables (sanitized)
    console.log('Environment Variables Check:');
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    
    const uri = process.env.MONGO_URI;
    
    // Create a MongoClient with a MongoClientOptions object
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        // Connect the client to the server
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
        // List all databases (optional)
        const databasesList = await client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    } catch (error) {
        console.error('Connection test failed:');
        console.error(error);
    } finally {
        // Ensures that the client will close when you finish/error
        console.log('Closing connection...');
        await client.close();
        console.log('Connection closed');
    }
}

// Run the test
console.log('Starting MongoDB connection test...');
testConnection().catch(console.dir);
