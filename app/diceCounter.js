import * as renderer from "./renderer.js"
import * as diceSelection from "./diceSelection.js"

export let countsArray = [];
export let countsString;
let modifierDescription;

export function updateCountsArray(newCountsArray)
{
    countsArray = newCountsArray;
}

export function updateDiceCounter()
    {
        if(diceSelection.selectedDice.length===0)
            renderer.diceCounterDiv.innerText = "No estás por tirar ningún dado.";
        else 
            {
                const countsObjects = diceSelection.selectedDice.reduce((acc, die) => 
                {
                    acc[die.id] = (acc[die.id] || 0) + 1;
                    return acc;
                }, {});

                countsArray =  Object.entries(countsObjects)
                .map(([id, count]) => 
                {
                    const sides = renderer.diceValues.find(die => die.id === id).sides;
                    return {id, count, sides};
                })

                countsString = countsArray
                    .sort((a, b) => b.sides - a.sides)
                    .map(({count, id}) =>
                    {
                        return `${count}d${id.slice(1)}`
                    })
                
                const descriptionText = countsString.join(", ").replace(/, ([^,]*)$/, ' y $1')
    
                modifierDescription = "";
                if(renderer.modifierValue > 0)
                    modifierDescription = `, sumando ${renderer.modifierValue}`;
                if(renderer.modifierValue < 0)
                    modifierDescription = `, restando ${renderer.modifierValue.slice(1)}`;
    
                renderer.diceCounterDiv.innerText = `Estás por tirar ${descriptionText}${modifierDescription}.`;
            }
}