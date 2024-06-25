<template>
  <div class="feedback-details-container">
    <el-header class="full-header">
      <div class="header-content">
        <el-icon @click="goBack" class="logout-icon"><ArrowLeft /></el-icon>
        <span class="header-text">反馈任务详细信息</span>
      </div>
    </el-header>
    <div class="list-container">
      <el-table :data="formTableData" border style="width: 100%">
        <el-table-column label="属性" align="center" width="150">
          <template #default="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="具体信息" align="center">
          <template #default="scope">
            <span>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="form-container">
      <el-form :model="form" ref="feedbackForm" label-width="120px" status-icon>
        <el-form-item label="SO₂浓度">
          <el-input v-model="form.so2" placeholder="请输入SO₂浓度" suffix="ug/m³"></el-input>
        </el-form-item>
        <el-form-item label="CO浓度">
          <el-input v-model="form.co2" placeholder="请输入CO浓度" suffix="ug/m³"></el-input>
        </el-form-item>
        <el-form-item label="PM2.5">
          <el-input v-model="form.pm25" placeholder="请输入PM2.5浓度" suffix="ug/m³"></el-input>
        </el-form-item>
        <div class="aqi-warning" :class="aqiClass">
          实测AQI等级: {{ aqiLevel }}
        </div>
        <div class="button-container">
          <el-button type="primary" @click="submitData">提交实测数据</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import axiosInstance from '@/axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const form = reactive({
  user: localStorage.getItem('feedbackName') + ' ' + localStorage.getItem('feedbackTel'),
  grid: localStorage.getItem('province') + ' ' + localStorage.getItem('city'),
  address: localStorage.getItem('address'),
  estimatedLevel: localStorage.getItem('ackGrade'),
  description: localStorage.getItem('description'),
  so2: '',
  co2: '',
  pm25: '',
  ackId: route.params.taskId
});

const formTableData = ref([
  { label: '反馈用户', value: form.user },
  { label: '网格', value: form.grid },
  { label: '详细地址', value: form.address },
  { label: '预估等级', value: form.estimatedLevel },
  { label: '信息描述', value: form.description }
]);

const submitData = async () => {
  const token = localStorage.getItem('token');
  const taskId = localStorage.getItem('taskId');
  const ackId = parseInt(taskId, 10);

  console.log('taskId:', taskId);
  console.log('ackId:', ackId);

  const submitParams = {
    ackId: ackId, 
    so2: parseFloat(form.so2),
    co2: parseFloat(form.co2),
    pm250: parseFloat(form.pm25),
    ackGrade: aqiLevel.value
  };
  console.log('提交参数:', submitParams);

  // 输出请求头信息
  console.log('请求头:', {
    token: `${token}`
  });

  try {
    const response = await axiosInstance.post('/ackman/submitAck', {
      ackId: form.ackId,
      so2: parseFloat(form.so2),
      co2: parseFloat(form.co2),
      pm250: parseFloat(form.pm25),
      ackGrade: aqiLevel.value
    }, {
      headers: {
        token: `${token}`
      }
    });

    // 输出服务器响应
    console.log('服务器响应:', response);

    if (response.status === 200 && response.data.success) {
      ElMessage.success('数据提交成功');
      router.push('/feedbackList');
    } else {
      ElMessage.error(response.data.errorMsg || '数据提交失败');
    }
  } catch (error) {
    console.error('提交错误:', error.response ? error.response.data : error.message);
    ElMessage.error('提交失败，请稍后重试');
  }
};

const aqiLevel = computed(() => {
  const so2 = parseFloat(form.so2) || 0;
  const co = parseFloat(form.co2) || 0;
  const pm25 = parseFloat(form.pm25) || 0;
  
  // 根据中国的AQI污染级别定义阈值
  if (so2 > 800 || co > 35 || pm25 > 250) {
    return '六级污染';
  } else if (so2 > 475 || co > 28 || pm25 > 150) {
    return '五级污染';
  } else if (so2 > 300 || co > 15 || pm25 > 115) {
    return '四级污染';
  } else if (so2 > 150 || co > 10 || pm25 > 75) {
    return '三级污染';
  } else if (so2 > 75 || co > 5 || pm25 > 35) {
    return '二级污染';
  } else {
    return '一级污染';
  }
});

const aqiClass = computed(() => {
  switch (aqiLevel.value) {
    case '六级污染':
      return 'aqi-six';
    case '五级污染':
      return 'aqi-five';
    case '四级污染':
      return 'aqi-four';
    case '三级污染':
      return 'aqi-three';
    case '二级污染':
      return 'aqi-two';
    default:
      return 'aqi-one';
  }
});

const goBack = () => {
  router.push('/feedbackList');
};

</script>

<style scoped>
.feedback-details-container {
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

.full-header {
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
  margin-top: 100px;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.aqi-warning {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}

.aqi-one {
  background-color: #00e400;
  color: white;
}

.aqi-two {
  background-color: #66bb6a;
  color: white;
}

.aqi-three {
  background-color: #ffa726;
  color: white;
}

.aqi-four {
  background-color: #ef5350;
  color: white;
}

.aqi-five {
  background-color: #99004c;
  color: white;
}

.aqi-six {
  background-color: #7e0023;
  color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

</style>
