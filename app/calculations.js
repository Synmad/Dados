import * as renderer from "./renderer.js" 
import * as history from "./history.js"
import * as diceSelection from "./diceSelection.js"

let breakdownText = "";
let modifierText;
let finalTotal = 0;
const RESULT_PLACEHOLDER_TEXT = document.getElementById("result-placeholder-text");
const RESULT_DIV = document.getElementById("result-div");
const RESULT_BREAKDOWN_DIV = document.getElementById("result-breakdown");
const RESULTS = [];

export function rollDie(eventOrElement)
{
    const TARGET = eventOrElement instanceof Event ? eventOrElement.currentTarget : eventOrElement; 
    TARGET.classList.add("rotate");
    const RESULT = Math.floor(Math.random() * TARGET.id.slice(1)) + 1;
    TARGET.querySelector("span").innerText = RESULT;
    TARGET.setAttribute("result", RESULT);
}

export function rollAllDice()
{
    const TRAY_DICE = document.querySelectorAll(".tray-die-button");
    TRAY_DICE.forEach(button => rollDie(button));
    calculateTotal();
}

export function calculateTotal()
{
    if(diceSelection.hasSelected)
    {
        RESULT_DIV.classList.remove("removed");
        RESULT_PLACEHOLDER_TEXT.classList.add("removed");
    }
    else RESULT_DIV.classList.add("removed");

    RESULTS.length = 0;
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

    const TRAY_DICE = document.querySelectorAll(".tray-die-button");
    TRAY_DICE.forEach(die => {
        RESULTS.push(Number(die.getAttribute("result")));
    });
    console.log(RESULTS);
    const DICE_TOTAL = RESULTS.length !== 0 ? RESULTS.reduce((acc, result) => acc + result) : 0;
    finalTotal = DICE_TOTAL + Number(renderer.MODIFIER_INPUT.value);
    RESULT_DIV.innerText = finalTotal;
    breakdownText = DICE_TOTAL + modifierText;
    RESULT_BREAKDOWN_DIV.innerText = breakdownText;

    if(RESULTS.length !== 0)
    {
        history.addToHistory(finalTotal, breakdownText);
    }
}