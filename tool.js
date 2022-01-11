let toolsContainer = document.querySelector(".tool-options-icons-container");
let optionContainer = document.querySelector(".option-icon");
let optionFlag = true;
let upload = document.querySelector(".upload");
let toolPencil = document.querySelector(".tool-pencil");
let toolEraser = document.querySelector(".tool-eraser");
let pencilIcon = document.querySelector(".pencil");
let eraserIcon = document.querySelector(".eraser");
let stickyIcon = document.querySelector(".sticky");
let pencilFlag = false;
let eraserFlag = false;
let stickyFlag = true;



// from canvas.js
let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let mouseDown = false;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let penColor = "blue";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;
let tool = canvas.getContext("2d");

tool.strokeStyle =penColor;
tool.lineWidth= penWidth;


optionContainer.addEventListener("click", (e) => {
    optionFlag = !optionFlag;

    if(optionFlag)
    {
        openTools();
    }
    else
    {
        closeTools();
    }
})


function openTools()
{
    let iconElement = optionContainer.children[0];
    iconElement.classList.remove("fa-times");
    iconElement.classList.add("fa-bars");
    toolsContainer.style.display = "flex";
    
}

function closeTools()
{
    let iconElement = optionContainer.children[0];
    iconElement.classList.remove("fa-bars");
    iconElement.classList.add("fa-times");
    toolsContainer.style.display = "none";
    toolPencil.style.display = "none";
    toolEraser.style.display = "none";
}


pencilIcon.addEventListener("click", (e) => {
    eraserFlag = false;
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
    tool.strokeStyle= penColor;

    pencilFlag = !pencilFlag;
    if(pencilFlag)
    {
        toolPencil.style.display ="block";
    }
    else
    {
        toolPencil.style.display ="none";
    }
})

eraserIcon.addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;
    if(eraserFlag)
    {
        toolEraser.style.display = "block";
    }
    else
    {
        toolEraser.style.display = "none";
    }
})


stickyIcon.addEventListener("click", (e) => {
    let stickyNoteElem = document.createElement("div");
    stickyNoteElem.setAttribute("class", "sticky-cont");
    stickyNoteElem.innerHTML = `
    <div class="header-cont">
        <div class="minimize-note"></div>
        <div class="remove-note"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;

    let minimizeNote = stickyNoteElem.querySelector(".minimize-note");
    let removeNote = stickyNoteElem.querySelector(".remove-note");
    handleStickyActions(minimizeNote, removeNote, stickyNoteElem);

    document.body.appendChild(stickyNoteElem);
    stickyNoteElem.onmousedown = function (event) {
        dragAndDrop(stickyNoteElem, event);
    };

    stickyNoteElem.ondragstart = function () {
        return false;
    };
})


function handleStickyActions(minimizeNote, removeNote, note) {
    minimizeNote.addEventListener("click", (e) => {
        stickyFlag = !stickyFlag;
        let noteCont = note.querySelector(".note-cont");
        if (stickyFlag) {
            noteCont.style.display = "block";
        }
        else {
            noteCont.style.display = "none";
            note.style.height = "2rem";
        }
    })
    removeNote.addEventListener("click", (e) => {
        note.remove();
    })
}

upload.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyNoteElem = document.createElement("div");
        stickyNoteElem.setAttribute("class", "sticky-cont");
        stickyNoteElem.innerHTML = `
        <div class="header-cont">
            <div class="minimize-note"></div>
            <div class="remove-note"></div>
        </div>
        <div class="note-cont">
            <img src="${url}" />
        </div>
        `;

        let toggleNote = stickyNoteElem.querySelector(".minimize-note");
        let removeNote = stickyNoteElem.querySelector(".remove-note");
        handleStickyActions(toggleNote, removeNote, stickyNoteElem);

        document.body.appendChild(stickyNoteElem);
        stickyNoteElem.onmousedown = function (event) {
            dragAndDrop(stickyNoteElem, event);
        };

        stickyNoteElem.ondragstart = function () {
            return false;
        };
    });
})


function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}