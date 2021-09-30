var curLevel;

init(0);

function levelEnd() {
    alert('You beat level ' + curLevel);
    curLevel++;
    init(curLevel);
}
