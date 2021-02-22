const list = document.getElementById("list-todo"),
  optionAll = document.getElementById("option-main-all"),
  optionActive = document.getElementById("option-main-active"),
  optionCompleted = document.getElementById("option-main-completed"),
  form = document.getElementById("form-create-note"),
  inputComplete = document.getElementById("form-complete"),
  inputText = document.getElementById("form-text"),
  count = document.getElementById("count"),
  buttonColor = document.getElementById("change-color-page");
let listNotes = [],
  statePage = false,
  filterSelect = "all";

// manejo del storage
const dataStorageGet = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const dataStorageFilter = (filter) => {
  const notes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const note = JSON.parse(localStorage.getItem(key));
    if (filter(note)) {
      notes.push(note);
    }
  }
  return notes;
};

const dataStorageSet = (key, note) => {
  localStorage.setItem(key, JSON.stringify(note));
};

const dataStorageRemove = (key) => {
  localStorage.removeItem(key);
};

const dataStoragePush = (note) => {
  note.id = Date.now();
  localStorage.setItem(note.id, JSON.stringify(note));
  return note;
};

//note control

const endNote = (notes) => {
  if (notes.length > 1) {
    let biggerNumber = notes[0].number;
    notes.forEach((note) => {
      if (biggerNumber < note.number) biggerNumber = note.number;
    });
    return biggerNumber;
  }
  return 0;
};

const delateTodo = (buttonDelate) => {
  let todoItem;
  do {
    todoItem = buttonDelate.parentElement;
  } while (todoItem.nodeName != "LI");
  dataStorageRemove(todoItem.dataset.id);
  todoItem.remove();
};

const paintNotes = () => {
  const element = document.getElementById("element-note"),
    fragment = document.createDocumentFragment();
  //eliminamos todos las notas anteriores
  while (list.firstChild) list.firstChild.remove();
  //ordenamos la lista
  const noteList = listNotes.sort((a, b) => (a.number > b.number ? -1 : 1));
  //procedemos a crear cada nota
  noteList.forEach((note) => {
    const clone = document.importNode(element.content, true);
    const li = clone.querySelector("li");
    const text = li.querySelector(".todo-note__text");
    li.setAttribute("data-id", note.id);
    changeStateElement(li, note.complete);
    text.textContent = note.text;
    fragment.appendChild(clone);
  });
  //mostramos la cantidad de notas
  count.textContent = listNotes.length;
  //insertamos el fragment
  list.appendChild(fragment);
};

const changeStateElement = (elementNote, state) => {
  const text = elementNote.querySelector(".todo-note__text");
  const chek = elementNote.querySelector(".todo-note__chek");
  if (state) {
    chek.classList.add("todo-note__chek--completed");
    text.classList.add("todo-note__text--completed");
  } else {
    chek.classList.remove("todo-note__chek--completed");
    text.classList.remove("todo-note__text--completed");
  }
};

//creacion de una nota
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nots = dataStorageFilter(() => true);
  const endNumberNote = endNote(nots);
  const note = {
    number: endNumberNote + 1,
    complete: inputComplete.checked,
    text: inputText.value,
  };
  dataStoragePush(note);
  if (filterSelect == "all" || filterSelect == "") {
    listNotes = dataStorageFilter(() => true);
  } else if (filterSelect == "active") {
    listNotes = dataStorageFilter((note) => !note.complete);
  } else if (filterSelect == "completed") {
    listNotes = dataStorageFilter((note) => note.complete);
  }
  form.reset();
  paintNotes();
});

//cargamos las notas
document.addEventListener("DOMContentLoaded", (e) => {
  let hash = location.hash.replace("#", "");
  if (hash == "all" || hash == "") {
    listNotes = dataStorageFilter(() => true);
    changeOption("all");
  } else if (hash == "active") {
    listNotes = dataStorageFilter((note) => !note.complete);
    changeOption("active");
  } else if (hash == "completed") {
    listNotes = dataStorageFilter((note) => note.complete);
    changeOption("completed");
  }
  paintNotes();
});

//evento sobre la lista (remover o cabiar state de la nota)
list.addEventListener("click", (e) => {
  const element = e.target;
  if (element.classList.contains("todo-note__delate")) {
    delateTodo(element);
  } else {
    let buttonChek = element;
    if (buttonChek.classList.contains("todo-note__chek")) {
      let todoItem;
      do {
        todoItem = buttonChek.parentElement;
      } while (todoItem.nodeName != "LI");
      const note = dataStorageGet(todoItem.dataset.id);
      const state = note.complete;
      note.complete = !state;
      dataStorageSet(note.id, note);
      changeStateElement(todoItem, note.complete);
    } else {
      buttonChek = buttonChek.parentElement;
      if (buttonChek.classList.contains("todo-note__chek")) {
        let todoItem;
        do {
          todoItem = buttonChek.parentElement;
        } while (todoItem.nodeName != "LI");
        const note = dataStorageGet(todoItem.dataset.id);
        const state = note.complete;
        note.complete = !state;
        dataStorageSet(note.id, note);
        changeStateElement(todoItem, note.complete);
      }
    }
  }
});

// control menu

const changeOption = (option) => {
  filterSelect = option;
  optionAll.classList.toggle("todo-main__option--select", option == "all");
  optionActive.classList.toggle(
    "todo-main__option--select",
    option == "active"
  );
  optionCompleted.classList.toggle(
    "todo-main__option--select",
    option == "completed"
  );
};
optionAll.addEventListener("click", () => {
  listNotes = dataStorageFilter(() => true);
  paintNotes();
  changeOption("all");
});
optionActive.addEventListener("click", () => {
  listNotes = dataStorageFilter((note) => !note.complete);
  paintNotes();
  changeOption("active");
});
optionCompleted.addEventListener("click", () => {
  listNotes = dataStorageFilter((note) => note.complete);
  paintNotes();
  changeOption("completed");
});
inputComplete.addEventListener("change", () => {
  const label = form.querySelector(".label-chek");
  label.classList.toggle("label-chek--completed", inputComplete.checked);
});

// change color page

buttonColor.addEventListener("click", (e) => {
  e.preventDefault();
  const body = document.body;
  const light = body.classList.contains("body--light");
  if (light) {
    body.classList.add("body--dark");
    body.classList.remove("body--light");
  } else {
    body.classList.add("body--light");
    body.classList.remove("body--dark");
  }
});
