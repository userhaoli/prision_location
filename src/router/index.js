import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Main',
    component: Home,
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/personinfo',
    name: 'PersonInfo',
    component: () => import('../views/person/PersonInfo.vue')
  },
  {
    path: '/alarmdetail',
    name: 'AlarmDetail',
    component: () => import('@/views/alarm/AlarmDetail.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue')
  },
  {
    path: '/policelocation',
    name: 'PoliceLocation',
    component: () => import('@/views/police/PoliceLocation.vue')
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import('@/views/attendance/Index.vue')
  },
  {
    path: '/record',
    name: 'Record',
    component: () => import('@/views/attendance/Record.vue')
  },
  {
    path: '/blankmap/:oper',
    name: 'Blankmap',
    props: true,
    component: () => import('@/views/BlankMap.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    children: [{
        path: 'personlist',
        name: 'PersonList',
        component: () => import('@/views/person/PersonList.vue')
      },
      {
        path: 'defencelist',
        name: 'DefenceList',
        component: () => import('@/views/defence/DefenceList.vue')
      },
      {
        path: 'defencebuild',
        name: 'DefenceBuild',
        component: () => import('@/views/defence/DefenceBuild.vue')
      },
      {
        path: 'defenceedit',
        name: 'DefenceEdit',
        component: () => import('@/views/defence/DefenceEdit.vue')
      },
      {
        path: 'tracklist',
        name: 'TrackList',
        component: () => import('@/views/track/TrackList.vue')
      },
      {
        path: 'cameralist',
        name: 'CameraList',
        component: () => import('@/views/camera/CameraList.vue')
      },
      {
        path: 'hjzlist',
        name: 'HjzList',
        component: () => import('@/views/hjz/HjzList.vue')
      },
      {
        path: 'hjzadd',
        name: 'HjzAdd',
        component: () => import('@/views/hjz/HjzAdd.vue')
      },
      {
        path: 'hjzedit',
        name: 'HjzEdit',
        component: () => import('@/views/hjz/HjzEdit.vue')
      },
      {
        path: 'alarmlist',
        name: 'AlarmList',
        component: () => import('@/views/alarm/AlarmList.vue')
      },
      {
        path: 'detail/:id',
        name: 'Detail',
        props: true,
        component: () => import('@/views/alarm/Detail.vue')
      },
      {
        path: 'equipmentlist',
        name: 'EquipmentList',
        component: () => import('@/views/equipment/EquipmentList.vue')
      },
      {
        path: 'set',
        name: 'Set',
        component: () => import('@/views/set/Set.vue')
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('@/views/analysis/Analysis.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router