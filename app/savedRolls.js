import * as diceCounter from "./diceCounter.js"
import * as diceSelection from "./diceSelection.js"
import * as renderer from "./renderer.js"
import * as calculations from "./calculations.js"

const SAVED_SECTION = document.getElementById("saved-section");
const SAVED_ROLLS = [];

export function saveRoll(modifierValue)
{
    let modifierText = "";
    if (modifierValue > 0) {
        modifierText = ` + ${modifierValue}`;
    } else if (modifierValue < 0) {
        modifierText = ` - ${Math.abs(modifierValue)}`;
    }

    const DISPLAY_NAME = diceCounter.countsString.join(" + ") + modifierText;

    const ROLL_DATA = JSON.stringify({ countsArray: diceCounter.countsArray, modifierValue });

    createSavedRollButton(ROLL_DATA, DISPLAY_NAME);
    
    SAVED_ROLLS.push({ rollData: ROLL_DATA, displayName: DISPLAY_NAME });
    localStorage.setItem("savedRolls", JSON.stringify(SAVED_ROLLS));
}

function removeSavedRoll(event)
{
    const ROLL_DATA = event.target.getAttribute("data-roll");
    event.target.remove();

    const ROLLS_IN_STORAGE = JSON.parse(localStorage.getItem("savedRolls") || "[]");
    const UPDATED_STORAGE = ROLLS_IN_STORAGE.filter((roll) => roll.rollData !== ROLL_DATA);
    localStorage.setItem("savedRolls", JSON.stringify(UPDATED_STORAGE));
}

export function loadSavedRolls()
{
    const ROLLS_IN_STORAGE = JSON.parse(localStorage.getItem("savedRolls") || "[]");

    ROLLS_IN_STORAGE.forEach(({rollData, displayName}) => createSavedRollButton(rollData, displayName, false))
}

function createSavedRollButton(rollData, displayName, checkForRepeats = true)
{
    const NEW_SAVED_ROLL = document.createElement("button");
    NEW_SAVED_ROLL.setAttribute("data-roll", rollData);
    NEW_SAVED_ROLL.innerText = displayName;

    NEW_SAVED_ROLL.addEventListener("click", (e) => 
        {
            renderer.resetRoll();
            diceSelection.selectDice(e);
            calculations.rollAllDice();
        });
    NEW_SAVED_ROLL.addEventListener("contextmenu", (e) => 
        {
            removeSavedRoll(e);
            e.preventDefault();
        });

    if(checkForRepeats)
        SAVED_SECTION.querySelectorAll("button").forEach((existingButton) => 
            {
                if(existingButton.getAttribute("data-roll") === NEW_SAVED_ROLL.getAttribute("data-roll"))
                    existingButton.remove();
            })

    SAVED_SECTION.appendChild(NEW_SAVED_ROLL);
}