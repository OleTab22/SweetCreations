require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://serenopapi:Testing123@cluster0.ehte6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        console.log("Attempting to connect to MongoDB...");
        
        // Connect the client to the server
        await client.connect();
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
        // List available databases
        const databasesList = await client.db().admin().listDatabases();
        console.log("\nAvailable databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        
    } catch (error) {
        console.error("Connection error:", error);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log("\nConnection closed");
    }
}

console.log("Starting MongoDB connection test...");
run().catch(console.dir);