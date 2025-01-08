const diceValues = 
[
    { id: "d100", sides: 100 },
    { id: "d20", sides: 20 },
    { id: "d12", sides: 12 },
    { id: "d10", sides: 10 },
    { id: "d8", sides: 8 },
    { id: "d6", sides: 6 },
    { id: "d4", sides: 4 }
];
const diceButtons = document.querySelectorAll(".die");
let selectedDice = [];
const results = [];
let finalTotal = 0;
const diceCounter = []; 
const diceCounterDiv = document.getElementById("dice-counter");
const rollButton = document.getElementById("roll");
const resetButton = document.getElementById("reset");
const resultDiv = document.getElementById("result");
const resultBreakdownDiv = document.getElementById("result-breakdown");
const recordedRolls = [];
const saveButton = document.getElementById("save");
const historyList = document.getElementById("history-list");
const savedSection = document.getElementById("saved-section");
let countsString;
const modifierInput = document.getElementById("modifier");
let breakdownText = "";
let modifierText;
let modifierDescription;
let countsArray = [];
let modifierValue;
const diceTray = document.getElementById("tray");
const selectedTrayDice = []; 
const toggleHistory = document.getElementById("toggle-history");
const historySection = document.getElementById("history-section");

updateDiceCounter();
updateHistoryVisibility();

function updateHistoryVisibility()
{
    if(localStorage.getItem("hideHistory") === "true")
        historySection.classList.add("hidden");
    else
        historySection.classList.remove("hidden");
}

function updateDiceCounter()
    {
        if(selectedDice.length===0)
            diceCounterDiv.innerText = "No estás por tirar ningún dado.";
        else 
            {
                const countsObjects = selectedDice.reduce((acc, die) => 
                {
                    acc[die.id] = (acc[die.id] || 0) + 1;
                    return acc;
                }, {});

                countsArray =  Object.entries(countsObjects)
                .map(([id, count]) => 
                {
                    const sides = diceValues.find(die => die.id === id).sides;
                    return {id, count, sides};
                })

                countsString = countsArray
                    .sort((a, b) => b.sides - a.sides)
                    .map(({count, id}) =>
                    {
                        return `${count}d${id.slice(1)}`
                    })
                
                const descriptionText = countsString.join(", ").replace(/, ([^,]*)$/, ' y $1')
    
                modifierDescription = "";
                if(modifierInput.value > 0)
                    modifierDescription = `, sumando ${modifierInput.value}`;
                if(modifierInput.value < 0)
                    modifierDescription = `, restando ${modifierInput.value.slice(1)}`;
    
                diceCounterDiv.innerText = `Estás por tirar ${descriptionText}${modifierDescription}.`;
            }
}

modifierInput.addEventListener("input", (e) => 
    {
        modifierInput.value = modifierInput.value.replace(/[^*/\-+0-9]/g, '');
        modifierValue = Number(modifierInput.value);
        updateDiceCounter();
        if(e.target.value.indexOf("++") !== -1 || e.target.value.indexOf("--") !== -1)
            e.target.value = e.target.value.slice(0, -1);
    });
    
diceButtons.forEach(button => 
    {
        button.addEventListener("click", (e) => 
            {
                selectDice(e)
                addDiceToTray(e);
            });
        button.addEventListener("contextmenu", (e) => 
            {
                removeSelectedDice(e);
                e.preventDefault();
            });
    });

    function selectDice(event, count = 1)
    {
        const rollData = JSON.parse(event.target.getAttribute("data-roll")) || null;

        if(rollData !== null)
        {
            const { countsArray, modifierValue } = rollData;
            selectedDice = [];
            countsArray.forEach(({id, count}) => 
                {
                    const die = diceValues.find(die => die.id === id);
                    for (let i = 0; i < count; i++)
                        selectedDice.push(die);
                });
            
            
            if(modifierValue !== undefined)
                modifierInput.value = modifierValue;
        }
        else
        {
            selectedDice.push(diceValues.find(die => die.id === event.target.id));
            if(event.target.getAttribute("data-modifier") !== undefined)
            {
                modifierInput.value = event.target.getAttribute("data-modifier");
            }
        }
        console.log(selectedDice);
        updateDiceCounter();
    }

rollButton.addEventListener("click", () => 
    { 
        if(selectedDice.length !== 0)
        {
            rollAllDice();
        }
    });

function calculateTotal()
{
    results.length = 0;
    if (Number(modifierInput.value) > 0)
    {
        modifierText = ` + ${modifierInput.value}`;
        resultBreakdownDiv.classList.remove("hidden");
    }
    else if (Number(modifierInput.value) < 0)
    {
        modifierText = ` - ${modifierInput.value.slice(1)}`;
        resultBreakdownDiv.classList.remove("hidden");
    }
    else
    {
        modifierText = "";  
        resultBreakdownDiv.classList.add("hidden");
    }

    const trayDice = document.querySelectorAll(".tray-die-button");
    trayDice.forEach(die => {
        results.push(Number(die.getAttribute("result")));
    });
    console.log(results);
    const diceTotal = results.length !== 0 ? results.reduce((acc, result) => acc + result) : 0;
    finalTotal = diceTotal + Number(modifierInput.value);
    resultDiv.innerText = finalTotal;
    breakdownText = diceTotal + modifierText;
    resultBreakdownDiv.innerText = breakdownText;
    addToHistory();
}

