const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing. Set it before running:');
    console.error('MONGO_URI="mongodb+srv://<user>:<password>@.../<dbname>?retryWrites=true&w=majority" node test-mongo.js');
    process.exit(1);
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    await client.db().admin().ping();
    console.log('Ping ok');
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
})();