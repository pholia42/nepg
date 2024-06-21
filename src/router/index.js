import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import FeedbackList from '../views/FeedbackList.vue'
import FeedbackInfo from '../views/FeedbackInfo.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Login
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/feedbackList',
    name: 'FeedbackList',
    component: FeedbackList
  }, {
    path: '/feedbackInfo/:taskId',
    name: 'FeedbackInfo',
    component: FeedbackInfo,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router