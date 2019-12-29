const todoForm = document.querySelector('.js-todoForm');
let todoInput = todoForm.querySelector('input');
const todoList = document.querySelector('.js-todoList');

const TODOS_LS = 'todos';

let todos = [];

function toggleTodoInput() {
  todoInput = todoForm.querySelector('input');
  if (todoInput) {
    todoInput.remove();
  } else {
    todoInput = document.createElement('input');
    todoInput.setAttribute('type', 'text');
    todoInput.setAttribute('placeholder', 'Write a to do');
    todoForm.appendChild(todoInput);
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
  //delBtn.innerHTML = 'X';
  //delBtn.className = 'fas fa-remove';
  delBtn.setAttribute('src', './images/remove.svg');
  delBtn.setAttribute('width', '15');
  delBtn.setAttribute('height', '15');
  delBtn.className = 'delBtn';

  delBtn.addEventListener('click', deleteTodo);
  const span = document.createElement('span');
  const newId = todos.length + 1;
  span.innerHTML = text + '&nbsp;&nbsp;';
  li.appendChild(span);
  li.appendChild(delBtn);
  li.id = newId;
  todoList.appendChild(li);
  const todoObj = {
    text: text,
    id: newId
  };
  todos.push(todoObj);
  saveTodos();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = todoInput.value;
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
