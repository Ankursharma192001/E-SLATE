// here i will try to change the ham burger animation

let toolsCont = document.querySelector(".tools-cont")
let optionscontainer = document.querySelector(".options-cont");
let pencilTool = document.querySelector(".pencil-tool-cont");
let eraserTool = document.querySelector(".eraser-tool-cont");
let optionsFlag = true;
let isPencilFlag = false;
let isEraserFlag = false;
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");


// true --- > to show tools
// false -- > hide tools
optionscontainer.addEventListener("click", (e) => {


    if (optionsFlag == true) {
        closetools();
        optionsFlag = false;
    }
    else {
        opentools();
        optionsFlag = true;
    }



});

function opentools() {
    let iconEle = optionscontainer.children[0];
    iconEle.classList.remove("fa-times");
    iconEle.classList.add("fa-bars");
    toolsCont.style.display = "flex";


}

function closetools() {
    let iconEle = optionscontainer.children[0];
    iconEle.classList.remove("fa-bars");
    iconEle.classList.add("fa-times");
    toolsCont.style.display = "none";
    pencilTool.style.display = "none";
    eraserTool.style.display = "none";

}

pencil.addEventListener("click", (e) => {

    // true -- > show pencil
    // false -- > hide pencil

    if (isPencilFlag == true) {
        pencilTool.style.display = "block";
        isPencilFlag = false;
    }
    else {
        pencilTool.style.display = "none";
        isPencilFlag = true;
    }
})

eraser.addEventListener("click", () => {

    // true -- > show eraser
    // false -- > hide eraser

    if (isEraserFlag == true) {
        eraserTool.style.display = "flex";
        isEraserFlag = false;
    }
    else {
        eraserTool.style.display = "none";
        isEraserFlag = true;
    }
})

sticky.addEventListener("click", (e) => {

    let stickyContainer = document.createElement("div");
    stickyContainer.setAttribute("class", "sticky-cont");
    stickyContainer.innerHTML = `<div class="header-cont">
           
    <div class="minimize"></div>
    <div class="remove"></div>

</div>

<div class="note-cont">

    <textarea spellcheck="false"></textarea>
    
</div>`;

    document.body.appendChild(stickyContainer);


    let minimize = stickyContainer.querySelector(".minimize");
    let remove = stickyContainer.querySelector(".remove");

    noteActions(minimize, remove, stickyContainer);

    stickyContainer.onmousedown = function (event) {

        dragAndDrop(stickyContainer, event);
    };

    stickyContainer.ondragstart = function () {
        return false;
    };


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

function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })

    minimize.addEventListener("click", (e) => {

        let nodeCont = stickyCont.querySelector(".note-cont")
        let display = getComputedStyle(nodeCont).getPropertyValue("display");

        if (display == "none") {
            nodeCont.style.display = "block";
        }
        else {
            nodeCont.style.display = "none";
        }
    })
}



upload.addEventListener("click", (e) => {

    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyContainer = document.createElement("div");
        stickyContainer.setAttribute("class", "sticky-cont");
        stickyContainer.innerHTML = `<div class="header-cont">
           
    <div class="minimize"></div>
    <div class="remove"></div>

</div>

<div class="note-cont">

    <img src= ${url}>
    
</div>`;

        document.body.appendChild(stickyContainer);


        let minimize = stickyContainer.querySelector(".minimize");
        let remove = stickyContainer.querySelector(".remove");
    

        noteActions(minimize, remove, stickyContainer);

        stickyContainer.onmousedown = function (event) {

            dragAndDrop(stickyContainer, event);
        };

        stickyContainer.ondragstart = function () {
            return false;
        };


    })


})

