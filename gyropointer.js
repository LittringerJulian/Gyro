var robot = require("robotjs")

module.exports = class Gyropointer {

    constructor() {

    }

    screen = { x: robot.getScreenSize().width, y: robot.getScreenSize().height }

    mouse = { x: 0, y: 0 }
    gyroval = { alpha: 0, beta: 0, gamma: 1 }
    gyroval_old = { alpha: 0, beta: 0, gamma: 1 }


    moveMouse(newvalues) {
        this.gyroval = newvalues

        let newx, newy, sens

        if (this.difference(this.gyroval.alpha, this.gyroval_old.alpha) < 180) {
            // x-
            if (this.gyroval.alpha > this.gyroval_old.alpha) {
                newx = -1 * Math.floor(this.distance(this.gyroval.alpha, this.gyroval_old.alpha) * 100) / 100
            }
            // x+
            else {
                newx = Math.floor(this.distance(this.gyroval.alpha, this.gyroval_old.alpha) * 100) / 100
            }

        } else {

            // x+
            if (this.gyroval.alpha > this.gyroval_old.alpha) {
                newx = Math.floor(this.distance(this.gyroval.alpha, this.gyroval_old.alpha) * 100) / 100
            }
            // x-
            else {
                newx = -1 * Math.floor(this.distance(this.gyroval.alpha, this.gyroval_old.alpha) * 100) / 100
            }
        }

        newy = this.difference(this.gyroval.beta, this.gyroval_old.beta)
        if (this.gyroval.beta > this.gyroval_old.beta) newy *= -1

        this.gyroval.gamma = Math.round(this.gyroval.gamma * 100) / 100
        sens = Math.round(((this.gyroval.gamma >= 0) ? ((1 + (Math.abs(this.gyroval.gamma) / 100))) : ((1 - (Math.abs(this.gyroval.gamma) / 100)))) * 30)

        if (newx <= -1 || 1 <= newx) newx += newx * sens
        if (newy <= -1 || 1 <= newy) newy += newy * sens

        //newx = newx * 20
        //newy = newy * 20

        robot.moveMouse(Math.round(newx) + robot.getMousePos().x, Math.round(newy) + robot.getMousePos().y)

        this.gyroval_old = this.gyroval
    }

    // calculates smallest distance between two angles
    distance(a, b) {
        var phi = Math.abs(a - b) % 360
        var distance = phi > 180 ? 360 - phi : phi
        return distance
    }

    // calculates difference between two angles
    difference(a, b) {
        return Math.abs(a - b) % 360
    }

}