saveButton.addEventListener("click", saveRoll)
function saveRoll()
{
    let modifierText = "";
    if (modifierValue > 0) {
        modifierText = ` + ${modifierValue}`;
    } else if (modifierValue < 0) {
        modifierText = ` - ${Math.abs(modifierValue)}`;
    }

    const displayName = countsString.join(" + ") + modifierText;

    const rollData = JSON.stringify({ countsArray, modifierValue });


    const newSavedRoll = document.createElement("button");
    newSavedRoll.setAttribute("data-roll", rollData); 
    newSavedRoll.innerText = displayName;

    newSavedRoll.addEventListener("click", (e) => selectDice(e));
    newSavedRoll.addEventListener("contextmenu", (e) => {
        removeSavedRoll(e);
        e.preventDefault();
    });
    console.log(newSavedRoll.getAttribute("data-roll"))
    savedSection.querySelectorAll("button").forEach((existingButton) => 
        {
            if(existingButton.getAttribute("data-roll") === newSavedRoll.getAttribute("data-roll"))
                existingButton.remove();
        })
    savedSection.appendChild(newSavedRoll);
}

function addDiceToTray(event)
{
    const rollData = JSON.parse(event.target.getAttribute("data-roll")) || null;

    if(rollData !== null)
    {
        const countsArray = rollData;
        countsArray.forEach(({id, count}) => 
            {
                const die = diceValues.find(die => die.id === id);
                for (let i = 0; i < count; i++)
                    initializeTrayDie(die.id)
            });
    }
    else
        initializeTrayDie(event.target.id);
}

function initializeTrayDie(id)
{
    const newButton = document.createElement("button");
    const newDieImage = document.createElement("img");
    const newDieText = document.createElement("span");

    newButton.classList.add("tray-die-button");
    newButton.addEventListener("click", (e) => 
    {
        rollDie(e);
        calculateTotal();
    })
    newButton.addEventListener("contextmenu", (e) => 
    {
        removeTrayDice(e);
        e.preventDefault();
    });
    newButton.addEventListener("animationend", (e) =>
    {
        newButton.classList.remove("rotate");
    })
    newButton.id = id;
    
    newDieImage.src = `../assets/${id}.png`;
    newDieImage.classList.add("tray-die-image");
    newDieText.innerText = "x";

    diceTray.insertBefore(newButton, diceTray.firstChild);
    newButton.appendChild(newDieImage);
    newButton.appendChild(newDieText);

    rollDie(newButton);
    calculateTotal();
}

function rollDie(eventOrElement)
{
    const target = eventOrElement instanceof Event ? eventOrElement.currentTarget : eventOrElement; 
    target.classList.add("rotate");
    const result = Math.floor(Math.random() * target.id.slice(1)) + 1;
    target.querySelector("span").innerText = result;
    target.setAttribute("result", result);
}

function rollAllDice()
{
    const trayDice = document.querySelectorAll(".tray-die-button");
    trayDice.forEach(button => rollDie(button));
    calculateTotal();
}

//#region Secondary functions 

function removeSavedRoll(event)
{
    event.target.remove();
}

resetButton.addEventListener("click", resetRoll);
function resetRoll()
{
    selectedDice.length = 0;
    modifierInput.value = "";
    diceTray.innerHTML = "";
    updateDiceCounter();
}

function removeSelectedDice(event)
{
    const index = selectedDice.indexOf(event.target.id);
    if(index)
    {
        selectedDice.splice(index, 1);
    }
    updateDiceCounter();
}

function removeTrayDice(event)
{
    removeSelectedDice(event);
    event.currentTarget.remove();
    calculateTotal();
}

function addToHistory()
{
    if(results.length !== 0)
    {
        const newEntry = document.createElement("li");
        historyList.insertBefore(newEntry, historyList.firstChild);
        newEntry.innerText = `${finalTotal} ${Number(breakdownText) === finalTotal ? "" : `(${breakdownText})`}`;
        if(historyList.querySelectorAll("li").length > 10)
        {
            historyList.removeChild(historyList.lastChild);
        }
    }
}

toggleHistory.addEventListener("click", () => 
{
    if(localStorage.getItem("hideHistory") === "false")
        localStorage.setItem("hideHistory", "true");
    else if(localStorage.getItem("hideHistory") === "true")
        localStorage.setItem("hideHistory", "false");

    updateHistoryVisibility();
})
//#endregion