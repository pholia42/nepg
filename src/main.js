import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

// 初始化全局用户数据
const user = reactive({
  token: '',
  feedbackName: '',
  telId: ''
});

// 提供全局用户数据
app.provide('user', user);

app.use(store).use(router).use(ElementPlus).mount('#app');
