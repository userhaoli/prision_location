// import params from "@/apis/commonParams.js";
// import {
//     getCookie
// } from '@/utils/cookie_set.js';
// //修改围栏数据
// const putDefenceData = function (data,id) {
//     let stationid = getCookie("stationid");
//     let token = getCookie("token");
//     return new Promise(function (resolve, reject) {
//         var xhr = new XMLHttpRequest();
//         xhr.open('put', `${params.baseUrl}/fence/${id}/`);
//         xhr.setRequestHeader("token",token); 
//         xhr.setRequestHeader("stationid",stationid); 
//         xhr.send(data);
//         xhr.onreadystatechange = function () {
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
//                     resolve(xhr.responseText);
//             } else {
//                 reject(new Error("Request was unsuccessful: " + xhr.statusText));
//             }
//         }
//     })
// }

// export default putDefenceData;