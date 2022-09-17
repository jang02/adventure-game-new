let keysDown = [];

document.addEventListener("keydown", function(event) {
    if (!keysDown.includes(event.keyCode)) {
        keysDown.push(event.keyCode);
    }
});


document.addEventListener("keyup", function (event) {
    if (keysDown.includes(event.keyCode)) {
        let index = keysDown.indexOf(event.keyCode);
        if (index !== -1) keysDown.splice(index, 1);
    }
});



var Enemy = function (name, audioSrc, health, attack, defence, beginMessage, actButtons, backgroundSrc, attackFunc, onSpare, onKill) {
    var self = this;
    var local = {};

    local.attackFunc = attackFunc;

    local.backgroundImage = backgroundSrc;

    self.health = health;
    self.maxHealth = self.health;

    self.attackStat = attack;
    self.defenceStat = defence;

    self.beginMessage = beginMessage;

    self.onSpare = function () {
        if (onSpare != null)
            onSpare.call(onSpare);
    };

    self.onKill = function () {
        if (onKill != null)
            onKill.call(onKill);
    };

    local.canSpare = false;
    self.canSpare = function () {
        return local.canSpare;
    };

    self.setCanSpare = function (value) {
        local.canSpare = value;
    };

    self.getActButtons = function () {
        return actButtons;
    };

    self.getBackgroundImage = function () {
        return local.backgroundImage;
    };

    local.name = name;

    self.getName = function () {
        return name;
    };

    local.turn = 1;

    local.battle = null;
    local.hasFinished = false;


    // key listener

    let interval = -1;

    self.attackPlayer = function (battle) {
        local.hasFinished = false;

        local.battle = battle;

        let mainX = screenPosition.x + (750 - 125);
        let mainY = screenPosition.y + 442;

        let box = document.createElement("img");
        box.src = "easter_egg/images/ui/battle/box.png";
        box.classList.add("ui", "noscale");
        box.alt = "box";
        box.style.position = "absolute";
        box.style.top = mainY + "px";
        box.style.left = mainX + "px";
        document.getElementById("game").appendChild(box);


        local.soul = document.createElement("img");
        local.soul.src = "easter_egg/images/ui/battle/soul_0.png";
        local.soul.id = "humanSoul";
        local.soul.classList.add("ui", "noscale");
        local.soul.alt = "soul";
        local.soul.style.position = "absolute";
        local.soul.style.top = (mainY + 85) + "px";
        local.soul.style.left = (mainX + 125 - 8) + "px";

        document.getElementById("game").appendChild(local.soul);

        let speed = 2;

        interval = setInterval(function () {
            keysDown.forEach(function (value, index, array) {

                let keycode = value;

                let x = parseInt(local.soul.style.left.replace("px", ""));
                let y = parseInt(local.soul.style.top.replace("px", ""));

                switch (keycode) {
                    default: break;
                    case 37: {
                        x = x - speed;
                        break;
                    }
                    case 38: {
                        y = y - speed;
                        break;
                    }
                    case 39: {
                        x = x + speed;
                        break;
                    }
                    case 40: {
                        y = y + speed;
                        break;
                    }
                }

                ///*
                if (x < mainX + 4) {
                    x = mainX + 4;
                }
                else if (x > mainX + 250 - 4 - 16) {
                    x = mainX + 250 - 4 - 16;
                }

                if (y < mainY + 4) {
                    y = mainY + 4;
                }
                else if (y > mainY + 200 - 4 - 16) {
                    y = mainY + 200 - 4 - 16;
                }
                //*/

                local.soul.style.left = x + "px";
                local.soul.style.top = y + "px";
            })
        }, 1000.0 / 60.0);



        local.attackFunc.call(local.attackFunc, local, battle);
    };


    self.finishTurn = function (battle) {
        if (!local.hasFinished) {
            local.hasFinished = true;
            local.turn++;

            clearInterval(interval);


            battle.addButtons();
        }
    };

    self.getSoul = function () {
        return local.soul;
    };

    local.audioSrc = audioSrc;

    self.getAudioSource = function () {
        return local.audioSrc;
    }
};