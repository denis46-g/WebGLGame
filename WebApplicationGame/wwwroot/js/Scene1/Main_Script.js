window.onload = function () {
    loadImgs();
    loadObjs();

}

function loadImgs() {
    img_Field = document.getElementById("Field");
    img_Rock = document.getElementById("Rock");
    img_Stone = document.getElementById("Stone");
    img_teasure = document.getElementById("teasure");
    img_buddha_head = document.getElementById("buddha_head");
    img_octopus = document.getElementById("octopus");
}

function loadObjs() {
    obj_Field = parseOBJ("Field");
    obj_Rock = parseOBJ("Rock");
    obj_Stone = parseOBJ("Stone");
    obj_teasure = parseOBJ("teasure");
    obj_buddha_head = parseOBJ("buddha_head");
    obj_octopus = parseOBJ("octopus");
}



   

