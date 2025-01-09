import * as renderer from "./renderer.js" 
import * as history from "./history.js"

let breakdownText = "";
let modifierText;
let finalTotal = 0;
const resultDiv = document.getElementById("result");
const RESULT_BREAKDOWN_DIV = document.getElementById("result-breakdown");
const results = [];

export function rollDie(eventOrElement)
{
    const target = eventOrElement instanceof Event ? eventOrElement.currentTarget : eventOrElement; 
    target.classList.add("rotate");
    const result = Math.floor(Math.random() * target.id.slice(1)) + 1;
    target.querySelector("span").innerText = result;
    target.setAttribute("result", result);
}

export function rollAllDice()
{
    const trayDice = document.querySelectorAll(".tray-die-button");
    trayDice.forEach(button => rollDie(button));
    calculateTotal();
}

export function calculateTotal()
{
    results.length = 0;
    if (Number(renderer.MODIFIER_INPUT.value) > 0)
    {
        modifierText = ` + ${renderer.MODIFIER_INPUT.value}`;
        RESULT_BREAKDOWN_DIV.classList.remove("hidden");
    }
    else if (Number(renderer.MODIFIER_INPUT.value) < 0)
    {
        modifierText = ` - ${renderer.MODIFIER_INPUT.value.slice(1)}`;
        RESULT_BREAKDOWN_DIV.classList.remove("hidden");
    }
    else
    {
        modifierText = "";  
        RESULT_BREAKDOWN_DIV.classList.add("hidden");
    }

    const trayDice = document.querySelectorAll(".tray-die-button");
    trayDice.forEach(die => {
        results.push(Number(die.getAttribute("result")));
    });
    console.log(results);
    const diceTotal = results.length !== 0 ? results.reduce((acc, result) => acc + result) : 0;
    finalTotal = diceTotal + Number(renderer.MODIFIER_INPUT.value);
    resultDiv.innerText = finalTotal;
    breakdownText = diceTotal + modifierText;
    RESULT_BREAKDOWN_DIV.innerText = breakdownText;

    if(results.length !== 0)
    {
        history.addToHistory(finalTotal, breakdownText);
    }
}