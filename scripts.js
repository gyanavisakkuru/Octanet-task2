document.getElementById('taskForm').addEventListener('submit', addTask);

let tasks = [];
let progressChart = null;

function addTask(e) {
    e.preventDefault();
    
    let taskName = document.getElementById('taskName').value;
    let deadline = document.getElementById('deadline').value;
    let priority = document.getElementById('priority').value;
    let label = document.getElementById('label').value;

    let task = {
        id: Date.now(),
        name: taskName,
        deadline: deadline,
        priority: priority,
        label: label,
        status: 'To Do'
    };

    tasks.push(task);
    updateTaskList();
    updateProgressChart();
    document.getElementById('taskForm').reset();
}

function updateTaskList() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        let taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        let taskHeader = document.createElement('div');
        taskHeader.className = 'task-header';

        let taskTitle = document.createElement('h3');
        taskTitle.innerText = task.name;

        let taskPriority = document.createElement('span');
        taskPriority.className = `priority ${task.priority}`;
        taskPriority.innerText = task.priority;

        taskHeader.appendChild(taskTitle);
        taskHeader.appendChild(taskPriority);

        let taskDeadline = document.createElement('p');
        taskDeadline.innerText = `Deadline: ${task.deadline}`;

        let taskLabel = document.createElement('p');
        taskLabel.innerText = `Label: ${task.label}`;

        let taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';

        let inProgressButton = document.createElement('button');
        inProgressButton.className = 'in-progress';
        inProgressButton.innerText = 'In Progress';
        inProgressButton.onclick = () => updateTaskStatus(task.id, 'In Progress');

        let completedButton = document.createElement('button');
        completedButton.className = 'completed';
        completedButton.innerText = 'Completed';
        completedButton.onclick = () => updateTaskStatus(task.id, 'Completed');

        taskStatus.appendChild(inProgressButton);
        taskStatus.appendChild(completedButton);

        taskDiv.appendChild(taskHeader);
        taskDiv.appendChild(taskDeadline);
        taskDiv.appendChild(taskLabel);
        taskDiv.appendChild(taskStatus);

        taskList.appendChild(taskDiv);
    });
}

function updateTaskStatus(taskId, status) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.status = status;
        }
        return task;
    });
    updateTaskList();
    updateProgressChart();
}

function updateProgressChart() {
    let ctx = document.getElementById('progressChart').getContext('2d');
    let statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {});

    let data = {
        labels: ['To Do', 'In Progress', 'Completed'],
        datasets: [{
            data: [
                statusCounts['To Do'] || 0,
                statusCounts['In Progress'] || 0,
                statusCounts['Completed'] || 0
            ],
            backgroundColor: ['#ff5959', '#ffcc00', '#4CAF50']
        }]
    };

    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
