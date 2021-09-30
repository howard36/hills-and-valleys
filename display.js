var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var groundColor = {
    "-1": "#ff00ff",
    0: "#ff0000",
    1: "#ffff00",
    2: "#00ff00",
};


function display() {
    let m = itemGrid.length;
    let n = itemGrid[0].length;
    for (let i = 1; i<m-1; i++) {
        for (let j = 1; j<n-1; j++) {
            for (let k = 0; k<itemGrid[i][j].length; k++) {
                let id = itemGrid[i][j][k];
                let item = items[id];
                let type = item["type"];
                if (type == "ground") {
                    ctx.fillStyle = groundColor[item["height"]];
                    ctx.fillRect(j*50, i*50, 50, 50);
                } else if (type == "ball") {
                    ctx.fillStyle = "#00ffff";
                    ctx.beginPath();
                    ctx.arc(50*j + 25, 50*i + 25, 20, 0, 2*Math.PI);
                    ctx.fill();
                } else if (type == "target") {
                    ctx.fillStyle = "#0000ff";
                    ctx.beginPath();
                    ctx.arc(50*j + 25, 50*i + 25, 20, 0, 2*Math.PI);
                    ctx.fill();
                }
            }
        }
    }
}

canvas.addEventListener('click', function() {
    alert('clicked');
});
