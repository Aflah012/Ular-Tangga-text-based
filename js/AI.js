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
    //"A,B,C,D" is AI name
    isAI(playerName) {
        if (['A','B','C','D'].includes(playerName)) {
            return true;
        } else {
            return false;
        }
    }
}