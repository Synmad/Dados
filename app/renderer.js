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
const selectedDice = [];
const results = [];
let total = 0;
const diceCounter = []; 
const diceCounterDiv = document.getElementById("dice-counter");
const rollButton = document.getElementById("roll");
const resetButton = document.getElementById("reset");
const resultDiv = document.getElementById("result");
const resultBreakdownDiv = document.getElementById("result-breakdown");
const recordedRolls = [];
const saveButton = document.getElementById("save");
const historyList = document.getElementById("history");
const savedSection = document.getElementById("saved-section");
let descriptions;
const modifierInput = document.getElementById("modifier");
let breakdownText = "";
let modifierText;
let modifierDescription;

updateDiceCounter();

function updateDiceCounter()
    {
        if(selectedDice.length===0)
            diceCounterDiv.innerText = "No estás por tirar ningún dado.";
        else 
            {
                const counts = selectedDice.reduce((acc, die) => 
                {
                    acc[die.id] = (acc[die.id] || 0) + 1;
                    return acc;
                }, {});
        
                descriptions = Object.entries(counts)
                    .map(([id, count]) => 
                    {
                        const sides = diceValues.find(die => die.id === id).sides;
                        return {id, count, sides};
                    })
                    .sort((a, b) => b.sides - a.sides)
                    .map(({count, id}) =>
                    {
                        return `${count}d${id.slice(1)}`
                    })
                
                const descriptionText = descriptions.join(", ").replace(/, ([^,]*)$/, ' y $1')
    
                modifierDescription = "";
                if(modifierInput.value > 0)
                    modifierDescription = `, sumando ${modifierInput.value}`;
                if(modifierInput.value < 0)
                    modifierDescription = `, restando ${modifierInput.value.slice(1)}`;
    
                diceCounterDiv.innerText = `Estás por tirar ${descriptionText}${modifierDescription}.`;
            }
        console.log(selectedDice);
}

modifierInput.addEventListener("input", (e) => 
    {
        modifierInput.value = modifierInput.value.replace(/[^*/\-+0-9]/g, '');
        updateDiceCounter();
        if(e.target.value.indexOf("++") !== -1 || e.target.value.indexOf("--") !== -1)
            e.target.value = e.target.value.slice(0, -1);
    });
    
diceButtons.forEach(button => 
    {
        button.addEventListener("click", (e) => selectDice(e));
        button.addEventListener("contextmenu", (e) => 
            {
                removeDice(e);
                e.preventDefault();
            });
    });

function selectDice(event)
{
    selectedDice.push(diceValues.find(die => die.id === event.target.id));
    console.log(event.target.id);
    if(event.target.getAttribute("data-modifier") !== undefined)
    {
        modifierInput.value = event.target.getAttribute("data-modifier");
    }

    updateDiceCounter();
}

rollButton.addEventListener("click", () => 
    { 
        if(selectedDice.length !== 0)
        {
            addToHistory();
            calculateRolls();
        }
    });

function calculateRolls()
{
    const diceSizes = selectedDice.map(die => 
        diceValues.find(newDie => newDie.id === die.id).sides);
    for(let i = 0; i < diceSizes.length; i++)
        results.push(Math.floor(Math.random() * diceSizes[i]) + 1);
    total = (results.reduce((acc, result) => acc + result) + Number(modifierInput.value));

    if (Number(modifierInput.value) > 0)
        modifierText = ` + ${modifierInput.value}`;
    else if (Number(modifierInput.value) < 0)
        modifierText = ` - ${modifierInput.value.slice(1)}`;
    else
    modifierText = "";  

    breakdownText = results.join(" + ") + modifierText;
    resultBreakdownDiv.innerText = breakdownText;
    resultDiv.innerText = total;
}

saveButton.addEventListener("click", saveRoll)
function saveRoll()
{
    const modifierValue = Number(modifierInput.value);

    if (modifierValue > 0)
        modifierText = ` + ${modifierValue}`;
    else if (modifierValue < 0)
        modifierText = ` - ${Math.abs(modifierValue)}`;
    else
    modifierText = "";
    const rollData = JSON.stringify
        ({
            dice: selectedDice.map(die => die.id),
            modifier: modifierValue
        });
    
    const displayName = descriptions.join(" + ") + modifierText;

    // savedSection.querySelectorAll("button").forEach((existingButton) => 
    // {
    //     if(existingButton.getAttribute("id") === diceRoll)
    //         existingButton.remove();
    // })
    const newSavedRoll = document.createElement("button");
    newSavedRoll.setAttribute("data-roll", rollData);
    newSavedRoll.innerText = displayName;
    newSavedRoll.addEventListener("click", (e) => selectDice(e));
    newSavedRoll.addEventListener("contextmenu", (e) =>
        {
            removeSavedRoll(e);
            e.preventDefault();
        });
    savedSection.appendChild(newSavedRoll);
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
    updateDiceCounter();
}

function resetResults()
{
    results.length = 0;
}

function removeDice(event)
{
    const index = selectedDice.indexOf(event.target.id);
    if(index)
        selectedDice.splice(index, 1);
    updateDiceCounter();
}


function addToHistory()
{
    if(results.length !== 0)
    {
        const newEntry = document.createElement("li");
        historyList.insertBefore(newEntry, historyList.firstChild);
        newEntry.innerText = `${total} (${breakdownText})`
        resetResults();
        if(historyList.querySelectorAll("li").length > 10)
        {
            historyList.removeChild(historyList.lastChild);
        }
    }
}
//#endregion