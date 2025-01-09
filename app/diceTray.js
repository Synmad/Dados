import * as renderer from "./renderer.js"
import * as calculations from "./calculations.js"

export function addDiceToTray(event)
{
    const ROLL_DATA = JSON.parse(event.target.getAttribute("data-roll")) || null;
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
        initializeTrayDie(event.target.id);
}

function initializeTrayDie(id)
{
    const NEW_BUTTON = document.createElement("button");
    const NEW_BUTTON_IMAGE = document.createElement("img");
    const NEW_DIE_TEXT = document.createElement("span");

    NEW_BUTTON.classList.add("tray-die-button");
    NEW_BUTTON.addEventListener("click", (e) => 
    {
        renderer.rollDie(e);
        calculations.calculateTotal();
    })
    NEW_BUTTON.addEventListener("contextmenu", (e) => 
    {
        removeTrayDice(e);
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

function removeTrayDice(event)
{
    renderer.removeSelectedDice(event);
    event.currentTarget.remove();
    calculations.calculateTotal();
}