import {dom} from './UI.js';
import {GAME_CONFIG} from './config.js';

export default class AI{
    constructor(){
        //this.playerName = playerName;
    }
    move(playerName, func) {
        if (playerName === "A" || playerName === "B" || playerName === "C" || playerName === "D") {
            setTimeout(() => {
                if(GAME_CONFIG.game) {
                dom.diceBtn.style.display = "none";
                func();
                }
            },500);
        } else {
            dom.diceBtn.style.display = "block";
        }
    }
}