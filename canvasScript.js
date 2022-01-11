

// moved to tool.js

// let pencilColor = document.querySelectorAll(".pencil-color");
// let pencilWidthElem = document.querySelector(".pencil-width");
// let eraserWidthElem = document.querySelector(".eraser-width");

// let penColor = "blue";
// let eraserColor = "white";
// let penWidth = pencilWidthElem.value;
// let eraserWidth = eraserWidthElem.value;



let download = document.querySelector(".download");
let undoRedoTracker = [];
let tracker = 0;

let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");





canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {
    if(mouseDown)
    {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width : eraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawStroke", data);
       
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    tracker++;


   
})


function beginPath(strokeObj)
{
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj)
{
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}


pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[1];
        penColor = color;
        tool.strokeStyle= penColor;
    })
})


pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
    tool.strokeStyle = eraserColor;
})

eraserIcon.addEventListener("click", (e) => {
    if(eraserFlag)
    {
        eraserWidth = eraserWidthElem.value;
        tool.lineWidth = eraserWidth;
        tool.strokeStyle = eraserColor;
    }
    else
    {
        penWidth = pencilWidthElem.value;
        tool.lineWidth = penWidth;
        tool.strokeStyle = penColor;
    }
    
})




download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})


undo.addEventListener("click", (e) => {
    if(tracker > 0)
    {
          tracker--;
    }

    let data = {
        trackValue : tracker,
        undoRedoTracker
    }

    socket.emit("redoundo", data);
    // undoRedoCanvas(trackObj);
})

redo.addEventListener("click", (e) => {
    if(tracker < undoRedoTracker.length - 1)
    {
        tracker++;
    }
    let data = {
        trackValue : tracker,
        undoRedoTracker
    }
    socket.emit("redoundo", data);
    // undoRedoCanvas(trackObj);
})

function undoRedoCanvas(trackObj)
{
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image refern element 
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    
     
}


socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("redoundo", (data) => {
    undoRedoCanvas(data);
})