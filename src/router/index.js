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
    name: 'index' ,
    component: () => import('../views/Index.vue')
  },
  {
    path: '/personinfo',
    name: 'PersonInfo' ,
    component: () => import('../views/person/PersonInfo.vue')
  },
  {
    path: '/detail',
    name: 'Detail' ,
    component: () => import('@/views/alarm/AlarmDetail.vue')
  },
  {
    path: '/login',
    name: 'Login' ,
    component: () => import('@/views/user/Login.vue')
  },
  {
    path: '/home',
    name: 'Home' ,
    component: () => import('@/views/Home.vue'),
    children: [{
      path: 'personlist',
      name: 'PersonList',
      component: () => import('@/views/person/PersonList.vue')
    },
    {
      path: 'defencelist',
      name: 'DefenceList' ,
      component: () => import('@/views/defence/DefenceList.vue')
    },
    {
      path: 'defencebuild',
      name: 'DefenceBuild' ,
      component: () => import('@/views/defence/DefenceBuild.vue')
    },
    {
      path: 'defenceedit',
      name: 'DefenceEdit' ,
      component: () => import('@/views/defence/DefenceEdit.vue')
    },
    {
      path: 'tracklist',
      name: 'TrackList',
      component: () => import('@/views/track/TrackList.vue')
    },

  ]
  }
]

const router = new VueRouter({
  routes
})

export default router