let healthUpdaterInterval = -1;
function startBattle() {

    // hardcoded but idgaf
    document.getElementById("other").innerHTML =
        "<div class=\"hpbarFull\">" +
        "<div id=\"playerHealthBar\" class=\"hpBar\"></div>" +
        "</div>";

    new Battle(SecretInside, new Boss().asEnemy()).loadBattle();

    healthUpdaterInterval = setInterval(function () {
        if (currentBattle != null) {
            if (currentBattle.playerHealth <= 0) {
                //TODO game over screen
                //self.kill();
            }
            else {
                let bar = document.getElementById("playerHealthBar");
                if (bar == null) {
                    clearInterval(healthUpdaterInterval);
                }
                else {
                    let width = currentBattle.playerHealth / 100 * 100;
                    if (width < 0) width = 0;
                    else if (width > 100) width = 100;

                    bar.style.width = width + "%";

                    let green = (width / 100 * 255);
                    let red = 255 - green;
                    bar.style.backgroundColor = "rgb(" + red / 2 + ", " + green + ", 0)";
                }
            }
        }
        else {
            clearInterval(healthUpdaterInterval);
        }
    }, 20);
}


var currentBattle = null;
var Battle = function (oldLevel, enemy) {
    var local = {};
    var self = this;


    local.oldLevel = oldLevel;
    local.enemy = enemy;

    self.invincibilityTicks = 0;
    self.playerHealth = 100;

    let invincibilityTicksId = setInterval(function () {
        if (self.invincibilityTicks > 0)
            self.invincibilityTicks--;
    }, 20);

    let audioVolume = 0.9;
    var backgroundAudio = null;
    if (Array.isArray(enemy.getAudioSource())) {
        backgroundAudio = new Audio(enemy.getAudioSource()[0]);
        backgroundAudio.volume = audioVolume;


        var newAudio = new Audio(enemy.getAudioSource()[1]);
        newAudio.volume = audioVolume;

        backgroundAudio.addEventListener('ended', function() {
            (backgroundAudio = newAudio).play();

            backgroundAudio.addEventListener('ended', function() {
                this.play();
            }, false);

        }, false);

        newAudio.addEventListener('ended', function() {
            this.play();
        }, false);
    }
    else {
        backgroundAudio = new Audio(enemy.getAudioSource());
        backgroundAudio.volume = audioVolume;
        backgroundAudio.addEventListener('ended', function() {
            this.play();
        }, false);
    }



    // load enemy sprite
    local.enemyImage = document.createElement("img");
    local.enemyImage.src = enemy.getBackgroundImage();
    local.enemyImage.classList.add("ui", "noUiClear", "noscale");
    local.enemyImage.id = "enemy";
    local.enemyImage.alt = "Enemy";
    local.enemyImage.style.visibility = "hidden";


    self.loadBattle = function() {//980x150
        buttonloader("none", "none", "none");

        setTimeout(function () {

            backgroundAudio.play();
            document.getElementById("game").style.backgroundImage = "url(easter_egg/images/ui/battle/background.png)";
            self.addButtons();


            let times = [1, 100, 200, 300];
            for (let i = 0; i < times.length; i++) {
                setTimeout(function () {
                    //show enemy sprite
                    local.enemyImage.src = enemy.getBackgroundImage();
                    local.enemyImage.style.position = "absolute";
                    local.enemyImage.style.top = (screenPosition.y + (280 - (local.enemyImage.clientHeight * 0.95))) + "px";
                    local.enemyImage.style.left = screenPosition.x + (750 - (local.enemyImage.clientWidth / 2)) + "px";
                    local.enemyImage.style.visibility = "visible";

                }, times[i]);
            }

            document.getElementById("game").appendChild(local.enemyImage);
        }, 100);
    };

    local.battleFinished = false;


    self.finishBattle = function () {
        document.getElementsByClassName("hpbarFull")[0].remove();
        document.getElementById("other").innerHTML += "<p>Current rank: </p><p id=\"rank\"></p>";

        local.battleFinished = true;
        currentBattle = null;
        reset();
        backgroundAudio.pause();
        local.audio = null;

        clearInterval(invincibilityTicksId);

        enemies["nick"] = true;
        SecretInside();
    };



    self.addButtons = function () {
        if (!local.battleFinished) {
            local.clearUi();
            resetButtons();

            new Button("Attack", function () {
                local.attack();
            }).createButton();
        }
    };

    var attackTimes = 1;

    local.attack = function () {
        //TODO reset buttons
        resetButtons();

        var x = 0;
        var mainX = screenPosition.x + (750-(1024)/2);

        let image = document.createElement("img");
        image.src = "easter_egg/images/ui/battle/damage_bar.png";
        image.classList.add("ui", "noscale");
        image.alt = "Damage bar UI";
        image.style.position = "absolute";
        image.style.top = (screenPosition.y + 442) + "px";
        image.style.left = mainX + "px";
        image.style.width = "1024px";

        let bar = document.createElement("img");
        bar.src = "easter_egg/images/ui/battle/bar1.png";
        bar.classList.add("ui", "noscale");
        bar.alt = "bar";
        bar.style.position = "absolute";
        bar.style.top = (screenPosition.y + 492) + "px";
        bar.style.left = mainX + "px";

        let width = parseInt(image.style.width.replace("px", ""));

        document.getElementById("game").appendChild(image);
        document.getElementById("game").appendChild(bar);

        let runnableId = setInterval(function () {
            x += width / 75;
            bar.style.left = (mainX + x) + "px";

            if (x >= width) {
                local.finalAttack(0, runnableId);
            }

        }, 20);

        //TODO attack button
        new Button("Attack", function () {
            //old formula: Math.ceil((((-(1.0 / width) * Math.pow(x, 2) + x) / 18.1) * player.getAttackStat()) / enemy.defenceStat);

            let damage = Math.ceil((Math.sqrt((-(1.0 / width) * Math.pow(x, 2) + x) - Math.abs(Math.sin((x * 2) / (width / Math.PI)) * 100)) * 100 / Math.sqrt(Math.pow(enemy.defenceStat, 1.75))) * (Math.pow(attackTimes++ / 10, 2) + 0.99));

            local.finalAttack(damage, runnableId);
        }).createButton();

    };

    local.finalAttack = function(damage, runnableId) {
        //TODO reset buttons
        resetButtons();

        local.clearUi();

        clearInterval(runnableId);


        let damageEffect = document.createElement("img");

        var audio = new Audio("easter_egg/audio/sfx/attack.wav");
        audio.addEventListener("ended", function () {
            damageEffect.alt = "done";
            setTimeout(function () {
                if (local.health - damage < 0)
                    damage = local.health;

                var hpBarMain = document.createElement("div");
                hpBarMain.id = "hpbarFullhpBarEnemy";
                hpBarMain.classList.add("hpbarFull");
                hpBarMain.style.position = "absolute";
                hpBarMain.style.top = (screenPosition.y + 322) + "px";
                hpBarMain.style.left = screenPosition.x + (750 - 150) + "px";
                hpBarMain.style.backgroundColor = "#ddd";


                var width = local.enemy.health / local.enemy.maxHealth * 100;
                if (width < 0) width = 0;
                else if (width > 100) width = 100;
                var green = (width / 100 * 255);
                var red = 255 - green;

                var hpBar = document.createElement("div");
                hpBar.alt = "playing";
                hpBar.id = "hpBarEnemy";
                hpBar.classList.add("hpBar");
                hpBar.style.position = "absolute";
                hpBar.style.width = width + "%";
                //hpBar.style.top = (screenPosition.y + 322) + "px";
                //hpBar.style.left = screenPosition.x + (750 - 150) + "px";
                hpBar.style.backgroundColor = "rgb(" + red / 4 + ", " + green + ", 0)";

                document.getElementById("game").appendChild(hpBarMain);
                hpBarMain.appendChild(hpBar);

                let damagePerSec = damage / 35.0;


                var damageText = document.createElement("span");
                damageText.innerHTML = damage === 0 ? "MISS" : damage;

                var x = screenPosition.x + (750 - (getTextWidth(damageText.innerHTML, document.body.style.fontSize, document.body.style.font) / 2 + 11));
                var y = screenPosition.y + 282;

                damageText.alt = "playing";
                damageText.id = "damageText";
                damageText.style.fontFamily = "Determination Mono, Lato, sans-serif";
                damageText.style.fontSize = "40px";
                damageText.style.color = damage === 0 ? "gray" : "red";
                damageText.style.position = "absolute";
                damageText.style.top = y + "px";
                damageText.style.right = x + "px";

                document.getElementById("game").appendChild(damageText);

                let newHealth = local.enemy.health - damage;
                if (newHealth < 0)
                    newHealth = 0;

                let healthInterval = setInterval(function () {
                    local.enemy.health = (local.enemy.health - damagePerSec);

                    var width = local.enemy.health / local.enemy.maxHealth * 100;
                    if (width < 0) width = 0;
                    else if (width > 100) width = 100;

                    hpBar.style.width = width + "%";

                    var green = (width / 100 * 255);
                    var red = 255 - green;

                    hpBar.style.backgroundColor = "rgb(" + red + ", " + green + ", 0)";

                    if (hpBar.alt === "done") {
                        clearInterval(healthInterval);

                        hpBarMain.removeChild(hpBar);
                        document.getElementById("game").removeChild(document.getElementById("hpbarFullhpBarEnemy"));
                    }
                }, 20);

                var audio = new Audio("easter_egg/audio/sfx/damage_enemy.wav");
                audio.addEventListener("ended", function () {
                    setTimeout(function () {

                        local.enemy.health = newHealth;
                        damageText.alt = "done";
                        hpBar.alt = "done";

                        if (newHealth === 0) {
                            local.enemy.onKill();
                            backgroundAudio.volume = backgroundAudio.volume / 5;
                            new Audio("easter_egg/audio/sfx/victory.wav").play();
                            document.getElementById("enemy").style.opacity = "0";
                            local.finalContinue();
                        }
                        else {
                            local.continueBossAttack();
                        }

                    }, 200);
                });
                audio.play();

                var intervalId = setInterval(function () {
                    frames++;
                    if (damageText.alt === "done") {
                        clearInterval(intervalId);
                        document.getElementById("game").removeChild(document.getElementById("damageText"));
                    }
                    else {
                        damageText.style.top = (y + (Math.random() * 6 - 3) - 11) + "px";
                        damageText.style.left = (x + (Math.random() * 11 - 5.5) - 11) + "px";
                    }
                }, 20);
            }, 100);
        });

        damageEffect.src = "easter_egg/images/ui/battle/damage_0.png";
        damageEffect.classList.add("ui", "noscale");
        damageEffect.alt = "playing";
        damageEffect.style.position = "absolute";
        damageEffect.style.top = (screenPosition.y + 132) + "px";
        damageEffect.style.left = (screenPosition.x + (750 - 16)) + "px";

        let ticks = 0;
        let intervalId = setInterval(function () {
            if (ticks >= 5 || damageEffect.alt === "done") {
                clearInterval(intervalId);
                document.getElementById("game").removeChild(damageEffect);
            }
            else {
                damageEffect.src = "easter_egg/images/ui/battle/damage_" + (++ticks) + ".png";
            }
        }, 120);


        document.getElementById("game").appendChild(damageEffect);

        audio.play();

    };

    local.continueBossAttack = function () {
        local.enemy.attackPlayer(self);
    };

    local.clearUi = function () {
        let i = 0;
        while (document.getElementsByClassName("ui").length > i) {
            let element = document.getElementsByClassName("ui")[i];

            if (hasClass(element, "noUiClear")) {
                i++;
                continue;
            }

            element.remove();
        }
    };

    local.finalContinue = function () {
        resetButtons();

        new Button("Finish battle", function () {
            self.finishBattle();
        }).createButton();
    };


    currentBattle = self;
};

var Button = function (text, func) {
    var self = this;
    var local = {};

    local.text = text;
    local.uuid = randomUUID();

    self.getName = function () {
        return local.text;
    };

    local.func = func;
    self.onClick = function () {
        local.func.call(local.func);
    };

    self.createButton = function () {
        let parent = document.getElementById("buttons");

        let button = document.createElement("button");
        button.onclick = func;
        button.id = local.uuid;
        button.classList.add("customButton");
        button.style.display = "flex";
        button.innerHTML = local.text;

        parent.appendChild(button);
    };

    self.getButton = function () {
        return document.getElementById(local.uuid);
    };

    self.extraClick = null;
};

