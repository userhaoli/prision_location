// let baseUrl = "http://10.1.200.20:8001/api";
// let wsUrl = "ws://10.1.200.20:8001/ws";
// let imgUrl = "http://10.1.200.20:8001/static/images"; 
// let httpFlvServer  = "ws://10.1.1.194:8888/rtsp";    //摄像头推流服务 lfq
// let cameraImgUrl = "http://10.1.200.20:8001/static/camera"; //历史图片地址

// let baseUrl = "http://10.1.200.20:8000/api";
// let wsUrl = "ws://10.1.200.20:8000/ws";
// let imgUrl = "http://10.1.200.20:8000/static/images"; 
// let httpFlvServer  = "ws://10.1.1.194:8888/rtsp";    //摄像头推流服务 lfq
// let cameraImgUrl = "http://10.1.200.20:8000/static/camera"; //历史图片地址

// let baseUrl = "http://10.1.200.20:8100/api";
// let wsUrl = "ws://10.1.200.20:8003/ws";
// let imgUrl = "http://10.1.200.20:8100/static/images"; 
// let httpFlvServer  = "ws://10.1.1.194:8888/rtsp";    //摄像头推流服务 lfq
// let cameraImgUrl = "http://10.1.200.20:8100/static/camera"; //历史图片地址


let baseUrl = "http://117.172.255.144:18000/api";
let wsUrl = "ws://117.172.255.144:18000/ws";
let imgUrl = "http://117.172.255.144:18000/static/images";
let peronUrl = "http://117.172.255.144:18000/";
let httpFlvServer  = "ws://117.172.255.144:38888/rtsp/200430";    //摄像头推流服务 lfq
let cameraImgUrl = "http://117.172.255.144:18000/static/camera"; //历史图片地址

// let baseUrl = "http://10.1.200.21:8000/api";
// let wsUrl = "ws://10.1.200.21:8003/ws";
// let imgUrl = "http://10.1.200.21:8000/static/images"; 
// let httpFlvServer  = "ws://10.1.1.194:8888/rtsp";    //摄像头推流服务 lfq
// let cameraImgUrl = "http://10.1.200.21:8000/static/camera"; //历史图片地址
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