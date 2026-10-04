const mongoose = require('mongoose');
const crypto = require('crypto');

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI;
  
  // Sanitize URI: remove leading/trailing whitespace and accidental surrounding quotes
  const mongoUri = rawUri
    ? rawUri.trim().replace(/^["'\s]+|["'\s]+$/g, '')
    : 'mongodb://127.0.0.1:27017/expense_tracker';

  // Safe diagnostic logging (NEVER exposes actual password or full URI)
  console.log('--- MongoDB Connection Diagnostics ---');
  console.log('Mongo URI exists:', Boolean(rawUri));

  if (rawUri) {
    const uriHash = crypto
      .createHash('sha256')
      .update(mongoUri)
      .digest('hex');

    console.log('Mongo URI SHA256:', uriHash);
    console.log('Mongo URI length:', mongoUri.length);

    try {
      const parsed = new URL(mongoUri);
      console.log('Mongo protocol:', parsed.protocol);
      console.log('Mongo host:', parsed.hostname);
      console.log('Mongo username:', parsed.username);
      console.log('Mongo database:', parsed.pathname || '/');
      console.log('Mongo password present:', Boolean(parsed.password));
    } catch (parseErr) {
      console.error('Mongo URI URL parsing error:', parseErr.message);
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('--------------------------------------------------');
    console.error('MongoDB Connection Failed!');
    console.error(`Error Message: ${error.message}`);

    if (
      error.message.includes('bad auth') ||
      error.code === 18 ||
      error.code === 8000
    ) {
      console.error('Diagnostic Category: AUTHENTICATION FAILURE');
    } else if (
      error.name === 'MongoNetworkError' ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ENOTFOUND')
    ) {
      console.error('Diagnostic Category: NETWORK / ACCESS FAILURE');
    } else if (
      error.name === 'MongoParseError' ||
      error.code === 'ERR_INVALID_URL'
    ) {
      console.error('Diagnostic Category: INVALID URI FORMAT');
    } else if (
      error.message.includes('querySrv') ||
      error.name === 'MongoServerSelectionError'
    ) {
      console.error('Diagnostic Category: CLUSTER / DNS SELECTION FAILURE');
    }

    console.error('--------------------------------------------------');
    process.exit(1);
  }
};

module.exports = connectDB;
