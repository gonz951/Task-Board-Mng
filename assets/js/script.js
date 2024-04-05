// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskDisplayEl = $('#task-display');
const taskFormEl = $('#task-form');
const taskTitleInputEl = $('#task-title');
const taskDateInputEl = $('#task-due');
const taskDescriptionEl = $('#task-description');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskNum = Math.floor(Math.random() * 50);
    return taskNum;
}

// ? Making notes to figure out what went wrong. 
// * This reads tasks from localStorage and returns array of task objects.
// * if there are no tasks in storage, it initializes it in that 
// * empty array and returns it.
function readTasksFromStorage() {
    // * retrieving tasks from localStorage and parse the JSON to an array.
    // * Using let so things can be added from the if function; fluid
    // let tasks = JSON.parse(localStorage.getItem('taskData'));

    // * If no tasks in local storage, get tasks into empty array
    // * then return
    if (!taskList) {
        tasks = [];
    }
    console.log(tasks);
    return tasks;
}
// ! COME BACK HERE LATER 

// * accepts the array of objects, stringify, 
// * and saves them to tasks in localStorage.
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to create a task card
// * Creating a task card
function createTaskCard(task) {
    // * Start with the task card div, then add everything else
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);
    // * header, body, description, due date, and delete button 
    // * are all here.
    // ? Changed the task.name to task.title
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div').addClass('card-body');
    // ? changed the task.type to task.description
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.duedate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    // * Sets the card background color based on due date
    // * Might not be needed but *shrug*
    if(task.duedate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
        
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // * Gather elements from above and append them to the card body created
    // * append things needed to card body.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    // * return the task card so it can be appended to the correct lane.
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
// * Working under the idea that this is the equivalent of 
// * printProjectData from mini proj.
function renderTaskList() {
    const tasks = readTasksFromStorage();

    // * emptying existing project cards out of swim lanes
    // This is for the To Do swim lane
    const todoList = $('#todo-cards');
    todoList.empty();

    // This is for the In Progress swim lane
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    // This is for the Done swim lane 
    const doneList = $('#done-cards');
    doneList.empty();

    // * Tasks comes from the const at the start of this function ONLY
    // * loop through tasks and create task cards for each status
    for (let task of tasks) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    // * starting draggable here
    $('draggable').draggable({
        opacity: 0.7,
        zIndex: 100,

        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');

            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
    // * draggable function end 
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // ? Consts up top now exist; monitor closely! 
    // * Read user input from the form!
    const taskTitle = taskTitleInputEl.val().trim();
    const taskDate = taskDateInputEl.val();
    // * added trim here since it's also just regular input
    const taskDescription = taskDescriptionEl.val().trim();

    // * Making a newTask array to keep the info in
    const newTask = {
        // * Crypto is referenced from the mini project
        id: generateTaskId(),
        title: taskTitle,
        duedate: taskDate, 
        description: taskDescription,
        status: 'to-do',
    };

    // ? Pulling tasks from local storage here, then push
    const tasks = readTasksFromStorage();
    tasks.push(newTask);

    // * save tasks to tasks array to local storage
    saveTasksToStorage(tasks);

    // * render task data to screen
    renderTaskList();

    taskTitleInputEl.val('');
    taskDateInputEl.val('');
    taskDescriptionEl.val('');
}

// Todo: create a function to handle deleting a task
// ! removed event from parenthesis
function handleDeleteTask() {
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });

    // * saving tasks to local storage (tasks)
    saveTasksToStorage(tasks);

    // * render tasks to the screen
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // * Read tasks in localStorage
    const tasks = readTasksFromStorage();

    // ? Changed cardId back to taskId
    const taskId = ui.draggable[0].dataset.taskId;

    const newStatus = event.target.id;

    for (let task of tasks) {
        // * Find task card by id and update task status
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    // * render task list is finished
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// * Add event listener to form element 
// * listen for a submit event
// * Then call handleAddTask
taskFormEl.on('submit', handleAddTask);

// * Same for handleDeleteTask, except it's based on the button class
taskDisplayEl.on('click', '.btn-delete-task', handleDeleteTask);


$(document).ready(function () {
    // * equivalent of printProjectData 
    renderTaskList();

    $('#task-due').datepicker({
        changeMonth: true,
        changeYear: true,
    });
    
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});