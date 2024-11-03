import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.db = null;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.connect();
  }

  async connect() {
    try {
      const client = await this.client.connect();
      this.db = client.db(DB_DATABASE);
      console.log('Database connected successfully');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      this.db = null;
    }
  }

  isAlive() {
    return this.db !== null;
  }

  async nbUsers() {
    if (!this.db) throw new Error('Database connection not established');
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.db) throw new Error('Database connection not established');
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
