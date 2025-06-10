class TaskManager {
  constructor() {
    this.tasks = [];
    this.completedTasks = [];
    this.categories = new Set(['work', 'personal', 'urgent']);
    this.notifications = [];
    this.nextId = 1;
  }

  addTask(title, description, category = 'personal', dueDate = null) {
    if (!title || title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }

    if (!this.categories.has(category)) {
      this.categories.add(category);
    }

    const task = {
      id: this.nextId++,
      title: title.trim(),
      description: description || '',
      category,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: new Date(),
      completed: false,
      priority: this.calculatePriority(category, dueDate),
      tags: [],
      subtasks: []
    };

    this.tasks.push(task);
    this.sortTasksByPriority();
    return task;
  }

  calculatePriority(category, dueDate) {
    let priority = 0;
    
    if (category === 'urgent') {
      priority += 10;
    } else if (category === 'work') {
      priority += 5;
    }

    if (dueDate) {
      const daysUntilDue = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 1) {
        priority += 20;
      } else if (daysUntilDue <= 3) {
        priority += 15;
      } else if (daysUntilDue <= 7) {
        priority += 10;
      } else if (daysUntilDue <= 14) {
        priority += 5;
      }
    }

    return priority;
  }

  sortTasksByPriority() {
    this.tasks.sort((a, b) => b.priority - a.priority);
  }

  completeTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const task = this.tasks[taskIndex];
    task.completed = true;
    task.completedAt = new Date();
    
    this.completedTasks.push(task);
    this.tasks.splice(taskIndex, 1);
    
    this.addNotification(`Task "${task.title}" completed!`, 'success');
    return task;
  }

  updateTask(taskId, updates) {
    const task = this.tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const allowedUpdates = ['title', 'description', 'category', 'dueDate', 'tags'];
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (key === 'dueDate' && updates[key]) {
          task[key] = new Date(updates[key]);
        } else {
          task[key] = updates[key];
        }
      }
    });

    task.priority = this.calculatePriority(task.category, task.dueDate);
    this.sortTasksByPriority();
    
    return task;
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      const completedIndex = this.completedTasks.findIndex(task => task.id === taskId);
      if (completedIndex !== -1) {
        this.completedTasks.splice(completedIndex, 1);
        return true;
      }
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  addSubtask(parentTaskId, subtaskTitle) {
    const task = this.tasks.find(t => t.id === parentTaskId);
    
    if (!task) {
      throw new Error(`Parent task with id ${parentTaskId} not found`);
    }

    const subtask = {
      id: `${parentTaskId}-${task.subtasks.length + 1}`,
      title: subtaskTitle,
      completed: false,
      createdAt: new Date()
    };

    task.subtasks.push(subtask);
    return subtask;
  }

  completeSubtask(parentTaskId, subtaskId) {
    const task = this.tasks.find(t => t.id === parentTaskId);
    
    if (!task) {
      throw new Error(`Parent task with id ${parentTaskId} not found`);
    }

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    
    if (!subtask) {
      throw new Error(`Subtask with id ${subtaskId} not found`);
    }

    subtask.completed = true;
    subtask.completedAt = new Date();
    
    const allSubtasksCompleted = task.subtasks.every(st => st.completed);
    if (allSubtasksCompleted && task.subtasks.length > 0) {
      this.addNotification(`All subtasks for "${task.title}" are completed!`, 'info');
    }
    
    return subtask;
  }

  addTag(taskId, tag) {
    const task = this.tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    if (!task.tags.includes(tag)) {
      task.tags.push(tag);
    }
    
    return task;
  }

  removeTag(taskId, tag) {
    const task = this.tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const tagIndex = task.tags.indexOf(tag);
    if (tagIndex !== -1) {
      task.tags.splice(tagIndex, 1);
    }
    
    return task;
  }

  getTasksByCategory(category) {
    return this.tasks.filter(task => task.category === category);
  }

  getTasksByTag(tag) {
    return this.tasks.filter(task => task.tags.includes(tag));
  }

  getOverdueTasks() {
    const now = new Date();
    return this.tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && !task.completed
    );
  }

  getUpcomingTasks(days = 7) {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return this.tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= now && 
      new Date(task.dueDate) <= future &&
      !task.completed
    );
  }

  searchTasks(query) {
    const lowerQuery = query.toLowerCase();
    
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  addNotification(message, type = 'info') {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.unshift(notification);
    
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    
    return notification;
  }

  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  getStatistics() {
    const totalTasks = this.tasks.length + this.completedTasks.length;
    const completedCount = this.completedTasks.length;
    const overdueCount = this.getOverdueTasks().length;
    
    const categoryStats = {};
    this.categories.forEach(category => {
      categoryStats[category] = {
        active: this.tasks.filter(t => t.category === category).length,
        completed: this.completedTasks.filter(t => t.category === category).length
      };
    });

    return {
      totalTasks,
      activeTasks: this.tasks.length,
      completedTasks: completedCount,
      completionRate: totalTasks > 0 ? (completedCount / totalTasks * 100).toFixed(2) + '%' : '0%',
      overdueTasks: overdueCount,
      categoryStatistics: categoryStats,
      averageTasksPerDay: this.calculateAverageTasksPerDay()
    };
  }

  calculateAverageTasksPerDay() {
    if (this.completedTasks.length === 0) return 0;
    
    const dates = this.completedTasks.map(t => t.completedAt.toDateString());
    const uniqueDates = new Set(dates);
    
    return (this.completedTasks.length / uniqueDates.size).toFixed(2);
  }

  exportTasks(format = 'json') {
    const data = {
      tasks: this.tasks,
      completedTasks: this.completedTasks,
      categories: Array.from(this.categories),
      exportDate: new Date()
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
      const headers = ['ID', 'Title', 'Description', 'Category', 'Due Date', 'Status', 'Priority'];
      const rows = [...this.tasks, ...this.completedTasks].map(task => [
        task.id,
        task.title,
        task.description,
        task.category,
        task.dueDate ? task.dueDate.toISOString() : '',
        task.completed ? 'Completed' : 'Active',
        task.priority
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\\n');
    }
    
    throw new Error('Unsupported export format');
  }

  importTasks(data, format = 'json') {
    try {
      if (format === 'json') {
        const parsed = JSON.parse(data);
        
        if (parsed.tasks) {
          parsed.tasks.forEach(task => {
            task.createdAt = new Date(task.createdAt);
            if (task.dueDate) task.dueDate = new Date(task.dueDate);
            this.tasks.push(task);
          });
        }
        
        if (parsed.completedTasks) {
          parsed.completedTasks.forEach(task => {
            task.createdAt = new Date(task.createdAt);
            task.completedAt = new Date(task.completedAt);
            if (task.dueDate) task.dueDate = new Date(task.dueDate);
            this.completedTasks.push(task);
          });
        }
        
        if (parsed.categories) {
          parsed.categories.forEach(cat => this.categories.add(cat));
        }
        
        this.sortTasksByPriority();
        this.addNotification('Tasks imported successfully', 'success');
        
        return true;
      }
      
      throw new Error('Unsupported import format');
    } catch (error) {
      this.addNotification(`Import failed: ${error.message}`, 'error');
      return false;
    }
  }
}

module.exports = TaskManager;