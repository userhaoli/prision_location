const littleMapFollow = function () {
    let startX = (window.innerWidth / 2 - this.sx) * this.littleCanvas.width / this.mapImg.width / this.scale;
    let startY = (window.innerHeight / 2 - this.sy) * this.littleCanvas.height / this.mapImg.height / this.scale;
    let elWidth = this.littleCanvas.width,elHeight = this.littleCanvas.height;
    let width = window.innerWidth / this.mapImg.width / this.scale * elWidth;
    let height = (window.innerHeight - 34)  / this.mapImg.height / this.scale * elHeight;
    this.drawLittleMap({
        shape: "square",
        data: {
            startX,
            startY,
            color: "#f00",
            pos: this.pos,
            scaleX: elWidth / this.mapImg.width,
            scaleY: elHeight / this.mapImg.height,
            mapid: this.$store.state.mapid,
            width: width,
            height: height
        }
    })
}
export default littleMapFollow;