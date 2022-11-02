const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); //Initialized and server ready

app.use(express.static("OPEN BOARD"));

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
    console.log("Listening to port" + port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection");
})