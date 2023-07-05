class LightShip {
    decksNum;
    direction;
    x;
    y;
    constructor(decksNum, direction){
        this.decksNum = decksNum;
        this.direction = direction;
        this.x = [];
        this.y = [];
    }
}

const SHIP_LOCATION_ALGORITHMS = {
    easy: [
        {
            name: 'random_ship_location_algoritm', 
            code: 0
        }
    ],
    medium : [
        {
            name: 'diagonals_ship_location_algorithm', 
            code: 1
        },
        {
            name: 'shores_ship_location_algorithm', 
            code: 2
        }
    ],
    hard: [
        {
            name: 'hard_shores_ship_location_algorithm', 
            code: 3
        },
        {
            name: 'half_horizontal_bottom_field_ship_location_algorithm', 
            code: 4
        },
        {
            name: 'half_horizontal_top_field_ship_location_algorithm', 
            code: 5
        },
        {
            name: 'half_vertical_left_field_ship_location_algorithm', 
            code: 6
        },
        {
            name: 'half_vertical_right_field_ship_location_algorithm', 
            code: 7
        }
    ],
}

function getRandomValue(boundInfo) {
    let randomNumber, randomIndex;
    switch(boundInfo.type) {
        case 'range':
            randomNumber = Math.floor(Math.random() * (boundInfo.max - boundInfo.min + 1)) + boundInfo.min;
            break;
        case 'enum':
            randomIndex = Math.floor(Math.random() * boundInfo.arr.length);
            randomNumber = boundInfo.arr[randomIndex];
            break;
    }
    return randomNumber;
}

function checkShipLocation(x, y, kx, ky, decks, playerField, algorithm) {
    let fromX, toX, fromY, toY;
    let res = true;

	fromX = (x == 0) ? x : x - 1;
    if (kx == 1)
        toX = (x + kx * decks == 10) ? x + kx * decks : x + kx * decks + 1;
    else 
        toX = (x == 9) ? x + 1 : x + 2;

    fromY = (y == 0) ? y : y - 1;
    if (ky == 1)
        toY = (y + ky * decks == 10) ? y + ky * decks : y + ky * decks + 1;
    else
        toY = (y == 9) ? y + 1 : y + 2;

	if (toX === undefined || toY === undefined) 
        res =  false;

    switch(algorithm["code"]) {
        case 1:
            let k = 0;
            while (k < decks) {
                let i_x = x + k * kx;
                let j_y = y + k * ky;
                if (i_x == j_y || i_x == (9 - j_y)) 
                    res = false;
                k++;
            }
            break;
    }
    for (let i = fromX; i < toX; i++) {
        for (let j = fromY; j < toY; j++) {
            if(playerField[j][i] == 1)
                res = false;
        }
    }
	return res;
}

