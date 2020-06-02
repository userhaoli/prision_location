function Basestation(width, height, startX, startY,mapid,id,is_selected,check){
    this.width = width;
    this.height = height;
    this.startX = startX;
    this.startY = startY;
    // this.isSelected = false;
    this.mapid = mapid;
    this.id = id;
    this.is_selected = is_selected;
    this.checked = check;
    this.i = 0;
    this.status = true;
}
export default Basestation;