let offscreen = null,
    ctx, scale;
//     ctx, imgBaseUrl, person = null;
this.addEventListener("message", (e) => {
    if (e.name === "Init") {
        offscreen = new OffscreenCanvas(e.data.width, e.data.height);
        ctx = offscreen.getContext("2d");
        ctx.fillStyle = "#00A0E9";
    } else if(e.shape === "ball") {
        scale = e.scale
        drawBall(e.pos);
    } else if(e.shape === "arc"){
        drawArc(e.data);
    }else if(e.shape === "square"){
        drawSquare(e.data);
    }
    TransferBuffer();
})

function drawBall(pos) {
    ctx.clearReact(0, 0, offscreen.width, offscreen.height);
    pos.forEach((value) => {
        ctx.beginPath();
        ctx.arc(value[0] * scale, value[1] * scale, 3, 0 * Math.PI, 2 * Math.PI);
        ctx.fill();
    })
}

function drawArc(parmas) {
    let {
        startX,
        startY,
        r,
        color
    } = parmas;
    let width = offscreen.width,
        height = offscreen.height;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = color || "#f00";
    startX = startX < r ? r + 1 : startX; //左边界
    startY = startY < r ? r + 1 : startY; //上边界
    startX = startX < width - r ? startX : width - r - 1; //右边界
    startY = startY < height - r ? startY : height - r - 1; //右边界
    ctx.arc(startX, startY, r, 0 * Math.PI, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}

function drawSquare(parmas) {
    let {
        startX,
        startY,
        width,
        height,
        color
    } = parmas;
    ctx.clearRect(0, 0, offscreen.width, offscreen.height);
    ctx.beginPath();
    ctx.strokeStyle = color || "#f00";
    ctx.arc(startX - width / 2, startY - height / 2, width, height);
}
function TransferBuffer() {
    let image_bitmap = offscreen.transferToImageBitmap();
    postMessage({name:"TransferBuffer", buffer:image_bitmap},
      [image_bitmap]);
  }
