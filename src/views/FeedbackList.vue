<template>
  <div class="feedback-list-container">
    <header class="header">
      <div class="header-content">
        <el-icon @click="goBack" class="logout-icon"><ArrowLeft /></el-icon>
        <span class="header-text">反馈任务列表</span>
      </div>
    </header>
    <div class="header-image">
      <img src="@/assets/zhanwei.jpg" alt="Background Image" />
    </div>
    <div class="list-container">
      <el-table :data="feedbackList" style="width: 100%">
        <el-table-column label="等级" align="center">
          <template #default="scope">
            <span :class="'level level-' + scope.row.ackGrade">{{ scope.row.ackGrade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="省份" prop="province" align="center" />
        <el-table-column label="城市" prop="city" align="center" />
        <el-table-column label="地址" prop="address" align="center" />
        <el-table-column label="日期" prop="ackTime" align="center" />
        <el-table-column align="center">
          <template #default="scope">
            <el-button @click="goCheck(scope.row)" type="primary" size="small">去检测</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const feedbackList = reactive([]); 
const user = inject('user');
const router = useRouter();

const fetchData = async () => {
  try {
	const token = localStorage.getItem('token');
	const telId = localStorage.getItem('telId');
	      
	console.log('请求中的 token:', token); // 调试用
	console.log('请求中的 telId:', telId); // 调试用
	  
    const response = await axios.get('/ackman/queryTaskList', {
      params: { telId: telId },
      headers: {
        token: `${token}`
      }
    });
    if (response.data.success) {
      feedbackList.push(...response.data.data);
    } else {
      ElMessage.error('获取数据失败：' + response.data.errorMsg);
    }
  } catch (error) {
    console.error('请求错误:', error);
    ElMessage.error('请求错误，请稍后重试');
  }
};

const goBack = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('feedbackName');
  localStorage.removeItem('taskId');
  localStorage.removeItem('telId');
  ElMessage.success('已退出');
  router.push('/');
};

const goCheck = (task) => {
  const { id: taskId, feedbackName, feedbackTel, province, city, address, ackGrade, description } = task;

  if (!feedbackName || !feedbackTel|| !province || !city || !address || !ackGrade || !description) {
    console.error("一个或多个必要的字段缺失。");
    return;
  }

  localStorage.setItem('taskId', taskId);
  localStorage.setItem('feedbackName', feedbackName);
  localStorage.setItem('feedbackTel', feedbackTel);
  localStorage.setItem('province', province);
  localStorage.setItem('city', city);
  localStorage.setItem('address', address);
  localStorage.setItem('ackGrade', ackGrade);
  localStorage.setItem('description', description);

  console.log('taskId:', localStorage.getItem('taskId'));
  console.log('feedbackName:', localStorage.getItem('feedbackName'));
  console.log('province:', localStorage.getItem('province'));
  console.log('city:', localStorage.getItem('city'));
  console.log('address:', localStorage.getItem('address'));
  console.log('ackGrade:', localStorage.getItem('ackGrade'));
  console.log('description:', localStorage.getItem('description'));

  router.push({ name: 'FeedbackInfo', params: { taskId: taskId } });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.feedback-list-container {
  background: url('@/assets/background.png') no-repeat center center;
  background-size: cover;
  height: 100vh;
  width: 100vw; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-image {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 80px;
  margin-bottom: 20px;
}

.header-image img {
  max-width: 200px;
  width: 100%;
  height: auto;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.header-text {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.logout-icon {
  color: #333;
  cursor: pointer;
  position: absolute;
  left: 20px;
}

.list-container {
  height: 500px;
  font-size: 14px; 
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 80px; 
  overflow-y: auto;
}

.el-table {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.el-table th {
  background-color: #f2edac;
  color: #333;
}

.level {
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
  border-radius: 50%;
  line-height: 24px;
  color: white;
}

.el-message {
  position: fixed;
  top: 20px;
  right: 20px;
}
</style>
