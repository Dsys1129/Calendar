let yearMonthText = document.getElementById('year-month');
let nextMonthButton = document.getElementById('go-next');
let prevMonthButton = document.getElementById('go-prev');
let todayButton = document.getElementById('go-today');
let calendarDates = document.getElementById('todo');
let selectedDateText = document.getElementById('selected-date');

let todoList = document.getElementById('todo-list');
let todoInput = document.getElementById('todo-input');
let todoButton = document.getElementById('todo_button');

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

let selectedDate = null;
const todos = {};

document.addEventListener('DOMContentLoaded', function () {
    renderCalendar(currentYear, currentMonth);
});

nextMonthButton.addEventListener('click', function () {
    nextMonth();
});

prevMonthButton.addEventListener('click', function () {
    prevMonth();
});

todayButton.addEventListener('click', function () {
    goToday();
});

todoButton.addEventListener('click', function () {
    if (todoInput.value !== '') {
        saveTodo();
    }
});

todoInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && todoInput.value !== '') {
        saveTodo();
    }
});

function fetchTodoList(dateKey) {
    return fetch(`/todos/${dateKey}`)
        .then(response => response.json())
        .then(data => {
            const todosArray = Array.isArray(data.data) ? data.data : [];
            todos[dateKey] = todosArray.map(item => ({
                id: item.id,
                text: item.text,
                completed: item.status === 'COMPLETED',
            }));
        });
}

function renderCalendar(year, month) {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    yearMonthText.textContent = `${year}년 ${month + 1}월`;
    calendarDates.innerHTML = '';

    for (let i = firstDayOfWeek; i > 0; i--) {
        const dateEl = document.createElement('div');
        dateEl.className = 'date';
        dateEl.textContent = prevLastDay - i + 1;
        dateEl.style.color = '#ccc';
        calendarDates.appendChild(dateEl);
    }

    for (let date = 1; date <= lastDayOfMonth; date++) {
        const dateEl = document.createElement('div');
        dateEl.className = 'date';
        dateEl.textContent = date;
        if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
            dateEl.style.backgroundColor = '#ffeb3b';
        }
        dateEl.addEventListener('click', function () {
            selectDate(year, month, date);
        });
        calendarDates.appendChild(dateEl);
    }

    const totalDates = firstDayOfWeek + lastDayOfMonth;
    const nextMonthDates = totalDates % 7 === 0 ? 0 : 7 - (totalDates % 7);

    for (let i = 1; i <= nextMonthDates; i++) {
        const dateEl = document.createElement('div');
        dateEl.className = 'date';
        dateEl.textContent = i;
        dateEl.style.color = '#ccc';
        calendarDates.appendChild(dateEl);
    }
}

function selectDate(year, month, date) {
    selectedDate = {year, month, date};
    selectedDateText.textContent = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    fetchTodoList(selectedDateText.textContent).then(() => {
        renderTodoList();
    });
}

function renderTodoList() {
    todoList.innerHTML = '';
    const dateKey = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.date).padStart(2, '0')}`;
    const dateTodos = todos[dateKey] || [];
    dateTodos.forEach(todo => {
        const todoLi = document.createElement('li');
        const todoText = document.createElement('span');
        const completeTodoButton = document.createElement('input');
        const deleteButton = document.createElement('button');

        todoText.textContent = todo.text;
        completeTodoButton.setAttribute("type", "checkbox");
        completeTodoButton.checked = todo.completed;
        completeTodoButton.classList.add('complete-btn');
        deleteButton.textContent = '삭제';
        deleteButton.classList.add('delete-btn');

        completeTodoButton.addEventListener('click', function () {
            completeTodo(todoText, completeTodoButton, deleteButton, todo);
        });

        deleteButton.addEventListener('click', function () {
            deleteTodo(todoLi, dateKey, todo);
        });

        todoLi.appendChild(completeTodoButton);
        todoLi.appendChild(todoText);
        todoLi.appendChild(deleteButton);

        if (todo.completed) {
            todoText.style.textDecoration = 'line-through';
            deleteButton.style.display = 'none';
        }

        todoList.appendChild(todoLi);
    });
}

function saveTodo() {
    if (!selectedDate) return;

    const dateKey = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.date).padStart(2, '0')}`;
    const newTodo = {
        text: todoInput.value,
        completed: false
    };

    fetch('/todos', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: dateKey,
            text: newTodo.text,
            status: 'IN_PROGRESS'
        })
    }).then((response) => {
        if (response.ok) {
            createTodo(dateKey, newTodo)
        }
    });
}

function createTodo(dateKey, newTodo) {
    if (!todos[dateKey]) {
        todos[dateKey] = [];
    }

    todos[dateKey].push(newTodo);

    renderTodoList();
    todoInput.value = '';
}

function completeTodo(todoText, completeTodoButton, deleteButton, todo) {
    fetch(`/todos/${todo.id}/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (response.ok) {
            todo.completed = true;
            todoText.style.textDecoration = 'line-through';
            deleteButton.style.display = 'none';
            completeTodoButton.checked = true;
        } else {
            completeTodoButton.checked = false;
        }
    });
}

function deleteTodo(todoLi, dateKey, todo) {
    fetch(`/todos/${todo.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (response.ok) {
            todos[dateKey] = todos[dateKey].filter(t => t !== todo);
            todoList.removeChild(todoLi);
        }
    });
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
}

function goToday() {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar(currentYear, currentMonth);
}