const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
    process.env.JWT_SECRET = "teamboard-test-secret";
  
    mongoServer = await MongoMemoryServer.create();
  
    await mongoose.connect(mongoServer.getUri());
  }, 30000);

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);
