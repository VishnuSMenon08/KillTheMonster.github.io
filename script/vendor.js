const attackBtn = document.getElementById('atk-btn');
const chargeBtn = document.getElementById('charge-btn');
const healBtn = document.getElementById('heal-btn');
const strAttackBtn = document.getElementById('str-atk-btn');
const playerLogBtn = document.getElementById('player-log');
const monsterLogBtn = document.getElementById('monster-log')

const monsterHealthBar = document.getElementById('progress-bar-mn');
const playerHealthBar = document.getElementById('progress-bar-pl');

const playerLogContainer = document.getElementById("player-log-cnt");
const monsterLogContainer = document.getElementById("monster-log-cnt");

const plAttLogTable = document.getElementById('player-att-log');
const plDefLogTable = document.getElementById('player-def-log');
const mnAttLogTable = document.getElementById('monster-att-log');
const mnDefLogTable = document.getElementById('monster-def-log');

function updateHealth(entityHealthBar,healthPts){
    maxHealth = parseInt(entityHealthBar.getAttribute('aria-valuemax'));
    healthPercentage = Math.round((healthPts/maxHealth)*100);
    entityHealthBar.setAttribute('aria-valuenow',healthPts);
    entityHealthBar.style.width = `${healthPercentage}%`;
    updateProgressBarStyle(entityHealthBar,healthPercentage);
}

function updateProgressBarStyle(entityHealthBar,healthPercentage){
    if (healthPercentage <= 25){
        entityHealthBar.classList.remove('bg-success');
        entityHealthBar.classList.remove('bg-warning');
        entityHealthBar.classList.add('bg-danger');
    }else if(healthPercentage <= 50){
        entityHealthBar.classList.replace('bg-success','bg-warning');
    }else{
        entityHealthBar.classList.remove('bg-danger');
        entityHealthBar.classList.remove('bg-warning');
        entityHealthBar.classList.add('bg-success'); 
    }
}

function alertGameOver(healthBar){
    if(healthBar.getAttribute("id").includes("pl")){
        alert("GAME OVER : You LOST !!!");
        location.reload();
    }else{
        alert("GAME OVER : You WON !!!");
        location.reload();
    }
}

function toggleUserButtons(active){
    if(active){
        attackBtn.disabled = false;
        healBtn.disabled = false;
        strAttackBtn.disabled = false;

    }else{
        attackBtn.disabled = true;
        healBtn.disabled = true;
        strAttackBtn.disabled = true;
    }
}

function logToConsole(entity,consoleType,message){
    let myTable
    if(entity === 'player'){
        if(consoleType === 'defense'){
            myTable = plDefLogTable;
        }else if(consoleType === 'attack'){
            myTable = plAttLogTable;
        }
    }else{
        if(consoleType === 'defense'){
            myTable = mnDefLogTable;
        }else if(consoleType === 'attack'){
            myTable = mnAttLogTable;
        }
    }
    let tBody = myTable.tBodies[0];
    let tr = tBody.insertRow(-1);
    let td = document.createElement('td');
    let span = document.createElement('span');
    span.classList.add('log-line-item');
    td.classList.add('log-item-para');
    span.innerHTML = ">> "+message;
    td.appendChild(span)
    tr.appendChild(td);
}

function toggleLog(entity) {

    const isPlayer = () => {
        if(entity === "PLAYER"){
            return true
        }
    }
    let logContainer = isPlayer()?playerLogContainer: monsterLogContainer
    console.log(logContainer)
    if (logContainer.classList.contains("active")) {
        logContainer.classList.remove("active");
        logContainer.classList.add("hidden");
    } else {
        logContainer.classList.remove("hidden");
        logContainer.classList.add("active");
    }
}