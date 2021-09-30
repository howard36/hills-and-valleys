var items, itemGrid, totalHeight, players, selectedPlayer;

function init(level) {
    curLevel = level;
    let initGrid = levels[level];
    let m = initGrid.length;
    let n = initGrid[0].length;

    // make sure it's a rectangle
    for (let i = 0; i<m; i++) {
        console.assert(initGrid[i].length == n);
    }

    items = [];
    itemGrid = [];
    totalHeight = [];
    players = [];
    selectedPlayer = 0;
    for (let i = 0; i<m; i++) {
        itemGrid.push([]);
        totalHeight.push([]);
        for (let j = 0; j<n; j++) {
            itemGrid[i].push([]);
            totalHeight[i].push(0);
            for (let k = 0; k<initGrid[i][j].length; k++) {
                let item = {
                    "id": items.length,
                    "pos": [i, j, totalHeight[i][j]]
                };
                if (k == 0) {
                    item["type"] = "ground";
                    item["height"] = initGrid[i][j][k];
                }
                else {
                    let type = initGrid[i][j][k].substring(0, 2);
                    if (type == "Ba") {
                        item["type"] = "ball";
                        item["height"] = 1;
                    } else if (type == "Cu") {
                        item["type"] = "cube";
                        item["height"] = 1;
                    } else if (type == "Cx") {
                        item["type"] = "cylinder";
                        item["height"] = 1;
                        item["dir"] = "x";
                    } else if (type == "Cy") {
                        item["type"] = "cylinder";
                        item["height"] = 1;
                        item["dir"] = "y";
                    } else if (type == "Ta") {
                        item["type"] = "target";
                        item["height"] = 0;
                    } else if (type == "Sp") {
                        item["type"] = "spikes";
                        item["height"] = 0;
                    } else if (type == "St") {
                        item["type"] = "sticky";
                        item["height"] = 0;
                    }
                    if (["Ba", "Cu", "Cx", "Cy"].includes(type)) {
                        if (initGrid[i][j][k].length == 3) {
                            item["player id"] = parseInt(initGrid[i][j][k].charAt(2));
                            players[item["player id"]] = item["id"];
                        }
                    } else if (type == "Ta") {
                        item["target id"] = parseInt(initGrid[i][j][k].charAt(2));
                    }
                }
                items.push(item);
                itemGrid[i][j].push(item["id"]);
                totalHeight[i][j] += item["height"];
            }
        }
    }
    display();
};

function under(id) {
    let pos = items[id]["pos"];
    let idx = itemGrid[pos[0]][pos[1]].indexOf(id);
    return itemGrid[pos[0]][pos[1]][idx-1];
};

function step(id, dir) {
    let pos = items[id]["pos"];
    let next = [pos[0] + dir[0], pos[1] + dir[1], pos[2]];
    if (totalHeight[next[0]][next[1]] <= next[2]) {
        let fall = totalHeight[next[0]][next[1]] < next[2];
        items[id]["pos"] = [next[0], next[1], totalHeight[next[0]][next[1]]];
        totalHeight[pos[0]][pos[1]] -= items[id]["height"];
        totalHeight[next[0]][next[1]] += items[id]["height"];
        let idx = itemGrid[pos[0]][pos[1]].indexOf(id);
        itemGrid[pos[0]][pos[1]].splice(idx, 1);
        itemGrid[next[0]][next[1]].push(id);
        if (fall)
            return false;
        let id2 = under(id);
        let type2 = items[id2]["type"];
        if (type2 == "spikes" || type2 == "sticky")
            return false;
        return true;
    } else {
        let curHeight = 0, idx = 0;
        while (curHeight + items[itemGrid[next[0]][next[1]][idx]]["height"] <= next[2]) {
            curHeight += items[itemGrid[next[0]][next[1]][idx]]["height"];
        }
        let id2 = itemGrid[next[0]][next[1]][idx];
        let type2 = items[id2]["type"];
        if (["ball", "cube", "cylinder"].includes(type2)) {
            move(id2, dir);
        }
        return false;
    }
};

function move(id, dir) {
    let type = items[id]["type"];
    let roll = (type == "ball" || (type == "Cx" && dir[0] == 0) || (type == "Cy" && dir[1] == 0))
    do {
        roll = step(id, dir) && roll;
    } while (roll);
    display();
};

function checkWin() {
    let good = true;
    for (let i = 0; i<players.length; i++) {
        if (items[under(players[i])]["target id"] != items[players[i]]["player id"]) {
            good = false;
        }
    }
    if (good) {
        levelEnd();
    }
};

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 37) { // left
        move(players[selectedPlayer], [0, -1]);
        checkWin();
    } else if (e.keyCode == 38){ // up
        move(players[selectedPlayer], [-1, 0]);
        checkWin();
    } else if (e.keyCode == 39){ // right
        move(players[selectedPlayer], [0, 1]);
        checkWin();
    } else if (e.keyCode == 40){ // down
        move(players[selectedPlayer], [1, 0]);
        checkWin();
    }
});

