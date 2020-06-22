import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defenceImgArr: [], //显示的围栏数据
    persons: [], //定位人员实例
    mapid: 3, //当前地图id
    defenceActive: 0, //流程控制
    fenceData: {
      persons: []
    }, //围栏数据
    isShowStation: false, //是否显示基站
    isShowCamera: false, //是否显示摄像头
    isShowTrack: true, // 是否显示轨迹
    isShowDefenceImg: true, //是否显示围栏
    chartArr:[],  //绘制围栏坐标点
    unhandleAlarm:[],//未处理报警信息
  },
  mutations: {},
  actions: {},
  modules: {},
  titleBar:null, //标题栏
})