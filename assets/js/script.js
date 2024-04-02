// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!taskList) {
        taskList = [];
    }
    return taskList;
    // ! COME BACK HERE LATER 
}

// function saveTasksToStorage(taskList) {
//     localStorage.setItem('tasks', JSON.stringify(taskList));
// }

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
    const tasks = generateTaskId();

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

    })

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = generateTaskId();

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
$(document).ready(function () {

});


// For modal 
// ! FIX NAMING 
$( function() {
    var dialog, form,
      name = $( "#task-name" ),
    //   ! Still need to change these
      date = $( "#duedate" ),
    //   * Fixed any traces of 'email', but should check later
      password = $( "#password" ),
    //   ! Still need to change these
      allFields = $( [] ).add( name ).add( date ).add( password ),
      tips = $( ".validateTips" );

      // tips is a little more disconnected than everything
    function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }
    
    // ? This might be for the password input from before, 
    // ? So it might need to be removed 
    function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
          min + " and " + max + "." );
        return false;
      } else {
        return true;
      }
    }
 
    function checkRegexp( o, regexp, n ) {
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips( n );
        return false;
      } else {
        return true;
      }
    }
 
    function addTask() {
        // ! Any traces of addUser should be addTask
      var valid = true;
      allFields.removeClass( "ui-state-error" );
 
      valid = valid && checkLength( name, "task-name", 3, 16 );
      valid = valid && checkLength( date, "duedate", 6, 80 );
      valid = valid && checkLength( password, "password", 5, 16 );
 
      valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
      valid = valid && checkRegexp( date, emailRegex, "eg. ui@jquery.com" );
      valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
 
      if ( valid ) {
        // * users needs to be changed to task later
        $( "#tasks tbody" ).append( "<tr>" +
          "<td>" + name.val() + "</td>" +
          "<td>" + date.val() + "</td>" +
          "<td>" + password.val() + "</td>" +
        "</tr>" );
        dialog.dialog( "close" );
      }
      return valid;
    }
 
    dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        "Create a Task": addTask,
        Cancel: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
        allFields.removeClass( "ui-state-error" );
      }
    });
 
    form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault();
      addTask();
    });
 
    $( "#create-user" ).button().on( "click", function() {
      dialog.dialog( "open" );
    });
  } );
