import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.db = new Promise((resolve) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      client.connect((err) => {
        if (err) {
          console.error('Failed to connect to MongoDB:', err);
          resolve(null); // Set to null on failure
        } else {
          console.log('Database connected successfully');
          resolve(client.db(DB_DATABASE)); // Resolve with the database instance
        }
      });
    });
  }

  async isAlive() {
    return (await this.db) !== null;
  }

  async nbUsers() {
    const db = await this.db;
    if (!db) throw new Error('Database connection not established');
    return db.collection('users').countDocuments();
  }

  async nbFiles() {
    const db = await this.db;
    if (!db) throw new Error('Database connection not established');
    return db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
