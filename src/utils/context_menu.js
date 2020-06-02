function contextMenu(e) {
    if (this.isDrawDefence === false) return;
    e.preventDefault();
    this.position = {
        left: e.clientX + "px",
        top: e.clientY + "px",
        display: "block",
    };
}
export default contextMenu;