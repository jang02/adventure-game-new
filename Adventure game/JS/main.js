var currentlevel = 0;


var buttons;

(buttons = document.getElementById('buttons'));


document.body.onresize = onResize;

function onResize() {
    let oldScreenPosition = {x: screenPosition.x, y: screenPosition.y};

    screenPosition = getPos(document.getElementById("game"));

    for (let i = 0; i < document.getElementsByClassName("ui").length; i++) {
        let element = document.getElementsByClassName("ui")[i];

        let currentLeft = parseInt(element.style.left.replace("px", ""));
        element.style.left = (currentLeft - oldScreenPosition.x + screenPosition.x) + "px";
    }
}

function getPos(el) {
    // yay readability
    let x = el.getBoundingClientRect().left;
    return {x: Math.abs(x), y: 8};
}

var screenPosition = getPos(document.getElementById("game"));

function reset() {
    document.getElementById('game').innerHTML = "";
    console.log('reset screen.');
    document.getElementById('rank').innerHTML = currentrank.name;
    resetButtons();
}

function resetButtons() {
    while (document.getElementsByClassName("customButton").length > 0) {
        document.getElementsByClassName("customButton")[0].remove();
    }
}

function buttonLoader(buttons) {

    buttons.forEach(button => {

        if (button.toggled) {
            var createButton = document.createElement('BUTTON');

            createButton.innerHTML = button.name;

            if (button.isCustomButton) {
                createButton.classList.add("customButton")
            }

            if (button.onButtonClick != null) {
                if (currentrank.id >= button.requiredRank.id) {
                    createButton.onclick = function () {
                        button.onButtonClick(createButton, button);
                    };
                }
            } else {
                createButton.onclick = function () {
                    if (currentrank.id >= button.requiredRank.id) {
                        createLevel(levels[button.targetLocation])
                    } else {
                        document.getElementById("text").innerText = "You must be atleast the rank: " + button.requiredRank.name;
                    }

                };
            }

            document.getElementById("buttons").appendChild(createButton);
        }

    })

}



