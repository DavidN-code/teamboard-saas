const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const User = require("../src/models/User");
const Organization = require("../src/models/Organization");
const Board = require("../src/models/Board");
const Task = require("../src/models/Task");

async function createTenant({
  organizationName,
  ownerName,
  ownerEmail,
}) {
  const organization = await Organization.create({
    name: organizationName,
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  const owner = await User.create({
    name: ownerName,
    email: ownerEmail,
    password: hashedPassword,
    role: "owner",
    organizationId: organization._id,
  });

  organization.ownerId = owner._id;
  await organization.save();

  const token = jwt.sign(
    {
      userId: owner._id.toString(),
      organizationId: organization._id.toString(),
      role: "owner",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    organization,
    owner,
    token,
  };
}

describe("Board and task tenant isolation", () => {
  test("organization A cannot fetch organization B board", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardB = await Board.create({
      name: "Board B",
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .get(`/api/boards/${boardB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(404);
  });

  test("organization A cannot rename organization B board", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardB = await Board.create({
      name: "Board B",
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .put(`/api/boards/${boardB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        name: "Hacked Board",
      });

    expect(response.status).toBe(404);

    const unchangedBoard = await Board.findById(boardB._id);

    expect(unchangedBoard.name).toBe("Board B");
  });

  test("organization A cannot delete organization B board", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardB = await Board.create({
      name: "Board B",
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .delete(`/api/boards/${boardB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(404);

    const existingBoard = await Board.findById(boardB._id);

    expect(existingBoard).not.toBeNull();
  });

  test("organization A cannot fetch organization B task", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardB = await Board.create({
      name: "Board B",
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const taskB = await Task.create({
      title: "Task B",
      board: boardB._id,
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .get(`/api/tasks/${taskB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(404);
  });

  test("organization A cannot update organization B task", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardB = await Board.create({
      name: "Board B",
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const taskB = await Task.create({
      title: "Task B",
      board: boardB._id,
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .put(`/api/tasks/${taskB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        title: "Hacked Task",
      });

    expect(response.status).toBe(404);

    const unchangedTask = await Task.findById(taskB._id);

    expect(unchangedTask.title).toBe("Task B");
  });

  test("organization A cannot delete organization B task", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardB = await Board.create({
      name: "Board B",
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const taskB = await Task.create({
      title: "Task B",
      board: boardB._id,
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .delete(`/api/tasks/${taskB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(404);

    const existingTask = await Task.findById(taskB._id);

    expect(existingTask).not.toBeNull();
  });

  test("organization A cannot create task inside organization B board", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardB = await Board.create({
      name: "Board B",
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        title: "Cross Tenant Task",
        board: boardB._id.toString(),
      });

    expect(response.status).toBe(400);

    const task = await Task.findOne({
      title: "Cross Tenant Task",
    });

    expect(task).toBeNull();
  });

  test("organization A cannot assign organization B user to its task", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });

    const orgB = await createTenant({
      organizationName: "Organization B",
      ownerName: "Owner B",
      ownerEmail: "owner-b@example.com",
    });

    const boardA = await Board.create({
      name: "Board A",
      organizationId: orgA.organization._id,
      createdBy: orgA.owner._id,
    });

    const taskA = await Task.create({
      title: "Task A",
      board: boardA._id,
      organizationId: orgA.organization._id,
      createdBy: orgA.owner._id,
    });

    const response = await request(app)
      .put(`/api/tasks/${taskA._id}`)
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        assignedTo: orgB.owner._id.toString(),
      });

    expect(response.status).toBe(400);

    const unchangedTask = await Task.findById(taskA._id);

    expect(unchangedTask.assignedTo).toBeFalsy();
  });
});