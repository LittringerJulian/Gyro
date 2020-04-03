let start = { alpha: 0, beta: 0 }
let end = { alpha: 0, beta: 0 }
let cpoint = { alpha: 0, beta: 0 }

let sizeX = 0
let sizeY = 0

let oldPosX = 0
let oldPosY = 0

let multiplierH = 0
let multiplierV = 0


// called when pointer.html recalibrates
// sets the new 'display size'
// sets start and end points and multiplier for angles
function updateDisplaySize(newstart, newend, newsizeX, newsizeY) {

    sizeX = newsizeX
    sizeY = newsizeY

    start = newstart
    end = newend

    // multiplier horizontal / vertical
    multiplierH = sizeX / distance(start.alpha, end.alpha)
    multiplierV = sizeY / distance(start.beta, end.beta)
}

// called when pointer.html is calibrated
// and movement is detected
function updatePointer(newcpoint) {
    oldpoint = cpoint
    cpoint.alpha = newcpoint.alpha
    cpoint.beta = newcpoint.beta
    updatePointerPos()
}

// called when pointer position is updated
function updatePointerPos() {

    // variables for new pointer positions on screen
    var posX    // in vw
    var posY    // in vh 

    // calculates new pointer x position
    //
    // first case: start angle > end angle
    if (start.alpha >= end.alpha) {
        //  position if the pointer should be on screen
        if (start.alpha >= cpoint.alpha && end.alpha <= cpoint.alpha) {
            posX = distance(cpoint.alpha, end.alpha) * multiplierH
        }
        // position if the pointer should be out of screen
        // aligns pointer to whichever display edge the pointer is closest to
        else if (distance(cpoint.alpha, start.alpha) < distance(cpoint.alpha, end.alpha)) {
            posX = sizeX
        }
        else {
            posX = 0
        }
    }
    // second case: end angle > start angle
    else {
        // position if the pointer should be on screen
        if ((start.alpha >= cpoint.alpha && end.alpha > cpoint.alpha) || (start.alpha < cpoint.alpha && end.alpha <= cpoint.alpha)) {
            posX = distance(cpoint.alpha, end.alpha) * multiplierH
        }
        // position if the pointer should be out of screen
        // aligns pointer to whichever display edge the pointer is closest to
        else if (distance(cpoint.alpha, start.alpha) > distance(cpoint.alpha, end.alpha)) {
            posX = 0
        }
        else {
            posX = sizeX
        }

    }


    // calculates new pointer x position
    //
    // if start > end is only here so the code can be extended more easily
    // end > start is very unlikely and will never happen unintentionally
    if (start.beta >= end.beta) {
        // position if the pointer should be on screen
        if (start.beta >= cpoint.beta && end.beta <= cpoint.beta) {
            posY = distance(cpoint.beta, end.beta) * multiplierV
        }
        // position if the pointer should be out of screen
        // aligns pointer to whichever display edge the pointer is closest to
        else if (distance(cpoint.beta, start.beta) < distance(cpoint.beta, end.beta)) {
            posY = sizeY
        }
        else {
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
    return (posX, posY)
}

// calculates smallest distance between two angles
function distance(alpha, beta) {
    var phi = Math.abs(alpha - beta) % 360
    var distance = phi > 180 ? 360 - phi : phi
    return distance
}
