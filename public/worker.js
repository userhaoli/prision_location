let offscreen = null,
    ctx, x, y;
//     ctx, imgBaseUrl, person = null;
this.addEventListener("message", (e) => {
    // console.log("e",e)
    let data = e.data;
    if (offscreen == null ) {
        // console.log("offscreen",offscreen)
        offscreen = data.canvas;
        ctx = offscreen.getContext("2d");
        ctx.fillStyle = "#00A0E9";
    }
    //  else if (data.name === "arc") {
    //     drawArc(data.data);
    // } else if (data.name === "square") {
    //     drawSquare(data.data);
    // }
    else {
        let {
            startX,
            startY,
            color,
            pos,
            scaleX,
            scaleY,
            flag,
            mapid,
            width,
            height
        } = data.data;
        x = startX ? startX : x;
        y = startY ? startY : y;
        color = color || "#f00";
        ctx.clearRect(0, 0, offscreen.width, offscreen.height);
        ctx.strokeStyle = "#000"
        if (pos.length) {
            drawBall(pos, scaleX, scaleY, mapid);
        }
        if (flag === false) return;
        drawSquare(x, y, width, height, color);
    }
})

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

// function drawArc(parmas) {
//     let width = offscreen.width,
//         height = offscreen.height;
//     ctx.beginPath();
//     ctx.strokeStyle = color || "#f00";
//     // startX = startX < r ? r + 1 : startX; //左边界
//     // startY = startY < r ? r + 1 : startY; //上边界
//     // startX = startX < width - r ? startX : width - r - 1; //右边界
//     // startY = startY < height - r ? startY : height - r - 1; //右边界
//     ctx.arc(startX, startY, r, 0 * Math.PI, 2 * Math.PI);
//     ctx.closePath();
//     ctx.stroke();
// }

function drawSquare(x, y, width, height, color) {
    // width = width > 330 ? 330 : width;
    // height = height > 148 ? 148 : height;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.rect(x - width / 2, y - height / 2, width, height);
    ctx.stroke();
}