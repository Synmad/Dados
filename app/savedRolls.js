import * as diceCounter from "./diceCounter.js"
import * as diceSelection from "./diceSelection.js"
import * as renderer from "./renderer.js"
import * as calculations from "./calculations.js"

const SAVED_SECTION = document.getElementById("saved-section");

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

    const NEW_SAVED_ROLL = document.createElement("button");
    NEW_SAVED_ROLL.setAttribute("data-roll", ROLL_DATA); 
    NEW_SAVED_ROLL.innerText = DISPLAY_NAME;

    NEW_SAVED_ROLL.addEventListener("click", (e) => 
        {
            renderer.resetRoll();
            diceSelection.selectDice(e);
            calculations.rollAllDice();
        });
    NEW_SAVED_ROLL.addEventListener("contextmenu", (e) => {
        removeSavedRoll(e);
        e.preventDefault();
    });
    SAVED_SECTION.querySelectorAll("button").forEach((existingButton) => 
        {
            if(existingButton.getAttribute("data-roll") === NEW_SAVED_ROLL.getAttribute("data-roll"))
                existingButton.remove();
        })
    SAVED_SECTION.appendChild(NEW_SAVED_ROLL);
}

function removeSavedRoll(event)
{
    event.target.remove();
}