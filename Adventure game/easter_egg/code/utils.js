function integerPrompt(message) {
    let value;
    while (isNaN(value = parseInt(prompt(message)))) {
        alert("Je moet een getal invoeren.");
    }
    return value;
}

function getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    return dd + '-' + mm + '-' + yyyy;
}

function getCurrentTime() {
    let today = new Date();
    let hh = today.getHours();
    let mm = today.getMinutes()+1; //January is 0!
    let ss = today.getSeconds();

    return hh + ':' + mm + ':' + ss;
}

function randomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getTextWidth(text, size, font) {
    // re-use canvas object for better performance
    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    context.fontSize = size;
    let metrics = context.measureText(text);
    return metrics.width;
}

/*
    returns every value in an array to 0-1
    For example:
        1 = 0.2
        2 = 0.4
        3 = 0.6
        4 = 0.8
        5 = 1

        or

        1 = 0.333
        2 = 0.667
        3 = 1
 */
function normalize(arrayOfNumbers) {
    let total = 0;
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        total += (arrayOfNumbers[i] * arrayOfNumbers[i]);
    }
    let length = Math.sqrt(total);


    let newArray = [];
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        newArray.push(arrayOfNumbers[i] / length);
    }

    return newArray;
}

function distance2d(point1, point2, point3, point4) {
    return Math.sqrt((Math.abs(point1 - point3) * Math.abs(point1 - point3)) + (Math.abs(point2 - point4) * Math.abs(point2 - point4)));
}

function getPos(el) {
    // yay readability
    let x = el.getBoundingClientRect().left;
    return {x: Math.abs(x), y: 8};
}

// returns value fron css
function css( element, property ) {
    return window.getComputedStyle( element, null ).getPropertyValue( property );
}

function hasClass(element, toFind) {
    let className = element.className;
    let classes = className.split(" ");

    for (let i = 0; i < classes.length; i++) {
        if (classes[i] === toFind) {
            return true;
        }
    }

    return false;
}

function clearAllIntervals() {
    let interval_id = window.setTimeout(function () {}, 9999); // Get a reference to the last

    for (let i = interval_id; i > 0; i--)
        window.clearInterval(i);
    //for clearing all intervals
}

function vectorToAngle(x, y) {
    return ((Math.atan2(y, x) * (180 / Math.PI)) + 90) % 360;
}

function angleToVector(angle) {
    let x = Math.cos(angle / 180 * Math.PI);
    let y = Math.sin(angle / 180 * Math.PI);
    return {x: x, y: y};
}

function setElementToCenter(element) {
    element.style.left = "50%";
    element.style.transform = "translateX(-50%)";
    element.style.msTransform = "translateX(-50%)";
}