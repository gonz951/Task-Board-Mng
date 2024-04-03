// Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskDisplayEl = $('#task-display');
const taskFormEl = $('#task-form');
const taskTitleInputEl = $('#task-title');
const taskDateInputEl = $('#task-due');
const taskDescriptionEl = $('#task-description');

// Todo: create a function to generate a unique task id
// function generateTaskId() {
// }

function readTaskFromStorage() {
    let taskList = JSON.parse(localStorage.getItem("tasks"));

    if (!taskList) {
        taskList = [];
    }
    return taskList;
}
// ! COME BACK HERE LATER 

function saveTasksToStorage(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.name)
    const cardBody = $('<div').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.type);
    const cardDueDate = $('<p>').addClass('card-text').text(task.duedate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

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

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = readTaskFromStorage();

    // This is for the To Do swim lane
    const todoList = $('#todo-cards');
    todoList.empty();

    // This is for the In Progress swim lane
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    // This is for the Done swim lane 
    const doneList = $('#done-cards');
    doneList.empty();

    // * Need to add more
    // * Tasks comes from the const at the start of this function ONLY
    for (let task of tasks) {
        if(task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    // ! START DRAGGABLE 
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
    // draggable function end 

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // * Consts up top now exist; monitor closely! 
    const taskTitle = taskTitleInputEl.val().trim();
    const taskDate = taskDateInputEl.val();
    // * added trim here since it's also just regular input
    const taskDescription = taskDescriptionEl.val().trim();

    const newTask = {
        // * Crypto is referenced from the mini project
        id: crypto.randomUUID(),
        name: taskTitle,
        duedate: taskDate, 
        description: taskDescription,
        status: 'to-do',
    };

    // ? Pulling tasks from local storage here, then push
     const tasks = readTaskFromStorage();
     tasks.push(newTask);

     saveTasksToStorage(tasks);

     renderTaskList();

     taskTitleInputEl.val('');
     taskDateInputEl.val('');
     taskDescriptionEl.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    // const tasks = 
    // ! Need to figure out tasks before doing this


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // const tasks = generateTaskId();

    const taskId = ui.draggable[0].dataset.projectId;

    const newStatus = event.target.id;

    for (let task of taskList) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    //! THIS STILL NEEDS TO BE DONE 
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
taskFormEl.on('submit', handleAddTask);

taskDisplayEl.on('click', '.btn-delte-task', handleDeleteTask);


$(document).ready(function () {



    $( function() {
        $( "#task-due" ).datepicker();
      } );
    
      $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });
});