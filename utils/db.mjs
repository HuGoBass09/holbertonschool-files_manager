// utils/db.mjs

import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/`;

class DBClient {
  constructor() {
    this.db = null;
    this.initializeDb();
  }

  async initializeDb() {
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      this.db = client.db(database);

      // Check for existing collections and create if they don't exist
      const collections = await this.db.listCollections().toArray();
      const collectionNames = collections.map((col) => col.name);

      if (!collectionNames.includes('users')) {
        await this.db.createCollection('users');
      }

      if (!collectionNames.includes('files')) {
        await this.db.createCollection('files');
      }

      console.log('Database initialized successfully.');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
    }
  }

  isAlive() {
    // Check if MongoDB client is connected
    return !!this.db;
  }

  async nbUsers() {
    // Count number of documents in 'users' collection
    return this.db.collection('users').countDocuments();
  }

  async getUser(query) {
    // Search for the user in the collection
    console.log('QUERY IN DB.JS', query);
    const user = await this.db.collection('users').findOne(query);
    console.log('GET USER IN DB.JS', user);
    return user;
  }

  async nbFiles() {
    // Count number of documents in 'files' collection
    return this.db.collection('files').countDocuments();
  }

  async saveFile(fileData) {
    // Insert a new document into the 'files' collection
    const result = await this.db.collection('files').insertOne(fileData);
    return { _id: result.insertedId, ...fileData };
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
