const STORAGE_KEYS = {
  todos: "pixeltab:todos",
  settings: "pixeltab:settings",
};

// Initialize settings
let settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings));
if (settings === null) {
  settings = {
    name: "",
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

// Random Id Generator
function randomID() {
  return Math.random().toString(36).slice(2, 5);
}

// HTML Sanitizer
function sanitizeHTML(str) {
  return str.replace(/[&<>"']/g, function (m) {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#039;";
    }
  });
}

// Clock and Date updater
function startTime() {
  // Set the clock
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  // Set the date
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const time = new Date().toLocaleString("en-US", timeOptions);
  const date = new Date().toLocaleDateString("en-US", dateOptions);

  document.getElementById("clock").textContent = time.toLowerCase();
  document.getElementById("date").textContent = date;

  setTimeout(startTime, 500);
}
startTime();

// Greet and Name
const greet = document.querySelector("#greet span");
const nameButton = document.querySelector("#greet button");
const nameInput = document.querySelector("#nameInput input");

// Set the user's name on screen
const { name: userName } = settings;
if (userName !== "") {
  greet.textContent = "Hello, ";
  nameButton.textContent = userName;
}

nameButton.addEventListener("click", function (event) {
  // Show the name input
  if (nameInput.style.visibility === "visible") {
    nameInput.style.visibility = "hidden";
    nameInput.style.opacity = "0";
  } else {
    nameInput.style.visibility = "visible";
    nameInput.style.opacity = "1";
    nameInput.value = "";
  }
  event.stopPropagation();
});

nameInput.addEventListener("click", function (event) {
  event.stopPropagation();
});

nameInput.addEventListener("keypress", function (event) {
  event.stopPropagation();
  // The user pressed Enter
  if (event.which == 13) {
    if (this.value.replace(/\s/g, "") != "") {
      // Set the user's name
      const newName = this.value;
      localStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify({ ...settings, name: newName }),
      );

      // Display the user's name
      greet.textContent = "Hello, ";
      nameButton.textContent = newName;

      // Hide the input
      this.style.visibility = "hidden";
      this.style.opacity = "0";
      this.value = "";
    }
  }
});

nameInput.addEventListener("blur", function () {
  if (this.value.replace(/\s/g, "") != "") {
    // Set the user's name
    const newName = this.value;
    localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({ ...settings, name: newName }),
    );

    // Display the user's name
    greet.textContent = "Hello, ";
    nameButton.textContent = newName;
  }

  this.style.visibility = "hidden";
  this.style.opacity = "0";
});

document.body.addEventListener("click", function () {
  if (nameInput.style.visibility === "visible") {
    nameInput.style.visibility = "hidden";
    nameInput.style.opacity = "0";

    if (nameInput.value != "") {
      // Set the user's name
      const newName = nameInput.value;
      localStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify({ ...settings, name: newName }),
      );

      // Display the user's name
      greet.textContent = "Hello, ";
      nameButton.textContent = newName;
    }
  }
});

// Searchbox
const gButton = document.querySelector("#search > button:first-of-type");
const searchForm = document.querySelector("#search > form");
const search = document.querySelector('#search > form > input[name="q"]');

gButton.addEventListener("click", function (event) {
  event.stopPropagation();

  // Toggle the Search visibility
  search.classList.toggle("visible");

  // Get rid of focus so :hover can work
  this.blur();
});

search.addEventListener("keydown", function (event) {
  event.stopPropagation();
});

// Background Image
let backgrounds;
let backgroundIndex = 0;

const getBackground = new XMLHttpRequest();
getBackground.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // Read the backgrounds file
    backgrounds = JSON.parse(this.responseText).data;

    // Get a backgrounds
    backgroundIndex = Math.floor(Math.random() * backgrounds.length);
    switchBackground(backgroundIndex);
  }
};

// Authors
let authors;
const getAuthor = new XMLHttpRequest();
getAuthor.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // Read the authors file
    authors = JSON.parse(this.responseText);

    // Get all of the backgrounds database
    getBackground.open("GET", "data/backgrounds.json", true);
    getBackground.send();
  }
};
getAuthor.open("GET", "data/authors.json", true);
getAuthor.send();

