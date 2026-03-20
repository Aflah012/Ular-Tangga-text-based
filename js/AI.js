import {dom} from './UI.js';
import {GAME_CONFIG} from './config.js';

export default class AI{
    constructor(playerName){
        this.playerName = playerName;
    }
    move(func) {
        if (this.playerName === "A" || this.playerName === "B" || this.playerName === "C" || this.playerName === "D") {
            setTimeout(() => {
                if(GAME_CONFIG.game) {
                dom.diceBtn.style.display = "none";
                //dom.diceBtn.click();
                func();
                }
            },500);
        } else {
            dom.diceBtn.style.display = "block";
        }
    }
}