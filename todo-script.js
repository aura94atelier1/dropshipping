// ============================================
// TASK MASTER - TO-DO LIST APPLICATION
// JavaScript Functionality with Local Storage
// ============================================

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.loadTasks();
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.render();
        this.updateStats();
    }

    cacheElements() {
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.exportBtn = document.getElementById('exportBtn');
    }

    attachEventListeners() {
        // Add task
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter tasks
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn));
        });

        // Action buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.exportBtn.addEventListener('click', () => this.exportTasks());
    }

    // ============================================
    // LOCAL STORAGE
    // ============================================
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        console.log('📝 Tasks saved to local storage');
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        this.tasks = saved ? JSON.parse(saved) : [];
        console.log(`📂 Loaded ${this.tasks.length} tasks from local storage`);
    }

    // ============================================
    // TASK MANAGEMENT
    // ============================================
    addTask() {
        const text = this.taskInput.value.trim();
        const priority = this.prioritySelect.value;

        if (!text) {
            this.showNotification('Please enter a task', 'error');
            return;
        }

        if (text.length > 100) {
            this.showNotification('Task is too long (max 100 characters)', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            priority: priority,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.prioritySelect.value = 'medium';
        this.render();
        this.updateStats();
        this.showNotification('✅ Task added successfully', 'success');
        this.taskInput.focus();
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            const taskText = this.tasks[taskIndex].text;
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.render();
            this.updateStats();
            this.showNotification('🗑️ Task deleted', 'success');
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            this.updateStats();
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('Edit task:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
            this.render();
            this.showNotification('✏️ Task updated', 'success');
        }
    }

    clearCompleted() {
        const completed = this.tasks.filter(t => t.completed).length;
        if (completed === 0) {
            this.showNotification('No completed tasks to clear', 'warning');
            return;
        }

        if (confirm(`Delete ${completed} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
            this.updateStats();
            this.showNotification('🧹 Cleared completed tasks', 'success');
        }
    }

    clearAll() {
        if (this.tasks.length === 0) {
            this.showNotification('No tasks to clear', 'warning');
            return;
        }

        if (confirm(`Delete all ${this.tasks.length} task(s)? This cannot be undone.`)) {
            this.tasks = [];
            this.saveTasks();
            this.render();
            this.updateStats();
            this.showNotification('🗑️ All tasks cleared', 'success');
        }
    }

    // ============================================
    // FILTERING
    // ============================================
    setFilter(btn) {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            case 'high':
                return this.tasks.filter(t => t.priority === 'high');
            default:
                return this.tasks;
        }
    }

    // ============================================
    // RENDERING
    // ============================================
    render() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.classList.add('show');
            this.taskList.style.display = 'none';
        } else {
            this.emptyState.classList.remove('show');
            this.taskList.style.display = 'block';
            filteredTasks.forEach(task => {
                const li = this.createTaskElement(task);
                this.taskList.appendChild(li);
            });
        }
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `${task.priority}-priority`;
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="taskManager.toggleTask(${task.id})"
            >
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <span class="task-timestamp">${task.createdAt}</span>
            <div class="task-actions">
                <button class="task-btn edit" onclick="taskManager.editTask(${task.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete" onclick="taskManager.deleteTask(${task.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return li;
    }

    // ============================================
    // STATISTICS
    // ============================================
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('progressPercent').textContent = progress + '%';

        // Update button states
        this.clearCompletedBtn.disabled = completed === 0;
        this.clearAllBtn.disabled = total === 0;
    }

    // ============================================
    // EXPORT
    // ============================================
    exportTasks() {
        if (this.tasks.length === 0) {
            this.showNotification('No tasks to export', 'warning');
            return;
        }

        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('📥 Tasks exported successfully', 'success');
    }

    // ============================================
    // UTILITIES
    // ============================================
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.background = type === 'success' ? '#48bb78' : 
                                        type === 'error' ? '#f56565' : '#ed8936';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'notificationSlideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================
// INITIALIZATION
// ============================================
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
    console.log('%c🎉 Task Master Loaded!', 'font-size: 20px; color: #667eea; font-weight: bold;');
    console.log('%c✨ All your tasks are saved locally in your browser', 'font-size: 12px; color: #667eea;');
    console.log('%c📊 Browser Storage: ' + (localStorage.getItem('tasks') ? 'Tasks loaded' : 'Ready for new tasks'), 'font-size: 11px; color: #764ba2;');
});