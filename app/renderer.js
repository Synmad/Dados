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

updateDiceCounter();

diceButtons.forEach(button => 
    {
        button.addEventListener("click", (e) => selectDice(e));
        button.addEventListener("contextmenu", (e) => 
            {
                removeDice(e);
                e.preventDefault();
            });
    });

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
            
            diceCounterDiv.innerText = `Estás por tirar ${descriptions.join(", ").replace(/, ([^,]*)$/, ' y $1')}.`;
        }
    console.log(selectedDice);
}

function calculateRolls()
{
    const diceSizes = selectedDice.map(die => 
        diceValues.find(newDie => newDie.id === die.id).sides);
    for(let i = 0; i < diceSizes.length; i++)
        results.push(Math.floor(Math.random() * diceSizes[i]) + 1);
    total = results.reduce((acc, result) => acc + result);

    resultBreakdownDiv.innerText = results.join(" + "); 
    resultDiv.innerText = total;
}

resetButton.addEventListener("click", resetSelected);
function resetSelected()
{
    selectedDice.length = 0;
    updateDiceCounter();
}

function resetResults()
{
    results.length = 0;
}

rollButton.addEventListener("click", () => 
    { 
        if(selectedDice.length !== 0)
        {
            addToHistory();
            calculateRolls();
        }
    });

function addToHistory()
{
    if(results.length !== 0)
    {
        const newEntry = document.createElement("li");
        historyList.insertBefore(newEntry, historyList.firstChild);
        newEntry.innerText = `${total} (${results.join(" + ")})`
        resetResults();
        if(historyList.querySelectorAll("li").length > 10)
        {
            historyList.removeChild(historyList.lastChild);
        }
    }
}

function selectDice(event)
{
    selectedDice.push(diceValues.find(die => die.id === event.target.id));
    updateDiceCounter();
}

function removeDice(event)
{
    const index = selectedDice.indexOf(event.target.id);
    if(index)
        selectedDice.splice(index, 1);
    updateDiceCounter();
}

saveButton.addEventListener("click", saveRoll)
function saveRoll()
{
    const newSavedRollId = descriptions.join(" + ");
    savedSection.querySelectorAll("button").forEach((existingButton) => 
    {
        if(existingButton.getAttribute("id") === newSavedRollId)
            existingButton.remove();
    })
    const newSavedRoll = document.createElement("button");
    newSavedRoll.setAttribute("id", newSavedRollId)
    newSavedRoll.innerText = newSavedRollId;
    newSavedRoll.addEventListener("click", (e) => selectDice(e));
    newSavedRoll.addEventListener("contextmenu", (e) =>
        {
            removeSavedRoll(e);
            e.preventDefault();
        });
    savedSection.appendChild(newSavedRoll);
}

function removeSavedRoll(event)
{
    event.target.remove();
}
