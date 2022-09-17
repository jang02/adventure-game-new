var Bullet = function (owner, attack, backgroundSrc) {
    var self = this;
    var local = {};


    local.backgroundImage = backgroundSrc;
    local.owner = owner;

    self.attackStat = attack;

    self.collidesWithPlayer = function () {
        if (currentBattle.invincibilityTicks > 0)
            return false;

        let playerX = parseInt(local.owner.getSoul().style.left.replace("px", ""));
        let playerY = parseInt(local.owner.getSoul().style.top.replace("px", ""));

        let boundingBox = self.getBoundingBox();

        return local.x < playerX + 16
            && local.x + boundingBox.width > playerX

            && local.y < playerY + 16
            && local.y + boundingBox.height > playerY;
    };

    self.harmPlayer = function () {
        currentBattle.invincibilityTicks = 40;

        var audio = new Audio("easter_egg/audio/sfx/damage_take.wav");
        audio.play();

        let ticks = 0;
        var intervalId = setInterval(function () {
            if (currentBattle.invincibilityTicks <= 0) {
                local.owner.getSoul().src = "easter_egg/images/ui/battle/soul_0.png";
                clearInterval(intervalId);
            }
            else {
                ticks++;
                local.owner.getSoul().src = "easter_egg/images/ui/battle/soul_" + (Math.floor((ticks / 6 % 2))) + ".png";
            }
        }, 20);


        let width = 1024;
        let middle = width / 2;
        let offset = 75;
        middle += (Math.random() * 2 - 1) * offset;

        let damage = Math.ceil(Math.sqrt((-(1.0 / width) * Math.pow(middle, 2) + middle) - Math.abs(Math.sin((middle * 2) / (width / Math.PI)) * 100)) * owner.attackStat / Math.sqrt(Math.pow(100, 1.8)));

        currentBattle.playerHealth -= damage;

        console.log("Harmed the player for " + damage + " damage.");
    };

    local.element = null;
    local.loadObject = function () {
        local.element = document.createElement("img");
        if (Array.isArray(local.backgroundImage)) {
            let images = [];
            let delay = 0;

            for (let i = 0; i < local.backgroundImage.length; i++) {
                if (isNaN(local.backgroundImage[i])) {
                    images.push(local.backgroundImage[i]);
                }
                else {
                    delay = local.backgroundImage[i] * 20;
                    break;
                }
            }

            local.element.src = images[0];

            let ticks = 0;
            let intervalId = setInterval(function () {
                if (local.element === null) {
                    clearInterval(intervalId);
                }
                else {
                    local.element.src = images[ticks++%images.length];
                }
            }, delay);
        }
        else {
            local.element.src = local.backgroundImage;
        }
        local.element.classList.add("bullet", "ui", "noscale");
        local.element.alt = "bullet";
        local.element.style.position = "absolute";

        self.setX(screenPosition.x + 750);
        self.setY(screenPosition.y + 222);

        document.getElementById("game").appendChild(local.element);
    };

    local.x = 0;
    local.y = 0;

    local.velocityX = 0;
    local.velocityY = 0;

    self.getX = function () {
        return local.x;
    };

    self.setX = function (x) {
        local.x = x;

        local.element.style.left = x + "px";
    };

    self.getY = function () {
        return local.y;
    };

    self.setY = function (y) {
        local.y = y;

        local.element.style.top = y + "px";
    };

    self.setPosition = function (x, y) {
        self.setX(x);
        self.setY(y);
    };

    local.angle = 0;
    self.updateImageAngle = function (angle) {
        local.angle = angle;
        local.element.style.transform = "rotate(" + angle + "deg)";
        local.element.style.webkitTransform = "rotate(" + angle + "deg)";
    };


    self.getVelocityX = function () {
        return local.velocityX;
    };

    self.setVelocityX = function (x) {
        local.velocityX = x;
    };

    self.getVelocityY = function () {
        return local.velocityY;
    };

    self.setVelocityY = function (y) {
        local.velocityY = y;
    };

    self.getElement = function() {
        return local.element;
    };

    local.loadObject();

    self.removeObject = function () {
        if (local.element !== null) {
            local.element.remove();
            local.element = null;
        }
    };

    self.getElement = function () {
        return local.element;
    };

    self.getBoundingBox = function () {
        let width = local.element.clientWidth;
        let height = local.element.clientHeight;

        let angle = Math.floor(local.angle%360);

        if (angle === 0) {
            return {width: width, height: height};
        }
        else {
            let rads= angle * Math.PI / 180;

            let c = Math.abs(Math.cos(rads));
            let s = Math.abs(Math.sin(rads));

            return{width: height * s + width * c, height: height * c + width * s};
        }
    };
};