const shipStatus = {Killed: 'killed', NotKilled: 'not killed', Injured: 'injured'}
var algorythms = {RandomGame: 'random game', DiagonalShooting: 'diagonal shooting', EdgesShooting: 'edges shooting', DiagonalsShooting2: 'diagonal shooting 2', DiagonalsShooting3: 'diagonal shooting 3', ChessOrder: 'chess order', ShootCenter: 'shoot center'};
let level = 'light', isGameEnded = false;

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

class Player{
    playerField;
    fieldSize;
    ships = [];
    wasShipHited;
    constructor(fieldSize){
        this.playerField = new Field(fieldSize);
        this.wasShipHited = false;
        let ship;
        for (let i = 4; i>=1; i--){
            switch (i){
                case 1:
                    for (let j = 0; j < 4; j++){
                        ship = new Ship(1);
                        this.ships.push(ship);
                    }
                    break;
                case 2:
                    for (let j = 0; j < 3; j++){
                        ship = new Ship(2);
                        this.ships.push(ship);
                    }
                    break;
                case 3:
                    for (let j = 0; j < 2; j++){
                        ship = new Ship(3);
                        this.ships.push(ship);
                    }
                    break;
                case 4:
                    ship = new Ship(4);
                    this.ships.push(ship);
                    break;
            }
        
        }
    }

    getUnsinkableShips(){
        const ships = [];
        for (let i = 0; i < this.ships.length(); i++){

            if (this.ships[i].shipStatus != shipStatus.Killed){
                ships.push(this.ships[i]);
            }
        }
    }

    
}

class User extends Player{
    shoot(x, y, enemyField){
        const res = enemyField.toBeShooted(x,y);
        return res;
    }  
}

class Enemy extends Player{
    #cells = [];
    #chosenAlgorythm;
    #finishingMode;
    #finishingCells = [];
    #finishedShips = []
    #didEnemyHitDeck = false;
    #wasAlgoritmEnded;
    #level;
    constructor(fieldSize, level){
        super(fieldSize);
        this.#finishingMode = false;
        this.#wasAlgoritmEnded = false;
        this.#level = level;
        this.wasShipHited = false;
    }
    
    getEnemyStatus(){
        return this.wasShipHited;
    }

