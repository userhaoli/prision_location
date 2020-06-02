const showDefenceImg = function(src){
 const img = new Image();
 img.src = src;
 img.onload = ()=>{
    this.ctx.clearReact()
    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.sx, this.sy, this.img.width * this.scale, this.img.height * this.scale);
    this.ctx.drawImage(img, 0, 0, img.width, img.height, this.sx, this.sy, img.width * this.scale, img.height * this.scale);
 }
}
export default showDefenceImg;