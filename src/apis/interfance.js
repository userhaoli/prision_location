import axios from 'axios';
// import Qs from 'qs';
import params from "@/apis/commonParams.js";
import {
    getCookie
} from '@/utils/cookie_set.js';
let baseURL = params.baseUrl;
// var instance = axios.create({
//     timeout: 1000 * 6
// });
// axios.defaults.headers.common['cookieeee'] = 11111;
axios.interceptors.request.use(
    config => {
        //   config.headers.token = JSON.stringify({stationid:1,token:2})
        let stationid = getCookie("stationid");
        let token = getCookie("token");
        config.headers = {
            "stationid": stationid,
            "token": token,
            "Accept": 'application/json',
            "Content-Type": 'application/json;charset=UTF-8'
            // "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'

        }
        return config;
    },
    error => {
        return Promise.error(error);
    }
);


let reg = /^2\d{2}$/;
axios.interceptors.response.use(
    // 请求成功
    res => reg.test(res.status) || res.status == 304 ? Promise.resolve(res) : Promise.reject(res),
    // 请求失败
    error => {
        const {
            response
        } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            // errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // store.commit('changeNetwork', false);
            return Promise.reject("网络连接失败")
        }
    });

//用户登录 lfq
export function login(data) {
    return axios.post(
        baseURL + `/login/`, JSON.stringify(data)
    ).then(data => data.data)
}
//获取地铁站点详细信息 lfq
export function getMapByStation(stationid) {
    return axios.get(
        baseURL + `/map/?station=${stationid}`
    ).then(data => data.data)
}
//获取所有地铁站点信息 lfq
export function getAllStation() {
    return axios.get(
        baseURL + `/stations/`
    ).then(data => data.data)
}

//获取未处理的报警信息
export function getUnprocessedData() {
    return axios.get(
        baseURL + `/alarmdata/unprocessed/`
    )
}

//发送已处理的报警信息
export function postProcessedData(alarmid) {
    return axios.get(
        baseURL + `/alarmdata/unprocessed?alarmid=${alarmid}`
    ).then((data) => data.data)
}

//获取小地图信息
export function getMinMap() {
    return axios.get(
        baseURL + `/minmap/`
    ).then(data => data.data)
}
//获取大地图信息
export function getMap(id) {
    return axios.get(
        baseURL + `/map/${id}/`
    ).then(data => data.data)
}
//获取所有大地图信息 lfq
export function getAllMap() {
    return axios.get(
        baseURL + `/map/`
    ).then(data => data.data)
}

//获取部门类型
export function getDepType() {
    return axios.get(
        baseURL + `/person/dep/`
    ).then(data => data.data)
}
//获取等级类型
export function getLevelType() {
    return axios.get(
        baseURL + `/person/level/`
    ).then(data => data.data)
}
//获取所有人员列表
export function getAllPerson() {
    return axios.get(
        baseURL + `/person/?size=200`
    ).then(data => data.data)
}
//获取某一页人员列表
export function getPagePerson(page, type) {
    return axios.get(
        baseURL + `/person/?size=10&page=${page}&type=${type}`
    ).then(data => data.data)
}
//搜索人员
export function getSearchResult(value, type, page, size) {
    let {
        name,
        polid
    } = value;
    name = name === undefined ? "" : name;
    polid = polid === undefined ? "" : polid;
    type = type == 2 ? '' : type;
    page = page === undefined ? 1 : page;
    size = size ? size : 10;
    return axios.get(
        baseURL + `/person/?size=${size}&page=${page}&name=${name}&pid=${polid}&type=${type}`
    ).then(data => data.data)
}

//获取人员的详细信息
export function getPersonMsg(id) {
    return axios.get(
        baseURL + `/person/${id}/`
    ).then(data => data.data)
}
//分类筛选人员
// export function getClassPerson(type) {
//     return axios.get(
//         baseURL + `/person/?name=&polid=&sex=&type=${type}`
//     ).then(data => data.data)
// }

//获取人员职务类型
export function getPersonType() {
    return axios.get(
        baseURL + `/person_type/`
    ).then(data => data.data)
}

//获取报警信息
export function getAlarmData(page) {
    return axios.get(
        baseURL + `/alarmdata/?size=10&page=${page}`
    ).then(data => data.data)
}
//获取报警信息
export function getAllAlarmData() {
    return axios.get(
        baseURL + `/alarmdata/?size=10000`
    ).then(data => data.data)
}


//获取报警类型
export function getAlarmType() {
    return axios.get(
        baseURL + `/alarmtype/`
    ).then(data => data.data)
}
//获取未处理的报警信息
export function getUnhandleAlarm() {
    return axios.get(
        baseURL + `/alarmdata/?status=0&typeid=&starttime=&endtime=`
    ).then(data => data.data)
}
// //分类筛选报警信息
// export function getAlamDataByContdition(level, status, typeid, currentPage) {
//     return axios.get(
//         baseURL + `/alarmdata/?level=${level}&status=${status}&typeid=${typeid}&page=${currentPage}`
//     ).then(data => data.data)
// }
//分类筛选报警信息 lfq
export function getAlamDataByContdition(level, status, typeid, startTime, endTime, currentPage, size) {
    size = size ? size : 10;
    // startTime = startTime ? startTime : '';
    // endTime = endTime ? endTime : '';
    return axios.get(
        baseURL + `/alarmdata/?size=${size}&level=${level}&status=${status}&typeid=${typeid}&starttime=${startTime}&endtime=${endTime}&page=${currentPage}`
    ).then(data => data.data)
}
//编辑报警设置
export function editAlarmSet(data, id) {
    return axios.put(
        baseURL + `/alarmtype/${id}/`, data
    ).then(data => data.data)
}
//处理报警信息
export function handleAlarmData(id) {
    return axios.put(
        baseURL + `/alarmdata/${id}/`
    ).then(data => data.data)
}
//获取报警详情
export function getAlarmDetail(id) {
    return axios.get(
        baseURL + `/alarmdata/${id}/`
    ).then(data => data.data)
}

