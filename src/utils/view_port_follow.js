function viewPortFollow(startX, startY) {
    let rateX = startX / this.littleCanvas.width;
    let rateY = startY / this.littleCanvas.height;
    this.sx = -(rateX * this.img.width * this.scale - window.innerWidth / 2);
    this.sy = -(rateY * this.img.height * this.scale - window.innerHeight / 2);
    this.buffer = this.getBufferCanvas({
            isShowTrack: this.isShowTrack,
            isShowDefence: true
        }, this.$store.state.chartArr),
        this.drawImage();
}

export default viewPortFollow;