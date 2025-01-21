import * as renderer from "./renderer.js"
import * as calculations from "./calculations.js"
import * as diceSelection from "./diceSelection.js"

export function addDiceToTray(button)
{
    const ROLL_DATA = JSON.parse(button.getAttribute("data-roll")) || null;
    console.log(ROLL_DATA);
    if(ROLL_DATA !== null)
    {
        console.log("ROLL_DATA is not null");
        const COUNTS_ARRAY = ROLL_DATA.countsArray;
        COUNTS_ARRAY.forEach(({id, count}) => 
            {
                const DIE = renderer.diceValues.find(die => die.id === id);
                for (let i = 0; i < count; i++)
                    initializeTrayDie(DIE.id)
            });
    }
    else
        initializeTrayDie(button.id);
}

function initializeTrayDie(id)
{
    const NEW_BUTTON = document.createElement("button");
    const NEW_BUTTON_IMAGE = document.createElement("img");
    const NEW_DIE_TEXT = document.createElement("span");

    NEW_BUTTON.classList.add("tray-die-button");
    NEW_BUTTON.addEventListener("click", (e) => 
    {
        calculations.rollDie(e);
        calculations.calculateTotal();
    })
    NEW_BUTTON.addEventListener("contextmenu", (e) => 
    {
        removeTrayDice(e);
        diceSelection.removeSelectedDice(e.currentTarget);
        e.preventDefault();
    });
    NEW_BUTTON.addEventListener("animationend", (e) =>
    {
        NEW_BUTTON.classList.remove("rotate");
    })
    NEW_BUTTON.id = id;
    
    NEW_BUTTON_IMAGE.src = `../assets/${id}.png`;
    NEW_BUTTON_IMAGE.classList.add("tray-die-image");
    NEW_DIE_TEXT.innerText = "x";

    renderer.diceTrayDiv.insertBefore(NEW_BUTTON, renderer.diceTrayDiv.firstChild);
    NEW_BUTTON.appendChild(NEW_BUTTON_IMAGE);
    NEW_BUTTON.appendChild(NEW_DIE_TEXT);

    calculations.rollDie(NEW_BUTTON);
    calculations.calculateTotal();
}

export function removeTrayDice(button)
{
    if(button.currentTarget)
    {
        button.currentTarget.remove();
    }
    else
    {
        const TRAY_DICE = document.querySelectorAll(".tray-die-button");
        const DIE_TO_REMOVE = Array.from(TRAY_DICE).find((dice) => dice.id === button.id);
        DIE_TO_REMOVE.remove();
    }
    calculations.calculateTotal();
}