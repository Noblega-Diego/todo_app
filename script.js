const list = document.getElementById('list-todo');
const optionAll = document.getElementById('option-main-all');
const optionActive = document.getElementById('option-main-active');
const optionCompleted = document.getElementById('option-main-completed');
const form = document.getElementById('form-create-note');
const inputComplete = document.getElementById('form-complete');
const inputText = document.getElementById('form-text');
const count = document.getElementById('count');
const buttonColor = document.getElementById('change-color-page');

let statePage = false;
let filterSelect = 'all';
// manejo del storage

const dataStorageGet = (key) =>{
    return JSON.parse(localStorage.getItem(key));
}

const dataStorageFilter = (filter) =>{
    const notes = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const note = JSON.parse(localStorage.getItem(key));
        if(filter(note)){
            notes.push(note);
        }
    }
    return notes;
}

const dataStorageSet = (key,note) =>{
    localStorage.setItem(key,JSON.stringify(note));
}

const dataStorageRemove = (key) =>{
    localStorage.removeItem(key);
}

const dataStoragePush = (note)=>{
    note.id = Date.now();
    localStorage.setItem(note.id,JSON.stringify(note));
    return note;
}

const changeStateElement = (elementNote ,state) =>{
    const text = elementNote.querySelector('.todo-note__text');
    const chek = elementNote.querySelector('.todo-note__chek');
    if(state){
        chek.classList.add('todo-note__chek--completed');
        text.classList.add('todo-note__text--completed');
    }else{
        chek.classList.remove('todo-note__chek--completed');
        text.classList.remove('todo-note__text--completed');
    }
}
//note control

const endNote = (notes) => {
    if(notes.length > 1){
        let biggerNumber = notes[0].number;
        notes.forEach(note => {
            if(biggerNumber < note.number)
            biggerNumber = note.number;
        })
        return biggerNumber;
    }
    return 0;
}

const noteChangeEstate = (elementNote) =>{
    const id = elementNote.dataset.id;
    const note = dataStorageGet(id);
    changeStateElement(elementNote,note.complete);
}

const delateTodo = (buttonDelate)=>{
    let todoItem;
    do{
        todoItem = buttonDelate.parentElement;
    }while (todoItem.nodeName != 'LI');
    dataStorageRemove(todoItem.dataset.id);
    todoItem.remove();
}

const paintNotes = (notes)=>{
    const element = document.getElementById('element-note');
    const fragment = document.createDocumentFragment();
    while (list.firstChild) list.firstChild.remove();
    const noteList = notes.sort((a,b) => a.number > b.number? -1 :1)
    noteList.forEach(note=>{
        const clone = document.importNode(element.content, true);
        const li = clone.querySelector('li');
        const text = li.querySelector('.todo-note__text');
        li.setAttribute('data-id',note.id);
        changeStateElement(li,note.complete);
        text.textContent = note.text;
        fragment.appendChild(clone);
    })
    
    count.textContent = notes.length;
    list.appendChild(fragment)
;}

// control menu

const changeOption = (option)=>{
    filterSelect = option;
    optionAll.classList.toggle('todo-main__option--select',(option == 'all'));
    optionActive.classList.toggle('todo-main__option--select',(option == 'active'));
    optionCompleted.classList.toggle('todo-main__option--select',(option == 'completed'));
}
optionAll.addEventListener('click',() =>{
    notes = dataStorageFilter(() => true);
    paintNotes(notes);
    changeOption('all');
})
optionActive.addEventListener('click',() =>{
    notes = dataStorageFilter(note => !note.complete);
    paintNotes(notes);
    changeOption('active');
})
optionCompleted.addEventListener('click',() =>{
    notes = dataStorageFilter(note => note.complete);
    paintNotes(notes);
    changeOption('completed');
})
inputComplete.addEventListener('change', () => {
    const label = form.querySelector('.label-chek');
    label.classList.toggle('label-chek--completed',inputComplete.checked)
})

//creacion de nota
form.addEventListener('submit', e =>{
    e.preventDefault();
    const nots = dataStorageFilter(()=>true);
    const endNumberNote = endNote(nots);
    const note = {
        number: endNumberNote + 1,
        complete:inputComplete.checked,
        text: inputText.value
    }
    dataStoragePush(note);
    let notes = [];
    if(filterSelect == 'all' || filterSelect == ''){
        notes = dataStorageFilter(() => true);
    }else if(filterSelect == 'active'){
        notes = dataStorageFilter(note => !note.complete);
    }else if(filterSelect == 'completed'){
        notes = dataStorageFilter(note => note.complete);
    }
    form.reset();
    paintNotes(notes);
})

document.addEventListener('DOMContentLoaded',e=>{
    let hash = location.hash.replace('#','');
    let notes = [];
    if(hash == 'all' || hash == ''){
        notes = dataStorageFilter(() => true);
        changeOption('all');
    }else if(hash == 'active'){
        notes = dataStorageFilter(note => !note.complete);
        changeOption('active');
    }else if(hash == 'completed'){
        notes = dataStorageFilter(note => note.complete);
        changeOption('completed');
    }
    paintNotes(notes);
});

list.addEventListener('click',e =>{
    const element = e.target;
    if(element.classList.contains('todo-note__delate')){
        delateTodo(element);
    }else{
        let buttonChek = element;
        if(buttonChek.classList.contains('todo-note__chek')){
            let todoItem;
            do{
                todoItem = buttonChek.parentElement;
            }while (todoItem.nodeName != 'LI');
            const note = dataStorageGet(todoItem.dataset.id);
            const state = note.complete;
            note.complete = !state;
            dataStorageSet(note.id,note);
            changeStateElement(todoItem,note.complete);
        }else{
            buttonChek = buttonChek.parentElement;
            if(buttonChek.classList.contains('todo-note__chek')){
                let todoItem;
                do{
                    todoItem = buttonChek.parentElement;
                }while (todoItem.nodeName != 'LI');
                const note = dataStorageGet(todoItem.dataset.id);
                const state = note.complete;
                note.complete = !state;
                dataStorageSet(note.id,note);
                changeStateElement(todoItem,note.complete);
            }
        }
        
    }
})

buttonColor.addEventListener('click',e => {
    e.preventDefault();
    const body = document.body;
    const light = body.classList.contains('body--light');
    if(light){
        body.classList.add('body--dark');
        body.classList.remove('body--light');
    }else{
        body.classList.add('body--light');
        body.classList.remove('body--dark');
    }
})
