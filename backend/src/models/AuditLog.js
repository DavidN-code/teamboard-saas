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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: Object, // optional extra info
  }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);