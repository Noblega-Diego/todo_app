const list = document.getElementById("list-todo"),
  optionAll = document.getElementById("option-main-all"),
  optionActive = document.getElementById("option-main-active"),
  optionCompleted = document.getElementById("option-main-completed"),
  clearCompleted = document.getElementById("clearCompleted"),
  form = document.getElementById("form-create-note"),
  inputComplete = document.getElementById("form-complete"),
  inputText = document.getElementById("form-text"),
  count = document.getElementById("count"),
  buttonColor = document.getElementById("change-color-page");
let listNotes = [],
  statePage = false,
  filterSelect = "all";

// manejo del storage
const noteStorageGet = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const noteStorageLoad = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const note = JSON.parse(localStorage.getItem(key));
    listNotes.push(note);
  }
};

const noteStorageSet = (note) => {
  for (let i = 0; i< listNotes.length; i++) {
    console.log(i);
      if(listNotes[i].id === note.id){
        listNotes[i] = note;
        break;
      }
  }
  localStorage.setItem(note.id, JSON.stringify(note));
};

const noteStorageRemove = (id) => {
  listNotes = listNotes.filter(n => n.id != id);
  localStorage.removeItem(id);
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

const noteStoragePush = (state,text) => {
  const note  = {
    id: Date.now(),
    complete: state,
    number: endNumberStorage(listNotes),
    text
  }
  listNotes.push(note);
  localStorage.setItem(note.id, JSON.stringify(note));
  return note;
};

const countNotes = (param) => {
  let count = 0;
    listNotes.forEach(note =>{
      if(param(note))
        count ++;
    })
  return count;
}
//note control

const delateTodo = (buttonDelate) => {
  let todoItem;
  do {
    todoItem = buttonDelate.parentElement;
  } while (todoItem.nodeName != "LI");
  if(!noteStorageGet(todoItem.dataset.id).complete)
    count.textContent = parseInt(count.textContent) - 1;
  noteStorageRemove(todoItem.dataset.id);
  todoItem.remove();
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
  //mostramos la cantidad de tareas sin completar
  count.textContent = countNotes((n)=> !n.complete);
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
  const label = form.querySelector(".label-chek");
  e.preventDefault();
  noteStoragePush(inputComplete.checked,inputText.value);
  form.reset();
  label.classList.toggle("label-chek--completed", false);
  paintNotes();
});

inputComplete.addEventListener("change", () => {
  const label = form.querySelector(".label-chek");
  label.classList.toggle("label-chek--completed", inputComplete.checked);
});
//cargamos las notas
document.addEventListener("DOMContentLoaded", (e) => {
  //guardamos las notas del storage en el listNotes;
  noteStorageLoad();
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
      const note = noteStorageGet(todoItem.dataset.id);
      const state = note.complete;
      note.complete = !state;
      noteStorageSet(note);
      if(note.complete)
          count.textContent = parseInt(count.textContent) - 1; 
      else
          count.textContent = parseInt(count.textContent) + 1;
      changeStateElement(todoItem, note.complete);
    } else {
      buttonChek = buttonChek.parentElement;
      if (buttonChek.classList.contains("todo-note__chek")) {
        let todoItem;
        do {
          todoItem = buttonChek.parentElement;
        } while (todoItem.nodeName != "LI");
        const note = noteStorageGet(todoItem.dataset.id);
        const state = note.complete;
        note.complete = !state;
        noteStorageSet(note);
        if(note.complete)
          count.textContent = parseInt(count.textContent) - 1; 
        else
          count.textContent = parseInt(count.textContent) + 1;
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

clearCompleted.addEventListener('click',()=>{
  
})

// change color page

buttonColor.addEventListener("click", (e) => {
  e.preventDefault();
  const body = document.body;
  const light = body.classList.contains("body--light");
  if (light) {
    buttonColor.classList.toggle('button-change--down',false);
    buttonColor.classList.toggle('button-change--up',true);
    body.classList.add("body--dark");
    body.classList.remove("body--light");
  } else {
    buttonColor.classList.toggle('button-change--down',true);
    buttonColor.classList.toggle('button-change--up',false);
    body.classList.add("body--light");
    body.classList.remove("body--dark");
  }
});
