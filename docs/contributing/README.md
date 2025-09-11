# Contributing Guidelines

Thank you for your interest in contributing to the Smart To-Do List Application! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Review Process](#review-process)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](./code-of-conduct.md) before participating.

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Development Environment**: Follow the [Installation Guide](../installation-guide.md)
2. **Git Knowledge**: Basic understanding of Git and GitHub workflow
3. **Technology Stack**: Familiarity with React, Node.js, TypeScript, and Google Cloud Platform
4. **Project Understanding**: Read the [Architecture Overview](../architecture/overview.md)

### Setting Up Development Environment

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ProjectA.git
   cd ProjectA
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/nibertinvestments/ProjectA.git
   ```

3. **Install Dependencies**
   ```bash
   npm run install:all
   ```

4. **Set Up Environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env with your configuration
   ```

5. **Verify Setup**
   ```bash
   npm run dev
   ```

## Development Process

### Branching Strategy

We use a Git Flow branching model:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Feature development branches
- **`hotfix/*`**: Critical production fixes
- **`release/*`**: Release preparation branches

### Creating a Feature Branch

```bash
# Update your local develop branch
git checkout develop
git pull upstream develop

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# ... make changes ...

# Commit your changes
git add .
git commit -m "feat: add new feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes

#### Examples

```bash
feat(auth): add Google OAuth integration
fix(tasks): resolve duplicate task creation issue
docs(api): update authentication endpoints documentation
test(tasks): add unit tests for task validation
refactor(ui): improve component structure
```

## Coding Standards

### TypeScript Guidelines

#### General Rules
- Use TypeScript strict mode
- Prefer interfaces over types for object definitions
- Use explicit return types for functions
- Avoid `any` type - use proper typing

#### Example Code Style
```typescript
// Interface definition
interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
}

// Function with explicit return type
async function createTask(taskData: CreateTaskInput): Promise<Task> {
  // Validation
  if (!taskData.title.trim()) {
    throw new ValidationError('Title is required');
  }

  // Implementation
  const task = await taskService.create(taskData);
  return task;
}
```

### React Guidelines

#### Component Structure
```typescript
// Component props interface
interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

// Component implementation
export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = useCallback(async (updatedTask: Task) => {
    try {
      await onUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [onUpdate]);

  return (
    <div className="task-item">
      {/* Component JSX */}
    </div>
  );
};
```

#### Hooks Guidelines
- Use custom hooks for reusable logic
- Prefer `useCallback` and `useMemo` for optimization
- Keep hooks simple and focused

### CSS/Styling Guidelines

#### Tailwind CSS Usage
- Use Tailwind utility classes consistently
- Create custom components for repeated patterns
- Use responsive design utilities

```tsx
// Good: Responsive and semantic
<div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-md">
  <div className="flex-1 space-y-2">
    <h3 className="text-lg font-semibold text-gray-900">
      {task.title}
    </h3>
    <p className="text-sm text-gray-600">
      {task.description}
    </p>
  </div>
</div>
```

### Backend Guidelines

#### Express.js Structure
```typescript
// Controller example
export class TaskController {
  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Validation
      const validatedData = createTaskSchema.parse(req.body);
      
      // Business logic
      const task = await this.taskService.create({
        ...validatedData,
        userId: req.user!.id
      });

      // Response
      res.status(201).json({
        success: true,
        data: { task },
        message: 'Task created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
```

#### Error Handling
```typescript
// Custom error classes
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Error middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        field: error.field
      }
    });
  }

  // Handle other errors...
};
```

## Testing Guidelines

### Frontend Testing

#### Unit Tests with Vitest
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from './TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    status: 'pending' as const,
    createdAt: new Date()
  };

  it('displays task title', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={vi.fn()} 
        onDelete={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={vi.fn()} 
        onDelete={onDelete} 
      />
    );
    
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
```

### Backend Testing

#### API Tests with Jest and Supertest
```typescript
import request from 'supertest';
import { app } from '../src/app';
import { setupTestDatabase, cleanupTestDatabase } from './helpers/database';

describe('Task API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/tasks', () => {
    it('creates a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 3
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.title).toBe(taskData.title);
    });
  });
});
```

### Test Coverage

- Maintain minimum 80% test coverage
- Focus on critical business logic
- Test edge cases and error scenarios
- Include integration tests for API endpoints

## Documentation

### Code Documentation

#### JSDoc Comments
```typescript
/**
 * Creates a new task for the authenticated user
 * @param taskData - The task data to create
 * @param userId - The ID of the user creating the task
 * @returns Promise resolving to the created task
 * @throws {ValidationError} When task data is invalid
 * @throws {DatabaseError} When database operation fails
 */
async function createTask(
  taskData: CreateTaskInput, 
  userId: number
): Promise<Task> {
  // Implementation
}
```

#### README Updates
- Update relevant README files when adding features
- Include code examples for new functionality
- Update installation instructions if dependencies change

### API Documentation
- Update OpenAPI/Swagger specifications
- Include request/response examples
- Document error codes and responses

## Pull Request Process

### Before Submitting

1. **Code Quality Checks**
   ```bash
   # Run linting
   npm run lint

   # Run tests
   npm run test

   # Build project
   npm run build
   ```

2. **Documentation Updates**
   - Update relevant documentation
   - Add/update tests
   - Update CHANGELOG.md

3. **Self Review**
   - Review your own changes
   - Check for debugging code
   - Ensure consistent formatting

### Pull Request Template

Use this template for your PR description:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No breaking changes (or noted above)

## Screenshots
(If applicable, add screenshots of UI changes)

## Additional Notes
Any additional context or notes for reviewers.
```

### Review Criteria

PRs will be reviewed for:
- **Functionality**: Does it work as intended?
- **Code Quality**: Is it well-written and maintainable?
- **Tests**: Are there adequate tests?
- **Documentation**: Is documentation updated?
- **Performance**: Any performance implications?
- **Security**: Any security concerns?

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Windows 10, macOS Big Sur]
- Browser: [e.g., Chrome 96, Safari 15]
- Version: [e.g., 1.2.3]

## Additional Context
Screenshots, logs, or other context.
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature.

## Problem
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives
Any alternative solutions considered?

## Additional Context
Any other context or screenshots.
```

## Review Process

### Code Review Guidelines

#### For Reviewers
- Be constructive and respectful
- Focus on code, not the person
- Explain reasoning behind suggestions
- Approve when ready, request changes when needed

#### For Authors
- Respond to all feedback
- Ask questions if unclear
- Make requested changes promptly
- Thank reviewers for their time

### Review Checklist

- [ ] **Functionality**: Feature works as described
- [ ] **Code Quality**: Clean, readable, maintainable code
- [ ] **Tests**: Adequate test coverage
- [ ] **Documentation**: Updated and accurate
- [ ] **Performance**: No performance regressions
- [ ] **Security**: No security vulnerabilities
- [ ] **Accessibility**: UI changes are accessible
- [ ] **Mobile**: Responsive design maintained

## Getting Help

### Where to Ask Questions

1. **GitHub Discussions**: General questions and discussions
2. **Issues**: Bug reports and feature requests
3. **PR Comments**: Specific code-related questions
4. **Documentation**: Check existing documentation first

### Mentorship

New contributors can request mentorship:
- Comment on issues you'd like to work on
- Ask for guidance in discussions
- Join our community channels

## Recognition

Contributors are recognized through:
- GitHub contributor graphs
- Release notes acknowledgments
- Contributor spotlights
- Maintainer nominations for outstanding contributors

---

Thank you for contributing to the Smart To-Do List Application! Your contributions help make this project better for everyone.