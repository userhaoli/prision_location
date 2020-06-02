/**
 * 绘制基础图形
 * @param {Array}  data  数据点[ , ]
 * @param {Object} context 绘图上下文
 */
function drawBasicImg(data, context, scaleW, scaleH) {
    data.forEach(point => {
        let [x, y] = point;
        y = y * scaleH;
        x = x * scaleW;
        let n = Math.random()*10+10;
        context.beginPath();
        context.arc(x, y, n, 0, 2 * Math.PI);
        context.closePath();
        let grd = context.createRadialGradient(x, y, 0, x, y, n);
        grd.addColorStop(0, "rgba(0,0,0,255)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = grd;
        context.fill();
    })
}
const pallet = (function () {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 20;
    canvas.height = 256;
    const colorStops = {
        0: "#0ff",
        0.3: "#0f0",
        0.6: "#ff0",
        1: "#f00",
    };
    let linearGradient = ctx.createLinearGradient(0, 0, 20, 256);
    for (let key in colorStops) {
        linearGradient.addColorStop(key, colorStops[key]);
    }
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, 20, 256);
    return ctx.getImageData(0, 0, 1, 256).data;
})()
/**
 * 取色
 * @param {Number} a 透明度
 * @return {Array.<Number>} [r, g, b]
 */
function getColor(a) {
    return pallet.slice(4 * a, 4 * a + 3);
}
/**
 * 染色
 * @param {Object}  context  绘图上下文
 */
function dye(context) {
    let imgData = context.getImageData(0, 0, 400, 300);
    let length = imgData.data.length;
    for (var i = 0; i < length; i += 4) {
        let color = getColor(imgData.data[i + 3]);
        imgData.data[i] = color[0];
        imgData.data[i + 1] = color[1];
        imgData.data[i + 2] = color[2];
    }
    context.putImageData(imgData, 0, 0);
}
//渲染
function render(data, context, scaleW, scaleH) {
    drawBasicImg(data, context, scaleW, scaleH);
    dye(context);
}

export default render;