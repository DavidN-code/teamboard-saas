const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const User = require("../src/models/User");
const Organization = require("../src/models/Organization");

async function createOrganizationWithUser({
  organizationName,
  name,
  email,
  role = "owner",
}) {
  const organization = await Organization.create({
    name: organizationName,
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    organizationId: organization._id,
  });

  if (role === "owner") {
    organization.ownerId = user._id;
    await organization.save();
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      organizationId: organization._id.toString(),
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    organization,
    user,
    token,
  };
}

describe("Authorization and tenant isolation", () => {
  test("owner can access organization audit logs", async () => {
    const { token } = await createOrganizationWithUser({
      organizationName: "Organization A",
      name: "Owner A",
      email: "owner-a@example.com",
      role: "owner",
    });

    const response = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.logs).toBeDefined();
  });

  test("member cannot access organization audit logs", async () => {
    const { token } = await createOrganizationWithUser({
      organizationName: "Organization A",
      name: "Member A",
      email: "member-a@example.com",
      role: "member",
    });

    const response = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  test("current database role overrides stale owner role in JWT", async () => {
    const { user, token } = await createOrganizationWithUser({
      organizationName: "Organization A",
      name: "Owner A",
      email: "owner-a@example.com",
      role: "owner",
    });

    // Simulate the user's role changing after the JWT was issued.
    user.role = "member";
    await user.save();

    const response = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  test("owner cannot change the role of a user in another organization", async () => {
    const orgA = await createOrganizationWithUser({
      organizationName: "Organization A",
      name: "Owner A",
      email: "owner-a@example.com",
      role: "owner",
    });

    const orgB = await createOrganizationWithUser({
      organizationName: "Organization B",
      name: "User B",
      email: "user-b@example.com",
      role: "member",
    });

    const response = await request(app)
      .put(`/api/users/${orgB.user._id}/role`)
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        role: "admin",
      });

    expect(response.status).toBe(404);

    const unchangedUser = await User.findById(orgB.user._id);

    expect(unchangedUser.role).toBe("member");
  });

  test("owner cannot delete a user in another organization", async () => {
    const orgA = await createOrganizationWithUser({
      organizationName: "Organization A",
      name: "Owner A",
      email: "owner-a@example.com",
      role: "owner",
    });

    const orgB = await createOrganizationWithUser({
      organizationName: "Organization B",
      name: "User B",
      email: "user-b@example.com",
      role: "member",
    });

    const response = await request(app)
      .delete(`/api/users/${orgB.user._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(404);

    const existingUser = await User.findById(orgB.user._id);

    expect(existingUser).not.toBeNull();
  });

  test("member cannot change another user's role", async () => {
    const organization = await Organization.create({
      name: "Organization A",
    });

    const hashedPassword = await bcrypt.hash("password123", 10);

    const member = await User.create({
      name: "Member A",
      email: "member-a@example.com",
      password: hashedPassword,
      role: "member",
      organizationId: organization._id,
    });

    const targetUser = await User.create({
      name: "Target User",
      email: "target@example.com",
      password: hashedPassword,
      role: "member",
      organizationId: organization._id,
    });

    const token = jwt.sign(
      {
        userId: member._id.toString(),
        organizationId: organization._id.toString(),
        role: "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = await request(app)
      .put(`/api/users/${targetUser._id}/role`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        role: "admin",
      });

    expect(response.status).toBe(403);

    const unchangedUser = await User.findById(targetUser._id);

    expect(unchangedUser.role).toBe("member");
  });

  test("member cannot list organization users", async () => {
    const { token } = await createOrganizationWithUser({
      organizationName: "Organization A",
      name: "Member A",
      email: "member-a@example.com",
      role: "member",
    });
  
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(403);
  });
});