// let arr = [{pos:[200,400]},{pos:[400,600]},{pos:[200,400]},{pos:[200,400]},{pos:[200,400]},{pos:[200,400]},{pos:[200,400]}];
// arr.forEach(value=>{

// })
const forward = function (forwardArr) {
    this.ctx.beginPath();
    if(forwardArr.length<3) return;
    // this.ctx.moveTo(forwardArr[0][0], forwardArr[0][1]);
    let last2x, last2y, last1x, last1y, nowX, nowY, nextX, nextY, cp1x, cp1y, cp2x, cp2y;
    forwardArr.forEach((value, index) => {
        if (index === 0) {
            this.ctx.lineTo(value[0], value[1]);
            return;
        } else if (index === 1) {
            last2x = forwardArr[index - 1][0];
            last2y = forwardArr[index - 1][1];
            //下一个点
            nextX = forwardArr[index + 1][0];
            nextY = forwardArr[index + 1][1];
        } else if (index === forwardArr.length - 1) {
            //下一个点
            nextX = value[0];
            nextY = value[1];
        } else {
            //上两个点
            last2x = forwardArr[index - 2][0];
            last2y = forwardArr[index - 2][1];
            //下一个点
            nextX = forwardArr[index + 1][0];
            nextY = forwardArr[index + 1][1];
        }
        //上一个点
        last1x = forwardArr[index - 1][0];
        last1y = forwardArr[index - 1][1];
        //当前点
        nowX = value[0];
        nowY = value[1];
        //第一个控制点
        cp1x = last1x + (nowX - last2x) * 0.2;
        cp1y = last1y + (nowY - last2y) * 0.2;
        //最后一个控制点
        cp2x = nowX - (nextX - last1x) * 0.2;
        cp2y = nowY - (nextY - last1y) * 0.2;
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nowX, nowY);
    })
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = 'source-over';
}
const trackBack = function (arr,forwardArr) {
    return setInterval(()=> {
        forward.call(this,forwardArr);
        forwardArr.push(arr[0])
        arr.splice(0,1);
    }, 300)
}
export default trackBack;