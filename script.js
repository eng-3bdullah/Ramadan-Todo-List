document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const taskInput = document.getElementById("task-input");
    const taskDate = document.getElementById("task-date");
    const addTaskBtn = document.getElementById("add-task");
    const searchInput = document.getElementById("search");
    const filterDate = document.getElementById("filter-date");
    const toggleDark = document.getElementById("toggle-dark");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let darkMode = localStorage.getItem("darkMode") === "true";

    if (darkMode) document.body.classList.add("dark");

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        const searchText = searchInput.value.toLowerCase();
        const filterValue = filterDate.value;

        tasks
            .filter(task =>
                task.text.toLowerCase().includes(searchText) &&
                (!filterValue || task.date === filterValue)
            )
            .forEach((task, index) => {
                const li = document.createElement("li");

                const span = document.createElement("span");
                span.textContent = `${task.text} (${task.date || "No date"})`;
                span.className = "task-text";
                if (task.done) span.style.textDecoration = "line-through";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.done;
                checkbox.addEventListener("change", () => {
                    task.done = checkbox.checked;
                    saveTasks();
                    renderTasks();
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.className = "delete-btn";
                deleteBtn.addEventListener("click", () => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                });

                li.appendChild(span);
                li.appendChild(checkbox);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
    }

    addTaskBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        const date = taskDate.value;
        if (text) {
            tasks.push({ text, date, done: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
            taskDate.value = "";
        }
    });

    searchInput.addEventListener("input", renderTasks);
    filterDate.addEventListener("input", renderTasks);

    toggleDark.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        darkMode = document.body.classList.contains("dark");
        localStorage.setItem("darkMode", darkMode);
    });

    renderTasks();
});
