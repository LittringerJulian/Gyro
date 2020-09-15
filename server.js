const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const localIpV4Address = require("local-ipv4-address")
const pass = "19234"
var localip
var port = 3000

var Gyropointer = require("./gyropointer.js")
var robot = require("robotjs")

var gyro = new Gyropointer()

localIpV4Address().then(function (ipAddress) {
    localip = ipAddress
    console.log(localip)
});

server.listen(port, () => console.log('app listening on port 3000!'))


io.sockets.on('connection', function (socket) {

    //io.emit('getip', "http://" + localip + ":" + port + "/pointer")


    socket.on('gyro.recalibrate', function (start, end, password) {
        if (password == pass) {
            gyro.updateDisplaySize(start, end, robot.getScreenSize().width, robot.getScreenSize().height)
        }
    })

    socket.on('gyro.movepointer', function (cpoint, password) {
        if (password == pass) {
            gyro.updatePointer(cpoint)
        }
    })

    socket.on('gyro.mousebuttontoggle', function (mousestatus, password) {
        if (password == pass) {
            if (!mousestatus) {
                robot.mouseToggle("down")
            }
            else {
                robot.mouseToggle("up")
            }
        }
    })

    console.log("connected")
});

app.get('/gyro', (req, res) => {
    res.sendFile(__dirname + '/gyro.html')
});

app.get('/acc', (req, res) => {
    res.sendFile(__dirname + '/acc.html')
});
