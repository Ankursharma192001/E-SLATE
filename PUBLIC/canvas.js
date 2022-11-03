let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = infoForEraser;
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []; //Data
let track = 0; // Represent which action from tracker array

// push the initial state in undoRedoTracker
    let Tempurl = canvas.toDataURL();
    undoRedoTracker.push(Tempurl);
    track = 1;

let mouseDown = false;

// API
let tool = canvas.getContext("2d");

// document.body.style.backgroundColor = "red";
choosenColor.style.backgroundColor=penColor;
tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // send data to server
    socket.emit("beginPath", data);
})
canvas.addEventListener("touchstart", (e) => {
    mouseDown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // send data to server
    console.log("started touch event ");
    socket.emit("beginPath", data);
})
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: isEraserFlag ? eraserColor : penColor,
            width: isEraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawStroke", data);
    }
})
canvas.addEventListener("touchmove", (e) => {
    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: isEraserFlag ? eraserColor : penColor,
            width: isEraserFlag ? eraserWidth : penWidth
        }
        
        console.log("move touch event ");
        socket.emit("drawStroke", data);
    }
})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})
canvas.addEventListener("touchend", (e) => {
    mouseDown = false;
    console.log("touch event finished")
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    choosenColor.style.backgroundColor=penColor;
    if(penColor==="yellow"||penColor==="white")
    {
        choosenColor.style.color="black";
    }
    else
    {
        choosenColor.style.color="white";

    }
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        choosenColor.style.backgroundColor=penColor;
        if (penColor === "yellow" || penColor === "white") {
            choosenColor.style.color = "black";
        }
        else {
            choosenColor.style.color = "white";

        }
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click", (e) => {
    if (isEraserFlag ) {

        if(themeFlag==false)
        {
            eraserColor="white";
        }
        else
        {
            eraserColor="black";
        }
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        choosenColor.style.backgroundColor=penColor;
        if (penColor === "yellow" || penColor === "white") {
            choosenColor.style.color = "black";
        }
        else {
            choosenColor.style.color = "white";

        }
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "E-Slate.jpg";
    a.click();
})

remove.addEventListener("click",(e)=>{
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
    
    let data = {
        canvas : e.canvas,
        x: e.clientX,
        y: e.clientY
    }
    clearAll();
    // socket.emit("clearall", data);
    
})


function clearAll()
{
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log("remove clicked");
    

}

socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
    // let body=document.querySelector(body);
    // body.style.backgroundColor="red";
    console.log("socket working on touch1")
})
socket.on("drawStroke", (data) => {
    drawStroke(data);
    console.log("socket working on touch2")
})
socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
    console.log("undo Redo called");
    console.log("socket working on touch3 ")
})

// socket.on("clearall",(data)=>{
//     clearAll(data);
// })