function drawArc(event, getBuffer) {
    let e = event || window.event;
    if (e.target !== this.littleCanvas) return;
    if (this.litMapflag === false) return;
    if (this.$store.state.followPerson) {
        this.$store.state.followPerson.follow = false;
    }
    this.isfollowing = false;
    this.newTime = +new Date();
    if (this.newTime - this.oldTime < 15) return;
    let startX = e.offsetX,
        startY = e.offsetY,
        elWidth = this.$refs.littleCanvas.offsetWidth,
        elHeight = this.$refs.littleCanvas.offsetHeight;
    let width = (window.innerWidth / this.mapImg.width / this.scale) * elWidth;
    let height = (window.innerHeight / this.mapImg.height / this.scale) * elHeight;
    this.drawLittleMap({
        shape: "square",
        data: {
            startX,
            startY,
            width: width,
            height: height,
            color: "#f00",
            pos: this.pos,
            scaleX: elWidth / this.mapImg.width,
            scaleY: elHeight / this.mapImg.height
        }
    })
    this.viewPortFollow(startX, startY, getBuffer);
    this.oldTime = this.newTime;
}

export default drawArc;