const attackPts = 15;
const strAttackPts = 30;
const minAttPower = 90;
const maxAttPower = 100;
const minRecoveryHealth = 30;
const maxRecoveryHealth = 40;
const movesArr = ["ATTACK", "STRONG ATTACK", "HEAL", "CHARGE"];

let moveLog = {
    player: [],
    monster: [],
};

let counterEntity = { player: "monster", monster: "player" };

let fnMap = {
    ATTACK: {
        launch: attack,
        healthBar: playerHealthBar,
    },
    "STRONG ATTACK": {
        launch: strongAttack,
        healthBar: playerHealthBar,
    },
    HEAL: {
        launch: heal,
        healthBar: monsterHealthBar,
    },
    CHARGE: {
        launch: charge,
        healthBar: monsterHealthBar,
    },
};

function generateRandVal(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function generateAttackPower(attackPts) {
    let powerGrade = generateRandVal(minAttPower, maxAttPower) / 100;
    return Math.round(attackPts * powerGrade);
}

function killHealth(attPower, defHealthBar) {
    currentHealth = parseInt(defHealthBar.getAttribute("aria-valuenow"));
    currentHealth -= attPower;
    if (currentHealth < 0) {
        currentHealth = 0;
        updateHealth(defHealthBar, currentHealth);
        alertGameOver(defHealthBar);
        return;
    }
    updateHealth(defHealthBar, currentHealth);
}

function generateRecoveryHealth(healthBar) {
    currentHealth = parseInt(healthBar.getAttribute("aria-valuenow"));
    hpRecoveryFactor =
        generateRandVal(minRecoveryHealth, maxRecoveryHealth) / 100;
    currentHealth += Math.round(currentHealth * hpRecoveryFactor);
    if (currentHealth > parseInt(healthBar.getAttribute("aria-valuemax"))) {
        currentHealth = parseInt(healthBar.getAttribute("aria-valuemax"));
    }
    updateHealth(healthBar, currentHealth);
    return currentHealth * hpRecoveryFactor;
}

function launchMove(entity, attackType, attackPts, entityHealthBar) {
    let logMessage = `<strong>${entity}</strong> used <strong>${attackType}</strong>`;
    logToConsole(entity, "attack", logMessage);
    switch (attackType) {
        case "ATTACK":
        case "STRONG ATTACK":
            attackPower = generateAttackPower(attackPts);
            killHealth(attackPower, entityHealthBar);
            logMessage = `<strong>${counterEntity[entity]}</strong> lost ${attackPower} HP`;
            logToConsole(counterEntity[entity], "defense", logMessage);

            if (entity === "player" && attackType === "STRONG ATTACK") {
                toggleUserButtons((active = false));
                logToConsole(entity, "defense", "Requires to Charge!");
            }
            break;
        case "HEAL":
            recoveredHp = generateRecoveryHealth(entityHealthBar);
            logMessage = `Recovered <strong>${recoveredHp}</strong>HP`;
            logToConsole(entity, "defense", logMessage);
            break;
        case "CHARGE":
            logMessage = "All attacks CHARGED!";
            logToConsole(entity, "attack", logMessage);
            if (entity === "player") {
                toggleUserButtons((active = true));
            }
            break;
    }
    moveLog[entity].push(attackType);
    console.log(moveLog);
    if (entity === "player") {
        sleep(1000).then(() => {
            loadMonsterMove();
        });
    }
}

function loadMonsterMove() {
    previousMove = moveLog?.monster[moveLog.monster.length - 1];
    console.log(`previous move ${previousMove}`);
    if (previousMove === "STRONG ATTACK") {
        attackType = "CHARGE";
        attackBlueprint = fnMap[attackType];
        attackBlueprint.launch(
            (mode = null),
            (entity = "monster"),
            (healthBar = attackBlueprint.healthBar)
        );
        logMessage = "All attacks CHARGED!";
        logToConsole("monster", "attack", logMessage);
    } else {
        attackType = movesArr[generateRandVal(0, movesArr.length - 1)];
        console.log(attackType);
        attackBlueprint = fnMap[attackType];
        attackBlueprint.launch(
            (mode = null),
            (entity = "monster"),
            (healthBar = attackBlueprint.healthBar)
        );
    }
}

function attack(mode = null, entity = "player", healthBar = monsterHealthBar) {
    attackType = movesArr[0];
    console.log(`entity ${entity} used attackType : ${attackType}`);
    launchMove(entity, attackType, attackPts, healthBar);
}

function strongAttack(
    mode = null,
    entity = "player",
    healthBar = monsterHealthBar
) {
    attackType = movesArr[1];
    console.log(`entity ${entity} used attackType : ${attackType}`);
    launchMove(entity, attackType, strAttackPts, healthBar);
}

function heal(mode = null, entity = "player", healthBar = playerHealthBar) {
    attackType = movesArr[2];
    console.log(`entity ${entity} used attackType : ${attackType}`);
    launchMove(entity, attackType, strAttackPts, healthBar);
}

function charge(mode = null, entity = "player", healthBar = playerHealthBar) {
    attackType = movesArr[3];
    console.log(`entity ${entity} used attackType : ${attackType}`);
    launchMove(entity, attackType, strAttackPts, healthBar);
}

attackBtn.addEventListener("click", attack);
strAttackBtn.addEventListener("click", strongAttack);
healBtn.addEventListener("click", heal);
chargeBtn.addEventListener("click", charge);
playerLogBtn.addEventListener("click", () => {toggleLog("PLAYER")});
monsterLogBtn.addEventListener("click", () => {toggleLog("MONSTER")});
