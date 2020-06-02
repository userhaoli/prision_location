//小地图初始化
function littleMapInit() {
    const offscreen = document
        .getElementById("innerCanvas")
        .transferControlToOffscreen();
    this.worker.postMessage({
            name: "Init",
            mode: "transfer",
            canvas: offscreen
        },
        [offscreen]
    );
}

export default littleMapInit;