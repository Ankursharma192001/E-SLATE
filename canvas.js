let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//API 

let tool = canvas.getContext("2d");


let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElement = document.querySelector(".pencil-width");
let eraserWidthElement = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElement.value;
let eraserWidth = eraserWidthElement.value;


tool.strokeStyle = penColor;
tool.lineWidth = penWidth;



// mousedown  -- > start new path 
//  mousemove - - > fill graphic

// data manager 

let undoRedoTracker = [];

// Represent which action form tracker array should be performed
let track = 0;

// pushing the initial state 
let url = canvas.toDataURL();
undoRedoTracker.push(url);
track = 1;


let mouseDown = false;

canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    BeginPath(e);
})
canvas.addEventListener("mousemove", (e) => {

    DrawStroke(e);
})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

undo.addEventListener("click", (e) => {

    if (track > 0) {
        track -= 1;
    }

    let trackObj = {
        trackvalue: track,
        undoRedoTracker,
    }
    //  action
    undoRedoPerformer(trackObj);
})

redo.addEventListener("click", (e) => {

    if (track < undoRedoTracker.length - 1) {
        track += 1;
    }

    let trackObj = {
        trackvalue: track,
        undoRedoTracker,
    }
    //  action
    undoRedoPerformer(trackObj);
})

function undoRedoPerformer(trackobj) {
    track = trackobj.trackvalue;
    undoRedoTracker = trackobj.undoRedoTracker;

    // new image reference element

    let url = undoRedoTracker[track];
    let img = new Image();
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }


}


function BeginPath(strokeObject) {
    tool.beginPath();
    tool.moveTo(strokeObject.x, strokeObject.y);
}
function DrawStroke(strokeObject) {
    if (mouseDown == true) {

        tool.lineTo(strokeObject.x, strokeObject.y);
        tool.stroke();
    }
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElement.addEventListener("change", (e) => {
    penWidth = pencilWidthElement.value;
    tool.lineWidth = penWidth;
})
eraserWidthElement.addEventListener("change", (e) => {

    eraserWidth = eraserWidthElement.value;
    tool.lineWidth = penWidth;

})

eraser.addEventListener("click", (e) => {
    if (isEraserFlag == true) {

        if (penColor === "white")
        {
            eraserColor = "black";
        }
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {


    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "E-slate.jpg";
    a.click();
})


