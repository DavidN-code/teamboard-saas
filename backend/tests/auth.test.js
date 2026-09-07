const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Organization = require("../src/models/Organization");

describe("Authentication", () => {
  test("rejects login when password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  test("rejects login with an invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "not-an-email",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  test("registers a new owner and organization", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Owner",
        email: "owner@example.com",
        password: "password123",
        organizationName: "Test Organization",
      });

    expect(response.status).toBe(201);

    const user = await User.findOne({
      email: "owner@example.com",
    });

    expect(user).not.toBeNull();
    expect(user.role).toBe("owner");

    const organization = await Organization.findById(
      user.organizationId
    );

    expect(organization).not.toBeNull();
    expect(organization.name).toBe("Test Organization");
  });

  test("rejects duplicate registration", async () => {
    const registration = {
      name: "Test Owner",
      email: "owner@example.com",
      password: "password123",
      organizationName: "Test Organization",
    };

    await request(app)
      .post("/api/auth/register")
      .send(registration);

    const response = await request(app)
      .post("/api/auth/register")
      .send(registration);

    expect(response.status).toBe(400);
  });

  test("logs in a registered user and returns a token", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Owner",
        email: "owner@example.com",
        password: "password123",
        organizationName: "Test Organization",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "owner@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe("owner@example.com");
    expect(response.body.user.role).toBe("owner");
  });

  test("rejects login with an incorrect password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Owner",
        email: "owner@example.com",
        password: "password123",
        organizationName: "Test Organization",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "owner@example.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  test("rejects protected route without a token", async () => {
    const response = await request(app)
      .get("/api/auth/protected");

    expect(response.status).toBe(401);
  });

  test("allows protected route with a valid token", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Owner",
        email: "owner@example.com",
        password: "password123",
        organizationName: "Test Organization",
      });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "owner@example.com",
        password: "password123",
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/auth/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
