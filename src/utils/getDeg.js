const getDeg = function(oldPoint,newPoint){
    let arr = [newPoint[0] - oldPoint[0], newPoint[1] - oldPoint[1]];
    let deg = Math.acos(arr[0] / Math.sqrt(arr[0] * arr[0] + arr[1] * arr[1]));
    if (arr[0] < 0) {
        deg = -deg;
    }
    return deg;
}
export default getDeg;