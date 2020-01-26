const todoForm = document.querySelector('.js-todoForm');
let todoInput = todoForm.querySelector('input');
const todoList = document.querySelector('.js-todoList');
const todoLink = document.querySelector('.todo-link');
const TODOS_LS = 'todos';

let todos = [];

function toggleTodoInput() {
  todoInput = todoForm.querySelector('input');
  todoAnchor = todoForm.querySelector('a');
  const isMobile = window.innerWidth < 640;
  newsButton = document.querySelector('#news-button');
  divRight = document.querySelector('.right'); //background: var(--page-3-color);slateblue

  if (todoInput !== null && todoInput.style.display !== 'none') {
    divRight.classList.remove('selected');
    todoInput.style.display = 'none';
    todoAnchor.style.display = 'none';
    if (isMobile) {
      newsButton.style.display = 'block';
    }
    todoLink.textContent = 'To-Do';
    todoAnchor.textContent = 'Add';
  } else {
    divRight.classList.add('selected');
    todoInput.style.display = 'block';
    todoAnchor.style.display = 'block';
    if (isMobile) {
      newsButton.style.display = 'none';
    }

    todoInput.focus();
    todoLink.textContent = 'Close';
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
  updateTodoAppearance();
}

function revertChange() {
  const prevSelectedItem = document.querySelector('.selected-item');
  if (prevSelectedItem) prevSelectedItem.classList.remove('selected-item');
  todoInput.value = '';
}

function changeTodo(event) {
  //console.log(event.target);
  if (event === null || event.target === null) return;

  revertChange();

  if (todoInput.style.display === 'none') {
    toggleTodoInput();
  }

  // const selectedTextNode = event.target.previousSibling.lastChild;
  // const parentLi = selectedTextNode.parentNode.parentNode;
  const selectedTextNode = event.target.childNodes[0];
  const parentLi = event.target.parentNode.parentNode;
  parentLi.classList.add('selected-item');
  todoInput.value = selectedTextNode.textContent;
  //todoInput.select();
  todoInput.focus();
  todoAnchor.textContent = 'Update';
}

function saveTodos() {
  localStorage.setItem(TODOS_LS, JSON.stringify(todos));
}

function paintTodo(text) {
  let isChanging = false;
  let IDLi = 0;
  for (let li of todoList.children) {
    if (li.classList.contains('selected-item')) {
      li.firstChild.lastChild.textContent = text;
      IDLi = li.id;
      revertChange();
      isChanging = true;
    }
  }

  if (isChanging) {
    todos.map(function(todo) {
      if (todo.id === parseInt(IDLi)) todo.text = text;
    });
  } else {
    const li = document.createElement('li');
    const delBtn = document.createElement('img');
    delBtn.setAttribute('src', './images/remove.svg');
    delBtn.setAttribute('width', '15');
    delBtn.setAttribute('height', '15');
    delBtn.className = 'delBtn list-button';

    // const changeBtn = document.createElement('img');
    // changeBtn.setAttribute('src', './images/update.svg');
    // changeBtn.setAttribute('width', '13');
    // changeBtn.setAttribute('height', '13');
    // changeBtn.className = 'changeBtn list-button';

    delBtn.addEventListener('click', deleteTodo);
    // changeBtn.addEventListener('click', changeTodo);
    const span = document.createElement('span');
    const newId = todos.length + 1;
    const dot =
      "<img src='./weather-svg/10c.svg' width=5 height=5 class='list-dot'>";
    span.innerHTML = `${dot}<a href="#!" onclick='changeTodo(event)' class='text-change-anchor'>${text}</a>`;
    li.appendChild(span);
    //li.appendChild(changeBtn);
    li.appendChild(delBtn);
    li.id = newId;
    li.className = 'collection-item';
    todoList.appendChild(li);
    const todoObj = {
      text: text,
      id: newId
    };
    todos.push(todoObj);
  }
  //saveTodos();
}

function handleSubmit(event) {
  if (event) {
    event.preventDefault();
  }
  const currentValue = todoInput.value.trim();
  if (currentValue == '') {
    revertChange();
    toggleTodoInput();
    return;
  }
  paintTodo(currentValue);
  saveTodos();
  todoInput.value = '';
  todoAnchor.textContent = 'Add';
  updateTodoAppearance();
}

function loadTodos() {
  const loadedTodos = localStorage.getItem(TODOS_LS);
  if (loadedTodos !== null) {
    const parseTodos = JSON.parse(loadedTodos);
    parseTodos.forEach(function(todo) {
      paintTodo(todo.text);
    });
  }
  updateTodoAppearance();
}

const updateTodoAppearance = () => {
  divRight = document.querySelector('.js-todoList');
  const loadedTodos = localStorage.getItem(TODOS_LS);
  if (loadedTodos !== null) {
    const parseTodos = JSON.parse(loadedTodos);
    if (parseTodos.length > 0) {
      divRight.classList.add('selected');
    } else {
      divRight.classList.remove('selected');
    }
  }
};

function createInput() {
  if (document.querySelector('.input-todo') === null) {
    todoInput = document.createElement('input');
    todoInput.setAttribute('type', 'text');
    todoInput.setAttribute('placeholder', 'Write a to do');
    todoInput.className = 'input-todo';
    todoForm.appendChild(todoInput);
    todoAnchor = document.createElement('a');
    todoAnchor.setAttribute('onclick', 'handleSubmit()');
    todoAnchor.className = 'add-anchor';
    todoAnchor.innerHTML = 'Add';
    todoForm.appendChild(todoAnchor);
    todoInput.style.display = 'none';
    todoAnchor.style.display = 'none';
  }
}

function init() {
  loadTodos();
  todoForm.addEventListener('submit', handleSubmit);
  createInput();
}

init();