//获取所有基站
export function getAllBaseStation() {
    return axios.get(
        baseURL + `/equipment/basestation/?size=200`
    ).then(data => data.data)
}
//获取某些基站
export function screenStation(mapid, ip) {
    ip = ip || '';
    mapid = mapid == 5 ? '' : mapid;
    return axios.get(
        baseURL + `/equipment/basestation/?size=200&map=${mapid}&ip=${ip}&fullIp=`
    ).then(data => data.data)
}

//获取一页基站
export function getBaseStationPage(page) {
    return axios.get(
        baseURL + `/equipment/basestation/?size=10&page=${page}`
    ).then(data => data.data)
}

//获取某个基站的信息
export function getBaseStationData(id) {
    return axios.get(
        baseURL + `/equipment/basestation/${id}/`
    ).then(data => data.data)
}
//发送基站数据
export function postStationMsg(data) {
    return axios.post(
        baseURL + `/equipment/basestation/`, data
    ).then(data => data.data)
}

//获取基站组
export function getStationGroup(page, size, mapid) {
    mapid = mapid || '';
    size = size || 10;
    return axios.get(
        baseURL + `/equipment/basestationgroup/?page=${page}&size=${size}&map=${mapid}`,
    ).then(data => data.data)
}
//新建基站组
export function postStationGroup(data) {
    return axios.post(
        baseURL + `/equipment/basestationgroup/`, JSON.stringify(data)
    ).then(data => data.data)
}
//删除基站组
export function deleteGroup(id) {
    return axios.delete(
        baseURL + `/equipment/basestationgroup/${id}/`
    ).then(data => data.data)
}
//新建基站组
export function putStationGroup(data, id) {
    return axios.put(
        baseURL + `/equipment/basestationgroup/${id}/`, JSON.stringify(data)
    ).then(data => data.data)
}
//新增基站
export function addStation(data) {
    return axios.post(
        baseURL + `/equipment/basestation/`, data
    ).then(data => data.data)
}
//编辑基站
export function editStation(data, id) {
    return axios.put(
        baseURL + `/equipment/basestation/${id}/`, data
    ).then(data => data.data)
}

//发送基站数据
export function sendStationData(data) {
    return axios.post(
        baseURL + `/equipment/basestation/`, data
    ).then(data => data.data)
}

//删除基站
export function deleteStation(id) {
    return axios.delete(
        baseURL + `/equipment/basestation/${id}/`
    ).then(data => data.data)
}

//获取某个摄像头的信息
export function getCameraData(id) {
    return axios.get(
        baseURL + `/equipment/cameras/${id}/`
    ).then(data => data.data)
}
//获取所有摄像头数据
export function getAllCamera() {
    return axios.get(
        baseURL + `/equipment/cameras/?size=200`
    ).then(data => data.data)
}
//获取单页摄像头数据
export function getCameraPage(page, mapid, camera_id) {
    mapid = mapid || '';
    mapid = mapid === 5 ? '' : mapid;
    camera_id = camera_id || '';
    return axios.get(
        baseURL + `/equipment/cameras/?size=10&page=${page}&map=${mapid}&camera_id=${camera_id}&station=`
    ).then(data => data.data)
}

//删除摄像头
export function deleteCamera(id) {
    return axios.delete(
        baseURL + `/equipment/cameras/${id}/`
    ).then(data => data.data)
}

//发送摄像头数据
export function postCameraData(data) {
    return axios.post(
        baseURL + `/equipment/cameras/`, JSON.stringify(data)
    ).then(data => data.data)
}
//修改摄像头数据
export function putCameraData(id, data) {
    return axios.put(
        baseURL + `/equipment/cameras/${id}/`, JSON.stringify(data)
    ).then(data => data.data)
}

//获取某一页的围栏列表
export function getPageFence(page) {
    return axios.get(
        baseURL + `/fence/?size=10&page=${page}`
    ).then(data => data.data)
}
//获取某个围栏信息
export function getFenceData(id) {
    return axios.get(
        baseURL + `/fence/${id}/`
    ).then(data => data.data)
}
//删除围栏
export function deleteFence(id) {
    return axios.delete(
        baseURL + `/fence/${id}/`
    ).then(data => data.data)
}

//修改围栏数据
export function putFence(id, data) {
    return axios.put(
        baseURL + `/fence/${id}/`, JSON.stringify(data)
    ).then(data => data.data)
}
//筛选围栏
export function getClassFence(id) {
    return axios.get(
        baseURL + `/fence/?map=${id}`
    ).then(data => data.data)
}

//获取标签详细信息
export function getLabelData(id) {
    id = +(id.substring(9))
    return axios.get(
        baseURL + `/equipment/label/${id}/`
    ).then(data => data.data)
}
//获取标签列表
export function getLabel(page) {
    return axios.get(
        baseURL + `/equipment/label/?size=10&page=${page}`
    ).then(data => data.data)
}
//获取所有标签
export function getAllLabel() {
    return axios.get(
        baseURL + `/equipment/label/?size=400`
    ).then(data => data.data)
}

//获取轨迹回放数据
export function getTrackData(startTime, endTime, id) {
    return axios.get(
        baseURL + `/historyTrack/?startTime=${startTime}&endTime=${endTime}&personId=${id}`
    ).then(data => data.data)
}