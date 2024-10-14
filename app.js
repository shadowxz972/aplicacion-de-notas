// declaracion de variables

const titleInput = document.getElementById("title-input");
const contentInput = document.getElementById("content-input");
const addNoteBtn = document.getElementById("add-note-btn");
const orderByTitleBtn = document.getElementById("order-by-title-btn");
const orderByDateBtn = document.getElementById("order-by-date-btn");
const activeEditBtn = document.getElementById("active-edit-btn");
const deactiveEditBtn = document.getElementById("deactive-edit-btn");
const saveChangesBtn = document.getElementById("save-changes-btn");
const loadChangesBtn = document.getElementById("load-changes-btn");
const deleteAllChangesBtn = document.getElementById("delete-all-changes-btn");
const feedback = document.getElementById("feedback")
const notesContainer = document.querySelector(".notes-container");
//// Funciones flecha

const dateNow = ()=>{
    const ahora = new Date();

    // Obteniendo los componentes de la fecha y hora
    const dia = String(ahora.getDate()).padStart(2, '0');  // Día con dos dígitos
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');  // Mes con dos dígitos (recuerda que los meses empiezan desde 0)
    const año = String(ahora.getFullYear()).slice(-2);  // Últimos dos dígitos del año
    const horas = String(ahora.getHours()).padStart(2, '0');  // Hora con dos dígitos
    const minutos = String(ahora.getMinutes()).padStart(2, '0');  // Minutos con dos dígitos

    // Formateando la fecha y hora
    const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}`;
    return fechaFormateada;
}

const validateInput = (input,type)=>{
    if (input.value.length < 5){
        return `El ${type} debe tener mas de 5 caracteres`;
    }
    return "";
}

const notify = (msg)=> {
    feedback.classList.remove('notificar'); // Elimina la clase
    void feedback.offsetWidth; // Forza el reflujo para reiniciar la animación
    feedback.classList.add('notificar'); // Añade la clase nuevamente
    feedback.textContent = msg
}

const createNote = (title,content,time)=> {
    // creamos la nota
    let div = document.createElement("div");
    let titleSpan = document.createElement("span");
    let separator = document.createElement("span");
    let contentSpan = document.createElement("p");
    let deleteBtn = document.createElement("button");
    let timeSpan = document.createElement("span");
    // añadimos sus clases y atributos
    div.classList.add("note-container");
    titleSpan.classList.add("note-title");
    titleSpan.setAttribute("title", title);
    separator.classList.add("separator");
    contentSpan.classList.add("note-content");
    deleteBtn.classList.add("delete-note-btn");
    timeSpan.classList.add("time");
    timeSpan.textContent = time;
    // añadimos su contenido
    titleSpan.textContent = title;
    contentSpan.textContent = content;
    deleteBtn.textContent = "Borrar";

    // unimos las etiquetas
    div.appendChild(titleSpan);
    div.appendChild(separator);
    div.appendChild(contentSpan);
    div.appendChild(deleteBtn);
    div.appendChild(timeSpan);
    notesContainer.appendChild(div)
    // añadimos los eventos
    deleteBtn.addEventListener("click",()=>{
        div.remove()
    })
}

const addNote = ()=> {
    let titleError = validateInput(titleInput,"titulo");
    let contentError = validateInput(contentInput,"contenido");

    if (titleError || contentError){
        notify(`Error: ${titleError +" "+ contentError}`)
        return; // para que se termine la funcion
    }
    
    //creamos la nota
    createNote(titleInput.value,contentInput.value,dateNow())
    
    // limpiamos los inputs
    titleInput.value = "";
    contentInput.value = "";
}

const activeEdit = ()=> {
    const allNotes = document.querySelectorAll(".note-container");
    allNotes.forEach(note => {
        note.setAttribute("contenteditable","true")
    })
}

const deactiveEdit = ()=>{
    const allNotes = document.querySelectorAll(".note-container");
    allNotes.forEach(note => {
        note.setAttribute("contenteditable","false")
    })
}

const saveChanges = ()=> {
    const allNotes = document.querySelectorAll(".note-container");
    let list_notes = Array.from(allNotes,note=>{
        const title = note.querySelector(".note-title").textContent;
        const content = note.querySelector(".note-content").textContent;
        const time = note.querySelector(".time").textContent;
        return {
            title: title,
            content: content,
            time : time
        }
    })
    localStorage.setItem("notes",JSON.stringify(list_notes))
}

const loadChanges = ()=> {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notesContainer.innerHTML = ""
    notes.forEach(note => {
        createNote(note.title,note.content,note.time)
    });
}

const orderByTitle = () => {
    const allNotes = Array.from(document.querySelectorAll(".note-container"));
    let fragment = document.createDocumentFragment()
    // Ordenar las notas por el texto del título
    const orderedNotes = allNotes.sort((a, b) => {
        const titleA = a.querySelector(".note-title").textContent.toLowerCase();
        const titleB = b.querySelector(".note-title").textContent.toLowerCase();
        return titleA.localeCompare(titleB);  // Comparar alfabéticamente
    });

    // Volver a agregar las notas ordenadas al contenedor
    orderedNotes.forEach(note => {
        fragment.appendChild(note);
    });
    notesContainer.appendChild(fragment)
};

// Función para ordenar por fecha
const orderByDate = () => {
    const allNotes = Array.from(document.querySelectorAll(".note-container"));

    const orderedNotes = allNotes.sort((a, b) => {
        // Extraer el elemento de fecha con la clase correcta '.time'
        const dateElementA = a.querySelector(".time");
        const dateElementB = b.querySelector(".time");

        // Verificar si los elementos existen
        if (!dateElementA || !dateElementB) {
            console.error("No se encontró el elemento '.time' en uno de los contenedores.");
            return 0;  // No mover las notas si no hay fechas
        }

        // Extraer el texto de las fechas
        const dateA = dateElementA.textContent.trim();
        const dateB = dateElementB.textContent.trim();

        // Convertir las fechas en objetos Date
        const parsedDateA = parseDate(dateA); 
        const parsedDateB = parseDate(dateB);

        return parsedDateA - parsedDateB;  // Ordenar por la diferencia de fechas
    });

    // Limpiar el contenedor de notas
    notesContainer.innerHTML = "";

    // Volver a agregar las notas ordenadas
    orderedNotes.forEach(note => {
        notesContainer.appendChild(note);
    });
};

// Función para convertir una cadena de fecha en un objeto Date
const parseDate = (dateString) => {
    // Asumiendo que el formato es "dd/mm/yy hh:mm"
    const [day, month, year, hour, minute] = dateString.split(/[/:\s]/);

    // Crear un objeto Date (considera el siglo para el año)
    return new Date(`20${year}`, month - 1, day, hour, minute);
};


// añadimos los eventos
addNoteBtn.addEventListener("click",addNote);
saveChangesBtn.addEventListener("click",saveChanges);
loadChangesBtn.addEventListener("click",loadChanges)
deleteAllChangesBtn.addEventListener("click", ()=>{
    localStorage.clear();
    notesContainer.innerHTML = "";
})
activeEditBtn.addEventListener("click",activeEdit);
deactiveEditBtn.addEventListener("click",deactiveEdit);
orderByTitleBtn.addEventListener("click",orderByTitle);
orderByDateBtn.addEventListener("click",orderByDate);