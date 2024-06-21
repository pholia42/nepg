import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from './router/index.js';

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://wftr4y.natappfree.cc/', // 你的API基础URL
  timeout: 100000,
});

// 添加请求拦截器
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    ElMessage.error('登录已过期');
    router.push('/');
  }
  return Promise.reject(error);
});

export default instance;