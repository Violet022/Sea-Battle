let user, enemy;
let sizeCoordinateMatrix = 10;
let coordinateMatrix = new Array(sizeCoordinateMatrix);
for (var i = 0; i < 3; i++) {
    coordinateMatrix[i] = 52.8 * i + 2;
}
for (var i = 3; i < sizeCoordinateMatrix; i++) {
    coordinateMatrix[i] = 52.8 * i - 2;
}
    
function createPlayers() {
    user = convertLightShipInfoToPlayerInfo(JSON.parse(localStorage.getItem('userFieldInfo')), 'user');
    enemy = convertLightShipInfoToPlayerInfo(JSON.parse(localStorage.getItem('enemyFieldInfo')), 'enemy');

    let fieldToShow = [...Array(10)].map(() => Array(10).fill(0));
    for(let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let curCell = enemy.playerField.getCell(i, j);
            if(curCell.isOccupied) {
                fieldToShow[j][i] = 1;
            }
        }
    }
    console.log(fieldToShow);

    enemy.startGame(user.playerField);
}

window.onload = function() {
    createPlayers();
    
    let canvasOpponent = document.getElementsByClassName("opponent-playing-field");
    let canvasMy = document.getElementsByClassName("my-playing-field");
    let contextOpponent = canvasOpponent[0].getContext("2d");
    let contextMy = canvasMy[0].getContext("2d");
    let imgPlayingField = new Image();
    imgPlayingField.src = "../images/playingField.png";
    imgPlayingField.onload = function() {
        contextOpponent.drawImage(imgPlayingField, 0, 0, 528, 528);
        contextMy.drawImage(imgPlayingField, 0, 0, 528, 528);
    };

    drawingShips(user.ships);
    play();

    function drawingShips(userShipsInfo) {
        if (userShipsInfo[0].direction == 'horizontal') {
            deck4(userShipsInfo[0].decks[0].position.x, userShipsInfo[0].decks[0].position.y);
        }
        else {
            deck4_90(userShipsInfo[0].decks[0].position.x, userShipsInfo[0].decks[0].position.y);
        } 
        for (var i = 1; i <= 2; i++) {
            if (userShipsInfo[i].direction == 'horizontal') {
                deck3(userShipsInfo[i].decks[0].position.x, userShipsInfo[i].decks[0].position.y);
            }
            else {
                deck3_90(userShipsInfo[i].decks[0].position.x, userShipsInfo[i].decks[0].position.y);
            } 
        
        }
        for (var i = 3; i <= 5; i++) {
            if (userShipsInfo[i].direction == 'horizontal') {
                deck2(userShipsInfo[i].decks[0].position.x, userShipsInfo[i].decks[0].position.y);
            }
            else {
                deck2_90(userShipsInfo[i].decks[0].position.x, userShipsInfo[i].decks[0].position.y);
            } 
        }
        for (var i = 6; i <= 9; i++) {
            deck1(userShipsInfo[i].decks[0].position.x, userShipsInfo[i].decks[0].position.y);
        }

    }
    function deck4(x, y) {
        var imgDeck4 = new Image();
        imgDeck4.src = "../images/deck4.png";
        imgDeck4.onload = function() {
            contextMy.drawImage(imgDeck4, coordinateMatrix[x], coordinateMatrix[y], 197, 46);
        };
    };
    function deck4_90(x, y) {
        var imgDeck4_90 = new Image();
        imgDeck4_90.src = "../images/deck4_90.png";
        imgDeck4_90.onload = function() {
            contextMy.drawImage(imgDeck4_90, coordinateMatrix[x], coordinateMatrix[y], 46, 197);
        };
    };
    function deck3(x, y) {
        var imgDeck3 = new Image();
        imgDeck3.src = "../images/deck3.png";
        imgDeck3.onload = function() {
            contextMy.drawImage(imgDeck3, coordinateMatrix[x], coordinateMatrix[y], 147, 46);
        };
    };
    function deck3_90(x, y) {
        var imgDeck3_90 = new Image();
        imgDeck3_90.src = "../images/deck3_90.png";
        imgDeck3_90.onload = function() {
            contextMy.drawImage(imgDeck3_90, coordinateMatrix[x], coordinateMatrix[y], 46, 147);
        };
    };
    function deck2(x, y) {
        var imgDeck2 = new Image();
        imgDeck2.src = "../images/deck2.png";
        imgDeck2.onload = function() {
            contextMy.drawImage(imgDeck2, coordinateMatrix[x], coordinateMatrix[y], 93, 46);
        };
    };
    function deck2_90(x, y) {
        var imgDeck2_90 = new Image();
        imgDeck2_90.src = "../images/deck2_90.png";
        imgDeck2_90.onload = function() {
            contextMy.drawImage(imgDeck2_90, coordinateMatrix[x], coordinateMatrix[y], 46, 93);
        };
    };
    function deck1(x, y) {
        var imgDeck1 = new Image();
        imgDeck1.src = "../images/deck1.png";
        imgDeck1.onload = function() {
            contextMy.drawImage(imgDeck1, coordinateMatrix[x], coordinateMatrix[y], 46, 46);
        };
    };
    
    function windowToCanvas(canvas, x, y) {
        var box = canvas[0].getBoundingClientRect();
        return { x: x - box.left * (canvas[0].width / box.width),
            y: y - box.top * (canvas[0].height / box.height)
        };
    }; 
    
    function play(){
        if(isGameEnded == true) {
            document.getElementsByClassName("field-owner-name-me")[0].style.fontWeight = "normal";
            document.getElementsByClassName("field-owner-name-opponent")[0].style.fontWeight = "normal";
            $('#victoryModal').modal('show');
            //$('#lossModal').modal('show');
            return;
        }
        userMove();
    }
    function userMove() {
        document.getElementsByClassName("field-owner-name-me")[0].style.fontWeight = "bold";
        document.getElementsByClassName("field-owner-name-opponent")[0].style.fontWeight = "normal";
        canvasOpponent[0].onmousedown = function (e) {
            var loc = windowToCanvas(canvasOpponent, e.clientX, e.clientY);
            var x = identifyCell(loc.x);
            var y = identifyCell(loc.y);
            var result = user.shoot(x,y,enemy.playerField)
            if (result) {
                hit(x, y);
            } else {
                emptyCage(x, y);
                canvasOpponent[0].onmousedown = null;
                document.getElementsByClassName("field-owner-name-opponent")[0].style.fontWeight = "bold";
                document.getElementsByClassName("field-owner-name-me")[0].style.fontWeight = "normal";
                enemyMove();
            }
        }; 
    }

    function enemyMove() {
        let res = false;
        let cell;
        do{
            cell = enemy.toPlay(user.playerField);
            res = enemy.getEnemyStatus();
            if(res){
                hitEnemy(cell.x, cell.y);
            }
            else{
                emptyCageEnemy(cell.x,cell.y);
            }
        } while(res);
        play();
    }

    function identifyCell(coordinate) {
        for (var i = 0; i < sizeCoordinateMatrix - 1; i++) {
            if (coordinate < coordinateMatrix[i + 1]) {
                return i;
            }
        }
        return sizeCoordinateMatrix - 1;
    }

    function emptyCage(x, y) {
        var imgEmptyCage = new Image();
        imgEmptyCage.src = "../images/emptyCage.png";
        imgEmptyCage.onload = function() {
            contextOpponent.drawImage(imgEmptyCage, coordinateMatrix[x], coordinateMatrix[y], 51, 51);
        };        
    }
    
    function hit(x, y) {
        var imgHit = new Image();
        imgHit.src = "../images/hit.png";
        imgHit.onload = function() {
            contextOpponent.drawImage(imgHit, coordinateMatrix[x], coordinateMatrix[y], 51, 51);
        };
    }

    function emptyCageEnemy(x, y) {
        var imgEmptyCage = new Image();
        imgEmptyCage.src = "../images/emptyCage.png";
        imgEmptyCage.onload = function() {
            contextMy.drawImage(imgEmptyCage, coordinateMatrix[x], coordinateMatrix[y], 51, 51);
        };        
    }
    
    function hitEnemy(x, y) {
        var imgHit = new Image();
        imgHit.src = "../images/hit.png";
        imgHit.onload = function() {
            contextMy.drawImage(imgHit, coordinateMatrix[x], coordinateMatrix[y], 51, 51);
        };
    }
}