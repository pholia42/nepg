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
            <span :class="'level level-' + scope.row.ack_grade">{{ scope.row.ack_grade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="省份" prop="province" align="center" />
        <el-table-column label="城市" prop="city" align="center" />
        <el-table-column label="地址" prop="address" align="center" />
        <el-table-column label="日期" prop="ack_time" align="center" />
        <el-table-column align="center">
          <template #default="scope">
            <el-button @click="goCheck(scope.row.task_id)" type="primary" size="small">去检测</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue';
import axios from 'axios';
import axiosInstance from '@/axios'; 
import { useRouter } from 'vue-router';
import { ElMessage, ElIcon, ElButton } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const feedbackList = reactive([]); 
const user = inject('user');
const router = useRouter();

const fetchData = async () => {
  try {
    const response = await axiosInstance.get('/ackman/queryTaskList', {
      params: { telId: user.telId },
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
  ElMessage.success('已退出');
  router.push('/');
};

const goCheck = (taskId) => {
  router.push({ name: 'FeedbackInfo', params: { taskId } });
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
  justify-content: flex-start; /* 修改为从上到下排列 */
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
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px; /* 确保内容不会被固定的头部遮挡 */
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
