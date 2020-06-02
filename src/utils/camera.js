function Camera(width, height, startX, startY, mapid, id, is_selected, check, direction) {
    this.width = width;
    this.height = height;
    this.startX = startX;
    this.startY = startY;
    this.mapid = mapid;
    this.id = id;
    this.is_selected = is_selected;
    this.checked = check;
    this.i = 0;
    this.status = true;
    this.isFirst = true;
    this.direction = direction;
}
export default Camera;