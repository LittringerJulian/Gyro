const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const localIpV4Address = require("local-ipv4-address")
var localip
var port = 3000

var Gyropointer = require("./gyropointer.js")
var robot = require("robotjs")

var gyro = new Gyropointer()

localIpV4Address().then(function(ipAddress) {
    localip = ipAddress
    console.log(localip)
});

server.listen(port, () => console.log('app listening on port 3000!'))


io.sockets.on('connection', function(socket) {
    console.log("connected")

    //io.emit('getip', "http://" + localip + ":" + port + "/pointer")

    socket.on('gyro.moveMouse', function(gyroval) {
        gyro.moveMouse(gyroval)
    })
});

app.get('/gyroold', (req, res) => {
    res.sendFile(__dirname + '/gyroold.html')
});

app.get('/gyro', (req, res) => {
    res.sendFile(__dirname + '/gyro.html')
});

app.get('/acc', (req, res) => {
    res.sendFile(__dirname + '/acc.html')
});