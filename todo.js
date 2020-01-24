const todoForm = document.querySelector('.js-todoForm');
let todoInput = todoForm.querySelector('input');
const todoList = document.querySelector('.js-todoList');

const TODOS_LS = 'todos';

let todos = [];

function toggleTodoInput() {
  todoInput = todoForm.querySelector('input');
  todoAnchor = todoForm.querySelector('a');
  if (todoInput) {
    todoInput.remove();
    todoAnchor.remove();
  } else {
    todoInput = document.createElement('input');
    todoInput.setAttribute('type', 'text');
    todoInput.setAttribute('placeholder', 'Write a to do');
    todoForm.appendChild(todoInput);
    todoAnchor = document.createElement('a');
    todoAnchor.setAttribute('onclick', 'handleSubmit()');
    todoAnchor.className = 'add-anchor';
    todoAnchor.innerHTML = 'Add';
    todoForm.appendChild(todoAnchor);
  }
}

function deleteTodo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  todoList.removeChild(li);
  const cleanTodos = todos.filter(function(todo) {
    return todo.id !== parseInt(li.id);
  });
  todos = cleanTodos;
  saveTodos();
}

function saveTodos() {
  localStorage.setItem(TODOS_LS, JSON.stringify(todos));
}

function paintTodo(text) {
  const li = document.createElement('li');
  const delBtn = document.createElement('img');
  delBtn.setAttribute('src', './images/remove.svg');
  delBtn.setAttribute('width', '15');
  delBtn.setAttribute('height', '15');
  delBtn.className = 'delBtn';

  delBtn.addEventListener('click', deleteTodo);
  const span = document.createElement('span');
  const newId = todos.length + 1;
  const dot = "<img src='./weather-svg/10c.svg' width=5 height=5>&nbsp;&nbsp;";
  span.innerHTML = dot + text + '&nbsp;&nbsp;';
  li.appendChild(span);
  li.appendChild(delBtn);
  li.id = newId;
  li.className = 'collection-item';
  todoList.appendChild(li);
  const todoObj = {
    text: text,
    id: newId
  };
  todos.push(todoObj);
  saveTodos();
}

function handleSubmit(event) {
  if (event) {
    event.preventDefault();
  }
  const currentValue = todoInput.value.trim();
  if (currentValue == '') {
    toggleTodoInput();
    return;
  }
  paintTodo(currentValue);
  todoInput.value = '';
}

function loadTodos() {
  const loadedTodos = localStorage.getItem(TODOS_LS);
  if (loadedTodos !== null) {
    const parseTodos = JSON.parse(loadedTodos);
    parseTodos.forEach(function(todo) {
      paintTodo(todo.text);
    });
  }
}

function init() {
  loadTodos();
  todoForm.addEventListener('submit', handleSubmit);
}

init();