    toPlay(userField){
        let resultCell;
        if (this.#finishingMode){
            resultCell = this.finishShip(userField)
            if (!this.#finishingMode){
                this.changeAlgorythm(userField);
            }
        }
        else {
            let cell = this.#cells.shift();
            let cellWithDeck;
            let ship;
            console.log(cell);
            let res = this.shoot(cell.x,cell.y, userField);
            if(res){
                cellWithDeck = userField.getCell(this.#cells.shift().x,this.#cells.shift().y);
                let num = cellWithDeck.numOfDecksAtCell;
                if(num > 1){
                    this.#finishingMode = true;
                    this.#finishingCells.push(userField.getCell(this.#cells.shift().x,this.#cells.shift().y));
                    this.wasShipHited = true;
                    this.#cells = [];
                }
                else{
                    this.#cells = [];
                    this.wasShipHited = true;
                    this.changeAlgorythm(userField);
                    this.#finishedShips.push(1);
                }
                
            }
            else{
                this.wasShipHited = false;
            }
            resultCell = cell;
        }
        if(this.#cells.length == 0){
            this.#wasAlgoritmEnded = true;
            this.changeAlgorythm(userField);
        }
        console.log(this.#cells.length)
        console.log(resultCell);
        return resultCell;
    }

    finishShip(userField){
        let x, y, res;
        let resultCell;
        if(this.#finishingCells.length == 1){
            x = this.#finishingCells[0].x;
            y = this.#finishingCells[0].y;
            if((x + 1)<this.fieldSize && userField.getCell(x+1, y).isHited == false){
                res = this.shoot(x+1, y, userField);
                if(res ==true){
                    this.#finishingCells.push(userField.getCell(x+1, y));
                }
                else{
                    this.wasShipHited = false;
                }
                resultCell = userField.getCell(x+1, y);
            }
            else if((x - 1)>=0 && userField.getCell(x-1, y).isHited == false){
                res = this.shoot(x-1, y, userField);
                if(res ==true){
                    this.#finishingCells.push(userField.getCell(x-1, y));
                }
                else{
                    this.wasShipHited = false;
                }
                resultCell = userField.getCell(x-1, y);
            }
            else if((y + 1)<this.fieldSize && userField.getCell(x, y+1).isHited == false){
                res = this.shoot(x, y+1, userField);
                if(res ==true){
                    this.#finishingCells.push(userField.getCell(x, y+1));
                }
                else{
                    this.wasShipHited = false;
                }
                resultCell = userField.getCell(x, y+1);
            }
            else if((y - 1)>=0 && userField.getCell(x, y-1).isHited == false){
                res = this.shoot(x, y-1, userField);
                if(res ==true){
                    this.#finishingCells.push(userField.getCell(x, y-1));
                }
                else{
                    this.wasShipHited = false;
                }
                resultCell = userField.getCell(x, y-1); 
            }
        }
        else{
            for (let i = 0; i<this.#finishingCells.length; i++){
                x = this.#finishingCells[i].x;
                y = this.#finishingCells[i].y;
                if (((x + 1)<this.fieldSize)&&(userField.getCell(x+1,y).isHited == false) && (userField.getCell(x-1,y).isHited == true && userField.getCell(x-1,y).isOccupied == true)){
                    res = this.shoot(x+1, y, userField);
                    if(res ==true){
                        this.#finishingCells.push(userField.getCell(x+1, y));
                    }
                    else{
                        this.wasShipHited = false;
                    }
                    resultCell = userField.getCell(x+1, y);
                    break;
                }
                else if (((x - 1)>=0)&&(userField.getCell(x-1,y).isHited == false) && (userField.getCell(x+1,y).isHited == true && userField.getCell(x+1,y).isOccupied == true)){
                    res = this.shoot(x-1, y, userField);
                    if(res ==true){
                        this.#finishingCells.push(userField.getCell(x-1, y));
                    }
                    else{
                        this.wasShipHited = false;
                    }
                    resultCell = userField.getCell(x-1, y);
                    break;
                }
                else if (((y + 1)<this.fieldSize)&&(userField.getCell(x,y+1).isHited == false) && (userField.getCell(x,y-1).isHited == true && userField.getCell(x,y-1).isOccupied == true)){
                    res = this.shoot(x, y+1, userField);
                    if(res ==true){
                        this.#finishingCells.push(userField.getCell(x, y+1));
                    }
                    else{
                        this.wasShipHited = false;
                    }
                    resultCell = userField.getCell(x, y+1);
                    break;
                }
                else if (((y - 1)>=0)&&(userField.getCell(x,y-1).isHited == false) && (userField.getCell(x,y+1).isHited == true && userField.getCell(x,y+1).isOccupied == true)){
                    res = this.shoot(x, y-1, userField);
                    if(res ==true){
                        this.#finishingCells.push(userField.getCell(x, y-1));
                    }
                    else{
                        this.wasShipHited = false;
                    }
                    resultCell = userField.getCell(x, y-1);
                    break;
                }
            }


        }
        let num = this.#finishingCells[0].numOfDecksAtCell;
        if (num == this.#finishingCells.length){
            this.#finishingMode = false;
            this.#finishedShips.push(this.#finishingCells.length);
            this.#finishingCells = [];
        }
        return resultCell;
    }

    changeAlgorythm(userField){
        if (this.#level == 'easy'){
            this.#chosenAlgorythm = algorythms.RandomGame;
            this.randomPlay(userField);
        }
        else{
            if(!this.#wasAlgoritmEnded){
                switch(this.#chosenAlgorythm){
                    case algorythms.RandomGame:
                        this.randomPlay(userField);
                        break;
                    case algorythms.DiagonalShooting:
                        this.diagonalsShooting(userField);
                        break;
                    case algorythms.EdgesShooting:
                        this.edgesShooting(userField);
                        break;
                    case algorythms.ChessOrder:
                        this.shootInChessOrder(userField);
                        break;
                    case algorythms.ShootCenter:
                        this.shootCenter(userField);
                        break;
                    case algorythms.DiagonalsShooting2:
                        for(let i = 0; i<this.#finishedShips.length; i++){
                            if(this.#finishedShips[i] == 3){
                                this.#chosenAlgorythm = algorythms.ChessOrder;
                                this.shootInChessOrder(userField);
                                break;
                            }
                        }
                        this.diagonalsShooting2(userField);
                        break;
                    case algorythms.DiagonalsShooting3:
                        for(let i = 0; i<this.#finishedShips.length; i++){
                            if(this.#finishedShips[i] == 4){
                                this.#chosenAlgorythm = algorythms.DiagonalsShooting2;
                                this.diagonalsShooting2(userField);
                                break;
                            }
                        }
                        this.diagonalsShooting3(userField);
                        break;
                }
            }
            else{
                this.#wasAlgoritmEnded = false;
                let rnd;
                switch(this.#chosenAlgorythm){
                    case algorythms.RandomGame:
                        this.randomPlay(userField);
                        break;
                    case algorythms.DiagonalShooting:
                        rnd = getRandom(1,3);
                        switch(rnd){
                            case 1:
                                this.#chosenAlgorythm = algorythms.EdgesShooting;
                                this.edgesShooting(userField);
                                break;
                            case 2:
                                this.#chosenAlgorythm = algorythms.DiagonalsShooting2;
                                this.diagonalsShooting2(userField);
                                break;
                            case 3:
                                this.#chosenAlgorythm = DiagonalsShooting3;
                                this.diagonalsShooting3(userField);
                                break;
                        }
                        break;
                    case algorythms.EdgesShooting:
                        rnd = getRandom(1,3);
                        switch(rnd){
                            case 1:
                                this.#chosenAlgorythm = algorythms.DiagonalShooting;
                                this.diagonalsShooting(userField);
                                break;
                            case 2:
                                this.#chosenAlgorythm = algorythms.DiagonalsShooting2;
                                this.diagonalsShooting2(userField);
                                break;
                            case 3:
                                this.#chosenAlgorythm = DiagonalsShooting3;
                                this.diagonalsShooting3(userField);
                                break;
                            case 4:
                                this.#chosenAlgorythm = algorythms.ShootCenter();
                                this.shootCenter(userField);
                                break;
                        }
                        break;
                    case algorythms.ChessOrder:
                        this.#chosenAlgorythm = algorythms.RandomGame;
                        this.randomPlay(userField);
                        break;
                    case algorythms.ShootCenter:
                        case 1:
                                this.#chosenAlgorythm = algorythms.DiagonalShooting;
                                this.diagonalsShooting(userField);
                                break;
                            case 2:
                                this.#chosenAlgorythm = algorythms.DiagonalsShooting2;
                                this.diagonalsShooting2(userField);
                                break;
                            case 3:
                                this.#chosenAlgorythm = DiagonalsShooting3;
                                this.diagonalsShooting3(userField);
                                break;
                            case 4:
                                this.#chosenAlgorythm = algorythms.EdgesShooting;
                                this.edgesShooting(userField);
                                break;
                        break;
                    case algorythms.DiagonalsShooting2:
                        this.#chosenAlgorythm = algorythms.ChessOrder;
                        this.shootInChessOrder(userField);
                        break;
                    case algorythms.DiagonalsShooting3:
                        this.#chosenAlgorythm = algorythms.DiagonalsShooting2;
                        this.diagonalsShooting2(userField);
                        break;
                    
                }
            }
        }
    }

    startGame(userField){
        this.chooseFirstAlgorithm(userField);
    }

    chooseFirstAlgorithm(userField){
        let rnd;
        switch(this.#level){
            case 'easy':
                this.#chosenAlgorythm =  algorythms.RandomGame;
                this.randomPlay(userField);
                break;
            case 'medium':
                rnd = getRandom(1,6);
                switch(rnd){
                    case 1:
                        this.#chosenAlgorythm = algorythms.DiagonalShooting;
                        this.diagonalsShooting(userField);
                        break;
                    case 2:
                        this.#chosenAlgorythm = algorythms.EdgesShooting;
                        this.edgesShooting(userField);
                        break;
                    case 3:
                        this.#chosenAlgorythm = algorythms.DiagonalsShooting2;
                        this.diagonalsShooting2(userField);
                        break;
                    case 4:
                        this.#chosenAlgorythm = algorythms.DiagonalsShooting3;
                        this.diagonalsShooting3(userField);
                        break;
                    case 5:
                        this.#chosenAlgorythm = algorythms.ChessOrder;
                        this.shootInChessOrder(userField);
                        break;
                    case 6:
                        this.#chosenAlgorythm = algorythms.ShootCenter;
                        this.shootCenter(userField);
                        break;
                }
                break;
            case 'hard':
                rnd = getRandom(1,4);
                switch(rnd){
                    case 1:
                        this.#chosenAlgorythm = algorythms.DiagonalShooting;
                        this.diagonalsShooting(userField);
                        break;
                    case 2:
                        this.#chosenAlgorythm = algorythms.EdgesShooting;
                        this.edgesShooting(userField);
                        break;
                    case 3:
                        this.#chosenAlgorythm = algorythms.DiagonalsShooting3;
                        this.diagonalsShooting3(userField);
                        break;
                    case 4:
                        this.#chosenAlgorythm = algorythms.ShootCenter;
                        this.shootCenter(userField);
                        break;
                }
                break;
        }
    }

    randomPlay(userField){
        let cellsLeft = userField.getUnhitedCells().length;
        let unhitedCells = userField.getUnhitedCells();
        let indexes = [], index;
        for (let i = 0; i < cellsLeft; i++){
            indexes[i] = i;
        }
        indexes = shuffle(indexes);
        for (let i = 0; i < cellsLeft; i ++){
            index = indexes[i];
            this.#cells.push(unhitedCells[index]);
        }
    }
    
    diagonalsShooting(userField){
        let j = 0;
        let k = 9;
        let cell;
        for(let i = 0; i<10; i++){
            cell = userField.getCell(j, i);
            if(cell.isHited == false){
                this.#cells.push(cell)
            }
            cell = userField.getCell(k, i);
            if(cell.isHited == false){
                this.#cells.push(cell)
            }
            j = j + 1;
            k = k - 1;
        }
    }

    edgesShooting(userField){
        let cell;
        for(let i = 0; i<10; i = i+9){
            for(let j = 0; j<10; j=j+2){
                cell = userField.getCell(j,i);
                if(cell.isHited == false){
                    this.#cells.push(cell)
                }
            }
        }
        for(let i = 0; i<10; i = i+9){
            for(let j = 0; j<10; j=j+2){
                cell = userField.getCell(i,j);
                if(cell.isHited == false){
                    this.#cells.push(cell)
                }
            }
        }

    }

    diagonalsShooting2(userField){
        let k;
        let rnd = getRandom(0,1);
        let cell;
        switch (rnd){
            case 0:
                k = getRandom(0,2);
                for (let i = 0; i<10; i++){
                    for(let j = k; j<=9; j = j + 3){
                        cell = userField.getCell(j,i);
                        if(cell.isHited == false){
                            this.#cells.push(cell);
                        }
                        k = j;
                    }
                    k = k - 8;
                    if (k < 0){
                        k = k + 3;
                    }
                }
                break;
            case 1:
                k = getRandom(7,9);
                for(let i = 0; i<10; i++){
                    for(let j = k; j>=0; j = j - 3){
                        cell = userField.getCell(j,i);
                        if(cell.isHited == false){
                            this.#cells.push(cell);
                        }
                        k = j;
                    }
                    k = k + 8;
                    if (k > 9){
                        k = k - 3;
                    }
                }
                break;
        }
        
    }

    diagonalsShooting3(userField){
        let k;
        let rnd = getRandom(0,1);
        let cell;
        switch(rnd){
            case 0:
                k = getRandom(0,3);
                for (let i = 0; i<10; i++){
                    for(let j = k; j<=9; j = j + 4){
                        cell = userField.getCell(j,i);
                        if(cell.isHited == false){
                            this.#cells.push(cell);
                        }
                        k = j;
                    }
                    k = k - 7;
                    if (k < 0){
                        k = k + 4;
                    }
                }
                break;
            case 1:
                k = getRandom(6,9);
                for (let i = 0; i<10; i++){
                    for(let j = k; j>=0; j = j - 4){
                        cell = userField.getCell(j,i);
                        if(cell.isHited == false){
                            this.#cells.push(cell);
                        }
                        k = j;
                    }
                    k = k + 7;
                    if (k > 9){
                        k = k - 4;
                    }
                }
                break;
        }
    }

    shootInChessOrder(userField){
        let k = getRandom(0,1);
        let cell;
        for(let i = 0; i<10; i++){
            for(let j = k; j<10; j = j+2){
                cell = userField.getCell(j,i);
                if(cell.isHited == false){
                    this.#cells.push(cell);
                }
                k = j;
            }
            k = k - 9;
            if (k<0){
                k = k + 2;
            }
        }
    }
    
    shoot(x, y, userField){
        let res = userField.toBeShooted(x,y);
        return res;
    }

    shootCenter(userField){
        let cell;
        for (let i = 3; i<7; i++){
            for (let j = 3; j<7; j++){
                cell = userField.getCell(j, i);
                if(cell.isHited == false){
                    this.#cells.push(cell)
                }
            }
        }
    }

}

class Ship{
    shipStatus;
    decks;
    numOfDecks;
    direction;
    constructor(numOfDecks){
        this.numOfDecks = numOfDecks;
        this.shipStatus = shipStatus.NotKilled;
        this.decks = [];
        this.direction = '';
        for (let i = 0; i < numOfDecks; i++){
            this.decks[i] = new Deck(this);
        }
    }

    // get decks(){
     //   return this.#decks;
    //}

    // get shipStatus(){
    //     return this.#shipStatus;
    // }
    // set shipStatus(val){
    //     if (val == shipStatus.Injured || val == shipStatus.Killed || val == shipStatus.NotKilled){
    //         this.#shipStatus = val;
    //     }
    // }

   /* get numOfDecks(){
        return this.#numOfDecks;
    }

    get direction(){
        return this.#direction;
    }

    set direction(val){
        this.#direction = val;
    }*/

    getNotKilledDecks(){
        const decks = [];
        for (let i = 0; i < this.decks.length(); i++){
            if(this.decks[i].isKilled==false){
                decks.push(this.decks[i]);
            }
        }
        return decks;
    }

}

class Deck{
    isKilled;
    position;
    ship;
    numOfDecksInShip;
    constructor(ship){
        this.isKilled = false;
        this.ship = ship;
        this.numOfDecksInShip = ship.numOfDecks;
    }

    /*get isKilled(){
        return this.#isKilled;
    }
    set isKilled(val){
        if(typeof(val)==Boolean){
            this.#isKilled = val;
        }
    }*/

    //get ship(){
    //    return this.#ship;
    //}

    /*get position(){
        return this.#position
    }*/

    setPosition(cell){
        cell.placeDeck(this);
        this.position = cell;
    }
    

}

class Field{
    #size;
    #cells;
    constructor(size){
        this.#size = size
        this.#cells = [];
        for (let i = 0; i < this.#size; i++) {
            this.#cells[i] = []
            for (let j = 0; j < this.#size; j++) {
                this.#cells[i][j] = new Cell(j,i);
            }
          }
    }

    getCell(x,y){
        return this.#cells[y][x];
    }
    
    getUnhitedCells(){
        const unhitedCells = [];
        for (let i = 0; i < this.#size; i++){
            for (let j = 0; j < this.#size; j++){
                if(this.#cells[i][j].isHited == false){
                    unhitedCells.push(this.#cells[i][j]);
                }
            }
            
        }
        return(unhitedCells);
    }

    getUnoccupiedCells(){
        const unoccupiedCells = [];
        for (let i = 0; i < this.#size; i++){
            for (let j = 0; j < this.#size; j++){
                if(this.#cells[i][j].canShipStandHere == true){
                    unhitedCells.push(this.#cells[i][j]);
                }
            }
            
        }
        return(unoccupiedCells);
    }

    toBeShooted(x,y){
        this.#cells[y][x].isHited = true;
        if (this.#cells[y][x].isOccupied){
            return true;
        }
        else{
            return false;
        }
        //Нужно добавить проверку занятости клетки палубой. В случае если на клетке есть палуба, поменять поле палубы isKilled на true.
    }
}

class Cell{
    x;
    y;
    isHited;
    isOccupied;
    deck;
    numOfDecksAtCell;
    constructor(x, y){
        this.x = x
        this.y = y
        this.isHited = false
        this.isOccupied = false
   
    }
    
    /*get isOccupied(){
        return this.#isOccupied;
    }
    set isOccupied(val){
        if(typeof(val)==Boolean){
            this.isOccupied = val;
        }
    }*/

    // get deck(){
    //     return this.#deck;
    // }

    placeDeck(deck){
        this.isOccupied = true;
        this.deck = deck;
        this.numOfDecksAtCell = deck.numOfDecksInShip;
        //Нужно добавить привязку клетки к конкретной палубе.
    }
} 

