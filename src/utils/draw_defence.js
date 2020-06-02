function drawDefence() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#f00";
    this.ctx.fillStyle = "rgba(0,166,123,0.2)"
    this.clickPoint.forEach((value, index) => {
      if (index === 0) {
        this.ctx.moveTo(value[0], value[1]);
      } else {
        this.ctx.lineTo(value[0], value[1]);
      }
    });
    // this.order==="confirm" && this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  }

  export default drawDefence;