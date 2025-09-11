# Database Schema Documentation

This document describes the database schema for the Smart To-Do List Application.

## Database Overview

The application uses PostgreSQL as the primary database, hosted on Google Cloud SQL. The schema is designed for scalability, data integrity, and optimal query performance.

## Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │ Categories  │    │    Tasks    │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ email       │◄───┤ user_id(FK) │    │ user_id(FK) ├─┐
│ password_hash│    │ name        │    │category_id  │ │
│ google_id   │    │ color       │◄───┤ title       │ │
│ name        │    │ created_at  │    │ description │ │
│ avatar_url  │    └─────────────┘    │ priority    │ │
│ created_at  │                       │ status      │ │
│ updated_at  │                       │ due_date    │ │
└─────────────┘                       │ completed_at│ │
                                      │ created_at  │ │
                                      │ updated_at  │ │
                                      └─────────────┘ │
                                                     │
                                      ┌─────────────┐ │
                                      │Attachments  │ │
                                      ├─────────────┤ │
                                      │ id (PK)     │ │
                                      │ task_id(FK) │◄┘
                                      │ filename    │
                                      │ file_url    │
                                      │ file_size   │
                                      │ mime_type   │
                                      │ created_at  │
                                      └─────────────┘
```

## Table Definitions

### Users Table

Stores user account information and authentication data.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),           -- bcrypt hash for email/password users
  google_id VARCHAR(255) UNIQUE,        -- Google OAuth ID for SSO users
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),              -- Profile picture URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
```

#### Constraints
- `email` must be unique and not null
- Either `password_hash` or `google_id` must be present
- `name` is required for all users

### Categories Table

Stores user-defined categories for task organization.

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',   -- Hex color code
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexes
```sql
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE UNIQUE INDEX idx_categories_user_name ON categories(user_id, name);
```

#### Constraints
- `name` must be unique per user
- `color` must be a valid hex color code
- Categories are automatically deleted when user is deleted

### Tasks Table

Stores individual tasks with all their properties.

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexes
```sql
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
```

#### Constraints
- `priority` must be between 1 and 5
- `status` must be one of: pending, in_progress, completed, cancelled
- `completed_at` should be set when status changes to 'completed'
- If category is deleted, `category_id` is set to NULL

### Task Attachments Table

Stores file attachments associated with tasks.

```sql
CREATE TABLE task_attachments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,       -- Original filename
  file_url VARCHAR(500) NOT NULL,       -- Cloud Storage URL
  file_size INTEGER,                    -- File size in bytes
  mime_type VARCHAR(100),               -- MIME type
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexes
```sql
CREATE INDEX idx_attachments_task_id ON task_attachments(task_id);
```

#### Constraints
- Attachments are automatically deleted when task is deleted
- `file_url` must be a valid URL
- `file_size` should be positive

## Data Types and Domains

### Priority Levels
- `1`: Minimal priority
- `2`: Low priority  
- `3`: Medium priority
- `4`: High priority
- `5`: Critical priority

### Task Status Values
- `pending`: Task created but not started
- `in_progress`: Task is currently being worked on
- `completed`: Task has been finished
- `cancelled`: Task is no longer needed

### Color Codes
- Categories use hex color codes (e.g., `#3B82F6`)
- Default colors provided for common categories
- Custom colors supported

## Database Functions and Triggers

### Update Timestamp Trigger

Automatically updates `updated_at` timestamp when records are modified.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Task Completion Trigger

Automatically sets `completed_at` when task status changes to 'completed'.

```sql
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = CURRENT_TIMESTAMP;
    ELSIF NEW.status != 'completed' THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER task_completion_trigger
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_completed_at();
```

## Query Patterns

### Common Queries

#### Get User's Active Tasks
```sql
SELECT t.*, c.name as category_name, c.color as category_color
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1 AND t.status != 'completed'
ORDER BY t.priority DESC, t.due_date ASC;
```

#### Get Tasks by Category
```sql
SELECT t.*
FROM tasks t
JOIN categories c ON t.category_id = c.id
WHERE c.user_id = $1 AND c.name = $2
ORDER BY t.created_at DESC;
```

#### Get Overdue Tasks
```sql
SELECT t.*, c.name as category_name
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1 
  AND t.status IN ('pending', 'in_progress')
  AND t.due_date < CURRENT_TIMESTAMP
ORDER BY t.due_date ASC;
```

#### Task Statistics
```sql
SELECT 
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 END) as overdue_tasks
FROM tasks
WHERE user_id = $1;
```

## Performance Considerations

### Index Strategy
- All foreign keys are indexed for efficient joins
- Commonly filtered columns (status, due_date, priority) have indexes
- Composite indexes used where appropriate (user_id + name for categories)

### Query Optimization
- Use appropriate LIMIT clauses for pagination
- Index-only scans for count queries
- Prepared statements for frequently executed queries

### Partitioning (Future)
For very large datasets, consider partitioning tasks table by:
- Date range (monthly partitions)
- User ID (for multi-tenant scenarios)

## Backup and Recovery

### Backup Strategy
- Automated daily backups via Google Cloud SQL
- Point-in-time recovery available
- Cross-region backup replication for disaster recovery

### Data Retention
- Active data: Retained indefinitely
- Deleted user data: Purged after 30 days
- Backup retention: 1 year for production

## Migration Strategy

### Schema Versioning
- Database migrations tracked in version control
- Forward and backward migration scripts
- Staging environment testing before production

### Example Migration Template
```sql
-- Migration: YYYY-MM-DD-description.sql
-- Description: Add new column to tasks table

BEGIN;

-- Add new column
ALTER TABLE tasks ADD COLUMN new_column VARCHAR(100);

-- Update existing data if needed
UPDATE tasks SET new_column = 'default_value' WHERE new_column IS NULL;

-- Add constraints if needed
ALTER TABLE tasks ALTER COLUMN new_column SET NOT NULL;

-- Add indexes if needed
CREATE INDEX idx_tasks_new_column ON tasks(new_column);

COMMIT;
```

## Security Considerations

### Data Protection
- All sensitive data encrypted at rest
- SSL/TLS encryption for data in transit
- Regular security updates and patches

### Access Control
- Database users with minimal required permissions
- Application-level access control
- No direct database access for users

### Audit Trail
- All data modifications logged
- User action tracking
- Compliance with data protection regulations

---

For database setup instructions, see [Installation Guide](../installation-guide.md).
For performance tuning, see [Performance Guide](../admin/performance.md).