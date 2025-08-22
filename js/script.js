// --- SELECTORS --- //
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoDate = document.querySelector('.todo-date');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// --- EVENT LISTENERS --- //
document.addEventListener('DOMContentLoaded', getTodos); // Load todos from local storage
todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', deleteOrComplete);
filterOption.addEventListener('change', filterTodo);

// --- FUNCTIONS --- //

// Add a new To-Do item
function addTodo(event) {
    event.preventDefault(); // Prevent form from submitting and reloading the page

    // VALIDATE: Check if input fields are empty
    if (todoInput.value.trim() === '' || todoDate.value === '') {
        alert("Please fill out both the task and the date!");
        return; // Stop the function from running
    }

    // Create the main To-Do div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    // Create a container for text and date
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('todo-content');

    // Create LI for the task text
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    contentDiv.appendChild(newTodo);
    
    // Create SPAN for the date
    const newDate = document.createElement('span');
    newDate.innerText = todoDate.value;
    newDate.classList.add('todo-item-date');
    contentDiv.appendChild(newDate);

    todoDiv.appendChild(contentDiv);

    // Save To-Do to Local Storage
    saveLocalTodos({ text: todoInput.value, date: todoDate.value, completed: false });

    // Create Check Mark Button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    // Create Trash Button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    // Append the entire To-Do div to the list
    todoList.appendChild(todoDiv);

    // Clear input fields
    todoInput.value = '';
    todoDate.value = '';
}

// Delete or Complete a To-Do item
function deleteOrComplete(e) {
    const item = e.target;
    const todo = item.parentElement;

    // DELETE TODO
    if (item.classList.contains('trash-btn')) {
        // Animation
        todo.classList.add('fall');
        // Remove from local storage
        removeLocalTodos(todo);
        // Remove from DOM after animation finishes
        todo.addEventListener('transitionend', function() {
            todo.remove();
        });
    }

    // COMPLETE TODO
    if (item.classList.contains('complete-btn')) {
        todo.classList.toggle('completed');
        updateLocalTodoStatus(todo);
        filterTodo(); // <<-- INI ADALAH PERBAIKANNYA
    }
}

// Filter To-Do items
function filterTodo() {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        // Skip non-element nodes
        if (todo.nodeType !== 1) return;

        switch (filterOption.value) {
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    });
}


// --- LOCAL STORAGE FUNCTIONS --- //

function getTodosFromStorage() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

function saveLocalTodos(todo) {
    let todos = getTodosFromStorage();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = getTodosFromStorage();
    todos.forEach(function(todoData) {
        // Create the main To-Do div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        if (todoData.completed) {
            todoDiv.classList.add('completed');
        }

        // Create a container for text and date
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('todo-content');

        // Create LI for the task text
        const newTodo = document.createElement('li');
        newTodo.innerText = todoData.text;
        newTodo.classList.add('todo-item');
        contentDiv.appendChild(newTodo);
        
        // Create SPAN for the date
        const newDate = document.createElement('span');
        newDate.innerText = todoData.date;
        newDate.classList.add('todo-item-date');
        contentDiv.appendChild(newDate);

        todoDiv.appendChild(contentDiv);

        // Create Check Mark Button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton);

        // Create Trash Button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);

        // Append the entire To-Do div to the list
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos = getTodosFromStorage();
    const todoText = todo.querySelector('.todo-item').innerText;
    const todoDate = todo.querySelector('.todo-item-date').innerText;
    
    // Find index of the todo to remove
    const todoIndex = todos.findIndex(t => t.text === todoText && t.date === todoDate);
    
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
    }
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalTodoStatus(todo) {
    let todos = getTodosFromStorage();
    const todoText = todo.querySelector('.todo-item').innerText;
    const todoDate = todo.querySelector('.todo-item-date').innerText;

    // Find the todo and update its completed status
    const todoToUpdate = todos.find(t => t.text === todoText && t.date === todoDate);
    if (todoToUpdate) {
        todoToUpdate.completed = !todoToUpdate.completed;
    }
    
    localStorage.setItem('todos', JSON.stringify(todos));
}