//Constant variables related to local storage
const boardKey = "dg1229-bulletin";
const board = document.querySelector("#bulletin");

//Placeholder for current selected label
let selectedElement = null;

//Max number of labels without errors
const MAX_Z_INDEX = 1000;
 
//Identify all labels on the board
function identifyLabels(){
    let doMousedown = function(e){
        e.preventDefault();
        selectedElement = e.target;
        selectedElement.style.zIndex = MAX_Z_INDEX;
    };

    let allLabels = document.querySelectorAll(".label");
    for(let label of allLabels){
        label.onmousedown = doMousedown;
    }

}

function setupDragging(){
    document.onmousemove = function(e){
        e.preventDefault();
        if(selectedElement){
            let mousePos = getMousePos(document.body,e);

            //Centers dragging point on label
            mousePos.x -= selectedElement.clientWidth/2;
            mousePos.y -= selectedElement.clientHeight/2;

            setPosition(selectedElement, mousePos.x, mousePos.y);
        }
    };

    document.onmouseup = function(e){
        if(selectedElement){
            selectedElement.style.zIndex = MAX_Z_INDEX - 1;
        }
        selectedElement = null;
        localStorage.setItem(boardKey, board.innerHTML);
    };
}

function getMousePos(parentElement, event){
    let rect = parentElement.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function setPosition(label,labelLeft,labelTop){
    label.style.left = labelLeft + "px";
    label.style.top = labelTop + "px";

    //Remove any label that is dragged over the trash can
    if(labelLeft > document.querySelector("#remove").x && labelTop > document.querySelector("#remove").y){
        selectedElement.remove();
    }
}

document.querySelector('#create').onclick = function() {
    if(document.querySelector("#newLabel").value == ""){
        return;
    }
    else {
        color = document.querySelector("#textColor").value;
        bgColor = document.querySelector("#backgroundColor").value;
        text = document.querySelector("#newLabel").value;
        temp = board.innerHTML;
        newHTML = temp + "<p class='label' style='color:"+color+";background-color:"+bgColor+"'>"+text+"</p>";
        board.innerHTML = newHTML;
        populate();
    };
}

//Identify, enable and save all labels on board
function populate(){
    //console.log("Populating...");
    identifyLabels();
    setupDragging();
    localStorage.setItem(boardKey, board.innerHTML);
    //console.log("Populated!");
}


//Populate board with locally stored labels
window.onload = (e) => {
    const storedBoard = localStorage.getItem(boardKey);

    //console.log(storedBoard);

    if(storedBoard){
        board.innerHTML = storedBoard;
        populate();
    }
}