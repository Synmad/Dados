import * as diceTray from "./diceTray.js"
import * as diceCounter from "./diceCounter.js"
import * as calculations from "./calculations.js"
import * as diceSelection from "./diceSelection.js"
import * as savedRolls from "./savedRolls.js"

export const diceValues = 
[
    { id: "d100", sides: 100 },
    { id: "d20", sides: 20 },
    { id: "d12", sides: 12 },
    { id: "d10", sides: 10 },
    { id: "d8", sides: 8 },
    { id: "d6", sides: 6 },
    { id: "d4", sides: 4 }
];
const DICE_BUTTONS = document.querySelectorAll(".die");
export const diceCounterDiv = document.getElementById("dice-counter");
const ROLL_BUTTON = document.getElementById("roll");
const RESET_BUTTON = document.getElementById("reset");
export const MODIFIER_INPUT = document.getElementById("modifier");
export let modifierValue;
export const diceTrayDiv = document.getElementById("tray");
const SAVE_BUTTON = document.getElementById("save");

diceCounter.updateDiceCounter();

SAVE_BUTTON.addEventListener("click", (e) => 
{
    savedRolls.saveRoll(modifierValue)
})

MODIFIER_INPUT.addEventListener("input", (e) => 
    {
        MODIFIER_INPUT.value = MODIFIER_INPUT.value.replace(/[^*/\-+0-9]/g, '');
        modifierValue = Number(MODIFIER_INPUT.value);
        diceCounter.updateDiceCounter();
        if(e.target.value.indexOf("++") !== -1 || e.target.value.indexOf("--") !== -1)
            e.target.value = e.target.value.slice(0, -1);
    });
    
DICE_BUTTONS.forEach(button => 
    {
        button.addEventListener("click", (e) => 
            {
                diceSelection.selectDice(e);
            });
        button.addEventListener("contextmenu", (e) => 
            {
                diceSelection.removeSelectedDice(e);
                e.preventDefault();
            });
    });

ROLL_BUTTON.addEventListener("click", () => 
    { 
        if(diceSelection.selectedDice.length !== 0)
            calculations.rollAllDice();
    });

RESET_BUTTON.addEventListener("click", resetRoll);
export function resetRoll()
{
    diceSelection.selectedDice.length = 0;
    MODIFIER_INPUT.value = "";
    diceTrayDiv.innerHTML = "";
    diceCounter.updateDiceCounter();
}