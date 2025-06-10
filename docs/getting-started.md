# Getting Started Guide

This guide will help you get up and running with the Next Platform Starter project, which combines Next.js 14 with a powerful TaskManager system.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git for version control
- Netlify CLI (for full local development features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/next-platform-starter.git
   cd next-platform-starter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Netlify CLI globally:**
   ```bash
   npm install netlify-cli@latest -g
   ```

4. **Link to Netlify (optional):**
   ```bash
   netlify link
   ```

5. **Start development server:**
   ```bash
   netlify dev
   ```

   Visit [http://localhost:8888](http://localhost:8888) to see your application.

## Using the TaskManager

The TaskManager class is the core component for task management functionality. Here's how to get started:

### Basic Usage

```javascript
// Import the TaskManager
const TaskManager = require('./src/taskManager');

// Create a new instance
const taskManager = new TaskManager();

// Add your first task
const task = taskManager.addTask(
  'Learn TaskManager API',
  'Read documentation and try examples',
  'personal',
  '2024-12-31'
);

console.log('Created task:', task);
```

### Creating Different Types of Tasks

```javascript
// Work task with high priority
const workTask = taskManager.addTask(
  'Prepare presentation',
  'Create slides for quarterly review',
  'work',
  '2024-12-20'
);

// Urgent task (gets highest priority)
const urgentTask = taskManager.addTask(
  'Fix critical bug',
  'Address production issue immediately',
  'urgent'
);

// Personal task with tags
const personalTask = taskManager.addTask(
  'Plan vacation',
  'Research destinations and book flights',
  'personal'
);
taskManager.addTag(personalTask.id, 'travel');
taskManager.addTag(personalTask.id, 'planning');
```

### Working with Subtasks

```javascript
// Add subtasks to break down complex tasks
const complexTask = taskManager.addTask(
  'Launch new feature',
  'Complete feature development and deployment',
  'work'
);

taskManager.addSubtask(complexTask.id, 'Write unit tests');
taskManager.addSubtask(complexTask.id, 'Update documentation');
taskManager.addSubtask(complexTask.id, 'Deploy to staging');
taskManager.addSubtask(complexTask.id, 'Deploy to production');
```

### Managing Your Tasks

```javascript
// View tasks by category
const workTasks = taskManager.getTasksByCategory('work');
console.log('Work tasks:', workTasks);

// Check overdue tasks
const overdueTasks = taskManager.getOverdueTasks();
if (overdueTasks.length > 0) {
  console.log('You have overdue tasks:', overdueTasks);
}

// View upcoming tasks
const upcomingTasks = taskManager.getUpcomingTasks(7);
console.log('Tasks due this week:', upcomingTasks);

// Search tasks
const searchResults = taskManager.searchTasks('presentation');
console.log('Found tasks:', searchResults);
```

### Completing Tasks

```javascript
// Complete a task
const completedTask = taskManager.completeTask(workTask.id);
console.log('Completed:', completedTask.title);

// Complete subtasks
taskManager.completeSubtask(complexTask.id, '1-1'); // Complete first subtask
```

### Tracking Progress

```javascript
// Get comprehensive statistics
const stats = taskManager.getStatistics();
console.log('Task Statistics:');
console.log(`Total tasks: ${stats.totalTasks}`);
console.log(`Completion rate: ${stats.completionRate}`);
console.log(`Overdue tasks: ${stats.overdueTasks}`);
console.log('Category breakdown:', stats.categoryStatistics);
```

## Project Structure

```
next-platform-starter/
├── src/
│   └── taskManager.js          # Core TaskManager class
├── docs/
│   ├── intro.md               # Project introduction
│   ├── getting-started.md     # This guide
│   └── task-manager-api.md    # Complete API documentation
├── README.md                  # Project overview
└── package.json              # Dependencies and scripts
```

## Development Workflow

1. **Create tasks** for features or bugs you're working on
2. **Break down complex tasks** into subtasks
3. **Use categories** to organize different types of work
4. **Set due dates** for time-sensitive tasks
5. **Add tags** for better organization and searchability
6. **Monitor progress** with statistics and notifications

## Next Steps

- Read the [TaskManager API Documentation](./task-manager-api.md) for complete method references
- Explore the Next.js features in the main application
- Set up deployment to Netlify using the deploy button in the README
- Customize categories and notification settings for your workflow

## Common Patterns

### Daily Task Review
```javascript
// Morning routine: check what's due today and overdue
const todaysTasks = taskManager.getUpcomingTasks(1);
const overdueTasks = taskManager.getOverdueTasks();

console.log('Today\'s agenda:', todaysTasks);
if (overdueTasks.length > 0) {
  console.log('⚠️  Overdue items:', overdueTasks);
}
```

### Weekly Planning
```javascript
// Weekly planning: review upcoming tasks and set priorities
const weeklyTasks = taskManager.getUpcomingTasks(7);
const stats = taskManager.getStatistics();

console.log('This week\'s tasks:', weeklyTasks);
console.log('Current completion rate:', stats.completionRate);
```

### Data Backup
```javascript
// Export your tasks for backup
const backup = taskManager.exportTasks('json');
// Save to file or external storage
```

References issue #20