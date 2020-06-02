let offscreen = null,
    ctx, x, y;

function drawLittleMap(data) {
    if ( offscreen === null ) {
        offscreen = data.canvas;
        ctx = offscreen.getContext("2d");
        ctx.fillStyle = "#00A0E9";
        
    } else {
        let {
            startX,
            startY,
            color,
            pos,
            scaleX,
            scaleY,
            // flag,
            mapid,
            width,
            height,
        } = data;
        x = startX ? startX : x;
        y = startY ? startY : y;
        color = color || "#f00";
        ctx.clearRect(0, 0, offscreen.width, offscreen.height);
        ctx.strokeStyle = "#000";
        if (pos.length) {
            drawBall(pos, scaleX, scaleY, mapid);
        }

        // if (flag === false) return;
        drawSquare(x, y, width, height, color);
    }
}


function drawBall(pos, scaleX, scaleY, mapid) { //坐标点是大地图的坐标点
    pos.forEach((value) => {
        if (value[2] === mapid) {
            ctx.beginPath();
            ctx.arc(value[0] * scaleX, value[1] * scaleY, 6, 0 * Math.PI, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    })
}

function drawSquare(x, y, width, height, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.rect(x - width / 2, y - height / 2, width, height);
    ctx.stroke();
}

export default drawLittleMap;