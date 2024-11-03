import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    // Initialize `this.db` to `null`, to be set once connection is successful
    this.db = null;

    // Connect to MongoDB and assign the database instance to `this.db`
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(DB_DATABASE);
      } else {
        this.db = null; // Explicitly set to `null` on failure
      }
    });
  }

  isAlive() {
    return this.db !== null;
  }

  async nbUsers() {
    if (!this.isAlive()) return 0; // Return 0 if database connection is not established
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive()) return 0; // Return 0 if database connection is not established
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
