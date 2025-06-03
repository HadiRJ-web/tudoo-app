"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const formInput = document.getElementById("form-input");
  const addBtn = document.getElementById("add-btn");
  const template = document.getElementById("task-template");
  const todoList = document.getElementById("todo-list");
  const deleteAllTodosBtn = document.getElementById("del-all-btn");

  const isOpera = navigator.userAgent.indexOf("OPR") > -1;

  let allTodos = loadTodos();
  delAllBtn();
  emptyListQuote();
  allTodos.forEach(createTodoItem);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = formInput.value.trim();
    if (task.length > 0) {
      const newTodo = {
        name: task,
        completed: false,
        id: Date.now(),
      };
      allTodos.push(newTodo);
      createTodoItem(newTodo);
      formInput.value = "";
      saveTodos();
      delAllBtn();
      emptyListQuote();
    } else {
      alert("Empty Todo Can't be Added");
    }
  });

  function createTodoItem(todo) {
    const todoItem = template.content.cloneNode(true);
    const listItem = todoItem.querySelector("li");
    const taskField = todoItem.querySelector(".task");
    const editBtn = todoItem.querySelector(".edit-btn");
    const delBtn = todoItem.querySelector(".del-btn");
    const checkbox = todoItem.querySelector(".checkbox");
    const buttons = todoItem.querySelector(".buttons");

    taskField.value = todo.name;
    listItem.id = todo.id;
    checkbox.checked = todo.completed;

    editBtn.addEventListener("click", () => editTodo(taskField, todo.id));
    delBtn.addEventListener("click", () => deleteTodo(todo.id));
    checkbox.addEventListener("change", () => {
      toggleTodoCompletion(todo.id, checkbox.checked);
    });

    function createTodoItem(todo) {
      const todoItem = template.content.cloneNode(true);
      const listItem = todoItem.querySelector("li");
      const taskField = todoItem.querySelector(".task");
      const editBtn = todoItem.querySelector(".edit-btn");
      const delBtn = todoItem.querySelector(".del-btn");
      const checkbox = todoItem.querySelector(".checkbox");
      const buttons = todoItem.querySelector(".buttons");

      taskField.value = todo.name;
      listItem.id = todo.id;
      checkbox.checked = todo.completed;

      editBtn.addEventListener("click", () => editTodo(taskField, todo.id));
      delBtn.addEventListener("click", () => deleteTodo(todo.id));
      checkbox.addEventListener("change", () => {
        toggleTodoCompletion(todo.id, checkbox.checked);
      });
    }

    todoList.prepend(todoItem);
  }

  function toggleTodoCompletion(id, isChecked) {
    const todoIndex = allTodos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      allTodos[todoIndex].completed = isChecked;
      saveTodos();
    }
  }

  function editTodo(taskField, id) {
    taskField.focus();
    taskField.readOnly = false;
    taskField.classList.replace("cursor-default", "cursor-text");
    taskField.classList.add("bg-background", "text-text");

    // const taskField = todoItem.querySelector(".task");
    if (taskField.classList.contains("bg-background")) {
      taskField.classList.replace(
        "peer-checked:text-background",
        "peer-checked:text-text",
      );
    }

    const todoIndex = allTodos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return;

    const handleBlur = () => {
      allTodos[todoIndex].name = taskField.value.trim();
      if (allTodos[todoIndex].name.length > 0) {
        taskField.readOnly = true;
        taskField.classList.replace("cursor-text", "cursor-default");
        taskField.classList.remove("bg-background");
        saveTodos();
        delAllBtn();
        emptyListQuote();
        if (taskField.classList.contains("text-text")) {
          taskField.classList.replace(
            "peer-checked:text-text",
            "peer-checked:text-background",
          );
        }
      } else {
        alert("Empty Todo Can't be Edited");
        // taskField.focus();
        taskField.readOnly = false;
        taskField.classList.replace("cursor-default", "cursor-text");
        taskField.classList.add("bg-background");
      }
    };

    taskField.addEventListener("blur", handleBlur);

    taskField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleBlur();
      }
    });
  }

  function emptyListQuote() {
    const h2 = document.querySelector("h2");
    if (allTodos.length <= 0) {
      h2.classList.replace("opacity-0", "opacity-100");
    } else {
      h2.classList.replace("opacity-100", "opacity-0");
    }
  }

  // Move this line outside of the delAllBtn function
  deleteAllTodosBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteAllTodos();
  });

  // Modify the delAllBtn function to avoid adding the event listener again
  function delAllBtn() {
    if (allTodos.length > 1) {
      deleteAllTodosBtn.classList.remove("hidden");
      deleteAllTodosBtn.classList.add("cursor-pointer");
      deleteAllTodosBtn.removeAttribute("disabled");
      deleteAllTodosBtn.classList.remove("hidden");
    } else {
      deleteAllTodosBtn.classList.add("hidden");
    }
  }

  function deleteAllTodos() {
    if (confirm("Are You Sure?")) {
      allTodos.length = 0;
      todoList.innerHTML = "";
      formInput.value = "";
      delAllBtn();
      emptyListQuote();
      localStorage.clear();
    }
  }

  function deleteTodo(id) {
    const todoIndex = allTodos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      allTodos.splice(todoIndex, 1);
      saveTodos();
      document.getElementById(id).remove();
      delAllBtn();
      emptyListQuote();
    }
  }

  function saveTodos() {
    const saveJSON = JSON.stringify(allTodos);
    localStorage.setItem("todos", saveJSON);
  }

  function loadTodos() {
    const loadedJSON = localStorage.getItem("todos");
    return JSON.parse(loadedJSON) || [];
  }
});
