let baseUrl = "http://117.172.255.144:18000/api";
let wsUrl = "ws://117.172.255.144:18000/ws";
let imgUrl = "http://117.172.255.144:18000/static/images";
let peronUrl = "http://117.172.255.144:18000/";
let httpFlvServer  = "ws://117.172.255.144:38888/rtsp/200430";    //摄像头推流服务 lfq
let cameraImgUrl = "http://117.172.255.144:18000/static/camera"; //历史图片地址
let cameraCount = 4;//支持同时播放摄像头数量 lfq
const params = {
    baseUrl: baseUrl,
    peronUrl:peronUrl,
    wsUrl: wsUrl,
    imgUrl:imgUrl,
    httpFlvServer: httpFlvServer, //摄像头推流服务 lfq
    cameraImgUrl:cameraImgUrl,  
    cameraCount:cameraCount 
}
export default params;