function getPossibleValuesOfTheStartCoordinates(kx, decksNum, algorithm) {
    let x_possible, y_possible;
    switch(algorithm["code"]) {
        case 0:
        case 1:
            if (kx == 0) {
                x_possible = {type: "range", min: 0, max: 9};
                y_possible = {type: "range", min: 0, max: (10 - decksNum)};
            }
            else {
                x_possible = {type: "range", min: 0, max: (10 - decksNum)};
                y_possible = {type: "range", min: 0, max: 9};
            }
            break;
        case 2:
            if (kx == 0) {
                x_possible = {type: "enum", arr: [0, 9]};
                y_possible = {type: "range", min: 0, max: (10 - decksNum)};
            }
            else {
                x_possible = {type: "range", min: 0, max: (10 - decksNum)};
                y_possible = {type: "enum", arr: [0, 9]};
            }
            break;
        case 3:
            if (decksNum != 1) {
                if (kx == 0) {
                    x_possible = {type: "enum", arr: [0, 9]};
                    y_possible = {type: "range", min: 0, max: (10 - decksNum)};
                }
                else {
                    x_possible = {type: "range", min: 0, max: (10 - decksNum)};
                    y_possible = {type: "enum", arr: [0, 9]};
                }
            }
            else {
                x_possible = {type: "range", min: 1, max: 8};
                y_possible = {type: "range", min: 1, max: 8}; 
            }
            break;
        case 4:
            if (decksNum != 1) {
                if (kx == 0) {
                    x_possible = {type: "range", min: 0, max: 9};
                    y_possible = {type: "range", min: 0, max: (5 - decksNum)};
                }
                else {
                    x_possible = {type: "range", min: 0, max: (10 - decksNum)};
                    y_possible = {type: "range", min: 0, max: 4};
                }
            }
            else {
                x_possible = {type: "range", min: 0, max: 9};
                y_possible = {type: "range", min: 5, max: 9}; 
            }
            break;
        case 5:
            if (decksNum != 1) {
                if (kx == 0) {
                    x_possible = {type: "range", min: 0, max: 9};
                    y_possible = {type: "range", min: 5, max: (10 - decksNum)};
                }
                else {
                    x_possible = {type: "range", min: 0, max: (10 - decksNum)};
                    y_possible = {type: "range", min: 5, max: 9};
                }
            }
            else {
                x_possible = {type: "range", min: 0, max: 9};
                y_possible = {type: "range", min: 0, max: 4}; 
            }
            break;
        case 6:
            if (decksNum != 1) {
                if (kx == 0) {
                    x_possible = {type: "range", min: 5, max: 9};
                    y_possible = {type: "range", min: 0, max: (10 - decksNum)};
                }
                else {
                    x_possible = {type: "range", min: 5, max: (10 - decksNum)};
                    y_possible = {type: "range", min: 0, max: 9};
                }
            }
            else {
                x_possible = {type: "range", min: 0, max: 4};
                y_possible = {type: "range", min: 0, max: 9}; 
            }
            break;
        case 7:
            if (decksNum != 1) {
                if (kx == 0) {
                    x_possible = {type: "range", min: 0, max: 4};
                    y_possible = {type: "range", min: 0, max: (10 - decksNum)};
                }
                else {
                    x_possible = {type: "range", min: 0, max: (5 - decksNum)};
                    y_possible = {type: "range", min: 0, max: 9};
                }
            }
            else {
                x_possible = {type: "range", min: 5, max: 9};
                y_possible = {type: "range", min: 0, max: 9}; 
            }
            break;
    }
    return [x_possible, y_possible];
}

function getStartDeckCoord(decksNum, playerField, algorithm) {
    let x, y, possibleValues, x_possible, y_possible;
    let kx = getRandomValue({type: "range", min: 0, max: 1}); 
    let ky = (kx == 0) ? 1 : 0;

    possibleValues = getPossibleValuesOfTheStartCoordinates(kx, decksNum, algorithm);
    x_possible = possibleValues[0];
    y_possible = possibleValues[1];

    x = getRandomValue(x_possible);
    y = getRandomValue(y_possible);

    let result = checkShipLocation(x, y, kx, ky, decksNum, playerField, algorithm);

	if ( !result ) 
        return getStartDeckCoord(decksNum, playerField, algorithm);
    return {x, y, kx, ky}; // координаты первой палубы корабля, а также информация о направлении
}

function getShipsLocation(algorithm) {
    let field = [...Array(10)].map(() => Array(10).fill(0));
    let allLightShips = [];
    let SHIP_DATA = {
		fourdeck: [1, 4],
		tripledeck: [2, 3],
		doubledeck: [3, 2],
		singledeck: [4, 1]
	};

    for (let type in SHIP_DATA) {
		let count = SHIP_DATA[type][0];
		let decks = SHIP_DATA[type][1];
        for (let i = 0; i < count; i++) {
            let k = 0;
			let shipInfo = getStartDeckCoord(decks, field, algorithm);
            let direction = shipInfo.kx == 0 ? 'vertical' : 'horizontal';
            let lightShip = new LightShip(decks, direction);
            while (k < decks) {
                let x = shipInfo.x + k * shipInfo.kx;
                let y = shipInfo.y + k * shipInfo.ky;
                lightShip.x.push(x);
                lightShip.y.push(y);
                field[y][x] = 1;
                k++;
            }
            allLightShips.push(lightShip);
		}
    }

    return allLightShips;
}

function chooseAlgorithmBasedOnLevel(chosenLevel) {
    return getRandomValue({type: "enum", arr: SHIP_LOCATION_ALGORITHMS[chosenLevel]});
}
