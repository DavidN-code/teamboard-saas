const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const User = require("../src/models/User");
const Organization = require("../src/models/Organization");
const Board = require("../src/models/Board");
const Task = require("../src/models/Task");
const Comment = require("../src/models/Comment");
const AuditLog = require("../src/models/AuditLog");

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

async function createBoardAndTask(tenant, suffix) {
  const board = await Board.create({
    name: `Board ${suffix}`,
    organizationId: tenant.organization._id,
    createdBy: tenant.owner._id,
  });

  const task = await Task.create({
    title: `Task ${suffix}`,
    board: board._id,
    organizationId: tenant.organization._id,
    createdBy: tenant.owner._id,
  });

  return { board, task };
}

describe("Comment and activity tenant isolation", () => {
  test("organization A cannot create a comment on organization B task", async () => {
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

    const { task: taskB } = await createBoardAndTask(orgB, "B");

    const response = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        content: "Cross tenant comment",
        taskId: taskB._id.toString(),
      });

    expect(response.status).toBe(400);

    const comment = await Comment.findOne({
      content: "Cross tenant comment",
    });

    expect(comment).toBeNull();
  });

  test("organization A cannot read organization B comments", async () => {
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

    const { task: taskB } = await createBoardAndTask(orgB, "B");

    await Comment.create({
      content: "Secret Org B comment",
      taskId: taskB._id,
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .get(`/api/comments/task/${taskB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("organization A cannot update organization B comment", async () => {
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

    const { task: taskB } = await createBoardAndTask(orgB, "B");

    const commentB = await Comment.create({
      content: "Original Org B comment",
      taskId: taskB._id,
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .put(`/api/comments/${commentB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        content: "Hacked comment",
      });

    expect(response.status).toBe(404);

    const unchangedComment = await Comment.findById(commentB._id);

    expect(unchangedComment.content).toBe("Original Org B comment");
  });

  test("organization A cannot delete organization B comment", async () => {
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

    const { task: taskB } = await createBoardAndTask(orgB, "B");

    const commentB = await Comment.create({
      content: "Org B comment",
      taskId: taskB._id,
      organizationId: orgB.organization._id,
      createdBy: orgB.owner._id,
    });

    const response = await request(app)
      .delete(`/api/comments/${commentB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(404);

    const existingComment = await Comment.findById(commentB._id);

    expect(existingComment).not.toBeNull();
  });

  test("organization A cannot read organization B task activity", async () => {
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

    const { board: boardB, task: taskB } =
      await createBoardAndTask(orgB, "B");

    await AuditLog.create({
      action: "UPDATE_TASK",
      resourceType: "Task",
      resourceId: taskB._id,
      boardId: boardB._id,
      userId: orgB.owner._id,
      organizationId: orgB.organization._id,
      details: {
        taskTitle: "Secret Org B Task",
      },
    });

    const response = await request(app)
      .get(`/api/audit-logs/task/${taskB._id}`)
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("organization audit log endpoint returns only its own organization's logs", async () => {
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

    const { board: boardA, task: taskA } =
      await createBoardAndTask(orgA, "A");

    const { board: boardB, task: taskB } =
      await createBoardAndTask(orgB, "B");

    await AuditLog.create({
      action: "UPDATE_TASK",
      resourceType: "Task",
      resourceId: taskA._id,
      boardId: boardA._id,
      userId: orgA.owner._id,
      organizationId: orgA.organization._id,
      details: {
        taskTitle: "Org A Task",
      },
    });

    await AuditLog.create({
      action: "UPDATE_TASK",
      resourceType: "Task",
      resourceId: taskB._id,
      boardId: boardB._id,
      userId: orgB.owner._id,
      organizationId: orgB.organization._id,
      details: {
        taskTitle: "Secret Org B Task",
      },
    });

    const response = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${orgA.token}`);

    expect(response.status).toBe(200);
    expect(response.body.logs).toHaveLength(1);

    expect(
      response.body.logs[0].organizationId.toString()
    ).toBe(orgA.organization._id.toString());

    expect(
      response.body.logs[0].details.taskTitle
    ).toBe("Org A Task");
  });

  test("rejects malformed task ID when reading comments", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });
  
    const response = await request(app)
      .get("/api/comments/task/not-a-valid-id")
      .set("Authorization", `Bearer ${orgA.token}`);
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
  
  test("rejects malformed comment ID when updating a comment", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });
  
    const response = await request(app)
      .put("/api/comments/not-a-valid-id")
      .set("Authorization", `Bearer ${orgA.token}`)
      .send({
        content: "Updated comment",
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
  
  test("rejects malformed comment ID when deleting a comment", async () => {
    const orgA = await createTenant({
      organizationName: "Organization A",
      ownerName: "Owner A",
      ownerEmail: "owner-a@example.com",
    });
  
    const response = await request(app)
      .delete("/api/comments/not-a-valid-id")
      .set("Authorization", `Bearer ${orgA.token}`);
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});