function mapScale(e) {
    e.preventDefault();
    if (e.target !== this.canvas) {
      return;
    }
    let rateX = (e.clientX - this.sx) / this.scale;
    let rateY = (e.clientY - 34 - this.sy) / this.scale;
    this.scale = e.deltaY > 0 ? this.scale - 0.05 : this.scale + 0.05;
    this.scale = this.scale > this.maxScale ? this.maxScale : this.scale;
    this.scale = this.scale < this.minScale ? this.minScale : this.scale;
    this.sx = (1 - this.scale) * rateX + e.clientX - rateX;
    this.sy = (1 - this.scale) * rateY + e.clientY - 34 - rateY;
    this.buffer = this.getBufferCanvas({
        isShowTrack: this.isShowTrack,
        isShowDefence: true
      }, this.$store.state.chartArr)
      this.drawImage();
  }
  export default mapScale;