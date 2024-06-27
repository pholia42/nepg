import { createRouter, createWebHashHistory } from 'vue-router';
import { ElMessage } from 'element-plus';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/feedbackList',
    name: 'FeedbackList',
    component: () => import('../views/FeedbackList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/feedbackInfo/:taskId',
    name: 'FeedbackInfo',
    component: () => import('../views/FeedbackInfo.vue'),
    props: true,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token && to.name !== 'Login') {
      ElMessage.warning('登录已过期，请重新登录');
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
