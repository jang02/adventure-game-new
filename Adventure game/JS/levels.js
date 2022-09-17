let container = document.getElementById("container");
let game = document.getElementById("game");

let levels = {
    deadge: {
        name: "deadge",
        img: "none",
        backgroundColor: "black",
        deathmessage: null,
        elements: [
            {
                type: "H1",
                text: "You died",
                id: "death",
                size: 100,
            }
        ],
        buttons: [
            {
                name: "restart",
                isCustomButton: true,
                toggled: true,
                requiredRank: ranks.FARMER,
                onButtonClick: function (buttonHTML, button) {
                    window.location.reload(false);
                }
            }
        ],
    },
    startscreen: {
        name: "startscreen",
        img: "url(pictures/startscreen.jpg)",
        dialogue: dialogue.startscreen,
        buttons: [
            {
                targetLocation: "farm",
                name: "start",
                toggled: true,
                isCustomButton: true,
                requiredRank: ranks.FARMER
            },
            {
                name: "test",
                isCustomButton: true,
                toggled: true,
                requiredRank: ranks.FARMER,
                onButtonClick: function (buttonHTML, button) {

                    let specialDialogue = dialogue.specialTest;

                    document.getElementById("buttons").style.display = "none";

                    let dialogueCount = 0;

                    let clickScreen = function () {

                        if (dialogueCount < specialDialogue.length) {
                            document.getElementById("text").innerText = specialDialogue[dialogueCount];
                            dialogueCount++;
                        } else {
                            document.getElementById("buttons").style.display = "flex";
                            container.removeEventListener("click", clickScreen);

                            buttonHTML.remove();
                            button.toggled = false;
                        }
                    }

                    container.addEventListener("click", clickScreen);

                }
            }
        ],
    },
    farm: {
        name: "farm",
        img: "url(pictures/farm.jpg)",
        buttons: [
            {
                targetLocation: "castleforest",
                name: "left",
                toggled: true,
                isCustomButton: true,
                requiredRank: ranks.FARMER
            }
        ],
        clickables: [
            {
                name: "scythe",
                src: "pictures/scythe.png",
                toggled: true,
                height: 75,
                width: 75,
                position: "absolute",
                top: 360,
                left: 1115,
                classes: [
                    "ui",
                    "blur"
                ],
                click: function (clicked) {
                    clicked.toggled = false;

                    new inventoryItem("scythe", "pictures/scythe.png").add()

                    document.getElementById("scythe").remove();
                }
            }
        ]
    },
    castleforest: {
        name: "castleforest",
        img: "url(pictures/castle.jpg)",
        buttons: [
            {
                targetLocation: "farm",
                name: "back",
                toggled: true,
                isCustomButton: true,
                requiredRank: ranks.FARMER
            },
            {
                targetLocation: "castle",
                name: "left",
                toggled: true,
                isCustomButton: true,
                requiredRank: ranks.MERCHANT
            },
            {
                targetLocation: "forest",
                name: "right",
                toggled: true,
                isCustomButton: true,
                requiredRank: ranks.FARMER
            }
        ]
    },
    forest: {
        name: "forest",
        img: "url(pictures/forest.jpg)",
        buttons: [
            {
                targetLocation: "castleforest",
                name: "back",
                toggled: true,
                isCustomButton: true,
                requiredRank: ranks.FARMER
            }
        ],
        clickables: [
            {
                name: "bear",
                src: "pictures/enemy1.png",
                toggled: true,
                height: 250,
                width: 250,
                position: "absolute",
                top: 360,
                left: 1115,
                classes: [
                    "ui"
                ],
                click: function (clicked) {
                    if (inventory.includes("scythe")) {
                        clicked.toggled = false;
                        currentrank = ranks.MERCHANT;
                        new inventoryItem("bearhead", "pictures/bearhead.png").add()
                        document.getElementById("bear").remove();
                    } else {
                        levels.deadge.deathmessage = "Try finding some sort of weapon to defeat the bear with..."
                        createLevel(levels["deadge"]);
                    }
                }
            }
        ]
    },
    castle: {}
};


function createLevel(level) {
    reset();
    document.getElementById("game").style.backgroundImage = level.img;

    if (level.backgroundColor != null){
        document.getElementById("game").style.backgroundColor = level.backgroundColor;
    }
    if (level.deathmessage != null) {
        let death = document.createElement('H1');
        death.id = "deathdialogue";
        death.style.fontSize = "45px";
        death.innerText = level.deathmessage;
        document.getElementById("game").appendChild(death)

    }


    if (level.elements != null){

        level.elements.forEach(customElement => {

            let element = document.createElement(customElement.type);

            element.id = customElement.id;
            element.innerText = customElement.text;
            element.style.fontSize = customElement.size + "px";

            if (customElement.classes != null) {
                customElement.classes.forEach(classList => {
                    element.classList.add(classList);
                })
            }

            document.getElementById("game").appendChild(element)

        })

    }

    if (level.clickables != null) {
        level.clickables.forEach(clickable => {

            if (clickable.toggled) {
                let img = document.createElement('IMG');

                img.src = clickable.src;

                img.style.width = clickable.width + "px";
                img.style.height = clickable.height + "px";
                img.style.position = clickable.position;

                img.style.top = (screenPosition.y + clickable.top) + "px";
                img.style.left = (screenPosition.x + clickable.left) + "px";

                img.id = clickable.name;

                if (clickable.classes != null) {
                    clickable.classes.forEach(classList => {
                        img.classList.add(classList);
                    })
                }

                img.onclick = function () {
                    clickable.click(clickable);
                }

                game.appendChild(img);
            }
        })
    }

    if (level.dialogue != null) {
        let dialogueCount = 0;

        let clickScreen = function () {
            if (dialogueCount < level.dialogue.length) {
                document.getElementById("text").innerText = level.dialogue[dialogueCount];
                dialogueCount++;
            } else {
                buttonLoader(level.buttons);
                container.removeEventListener("click", clickScreen)
            }
        }

        container.addEventListener("click", clickScreen)
    } else {
        document.getElementById("text").innerText = ""
        buttonLoader(level.buttons);
    }


}


createLevel(levels["startscreen"]);


