import * as diceCounter from "./diceCounter.js"

export const translations = 
{
    en:
    {
        "result-placeholder-text": `Choose your dice with the buttons below. <hr />When you're ready, press "Roll".`,
        "roll-button": "Roll",
        "reset-button": "Reset roll",
        "save-button": "Save roll",
        "toggle-history-button": "Toggle history visibility",
        "saved-header-text": "Saved rolls",
        "history-header-text": "History",
        "dice-counter-empty": "You haven't selected any dice.",
        "dice-counter-add": "adding",
        "dice-counter-substract": "substracting",
        "dice-counter-intro": "You're about to roll",
        "dice-counter-conjunction": "and"
    },
    es:
    {
        "result-placeholder-text": `Elegí tus dados usando los botones de abajo. <hr />Cuando estés listo, seleccioná "Tirar".`,
        "roll-button": "Tirar",
        "reset-button": "Reiniciar tirada",
        "save-button": "Guardar tirada",
        "toggle-history-button": "Cambiar visibilidad del historial",
        "saved-header-text": "Tiradas guardadas",
        "history-header-text": "Historial",
        "dice-counter-empty": "No estás por tirar ningún dado.",
        "dice-counter-add": "sumando",
        "dice-counter-substract": "restando",
        "dice-counter-intro": "Estás por tirar",
        "dice-counter-conjunction": "y"
    }
}

export function changeLanguage(newLanguage)
{
    localStorage.setItem("chosenLanguage", newLanguage);
    const LANGUAGE_DATA = translations[newLanguage];

    for(const [key, value] of Object.entries(LANGUAGE_DATA))
    {
        const ELEMENT = document.getElementById(key);
        if(ELEMENT)
        {
            ELEMENT.innerHTML = value;
        }
    }
    diceCounter.updateDiceCounter();
}