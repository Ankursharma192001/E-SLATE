let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//API 

let tool = canvas.getContext("2d");

tool.strokeStyle="red";
tool.lineWidth="3";