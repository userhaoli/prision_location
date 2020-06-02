const viewPortCenter = function (x, y) {
    this.sx = -(x * this.scale - window.innerWidth / 2);
    this.sy = -(y * this.scale - window.innerHeight / 2);
    // this.buffer = getBuffer({
    //     width: this.canvas.width,
    //     height: this.canvas.height,
    //     bgImg: this.img,
    //     sx: this.sx,
    //     sy: this.sy,
    //     scale: this.scale,
    //     person: this.person,
    //     baseStation: this.$store.state.baseStation,
    //     camera: this.$store.state.camera,
    //     mapid:this.$store.state.mapid,
    //     name: "person",
    //     flag: {
    //         isShowTrack: this.isShowTrack,
    //         isShowDefence: true
    //     },
    //     point: this.defenceArr,
    //     defenceImgArr: this.$store.state.defenceImgArr
    // });
    this.buffer = this.getBufferCanvas({
            isShowTrack: this.isShowTrack,
            isShowDefence: true
        }, this.$store.state.chartArr),
        this.drawImage();
}

export default viewPortCenter;