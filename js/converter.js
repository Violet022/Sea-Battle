function convertLightShipInfoToPlayerInfo(allLightShips, role) {
    let player = role == 'user' ? new User(10) : new Enemy(10, localStorage.getItem("level"));
    for(let i = 0; i < 10; i++) {
        let lightShip = allLightShips[i];
        let playerShip = player.ships[i];

        playerShip.direction = lightShip.direction;

        for(let d = 0; d < lightShip.decksNum; d++) {
            let deck = playerShip.decks[d];
            let curCell = player.playerField.getCell(lightShip.x[d], lightShip.y[d]);

            deck.setPosition(curCell);
        }
    }
    return player;
}
