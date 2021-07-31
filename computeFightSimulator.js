let enemyFinder = document.getElementById("computeFightSimulator");

enemyFinder.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: findEnemies,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function findEnemies() {
    const ENEMY_TYPE_MAPPING = {
        "lightning-icon":"LIGHTNING",
        "water-icon":"WATER",
        "earth-icon":"EARTH",
         
    }
    const enemiesContainer = document.getElementsByClassName("enemy-list");
    if(enemiesContainer.length > 0){
        const enemyList = enemiesContainer[0].getElementsByClassName("encounter");

        // removed the old added html
        let enemyWinRate = document.getElementsByClassName("enemyWinRate");
        do{
            enemyWinRate = document.getElementsByClassName("enemyWinRate");
            if(enemyWinRate.length>0){
                for(const w of enemyWinRate){
                    w.remove();
                }
            }
        }while(enemyWinRate.length>0);

        for(const enemy of enemyList){
           
            const div = document.createElement('div');
            div.className = 'row enemyWinRate';

            div.innerHTML = `
                <label style='text-align:center'> 
                    Win chance: ${Math.random()} %
                </label>
            `;
            const enemyContainer = enemy.getElementsByClassName("encounter-element")[0];
            const enemyType = enemyContainer.getElementsByTagName("span")[0].getAttribute("class");
            console.log("enemyType=> ",enemyType, "  mapping=> ",ENEMY_TYPE_MAPPING[enemyType]);

            const enemyPower = enemy.getElementsByClassName("encounter-power")[0].innerText;
            console.log("enemyPower=> ",enemyPower);

            const encounterContainer = enemy.getElementsByClassName("encounter-container")[0]
            encounterContainer.prepend(div);

           // enemyList[0].getElementsByClassName("encounter-container")[0].prepend(div)
        }
    }
    const characterPower = document.getElementsByClassName("character-display-container")[0].getElementsByClassName("character-data-column")[0]
    .getElementsByClassName("subtext-stats")[0].getElementsByTagName("span")[1].innerText;
    console.log("characterPower: ",characterPower);
    
}