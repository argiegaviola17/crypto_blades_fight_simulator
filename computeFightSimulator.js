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
    const TRAIT_MAPPING = {
        "earth-icon":0,     
        "lightning-icon":1,
        "water-icon":2,
        "fire-icon":3,
    }
    // STR - fire
    // DEX - earth
    // CHA - lightning
    // INT - water
    // PWR - power
    const STAT_WEAPON_TRAIT_MAPPING = {
        "DEX":0,
        "CHA":1,
        "INT":2,
        "STR":3,     
        "PWR":4,
    }
    const characterPower = document.getElementsByClassName("character-display-container")[0].getElementsByClassName("character-data-column")[0]
    .getElementsByClassName("subtext-stats")[0].getElementsByTagName("span")[1].innerText;
    const parseCharacterPower = characterPower.split(",").join("")
    const numCharacterPower = parseFloat(parseCharacterPower);
    console.log("characterPower: ",numCharacterPower);

    const traitText = document.getElementsByClassName("character-display-container")[0].getElementsByClassName("character-data-column")[0]
    .getElementsByClassName("character-name")[0].getElementsByClassName("trait-icon")[0].getAttribute("class");
    const traitSplit = traitText.split(" ");
    const trait = traitSplit[0];
    console.log("TraitHero  ",trait, " - ",TRAIT_MAPPING[trait]);
    

    const weaponMainTraitHTML = document.getElementsByClassName("weapon-icon-wrapper")[0].getElementsByClassName("trait")[0].getElementsByTagName("span")[0].getAttribute("class");
    const weaponMainTrait = Number(TRAIT_MAPPING[weaponMainTraitHTML]);
    console.log("TRAIT_MAPPING[weaponMainTrain]; ",weaponMainTrait);
    const weaponStats = document.getElementsByClassName("weapon-icon-wrapper")[0].getElementsByClassName("stats")[0].getElementsByTagName("div");
    const weaponStatObj = {
        1: {
            trait: 0,
            power: 0
        },
        2: {
            trait: 0,
            power: 0
        },
        3: {
            trait: 0,
            power: 0
        }
    }
    let i = 0;
    for(const stat of weaponStats){
        i++;
        const weapStatPower = stat.getElementsByTagName("span")[1].innerText;
        const split = weapStatPower.split(" ");
        const weaponStat = STAT_WEAPON_TRAIT_MAPPING[split[0]];
        console.log("weapon type ",split[0], " - ",weaponStat);
        const numWeaponStatPower = parseFloat(split[1]);
        console.log("weapon stat ",numWeaponStatPower);
        weaponStatObj[i] = {
            trait: weaponStat,
            power: numWeaponStatPower
        }
    }
    
    const enemiesObj = {
        1: {
            trait: 0,
            power: 0,
            container: null
        },
        2: {
            trait: 0,
            power: 0,
            container: null
        },
        3: {
            trait: 0,
            power: 0,
            container: null
        }
    }
    const enemiesContainer = document.getElementsByClassName("enemy-list");
    if(enemiesContainer.length > 0){
        const enemyList = enemiesContainer[0].getElementsByClassName("encounter");
        let enemyWinRate = document.getElementsByClassName("enemyWinRate");
        do{
            enemyWinRate = document.getElementsByClassName("enemyWinRate");
            if(enemyWinRate.length>0){
                for(const w of enemyWinRate){
                    w.remove();
                }
            }
        }while(enemyWinRate.length>0);
        let i = 0;
        for(const enemy of enemyList){
            i++;
            
            const enemyContainer = enemy.getElementsByClassName("encounter-element")[0];
            const enemyType = enemyContainer.getElementsByTagName("span")[0].getAttribute("class");

            const enemyPower = enemy.getElementsByClassName("encounter-power")[0].innerText;
            const parseEnemyPower = enemyPower.split(" ");
            const numEnemyPower = parseFloat(parseEnemyPower[0]);
            console.log("enemyType=> ",enemyType," enemyType=> ",TRAIT_MAPPING[enemyType], " enemyPower=> ",numEnemyPower);

            const encounterContainer = enemy.getElementsByClassName("encounter-container")[0];

            enemiesObj[i] = {
                trait: TRAIT_MAPPING[enemyType],
                power: numEnemyPower,
                container: encounterContainer
            }
        }
    }

    
    console.log("enemiesObj 1 ",enemiesObj["1"]);
    console.log("enemiesObj 2 ",enemiesObj["2"]);
    console.log("enemiesObj 3 ",enemiesObj["3"]);
    console.log("enemiesObj 4 ",enemiesObj["4"]);

    console.log("weaponStatObj 1 ",weaponStatObj["1"]);
    console.log("weaponStatObj 2 ",weaponStatObj["2"]);
    console.log("weaponStatObj 3 ",weaponStatObj["3"]);
    const params = {
        heroTrait: TRAIT_MAPPING[trait],

        weaponTrait: weaponMainTrait,

        weaponStatTrait1: weaponStatObj["1"].trait,
        weaponStatTrait2: weaponStatObj["2"].trait,
        weaponStatTrait3: weaponStatObj["3"].trait,

        enemy1Trait: enemiesObj["1"].trait,
        enemy2Trait: enemiesObj["2"].trait,
        enemy3Trait: enemiesObj["3"].trait,
        enemy4Trait: enemiesObj["4"].trait,

        heroPower: numCharacterPower, 
        
        weaponPower: 0, 
        
        weaponPowerStat1: weaponStatObj["1"].power, 
        weaponPowerStat2: weaponStatObj["2"].power, 
        weaponPowerStat3: weaponStatObj["3"].power, 

        enemyPower1: enemiesObj["1"].power, 
        enemyPower2: enemiesObj["2"].power, 
        enemyPower3: enemiesObj["3"].power, 
        enemyPower4: enemiesObj["4"].power,

        enemyChance1: "0 %",
        enemyChance2: "0 %",
        enemyChance3: "0 %",
        enemyChance4: "0 %"
    }

    console.log("params ",params);


    const earthTrait = 0, ligthingTrait = 1, waterTrait = 2, fireTrait = 3, powerTrait = 4;

    computeWinChance(params);
    console.log("enemyChance1 ",params.enemyChance1);
    console.log("enemyChance2 ",params.enemyChance2);
    console.log("enemyChance3 ",params.enemyChance3);
    console.log("enemyChance4 ",params.enemyChance4);

    for(const eObj in enemiesObj){
        const div = document.createElement('div');
        div.className = 'row enemyWinRate';

        div.innerHTML = `
            <label style='text-align:center'> 
                Win chance: ${params["enemyChance"+eObj]}
            </label>
        `;
        enemiesObj[eObj].container.prepend(div);
    }
    
    

    function computeWinChance(data){
        function t(t, a, e) {
            let i = 1;
            var r,
            n;
            return t == a && (i += .075),
            n = e,
            ((r = t) == fireTrait && n == earthTrait || r == waterTrait && n == fireTrait || r == ligthingTrait && n == waterTrait || r == earthTrait && n == ligthingTrait) && (i += .075),
            function (t, a) {
                return t == fireTrait && a == waterTrait || t == waterTrait && a == ligthingTrait || t == ligthingTrait && a == earthTrait || t == earthTrait && a == fireTrait
            }
            (t, e) && (i -= .075),
            i
        }
        function a(t, a) {
            return t = Math.ceil(t),
            a = Math.floor(a),
            Math.floor(Math.random() * (a - t + 1)) + t
        }

        // try {
            let e = parseInt(data.heroTrait),
            i = parseInt(data.weaponTrait),
            r = parseInt(data.weaponStatTrait1),
            n = parseInt(data.weaponStatTrait2),
            o = parseInt(data.weaponStatTrait3),
            s = parseInt(data.enemy1Trait),
            p = parseInt(data.enemy2Trait),
            c = parseInt(data.enemy3Trait),
            d = parseInt(data.enemy4Trait);
            console.log("done setting trait ");
            !function (e, i, r, n, o, s, p, c, d, l, h, T, w, u, g, f, v, k) {
                console.log("initializing data");

                let m,
                b,
                I = function (t, a, e, i, r, n, o) {
                    let s = 1;
                    a > 0 && e >= 0 && (s += e == t ? .0026750000000000003 * a : e == powerTrait ? .002575 * a : .0025 * a);
                    i > 0 && r >= 0 && (s += r == t ? .0026750000000000003 * i : r == powerTrait ? .002575 * i : .0025 * i);
                    n > 0 && o >= 0 && (s += o == t ? .0026750000000000003 * n : o == powerTrait ? .002575 * n : .0025 * n);
                    return s
                }(n, o, s, p, c, d, l),
                y = e * I + r,
                x = Math.ceil(h - .1 * h),
                M = Math.floor(h + .1 * h),
                W = Math.ceil(y - .1 * y),
                P = Math.floor(y + .1 * y),
                F = Math.ceil(w - .1 * w),
                E = Math.floor(w + .1 * w),
                C = Math.ceil(y - .1 * y),
                L = Math.floor(y + .1 * y),
                R = Math.ceil(g - .1 * g),
                B = Math.floor(g + .1 * g),
                H = Math.ceil(y - .1 * y),
                N = Math.floor(y + .1 * y),
                D = Math.ceil(v - .1 * v),
                A = Math.floor(v + .1 * v),
                G = Math.ceil(y - .1 * y),
                J = Math.floor(y + .1 * y),
                O = t(i, n, T),
                S = t(i, n, u),
                U = t(i, n, f),
                _ = t(i, n, k),
                j = 0,
                q = 0,
                z = 0,
                K = 0;
                
                console.log("done computations ");
                let run = 0;
                for (let t = 0; t < 500; t++){
                    run++;
                    console.log("running ",run);
                    m = a(W, P) * O, b = a(x, M), m >= b && j++, m = a(C, L) * S, b = a(F, E), m >= b && q++, m = a(H, N) * U, b = a(R, B), m >= b && z++, m = a(G, J) * _, b = a(D, A), m >= b && K++;
                }
                     
                console.log("done for loop ");                    
                console.log("1 ",j);                    
                console.log("2 ",q);                    
                console.log("3 ",z);                    
                console.log("4 ",K);                    
                data.enemyChance1 = (j / 500 * 100).toFixed(2) + " %",
                data.enemyChance2 = (q / 500 * 100).toFixed(2) + " %",
                data.enemyChance3 = (z / 500 * 100).toFixed(2) + " %",
                data.enemyChance4 = (K / 500 * 100).toFixed(2) + " %"

            }(  data.heroPower, e, 
                data.weaponPower, i, 
                data.weaponPowerStat1, r, 
                data.weaponPowerStat2, n, 
                data.weaponPowerStat3, o, 
                data.enemyPower1, s, 
                data.enemyPower2, p, 
                data.enemyPower3, c, 
                data.enemyPower4, d)


        // } catch (errt) {
        //    console.error("error occured ",errt);
        // }
    }
}

