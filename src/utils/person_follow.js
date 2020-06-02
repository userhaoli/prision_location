// function personFollow(x, y, flag) {
//     if (flag === false) return;
//     // callback ? callback(id) : '';
//     let viewWidth = window.innerWidth,
//         viewHeight = window.innerHeight;
//     let canvasX = x * this.scale + this.sx,
//         canvasY = y * this.scale + this.sy,
//         winWidth = window.innerWidth,
//         winHeight = window.innerHeight;
//     if (canvasX < 100 || canvasX > viewWidth - 100) {
//         this.sx = -(x * this.scale - winWidth / 2);
//         this.sy = -(y * this.scale - winHeight / 2);
//     }
//     if (canvasY < 120 || canvasY > viewHeight - 120) {
//         this.sx = -(x * this.scale - winWidth / 2);
//         this.sy = -(y * this.scale - winHeight / 2);
//     }
//     this.buffer = this.getBufferCanvas({
//             isShowTrack: this.isShowTrack,
//             isShowDefence: true
//         },
//         []
//     );
//     this.drawImage();
// }
// export default personFollow;

function personFollow(x, y, flag) {
    if (flag === false) return;
    this.sx = -(x * this.scale - window.innerWidth / 2);
    this.sy = -(y * this.scale - window.innerHeight / 2);
    this.buffer = this.getBufferCanvas({
            isShowTrack: this.isShowTrack,
            isShowDefence: true
        },
        []
    );
    this.drawImage();
}
export default personFollow;