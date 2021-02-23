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

const dataStorageGetAll = () => {
  const notes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const note = JSON.parse(localStorage.getItem(key));
    notes.push(note);
  }
  return notes;
};

const dataStorageSet = (key, note) => {
  localStorage.setItem(key, JSON.stringify(note));
};

const dataStorageRemove = (key) => {
  localStorage.removeItem(key);
};

const endNumberStorage = (notes) => {
  if (notes.length > 1) {
    let biggerNumber = notes[0].number;
    notes.forEach((note) => {
      if (biggerNumber < note.number) biggerNumber = note.number;
    });
    return biggerNumber;
  }
  return 0;
};

const dataStoragePush = (note) => {
  const notes = dataStorageGetAll();
  const endNumberNote = endNumberStorage(notes);
  note.id = Date.now();
  note.number = endNumberNote + 1;
  localStorage.setItem(note.id, JSON.stringify(note));
  return note;
};

//note control

const delateTodo = (buttonDelate) => {
  let todoItem;
  do {
    todoItem = buttonDelate.parentElement;
  } while (todoItem.nodeName != "LI");
  dataStorageRemove(todoItem.dataset.id);
  listNotes = dataStorageGetAll();
  todoItem.remove();
  count.textContent = parseInt(count.textContent) - 1;
};

const paintNotes = () => {
  const element = document.getElementById("element-note"),
    fragment = document.createDocumentFragment();
  //eliminamos todos las notas anteriores
  while (list.firstChild) list.firstChild.remove();

  //filtramos dependiendo del filterSelect
  if (filterSelect == "all" || filterSelect == "") {
    listNot = listNotes.filter(() => true)
  } else if (filterSelect == "active") {
    listNot = listNotes.filter( note => !note.complete)
  } else if (filterSelect == "completed") {
    listNot = listNotes.filter( note => note.complete)
  }

  //ordenamos la lista
  const noteList = listNot.sort((a, b) => (a.number > b.number ? -1 : 1));

  //procedemos a crear cada nota
  noteList.forEach((note) => {
    const clone = document.importNode(element.content, true),
      li = clone.querySelector("li"),
      text = li.querySelector(".todo-note__text");
    li.setAttribute("data-id", note.id);
    changeStateElement(li, note.complete);
    text.textContent = note.text;
    fragment.appendChild(clone);
  });
  //mostramos la cantidad de notas
  count.textContent = noteList.length;
  //insertamos el fragment
  list.appendChild(fragment);
  console.log('se pintaron')
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
  const note = {
    complete: inputComplete.checked,
    text: inputText.value,
  };
  dataStoragePush(note);
  listNotes = dataStorageGetAll();
  form.reset();
  paintNotes();
});

//cargamos las notas
document.addEventListener("DOMContentLoaded", (e) => {
  //guardamos las notas del storage en el listNotes;
  listNotes = dataStorageGetAll();
  let hash = location.hash.replace("#", "");
  if (hash == '') 
    hash = 'all';
  changeFilterNotes(hash)
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
      listNotes = dataStorageGetAll();
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
        listNotes = dataStorageGetAll();
        changeStateElement(todoItem, note.complete);
      }
    }
  }
});

// control menu

const changeFilterNotes = (filter) => {
  filterSelect = filter;
  paintNotes();
  optionAll.classList.toggle("todo-main__option--select", filter == "all");
  optionActive.classList.toggle("todo-main__option--select",filter == "active");
  optionCompleted.classList.toggle("todo-main__option--select",filter == "completed");
  
};
optionAll.addEventListener("click", () => {
  changeFilterNotes("all");
});
optionActive.addEventListener("click", () => {
  changeFilterNotes("active");
});
optionCompleted.addEventListener("click", () => {
  changeFilterNotes("completed");
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
