# TaskManager API Documentation

The TaskManager class provides a comprehensive task management system with features for creating, organizing, and tracking tasks with priorities, categories, and subtasks.

## Overview

The TaskManager is a JavaScript class located in `src/taskManager.js` that handles:
- Task creation and management
- Priority-based task sorting
- Category and tag organization
- Subtask functionality
- Notification system
- Data import/export capabilities
- Statistical reporting

## Constructor

```javascript
const taskManager = new TaskManager();
```

Initializes a new TaskManager instance with:
- Empty task arrays (`tasks`, `completedTasks`)
- Default categories: `['work', 'personal', 'urgent']`
- Empty notifications array
- ID counter starting at 1

## Core Methods

### Task Management

#### `addTask(title, description, category, dueDate)`

Creates a new task with automatic priority calculation.

**Parameters:**
- `title` (string, required) - Task title
- `description` (string, optional) - Task description
- `category` (string, optional) - Task category (default: 'personal')
- `dueDate` (Date|string, optional) - Due date for the task

**Returns:** Task object with generated ID and priority

**Example:**
```javascript
const task = taskManager.addTask(
  'Complete documentation', 
  'Write comprehensive API docs', 
  'work', 
  '2024-12-31'
);
```

#### `completeTask(taskId)`

Marks a task as completed and moves it to the completed tasks list.

**Parameters:**
- `taskId` (number) - ID of the task to complete

**Returns:** Completed task object

**Example:**
```javascript
const completedTask = taskManager.completeTask(1);
```

#### `updateTask(taskId, updates)`

Updates an existing task with new values.

**Parameters:**
- `taskId` (number) - ID of the task to update
- `updates` (object) - Object containing fields to update

**Allowed update fields:** `title`, `description`, `category`, `dueDate`, `tags`

**Example:**
```javascript
taskManager.updateTask(1, {
  title: 'Updated task title',
  category: 'urgent',
  dueDate: '2024-12-25'
});
```

#### `deleteTask(taskId)`

Removes a task from either active or completed tasks.

**Parameters:**
- `taskId` (number) - ID of the task to delete

**Returns:** Boolean indicating success

### Subtask Management

#### `addSubtask(parentTaskId, subtaskTitle)`

Adds a subtask to an existing task.

**Parameters:**
- `parentTaskId` (number) - ID of the parent task
- `subtaskTitle` (string) - Title of the subtask

**Returns:** Subtask object with generated ID

**Example:**
```javascript
const subtask = taskManager.addSubtask(1, 'Review documentation');
```

#### `completeSubtask(parentTaskId, subtaskId)`

Marks a subtask as completed.

**Parameters:**
- `parentTaskId` (number) - ID of the parent task
- `subtaskId` (string) - ID of the subtask

**Returns:** Completed subtask object

### Tag Management

#### `addTag(taskId, tag)`

Adds a tag to a task.

**Parameters:**
- `taskId` (number) - ID of the task
- `tag` (string) - Tag to add

**Example:**
```javascript
taskManager.addTag(1, 'documentation');
```

#### `removeTag(taskId, tag)`

Removes a tag from a task.

## Query Methods

### `getTasksByCategory(category)`

Returns all active tasks in a specific category.

**Example:**
```javascript
const workTasks = taskManager.getTasksByCategory('work');
```

### `getTasksByTag(tag)`

Returns all tasks containing a specific tag.

### `getOverdueTasks()`

Returns all tasks that are past their due date.

### `getUpcomingTasks(days)`

Returns tasks due within the specified number of days (default: 7).

**Example:**
```javascript
const urgentTasks = taskManager.getUpcomingTasks(3);
```

### `searchTasks(query)`

Searches tasks by title, description, or tags.

**Parameters:**
- `query` (string) - Search term

**Example:**
```javascript
const results = taskManager.searchTasks('documentation');
```

## Priority System

Tasks are automatically assigned priorities based on:
- **Category weights:**
  - `urgent`: +10 points
  - `work`: +5 points
  - `personal`: 0 points
- **Due date proximity:**
  - ≤ 1 day: +20 points
  - ≤ 3 days: +15 points
  - ≤ 7 days: +10 points
  - ≤ 14 days: +5 points

Tasks are automatically sorted by priority (highest first).

## Notification System

### `addNotification(message, type)`

Creates a notification with types: `'info'`, `'success'`, `'error'`.

### `getUnreadNotifications()`

Returns all unread notifications.

## Data Management

### `exportTasks(format)`

Exports all tasks in JSON or CSV format.

**Parameters:**
- `format` (string) - Export format: `'json'` or `'csv'`

**Example:**
```javascript
const jsonData = taskManager.exportTasks('json');
const csvData = taskManager.exportTasks('csv');
```

### `importTasks(data, format)`

Imports tasks from JSON data.

### `getStatistics()`

Returns comprehensive statistics including:
- Total tasks count
- Completion rate
- Category breakdown
- Average tasks per day

**Example:**
```javascript
const stats = taskManager.getStatistics();
console.log(`Completion rate: ${stats.completionRate}`);
```

## Task Object Structure

```javascript
{
  id: 1,
  title: "Task title",
  description: "Task description",
  category: "work",
  dueDate: Date,
  createdAt: Date,
  completed: false,
  priority: 15,
  tags: ["tag1", "tag2"],
  subtasks: [
    {
      id: "1-1",
      title: "Subtask title",
      completed: false,
      createdAt: Date
    }
  ]
}
```

## Error Handling

The TaskManager throws errors for:
- Empty task titles
- Non-existent task IDs
- Invalid update parameters
- Unsupported export/import formats

Always wrap TaskManager operations in try-catch blocks:

```javascript
try {
  const task = taskManager.addTask('', 'Empty title task');
} catch (error) {
  console.error('Error:', error.message);
}
```

References issue #17