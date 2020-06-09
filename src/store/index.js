import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defenceImgArr:[], //显示的围栏数据
    persons:[],       //定位人员实例
    mapid:3,          //当前地图id
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
