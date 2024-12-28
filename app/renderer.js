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
const diceCounter = []; 
const diceCounterDiv = document.getElementById("dice-counter");
const rollButton = document.getElementById("roll");
const resetButton = document.getElementById("reset");
const resultDiv = document.getElementById("result");
const resultBreakdownDiv = document.getElementById("result-breakdown");
const recordedRolls = [];
const saveButton = document.getElementById("save");
const historyList = document.getElementById("history");

updateDiceCounter();

diceButtons.forEach(button => 
    {
        button.addEventListener("click", (e) =>
        {
            selectedDice.push(diceValues.find(die => die.id === e.target.id));
            updateDiceCounter();
        })
    })

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
    
            const descriptions = Object.entries(counts)
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
}

function calculateRolls()
{
    const results = []
    const diceSizes = selectedDice.map(die => 
        diceValues.find(newDie => newDie.id === die.id).sides);
    for(let i = 0; i < diceSizes.length; i++)
        results.push(Math.floor(Math.random() * diceSizes[i]) + 1);
    const total = results.reduce((acc, result) => acc + result);

    addToHistory(total, results);
    resultBreakdownDiv.innerText = results.join(" + "); 
    resultDiv.innerText = total;
}

resetButton.addEventListener("click", reset);
function reset()
{
    selectedDice.length = 0;
    updateDiceCounter();
}

rollButton.addEventListener("click", () => 
    { 
        calculateRolls();
        reset();
    });

function addToHistory(total, results)
{
    const newEntry = document.createElement("li");
    historyList.insertBefore(newEntry, historyList.firstChild);
    newEntry.innerText = `${total} (${results.join(" + ")})`
    if(historyList.querySelectorAll("li").length > 10)
    {
        historyList.removeChild(historyList.lastChild);
    }
}

saveButton.addEventListener("click", save)
function save()
{

}
