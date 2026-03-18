export const GAME_CONFIG = {
    Players: {
        A : {
            name: 'A',
            score: 0,
            record: 0,
            elementId: {
                score: 'p1',
                box: 'cp1'
            }
        },
        B : {
            name: 'B',
            score: 0,
            record: 0,
            elementId: {
                score: 'p2',
                box: 'cp2'
            }
        },
        C : {
            name: 'C',
            score: 0,
            record: 0,
            elementId: {
                score: 'p3',
                box: 'cp3'
            }
        },
        D : {
            name: 'D',
            score: 0,
            record: 0,
            elementId: {
                score: 'p4',
                box: 'cp4'
            }
        }
    },
    Snakes: {
        8: 3,
        39: 1,
        55: 37,
        68: 50,
        93: 75,
        99: 83
    },
    Ladders: {
        5: 26,
        9: 31,
        28: 47,
        43: 80,
        73: 91,
        77: 96
    },
    game: false,
    interval: undefined
};