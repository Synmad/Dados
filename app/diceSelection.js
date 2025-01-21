import * as diceCounter from "./diceCounter.js"
import * as renderer from "./renderer.js"
import * as diceTray from "./diceTray.js"

export let hasSelected = false;

export let selectedDice = [];

export function selectDice(button, count = 1)
{
    hasSelected = true;

    const ROLL_DATA = JSON.parse(button.getAttribute("data-roll")) || null;

    if(ROLL_DATA !== null)
    {
        console.log(ROLL_DATA);
        const { countsArray, modifierValue } = ROLL_DATA;
        diceCounter.updateCountsArray(countsArray);
        selectedDice = [];
        countsArray.forEach(({id, count}) => 
            {
                const die = renderer.diceValues.find(die => die.id === id);
                for (let i = 0; i < count; i++)
                    selectedDice.push(die);
            });
        
        if(modifierValue !== undefined)
            renderer.MODIFIER_INPUT.value = modifierValue;
    }
    else
    {
        console.log(button);
        selectedDice.push(renderer.diceValues.find(die => die.id === button.id));
        if(button.getAttribute("data-modifier") !== undefined)
        {
            renderer.MODIFIER_INPUT.value = button.getAttribute("data-modifier");
        }
    }
    console.log(selectedDice);
    diceCounter.updateDiceCounter();
    diceTray.addDiceToTray(button);
}

export function removeSelectedDice(button)
{
    const index = selectedDice.indexOf(button.id);
    if(index)
    {
        selectedDice.splice(index, 1);
    }
    diceCounter.updateDiceCounter();
}