// Change background
document.addEventListener("keydown", function (event) {
  if (
    nameInput !== document.activeElement &&
    todoInput !== document.activeElement
  ) {
    // Left arrow key
    if (event.key === "ArrowLeft") {
      // Cycle the backgrounds backwards
      if (backgroundIndex === 0) {
        backgroundIndex = backgrounds.length - 1;
      } else {
        backgroundIndex--;
      }
      switchBackground(backgroundIndex);
    } else if (event.key === "ArrowRight") {
      // Cycle the backgrounds forwards
      if (backgroundIndex === backgrounds.length - 1) {
        backgroundIndex = 0;
      } else {
        backgroundIndex++;
      }
      switchBackground(backgroundIndex);
    }
  }
});

function switchBackground(index) {
  // Set the new background
  const body = document.querySelector("body");
  body.style.background =
    'url("' +
    backgrounds[index].file +
    '") center center / cover no-repeat fixed';

  // Fetch the dom elements that will be adjusted
  const artAuthor = document.querySelector(".author");
  const artTitle = document.querySelector(".title");

  // Set the art's author, title and preffered link
  artAuthor.textContent = backgrounds[index].author;
  artAuthor.href = authors[backgrounds[index].author].link;
  artTitle.textContent = backgrounds[index].title;
}

// Quotes
const getQuote = new XMLHttpRequest();
getQuote.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // Get a quote
    const quotes = JSON.parse(this.responseText).data;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // Set the quote
    const quote = document.querySelector("#text");
    const author = document.querySelector("#author");
    quote.textContent = '"' + randomQuote.quote + '"';
    author.textContent = randomQuote.author;
  }
};
getQuote.open("GET", "data/quotes.json", true);
getQuote.send();

// Todo List
const toggle = document.querySelector("#open");
const modal = document.querySelector("#modal");
const closeTodo = document.querySelector("#modal .hide");
const toggleInput = document.querySelector("#modal .new");
const todoInput = document.querySelector("#modal input");
const todos = document.querySelector("#modal ul");
const todoSpans = document.querySelectorAll("#modal ul li > span");

// Fetch previous todos
let userTodos = JSON.parse(localStorage.getItem(STORAGE_KEYS.todos));
if (userTodos === null) {
  userTodos = [];
  localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(userTodos));
}
userTodos.forEach((todo) => {
  addTodo(todo);
});

// Toggle visibility on the TODO window
toggle.addEventListener("click", function () {
  modal.classList.toggle("visible");
});

closeTodo.addEventListener("click", function () {
  modal.classList.remove("visible");
});

// Toggle text input for new Todos
toggleInput.addEventListener("click", function () {
  if (todoInput.style.height == "35px") {
    todoInput.style.height = "0";
  } else {
    todoInput.style.height = "35px";
    todoInput.focus();
  }
});

// Existing "todos" event listeners

// Toggle "todo" status
function toggleTodo() {
  // Switch the todo's status if it exists
  const todoID = this.dataset.id;
  (userTodos = userTodos.map((todo) => {
    if (todo.id == todoID) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  })),
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(userTodos));

  // Toggle the class in the UI
  this.classList.toggle("done");
}

// Add new "todo"
todoInput.addEventListener("keypress", function (event) {
  event.stopPropagation();
  if (event.key === "Enter" && this.value != "") {
    // Get a new id
    const newID = randomID();

    // Add the "todo" to the current data
    const newTodo = {
      id: newID,
      completed: false,
      content: this.value,
    };
    userTodos.push(newTodo);

    // Update local storage
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(userTodos));

    // Add the new "todo" to the UI
    addTodo(newTodo);

    // Reset the input
    this.value = "";
  }
});

function addTodo({ id, completed, content }) {
  // Create the element
  const newLi = document.createElement("li");
  if (completed) {
    newLi.classList.add("done");
  }
  newLi.dataset.id = id;
  newLi.innerHTML = "<span>x</span>" + sanitizeHTML(content);

  // Add event listeners
  newLi.addEventListener("click", toggleTodo);
  newLi.querySelector("span").addEventListener("click", deleteTodo);

  // Append to the list
  todos.appendChild(newLi);
}

// Remove "todo"
function deleteTodo(event) {
  event.stopPropagation();

  // Look for the todo
  const todoID = this.parentElement.dataset.id;

  // Update the todos
  userTodos = userTodos.filter((todo) => todo.id != todoID);
  localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(userTodos));

  // Delete the element in the UI
  const parent = this.parentElement;
  parent.style.height = "0";
  parent.style.opacity = "0";
  setTimeout(function () {
    parent.remove();
  }, 200);
}
