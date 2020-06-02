function drag(el){
    let isDrag = false,
        oldClientX = 0,
        oldClientY = 0;
    el.addEventListener("mousedown", e => {
        e.stopPropagation();
        isDrag = true;
        oldClientX = e.clientX;
        oldClientY = e.clientY;
      });
      window.addEventListener("mousemove", e => {
        if (isDrag === false) return;
        let left = window.getComputedStyle(el, null)["left"];
        let top = window.getComputedStyle(el, null)["top"];
        el.style.left = parseInt(left) + e.clientX - oldClientX + "px";
        el.style.top = parseInt(top) + e.clientY - oldClientY + "px";
        oldClientX = e.clientX;
        oldClientY = e.clientY;
      });
      window.addEventListener("mouseup", () => {
        isDrag = false;
        oldClientX = 0;
        oldClientY = 0;
      });
      el.addEventListener("touchstart", e => {
        e.stopPropagation();
        isDrag = true;
        oldClientX = e.targetTouches[0].pageX;
        oldClientY = e.targetTouches[0].pageY;
      },{ passive: false });
      window.addEventListener("touchmove", e => {
        if (isDrag === false) return;
        let left = window.getComputedStyle(el, null)["left"];
        let top = window.getComputedStyle(el, null)["top"];
        el.style.left = parseInt(left) +  e.targetTouches[0].pageX - oldClientX + "px";
        el.style.top = parseInt(top) + e.targetTouches[0].pageY - oldClientY + "px";
        oldClientX = e.targetTouches[0].pageX;
        oldClientY = e.targetTouches[0].pageY;
      });
      window.addEventListener("touchend", () => {
        isDrag = false;
        oldClientX = 0;
        oldClientY = 0;
      });
}

export default drag;