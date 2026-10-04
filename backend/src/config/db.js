const mongoose = require('mongoose');

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
    try {
      const parsed = new URL(mongoUri);
      console.log('Mongo protocol:', parsed.protocol);
      console.log('Mongo host:', parsed.hostname);
      console.log('Mongo database:', parsed.pathname || '/');
      console.log('Mongo username:', parsed.username);
      console.log('Mongo password present:', Boolean(parsed.password));
      console.log('Mongo URI length:', mongoUri.length);

      if (rawUri !== mongoUri) {
        console.log('Notice: Accidental surrounding quotes or whitespace were detected and sanitized from MONGO_URI.');
      }
    } catch (parseErr) {
      console.error('Mongo URI URL parsing warning:', parseErr.message);
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

    // Categorized safe diagnostics for deployment platforms like Render
    if (
      error.message.includes('bad auth') ||
      error.code === 18 ||
      error.code === 8000
    ) {
      console.error('Diagnostic Category: AUTHENTICATION FAILURE');
      console.error('Possible Causes:');
      console.error(' 1. The password or username in Render MONGO_URI environment variable does not match MongoDB Atlas Database Access User.');
      console.error(' 2. Accidental quotes (" or \') or trailing spaces were entered into Render Environment Variable value field.');
      console.error(' 3. Database user password contains special characters (@, :, /, ?, #) that require URL encoding.');
    } else if (
      error.name === 'MongoNetworkError' ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ENOTFOUND')
    ) {
      console.error('Diagnostic Category: NETWORK / ACCESS FAILURE');
      console.error('Possible Cause: Render IP is blocked by MongoDB Atlas.');
      console.error('Fix: In MongoDB Atlas -> Network Access, ensure 0.0.0.0/0 (Allow Access from Anywhere) is added.');
    } else if (
      error.name === 'MongoParseError' ||
      error.code === 'ERR_INVALID_URL'
    ) {
      console.error('Diagnostic Category: INVALID URI FORMAT');
      console.error('Possible Cause: The connection string in MONGO_URI is malformed.');
    } else if (
      error.message.includes('querySrv') ||
      error.name === 'MongoServerSelectionError'
    ) {
      console.error('Diagnostic Category: CLUSTER / DNS SELECTION FAILURE');
      console.error('Possible Cause: Cannot resolve cluster DNS SRV record or host is unreachable.');
    }

    console.error('--------------------------------------------------');
    process.exit(1);
  }
};

module.exports = connectDB;
