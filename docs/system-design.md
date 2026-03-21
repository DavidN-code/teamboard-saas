# TeamBoard System Design Notes

## User Model Responsibilities

In TeamBoard, a User:

- Authenticates via email and password
- Belongs to exactly one organization
- Has a role within that organization
- Can be locked after repeated failed login attempts
- Generates audit log events
- Must never access data outside their organization

---

## User Schema Design Decisions

### Email
- Required
- Unique
- Indexed for fast login queries
- Lowercased and trimmed

### Password
- Stored as bcrypt hash
- Never returned in queries (select: false)
- Never logged

### Role
- Enum: owner | admin | member
- Default: member
- Used for RBAC enforcement

### organizationId
- Required
- Indexed
- Enforces multi-tenant isolation
- Used in every scoped database query

### Account Locking
- isLocked boolean
- failedLoginAttempts counter
- Used for brute-force protection


## Organization Model Responsibilities

- Represents a tenant (team/company)
- Owns all associated data (users, tasks, logs)
- Defines the boundary for multi-tenant isolation
- Has a single owner (ownerId)

---

## Organization Schema Design Decisions

### ownerId
- Required reference to User
- Indexed for efficient lookup
- Ensures a single authoritative owner per organization

### Data Ownership
- Users reference organizationId (not stored in Organization)
- Prevents duplication and keeps relationships normalized