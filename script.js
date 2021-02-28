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
  storageNotes,
  statePage,
  filterSelect = "all";


//delegacion de eventos



// manejo del storage
const localStorageManager = (key) =>{
  let storage = JSON.parse(localStorage.getItem(key));
  return {
    data: () => storage,
    remplace: (d) => {
      storage = d;
      console.log('data: ' + storage)
      localStorage.setItem(key,JSON.stringify(d));
    }
  }
}


const noteStorageGet = (key) => {
  for (let i = 0; i < listNotes.length; i++) {
    if(listNotes[i].id == key)
    return listNotes[i];
  }
  return;
};

const noteStorageLoad = () => {
  storageNotes = localStorageManager('notes');
  if(storageNotes.data() == null){
    listNotes = [];
    storageNotes.remplace(listNotes);
  }
  else{
    listNotes = storageNotes.data();
  }
};

const noteStorageSet = (note) => {
  for (let i = 0; i< listNotes.length; i++) {
      if(listNotes[i].id === note.id){
        listNotes[i] = note;
        break;
      }
  }
  storageNotes.remplace(listNotes);
};

const noteStorageRemove = (id) => {
  listNotes = listNotes.filter(n => n.id != id);
  storageNotes.remplace(listNotes);
};

const noteStorageRemoves = (param) => {
  listNotes = listNotes.filter(param);
  storageNotes.remplace(listNotes);
}

const endNumberStorage = (notes) => {
  if (notes.length > 0) {
    let biggerNumber = notes[0].number;
    notes.forEach((note) => {
      if (biggerNumber < note.number) biggerNumber = note.number;
    });
    return biggerNumber;
  }
  return -1;
};

const noteStoragePush = (state,text) => {
  const note  = {
    id: Date.now(),
    complete: state,
    number: endNumberStorage(listNotes) + 1,
    text
  }
  listNotes.push(note);
  storageNotes.remplace(listNotes);
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

const delateTodo = (noteElement) => {
  if(!noteStorageGet(noteElement.dataset.id).complete)
    count.textContent = parseInt(count.textContent) - 1;
  noteStorageRemove(noteElement.dataset.id);
  noteElement.remove();
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
      noteElement = clone.querySelector("li"),
      text = noteElement.querySelector(".todo-note__text");
    noteElement.setAttribute("data-id", note.id);
    setStateElement(noteElement, note.complete);
    text.textContent = note.text;
    fragment.appendChild(clone);
  });
  //mostramos la cantidad de tareas sin completar
  count.textContent = countNotes((n)=> !n.complete);
  //insertamos el fragment
  list.appendChild(fragment);
  console.log('se pintaron')
};
const setStateElement = ( noteElement, state ) => {
  const text = noteElement.querySelector(".todo-note__text");
  const chek = noteElement.querySelector(".todo-note__chek");
  if (state) {
    chek.classList.add("todo-note__chek--completed");
    text.classList.add("todo-note__text--completed");
  } else {
    chek.classList.remove("todo-note__chek--completed");
    text.classList.remove("todo-note__text--completed");
  }
}
const changeStateElement = (noteElement) => {
  const note = noteStorageGet(noteElement.dataset.id);
  note.complete = !note.complete;
  noteStorageSet(note.complete);
  if(note.complete)
      count.textContent = parseInt(count.textContent) - 1; 
   else
      count.textContent = parseInt(count.textContent) + 1;
  setStateElement(noteElement,note.complete);
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
  statePage = localStorageManager('page');
  if(statePage.data() == null){
    const page = {
      color:true
    }
    statePage.remplace(page);
    console.log(statePage.data())
  }
  changeColorPage(statePage.data().color);
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
  let noteElement = element.closest('.todo-note');
  if (element.classList.contains("todo-note__delate")) {
    delateTodo( noteElement );
  } else {
    let buttonChek = element.closest('.todo-note__chek');1
    if (buttonChek != null) {
      changeStateElement(noteElement);
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
  noteStorageRemoves(note => note.complete);
  paintNotes();
})

// change color page
const changeColorPage = (state) => {
  const body = document.body;
  if (state) {
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
}

buttonColor.addEventListener("click", (e) => {
  e.preventDefault();
  const page = statePage.data();
  page.color = !page.color;
  statePage.remplace(page);
  console.log(page);
  changeColorPage(page.color);
});
