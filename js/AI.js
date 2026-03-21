import {dom} from './UI.js';
import {GAME_CONFIG} from './config.js';

export default class AI{
    constructor(){
        //this.playerName = playerName;
    }
    move(func) {
        setTimeout(() => {
            func();
        },500);
    }
    isAI(playerName) {
        if (playerName === "A" || playerName === "B" || playerName === "C" || playerName === "D") {
            return true;
        } else {
            return false;
        }
    }
}