const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jobportalhub.o4wbs.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("jobPortalHub");
    console.log("Connected to MongoDB successfully!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit on failure
  }
}

module.exports = connectDB;
