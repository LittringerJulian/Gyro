module.exports = class Gyropointer {

    constructor() {

    }

    robot = require("robotjs")

    start = { alpha: 0, beta: 0 }
    end = { alpha: 0, beta: 0 }
    cpoint = { alpha: 0, beta: 0 }

    sizeX = 0
    sizeY = 0


    oldPosX = 0
    oldPosY = 0

    multiplierH = 0
    multiplierV = 0


    // called when pointer.html recalibrates
    // sets the new 'display size'
    // sets start and end points and multiplier for angles
    updateDisplaySize(newstart, newend, newsizeX, newsizeY) {

        this.sizeX = newsizeX
        this.sizeY = newsizeY

        this.start = newstart
        this.end = newend

        // multiplier horizontal / vertical
        this.multiplierH = this.sizeX / this.distance(this.start.alpha, this.end.alpha)
        this.multiplierV = this.sizeY / this.distance(this.start.beta, this.end.beta)
    }

    // called when pointer.html is calibrated
    // and movement is detected
    updatePointer(newcpoint) {
        this.oldpoint = this.cpoint
        this.cpoint.alpha = newcpoint.alpha
        this.cpoint.beta = newcpoint.beta
        this.updatePointerPos()
    }

    // called when pointer position is updated
    updatePointerPos() {

        // variables for new pointer positions on screen
        var posX
        var posY

        // calculates new pointer x position
        //
        // first case: start angle > end angle
        if (this.start.alpha >= this.end.alpha) {
            //  position if the pointer should be on screen
            if (this.start.alpha >= this.cpoint.alpha && this.end.alpha <= this.cpoint.alpha) {
                posX = this.distance(this.cpoint.alpha, this.end.alpha) * this.multiplierH
            }
            // position if the pointer should be out of screen
            // aligns pointer to whichever display edge the pointer is closest to
            else if (this.distance(this.cpoint.alpha, this.start.alpha) < this.distance(this.cpoint.alpha, this.end.alpha)) {
                posX = this.sizeX
            } else {
                posX = 0
            }
        }
        // second case: end angle > start angle
        else {
            // position if the pointer should be on screen
            if ((this.start.alpha >= this.cpoint.alpha && this.end.alpha > this.cpoint.alpha) || (this.start.alpha < this.cpoint.alpha && this.end.alpha <= this.cpoint.alpha)) {
                posX = this.distance(this.cpoint.alpha, this.end.alpha) * this.multiplierH
            }
            // position if the pointer should be out of screen
            // aligns pointer to whichever display edge the pointer is closest to
            else if (this.distance(this.cpoint.alpha, this.start.alpha) > this.distance(this.cpoint.alpha, this.end.alpha)) {
                posX = 0
            } else {
                posX = this.sizeX
            }

        }


        // calculates new pointer x position
        //
        // if start > end is only here so the code can be extended more easily
        // end > start is very unlikely and will never happen unintentionally
        if (this.start.beta >= this.end.beta) {
            // position if the pointer should be on screen
            if (this.start.beta >= this.cpoint.beta && this.end.beta <= this.cpoint.beta) {
                posY = this.distance(this.cpoint.beta, this.end.beta) * this.multiplierV
            }
            // position if the pointer should be out of screen
            // aligns pointer to whichever display edge the pointer is closest to
            else if (this.distance(this.cpoint.beta, this.start.beta) < this.distance(this.cpoint.beta, this.end.beta)) {
                posY = this.sizeY
            } else {
                posY = 0
            }
        }

        // prototype for reducing micro movement if the pointer is held still
        /*if (Math.abs(oldPosX - posX) < 1) {
            posX = oldPosX
        }
        if (Math.abs(oldPosY - posY) < 1) {
            posY = oldPosY
        }

        oldPosX = posX
        oldPosY = posY
        */


        // returning new pointer position
        //return (posX, posY)

        //robot.moveMouse(sizeX - posX, sizeY - posY)
        this.robot.moveMouse(this.sizeX - posX, this.sizeY - posY)
    }

    // calculates smallest distance between two angles
    distance(alpha, beta) {
        var phi = Math.abs(alpha - beta) % 360
        var distance = phi > 180 ? 360 - phi : phi
        return distance
    }

}