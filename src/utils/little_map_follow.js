const littleMapFollow = function () {
    let startX = (window.innerWidth / 2 - this.sx) * this.littleCanvas.width / this.img.width / this.scale;
    let startY = (window.innerHeight / 2 - this.sy) * this.littleCanvas.height / this.img.height / this.scale;
    let elWidth = this.littleCanvas.width,elHeight = this.littleCanvas.height;
    let width = window.innerWidth / this.img.width / this.scale * elWidth;
    let height = (window.innerHeight - 34)  / this.img.height / this.scale * elHeight;
    this.drawLittleMap({
        shape: "square",
        data: {
            startX,
            startY,
            color: "#f00",
            pos: this.pos,
            scaleX: elWidth / this.img.width,
            scaleY: elHeight / this.img.height,
            mapid: this.$store.state.mapid,
            width: width,
            height: height
        }
    })
}
export default littleMapFollow;