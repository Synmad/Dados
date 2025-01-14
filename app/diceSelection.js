import * as diceCounter from "./diceCounter.js"
import * as renderer from "./renderer.js"
import * as diceTray from "./diceTray.js"

export let selectedDice = [];

export function selectDice(event, count = 1)
{
    const ROLL_DATA = JSON.parse(event.target.getAttribute("data-roll")) || null;

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
        selectedDice.push(renderer.diceValues.find(die => die.id === event.target.id));
        if(event.target.getAttribute("data-modifier") !== undefined)
        {
            renderer.MODIFIER_INPUT.value = event.target.getAttribute("data-modifier");
        }
    }
    console.log(selectedDice);
    diceCounter.updateDiceCounter();
    diceTray.addDiceToTray(event);
}

export function removeSelectedDice(event)
{
    const index = selectedDice.indexOf(event.target.id);
    if(index)
    {
        selectedDice.splice(index, 1);
    }
    diceCounter.updateDiceCounter();
}