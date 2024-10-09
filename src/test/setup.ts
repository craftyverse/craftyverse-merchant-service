import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

declare global {
  var signup: (userId: string) => string;
}

dotenv.config({ path: ".env.test" });

// Connection URL to your MongoDB Docker instance
const mongoUri = process.env.MONGODB_CONNECTION_STRING!; // Replace with your Docker MongoDB URI

// Connect to MongoDB before any tests run
beforeAll(async () => {
  await mongoose.connect(mongoUri as string);
});

// Clear the database after each test
afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Disconnect from MongoDB after all tests are complete
afterAll(async () => {
  await mongoose.connection.close();
});

global.signup = (userId: string) => {
  // Build a JWT payload { id, email }
  const payload = {
    UserInfo: {
      userId: userId,
      userFirstName: "Tony",
      userLastName: "Li",
      userEmail: "tony.li@test.io",
      userPassword:
        "4d469d44bddeb9cb44a83a17825caf39a6c1ef9890058353c340802466144b1c7d3528886f338f35aca88189590d9c9717b335d8b8438929eff8fdebffaec3b2.957b64298267a5a7",
      userRoles: [2001, 5150, 1982],
      userRefreshToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VyRmlyc3ROYW1lIjoiVG9ueSIsInVzZXJMYXN0TmFtZSI6IkxpIiwidXNlckVtYWlsIjoidG9ueS5saTFAdGVzdC5pbyJ9LCJpYXQiOjE3MDA5NzI2NDUsImV4cCI6MTcwMTA1OTA0NX0.PYv9X9XcmTMKEvZ6b1owWtlWs11SQIp-ijWqKn1d9Zs",
      __v: 0,
    },
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

  return `Bearer ${token}`;
};
