const TOGGLE_HISTORY = document.getElementById("toggle-history");
const HISTORY_SECTION = document.getElementById("history-section");
const HISTORY_LIST = document.getElementById("history-list");

function updateHistoryVisibility()
{
    if(localStorage.getItem("hideHistory") === "true")
        HISTORY_SECTION.classList.add("hidden");
    else
        HISTORY_SECTION.classList.remove("hidden");
}

updateHistoryVisibility();

export function addToHistory(finalTotal, breakdownText)
{
    const newEntry = document.createElement("li");
        HISTORY_LIST.insertBefore(newEntry, HISTORY_LIST.firstChild);
        newEntry.innerText = `${finalTotal} ${Number(breakdownText) === finalTotal ? "" : `(${breakdownText})`}`;
        if(HISTORY_LIST.querySelectorAll("li").length > 10)
        {
            HISTORY_LIST.removeChild(HISTORY_LIST.lastChild);
        }
}

TOGGLE_HISTORY.addEventListener("click", () => 
    {
        if(localStorage.getItem("hideHistory") === "false")
            localStorage.setItem("hideHistory", "true");
        else if(localStorage.getItem("hideHistory") === "true")
            localStorage.setItem("hideHistory", "false");
    
        updateHistoryVisibility();
    })
