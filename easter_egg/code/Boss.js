var Boss = function () {
    let turn = 1;

    let talkAmount = 0;

    var enemy = new Enemy("Nick", "easter_egg/audio/battle.ogg", 25000, 45, 10, ["Nick: Hello my dear friend, say hello to death."], [], "easter_egg/images/sprites/enemy/nick.png",
        function (local, battle) {
            let randomAttack = Math.floor(Math.random() * 5);

            switch (randomAttack) {
                default:
                case 0: {
                    let spawnMethod = function () {
                        let toX = screenPosition.x + (750 - 125) + (Math.random() * (250 - 50));
                        let toY = screenPosition.y + 410 + (Math.random() * 195);

                        let interactionBullet = new Bullet(enemy, enemy.attackStat, "easter_egg/images/sprites/enemy/bullets/fireball.gif", function (bullet) {
                            let element = document.getElementById("humanSoul");

                            if (element != null) {
                                element.style.top = (parseInt(element.style.top.replace("px", "")) + (bullet.getVelocityY() * 1.1)) + "px";
                            }
                        });

                        interactionBullet.setPosition(interactionBullet.getX() + ((Math.random() * 2 - 1) * 350), interactionBullet.getY() + (Math.random() * 100));

                        let ballWidth = 36;

                        interactionBullet.getElement().style.width = (ballWidth / (258 / 122)) + "px";
                        interactionBullet.getElement().style.height = ballWidth + "px";

                        let vector = normalize([toX - interactionBullet.getX(), toY - interactionBullet.getY()]);

                        interactionBullet.updateImageAngle(vectorToAngle(vector[0], vector[1]));

                        interactionBullet.setVelocityX(vector[0]);
                        interactionBullet.setVelocityY(vector[1]);

                        let bulletSelf = setInterval(function () {
                            if (local.hasFinished) {
                                clearInterval(bulletSelf);
                                interactionBullet.removeObject();
                            }
                            else {
                                interactionBullet.setX(interactionBullet.getX() + interactionBullet.getVelocityX() * 7);
                                interactionBullet.setY(interactionBullet.getY() + interactionBullet.getVelocityY() * 7);


                                if ((distance2d(interactionBullet.getX(), interactionBullet.getY(), toX, toY) < 10 || interactionBullet.collidesWithPlayer()) && !local.hasFinished) {
                                    interactionBullet.removeObject();
                                    clearInterval(bulletSelf);

                                    let explosionWidth = 30;

                                    let bullet = new Bullet(enemy, enemy.attackStat / 1.5, "easter_egg/images/sprites/enemy/bullets/explosion.gif");
                                    bullet.getElement().style.width = explosionWidth + "px";
                                    bullet.getElement().style.height = explosionWidth + "px";

                                    new Audio("easter_egg/audio/sfx/explosion.wav").play();

                                    bullet.setPosition(toX + ((ballWidth - explosionWidth) / 2), toY + ((ballWidth - explosionWidth) / 2));

                                    let explosionInterval = setInterval(function () {
                                        if (local.hasFinished) {
                                            clearInterval(explosionInterval);
                                            bullet.removeObject();
                                        }
                                        else if (bullet.getElement() == null) {
                                            clearInterval(explosionInterval);
                                        }
                                        else if (bullet.collidesWithPlayer()) {
                                            bullet.harmPlayer();
                                        }
                                    }, 20);

                                    setTimeout(function () {
                                        bullet.removeObject();
                                    }, 400);
                                }
                            }
                        }, 20);
                    };

                    let bulletInterval = setInterval(function () {
                        spawnMethod();
                    }, 220);
                    spawnMethod();


                    setTimeout(function () {
                        clearInterval(bulletInterval);

                        enemy.finishTurn(battle);
                        turn = local.turn;
                    }, 6500);
                    break;
                }

                case 1: {
                    let mainX = screenPosition.x + (750 - 125) + 4;
                    let mainY = screenPosition.y + 442 + 4;

                    let toRemove = 55;

                    let position = [
                        [[0, -toRemove], [42, -toRemove], [84, -toRemove], [126, -toRemove], [168, -toRemove], [210, -toRemove]],
                        [[0, 164 + toRemove], [42, 164 + toRemove], [84, 164 + toRemove], [126, 164 + toRemove], [168, 164 + toRemove], [210, 164 + toRemove]],

                        [[-toRemove, 0], [-toRemove, 33], [-toRemove, 66], [-toRemove, 99], [-toRemove, 132], [-toRemove, 165]],
                        [[210 + toRemove, 0], [210 + toRemove, 33], [210 + toRemove, 66], [210 + toRemove, 99], [210 + toRemove, 132], [210 + toRemove, 165]]
                    ];

                    let spawnMethod = function () {
                        let random = Math.floor(Math.random() * position.length);

                        let reverse = Math.random() < 0.5;
                        let i = reverse ? position[random].length - 1 : 0;

                        let spawnInterval = setInterval(function () {
                            if ((!reverse ? i >= position[random].length : i < 0) || local.hasFinished) {
                                clearInterval(spawnInterval);
                            }
                            else {
                                let x = position[random][i][0] + mainX;
                                let y = position[random][i][1] + mainY;

                                let image = "easter_egg/images/sprites/enemy/bullets/fireball.gif";
                                let bullet = new Bullet(enemy, enemy.attackStat, image);

                                let ballWidth = 32;
                                bullet.getElement().style.width = (ballWidth / (258 / 122)) + "px";
                                bullet.getElement().style.height = ballWidth + "px";

                                bullet.setPosition(x, y);

                                let delta = 0;

                                setTimeout(function () {
                                    let playerPositionX = parseInt(enemy.getSoul().style.left.replace("px", "")) + 8;
                                    let playerPositionY = parseInt(enemy.getSoul().style.top.replace("px", "")) + 8;


                                    let velocity = normalize([playerPositionX - (bullet.getX() + 16), playerPositionY - (bullet.getY() + 16)]);

                                    bullet.setVelocityX(velocity[0]);
                                    bullet.setVelocityY(velocity[1]);

                                    bullet.updateImageAngle(vectorToAngle(velocity[0], velocity[1]));


                                    let velocityInterval = setInterval(function () {
                                        if (local.hasFinished || bullet.getElement() == null) {
                                            clearInterval(velocityInterval);
                                            bullet.removeObject();
                                        }
                                        else {
                                            let speed = ((Math.pow(delta, 2) * 2) + (delta / 2));
                                            if (speed > 11)
                                                speed = 11;

                                            bullet.setX(bullet.getX() + bullet.getVelocityX() * speed);
                                            bullet.setY(bullet.getY() + bullet.getVelocityY() * speed);

                                            if (bullet.collidesWithPlayer()) {
                                                bullet.harmPlayer();
                                            }


                                            if (bullet.getX() < 0 + screenPosition.x || bullet.getX() > 1500 + screenPosition.x - 16 || bullet.getY() < 0 + screenPosition.y || bullet.getY() > 720 + screenPosition.y - 16) {
                                                bullet.removeObject();
                                            }
                                        }

                                        delta += 0.02;
                                    }, 20);
                                }, 100 - (i * 10 / position[random]));

                                if (reverse) i--;
                                else i++;
                            }
                        }, 95);
                    };


                    let bulletInterval = setInterval(function () {
                        spawnMethod();
                    }, 900);
                    spawnMethod();

                    setTimeout(function () {
                        clearInterval(bulletInterval);

                        enemy.finishTurn(battle);
                        turn = local.turn;
                    }, 6700);

                    break;
                }

                case 2: {
                    let shootAmount = 70;
                    let circles = 4 + 0.5;

                    let positions = [-450, 400];

                    var spawnMethod = function (times) {
                        for (let j = 0; j < positions.length; j++) {
                            let addedAngle = [0];

                            for (let i = 0; i < addedAngle.length; i++) {
                                let image = "easter_egg/images/sprites/enemy/bullets/fireball.gif";

                                let bullet = new Bullet(enemy, enemy.attackStat, image);
                                bullet.setX(bullet.getX() - 12 + positions[j]);


                                let velocity = angleToVector((180 + addedAngle[i] + ((times + 1) * ((360 * circles) / shootAmount)) + ((Math.random() * 2 - 1) * 15)) * (j === 1 ? -1 : 1));


                                bullet.setVelocityX(velocity.x * Math.pow(times + 3, 0.45));
                                bullet.setVelocityY(velocity.y * Math.pow(times + 3, 0.45));

                                let ballWidth = 20;
                                bullet.getElement().style.width = (ballWidth / (258 / 122)) + "px";
                                bullet.getElement().style.height = ballWidth + "px";

                                bullet.updateImageAngle(Math.abs(360 - vectorToAngle(bullet.getVelocityX(), bullet.getVelocityY()) - 180));

                                let delta = 0.0;
                                let interval = setInterval(function () {
                                    bullet.setX(bullet.getX() + bullet.getVelocityX());
                                    bullet.setY(bullet.getY() - bullet.getVelocityY());

                                    delta += 0.02;

                                    if (bullet.collidesWithPlayer()) {
                                        bullet.harmPlayer();
                                    }

                                    if (bullet.getX() < 0 + screenPosition.x || bullet.getX() > 1500 + screenPosition.x - 23 || bullet.getY() < 0 + screenPosition.y || bullet.getY() > 720 + screenPosition.y - 27 || local.hasFinished) {
                                        bullet.removeObject();
                                        clearInterval(interval);
                                    }
                                }, 20);
                            }
                        }
                    };

                    let times = 0;
                    let interval = setInterval(function () {
                        if (times++ >= shootAmount || local.hasFinished) {
                            clearInterval(interval);
                            setTimeout(function () {
                                enemy.finishTurn(battle);
                                turn = local.turn;
                            }, 1600);
                        }
                        else {
                            spawnMethod(times);
                        }
                    }, 35);
                    spawnMethod(times);
                    break;
                }

                case 3: {
                    let hasFinished = false;


                    setTimeout(function () {

                        let toothSpawnInterval = setInterval(function () {
                            if (hasFinished) {
                                clearInterval(toothSpawnInterval);
                            }
                            else {

                                let spawnX = screenPosition.x + (750 - 125) + (Math.floor(Math.random() * (250 - 24)));
                                let spawnY = screenPosition.y + 390;

                                let bullet = new Bullet(enemy, this.attackStat, "easter_egg/images/sprites/enemy/bullets/fireball.gif");
                                bullet.setPosition(spawnX, spawnY);

                                let ballWidth = 40;
                                bullet.getElement().style.width = (ballWidth / (258 / 122)) + "px";
                                bullet.getElement().style.height = ballWidth + "px";

                                bullet.setVelocityY(1);

                                bullet.updateImageAngle(180);

                                let delta = 0.0;

                                let toothInterval = setInterval(function () {
                                    let speed = ((Math.pow(delta, 2) * 3.25) + (delta * 7.5));
                                    if (speed > 14)
                                        speed = 14;

                                    bullet.setY(bullet.getY() + (bullet.getVelocityY() * speed));

                                    delta += 0.02;

                                    if (bullet.collidesWithPlayer()) {
                                        bullet.harmPlayer();
                                    }

                                    if (bullet.getX() < 0 + screenPosition.x || bullet.getX() > 1500 + screenPosition.x - 23 || bullet.getY() < 350 + screenPosition.y || bullet.getY() > 720 + screenPosition.y - 27 || hasFinished) {
                                        bullet.removeObject();
                                        bullet = null;
                                        clearInterval(toothInterval);
                                    }
                                }, 20);
                            }
                        }, 110);
                    }, 200);


                    setTimeout(function () {
                        enemy.finishTurn(battle);
                        turn = local.turn;
                        hasFinished = true;
                    }, 6000);

                    break;
                }

                case 4: {
                    let directions = [
                        [1, 0],
                        [-1, 0],
                        [0, 1],
                        [0, -1],
                        [1, 1],
                        [1, -1],
                        [-1, 1],
                        [-1, -1],
                    ];

                    let positions = [
                        [-450, 0],
                        [0, -140],
                        [450, 0],
                    ];

                    let hasFinished = false;

                    let spawnMethod = function (times) {
                        for (let j = 0; j < positions.length; j++) {
                            let angleToAdd = times * 30 + (Math.random() * 2 - 1) * 7;
                            for (let i = 0; i < directions.length; i++) {
                                let direction = normalize(directions[i]);


                                let angle = vectorToAngle(direction[0], direction[1]);
                                if (times > 0) {
                                    angle += angleToAdd;
                                }

                                let bullet = new Bullet(enemy, this.attackStat, "easter_egg/images/sprites/enemy/bullets/fireball.gif");

                                bullet.setPosition(positions[j][0] + (screenPosition.x + 750), positions[j][1] + (screenPosition.y + 360));

                                let ballWidth = 35;
                                bullet.getElement().style.width = (ballWidth / (258 / 122)) + "px";
                                bullet.getElement().style.height = ballWidth + "px";

                                let newVelocity = angleToVector(angle);

                                bullet.setVelocityX(newVelocity.x);
                                bullet.setVelocityY(newVelocity.y);

                                bullet.updateImageAngle(angle + 90);

                                let delta = 0.0;

                                let toothInterval = setInterval(function () {
                                    let speed = ((Math.pow(delta, 2) * 1.35) + (delta / 2));
                                    if (speed > 9)
                                        speed = 9;

                                    bullet.setX(bullet.getX() + (bullet.getVelocityX() * speed));
                                    bullet.setY(bullet.getY() + (bullet.getVelocityY() * speed));

                                    delta += 0.02;

                                    if (bullet.collidesWithPlayer()) {
                                        bullet.harmPlayer();
                                    }

                                    if (bullet.getX() < 0 + screenPosition.x || bullet.getX() > 1500 + screenPosition.x - 23 || bullet.getY() < 0 + screenPosition.y || bullet.getY() > 720 + screenPosition.y - 27 || hasFinished) {
                                        bullet.removeObject();
                                        bullet = null;
                                        clearInterval(toothInterval);
                                    }
                                }, 20);
                            }
                        }
                    };


                    let spawned = 0;

                    let timesId = setInterval(function () {
                        if (hasFinished) {
                            clearInterval(timesId);
                        }
                        else {
                            spawnMethod(++spawned);
                        }
                    }, 830);
                    spawnMethod(0);

                    setTimeout(function () {
                        enemy.finishTurn(battle);
                        turn = local.turn;
                        hasFinished = true;
                    }, 8000);

                    break;
                }

            }
        }, function () {
            //TODO credits
        }, null);

    this.asEnemy = function () {
        return enemy;
    };
};