const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const itemsLeft = document.getElementById("itemsLeft");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";


function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}


function getFilteredTodos() {

    if (filter === "active") {
        return todos.filter(todo => !todo.completed);
    }

    if (filter === "completed") {
        return todos.filter(todo => todo.completed);
    }

    return todos;
}


function renderTodos() {

    list.innerHTML = "";

    const filteredTodos = getFilteredTodos();

    filteredTodos.forEach((todo, index) => {

        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? "complete" : ""}`;

        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? "checked" : ""}>
            <span>${todo.text}</span>
            <button class="delete-btn">Delete</button>
        `;

        
        const checkbox = li.querySelector("input");

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            save();
            renderTodos();
        });

        
        const deleteBtn = li.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {
            todos = todos.filter(t => t !== todo);
            save();
            renderTodos();
        });

        list.appendChild(li);
    });

    updateItemsLeft();
}


function updateItemsLeft() {

    const remaining = todos.filter(todo => !todo.completed).length;

    itemsLeft.textContent =
        `${remaining} item${remaining !== 1 ? "s" : ""} left`;
}


function addTodo() {

    const text = input.value.trim();

    if (text === "") {
        return;
    }

    todos.push({
        text: text,
        completed: false
    });

    input.value = "";

    save();
    renderTodos();
}


addBtn.addEventListener("click", addTodo);


input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTodo();
    }
});


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filter = button.dataset.filter;

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        renderTodos();
    });
});


clearCompletedBtn.addEventListener("click", () => {

    todos = todos.filter(todo => !todo.completed);

    save();
    renderTodos();
});


renderTodos();
