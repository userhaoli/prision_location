
    
    // const ws = new WebSocket();
   
   
    // ws.onopen = function () {
    //     worker.postMessage({
    //         name: "Init",
    //         mode: "commit",
    //         startPos: [],
    //         canvas: offscreen
    //     }, [offscreen])
    //     alert("已建立连接!!!!")
    // }

    // ws.onmessage = function (e) {
    //     let personData = e.data;
    //     worker.postMessage({name:"move",data:personData});
    // };

    // ws.onclose = function () {
    //     worker.terminate();
    //     alert("连接已关闭...");
    // };

// function littleMapInit(){
//     let canvas = document.getElementById("littleCanvas");
//     let offscreen = canvas.transferControlToOffscreen();  //离屏canvas
//     const worker = new Worker("@/utils/webWorker/worker.js");
//     worker.postMessage({
//         name: "Init",
//         mode: "commit",
//         canvas: offscreen
//     }, [offscreen])
// }