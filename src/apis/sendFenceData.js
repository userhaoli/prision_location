// import params from "@/apis/commonParams.js";
// import {
//     getCookie
// } from '@/utils/cookie_set.js';
// //发送围栏数据
// const sendData = function (data) {
//     let stationid = getCookie("stationid");
//     let token = getCookie("token");
//     return new Promise(function (resolve, reject) {
//         var xhr = new XMLHttpRequest();
//         xhr.open('post', `${params.baseUrl}/fence/`);
//         xhr.setRequestHeader("token",token); 
//         xhr.setRequestHeader("stationid",stationid); 
//         xhr.send(data);
//         xhr.onreadystatechange = function () {
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//                 resolve(xhr.responseText);
//             } else {
//                 reject(new Error("Request was unsuccessful: " + xhr.statusText));
//             }
//         }
//     })
// }

// export default sendData;