function mapDrag(e) {
    e.preventDefault();
    if (e.target !== this.canvas) return;
    // let { isDrag,oldTime,mousePos,canvas,img,person}  = this
    if (this.isDrag === false) return;
    if(this.$store.state.followPerson){
        this.$store.state.followPerson.follow = false;
    }
    this.isfollowing = false;
    this.newTime = +new Date();
    if (this.newTime - this.oldTime < 10) return;
    this.mousePos.x = Math.abs(this.mousePos.x - e.clientX) > 1 ? this.mousePos.x : e.clientX;
    this.mousePos.y = Math.abs(this.mousePos.y - e.clientY) > 1 ? this.mousePos.y : e.clientY;
    this.sx += e.clientX - this.mousePos.x;
    this.sy += e.clientY - this.mousePos.y;
    let maxSx = this.getOffset({
            x: 0,
            y: 0
        }, {
            x: 0,
            y: 0
        }).x,
        minSx = this.getOffset({
            x: this.canvas.width,
            y: 0
        }, {
            x: this.img.width,
            y: 0
        }).x,
        maxSy = this.getOffset({
            x: 0,
            y: 30,
        }, {
            x: 0,
            y: 0
        }).y,
        minSy = this.getOffset({
            x: 0,
            y: this.canvas.height
        }, {
            x: 0,
            y: this.img.height
        }).y;
    if (maxSx <= minSx) {
        this.sx = maxSx;
    } else if (this.sx > maxSx) {
        this.sx = maxSx;
    } else if (this.sx < minSx) {
        this.sx = minSx;
    }
    if (maxSy <= minSy) {
        this.sy = maxSy;
    } else if (this.sy > maxSy) {
        this.sy = maxSy;
    } else if (this.sy < minSy) {
        this.sy = minSy
    }
    this.buffer = this.getBufferCanvas({
        isShowTrack: this.isShowTrack,
        isShowDefence: true
    }, this.$store.state.chartArr);
    this.drawImage();
    this.mousePos = {
        x: e.clientX,
        y: e.clientY
    };
    this.oldTime = this.newTime;

}
export default mapDrag;