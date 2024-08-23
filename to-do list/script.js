// Selectors
const taskInput = document.getElementById('task-name');
const dueDateInput = document.getElementById('task-due-date');
const priorityInput = document.getElementById('task-priority');
const categoryInput = document.getElementById('task-category');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.task-filter button');

// Event Listeners
document.addEventListener('DOMContentLoaded', loadTasks);
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', modifyTask);
filterButtons.forEach(button => button.addEventListener('click', filterTasks));

// Functions
function addTask() {
    const task = {
        name: taskInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        category: categoryInput.value,
        completed: false
    };

    if (task.name === '') return; // Simple validation

    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks(tasks);
    clearInputs();
}

function modifyTask(e) {
    const item = e.target;
    if (item.tagName === 'BUTTON') {
        const tasks = getTasksFromStorage();
        const taskItem = item.closest('.task-item');
        const taskName = taskItem.querySelector('span').textContent;

        if (item.textContent === 'Delete') {
            const filteredTasks = tasks.filter(task => task.name !== taskName);
            localStorage.setItem('tasks', JSON.stringify(filteredTasks));
            renderTasks(filteredTasks);
        } else if (item.textContent === 'Complete') {
            tasks.forEach(task => {
                if (task.name === taskName) {
                    task.completed = !task.completed;
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks(tasks);
        }
    }
}

function filterTasks(e) {
    const filter = e.target.getAttribute('data-filter');
    const tasks = getTasksFromStorage();

    let filteredTasks;
    if (filter === 'all') {
        filteredTasks = tasks;
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    renderTasks(filteredTasks);
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) taskItem.classList.add('completed');
        const truncatedName = task.name.length > 30 ? `${task.name.substring(0, 30)}...` : task.name;
        const truncatedCategory = task.category.length > 15 ? `${task.category.substring(0, 15)}...` : task.category;

        taskItem.innerHTML = `
        <span>${truncatedName}</span>
        <span>Due: ${task.dueDate} | Priority: ${task.priority} | Category: ${truncatedCategory}</span>
        <div class="task-buttons">
            <button>Complete</button>
            <button>Delete</button>
        </div>
    `;
    taskList.appendChild(taskItem);
});
}

function clearInputs() {
    taskInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = 'medium';
    categoryInput.value = '';
}

function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    renderTasks(tasks);
}
