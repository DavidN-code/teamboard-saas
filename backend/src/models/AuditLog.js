const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: Object, 
  }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);