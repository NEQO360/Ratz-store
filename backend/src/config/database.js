const mongoose = require('mongoose');

let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      if (require.main === module) process.exit(1);
      return;
    }

    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: true,
    }).then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection failed:', error.message);
    if (require.main === module) process.exit(1);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;