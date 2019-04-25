import { openDb, fetchTodos, createTodo, deleteTodo, updateTodo } from './db.js'

// Get references to the form elements.
const newTodoForm = document.getElementById('new-todo-form')
const newTodoInput = document.getElementById('new-todo')
const todoList = document.getElementById('todo-items')

// Handle new todo item form submissions.
newTodoForm.onsubmit = function() {
  // Get the todo text.
  const text = newTodoInput.value

  // Check to make sure the text is not blank (or just spaces).
  if (text.replace(/ /g, '') !== '') {
    // Create the todo item.
    createTodo(text, function(todo) {
      refreshTodos()
    })
  }

  // Reset the input field.
  newTodoInput.value = ''

  // Don't send the form.
  return false
}

window.onload = function() {
  // Display the todo items.
  openDb(refreshTodos)
}

// Update the list of todo items.
function refreshTodos() {
  fetchTodos(function(todos) {
    todoList.innerHTML = ''

    for (let index = todos.length - 1; index >= 0; index--) {
      // Read the todo items backwards (most recent first).
      const todo = todos[index]

      addTodo(todo)
    }
  })
}

function addTodo(todo) {
  const li = document.createElement('li');
  li.id = 'todo-' + todo.timestamp;
  
  const deleteBtn = document.createElement('input');
  deleteBtn.type = 'button';
  deleteBtn.style.marginRight = '10px';
  deleteBtn.value = 'Delete';
  deleteBtn.setAttribute('data-id', todo.timestamp);

  li.appendChild(deleteBtn);

  const span = document.createElement('span');
  span.innerHTML = todo.text;
  span.setAttribute('data-id', todo.timestamp);
  
  li.appendChild(span);

  const todoText = document.createElement('input')
  todoText.type = 'text';
  todoText.value = todo.text;
  todoText.setAttribute('data-id', todo.timestamp);
  todoText.style.display = "none";

  li.appendChild(todoText);

  const editBtn = document.createElement('button');
  editBtn.style.marginLeft = '10px';
  editBtn.innerHTML = "Edit";
  editBtn.setAttribute('data-id', todo.timestamp)

  li.appendChild(editBtn);

  const saveBtn = document.createElement('button');
  saveBtn.style.marginLeft = '10px';
  saveBtn.innerHTML = "Save";
  saveBtn.setAttribute('data-id', todo.timestamp);
  saveBtn.style.display = "none";

  li.appendChild(saveBtn);

  todoList.appendChild(li);

  deleteBtn.addEventListener('click', function(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    deleteTodo(id, refreshTodos)
  });

  editBtn.addEventListener('click', () => {
    span.style.display = "none";
    todoText.style.display = "inline";
    editBtn.style.display = "none";
    saveBtn.style.display = "inline";
  });

  saveBtn.addEventListener('click', (e) => {
    const id = parseInt(e.target.getAttribute('data-id'));
    let todoUpdate = todoText.value;
    updateTodo(id, todoUpdate, refreshTodos);
    
    saveBtn.style.display = "none";
    editBtn.style.display = "inline";
  });
}
