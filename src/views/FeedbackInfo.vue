<template>
  <div class="feedback-details-container">
    <el-header class="full-header">
      <div class="header-content">
        <el-icon @click="goBack" class="logout-icon"><ArrowLeft /></el-icon>
        <span class="header-text">反馈任务详细信息</span>
      </div>
    </el-header>
   <div class="list-container">
      <div v-for="(group, index) in groupedFeedbackList" :key="index" class="group-container">
        <div class="group-header">
          <span>{{ group.province }} {{ group.city }} {{ group.date }}</span>
        </div>
        <el-table :data="group.locations" style="width: 100%">
          <el-table-column label="地址" prop="address" align="center" />
          <el-table-column align="center">
            <template #default="scope">
              <el-button @click="goCheck(scope.row.id)" type="primary" size="small">去检测</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
	<div class="form-container">
	  <el-table :data="formTableData" border style="width: 100%">
	    <el-table-column align="center" width="150">
	      <template #default="scope">
	        <span>{{ scope.row.label }}</span>
	      </template>
	    </el-table-column>
	    <el-table-column align="center">
	      <template #default="scope">
	        <span>{{ scope.row.value }}</span>
	      </template>
	    </el-table-column>
	  </el-table>
	</div>
      <el-form :model="form" ref="feedbackForm" label-width="120px" status-icon>
        <el-form-item label="SO₂浓度">
          <el-input v-model="form.so2" placeholder="请输入SO₂浓度" suffix="ug/m³"></el-input>
        </el-form-item>
        <el-form-item label="CO浓度">
          <el-input v-model="form.co" placeholder="请输入CO浓度" suffix="ug/m³"></el-input>
        </el-form-item>
        <el-form-item label="PM2.5">
          <el-input v-model="form.pm25" placeholder="请输入PM2.5浓度" suffix="ug/m³"></el-input>
        </el-form-item>
        <div class="aqi-warning" :class="aqiClass">
          实测AQI等级: {{ aqiLevel }}
        </div>
        <el-button type="primary" @click="submitData">提交实测数据</el-button>
      </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import axiosInstance from '@/axios';
import { useRouter, useRoute } from 'vue-router';

const form = reactive({
  user: '诸葛亮 13659877845',
  grid: '辽宁省 沈阳市',
  address: '和平区解放路211号',
  estimatedLevel: '四级 中度污染',
  description: '空气浑浊，呼吸不畅',
  so2: '',
  co: '',
  pm25: '',
  ackId: useRoute().params.taskId // 从路由参数中获取taskId作为ackId
});
const router = useRouter();

const formTableData = reactive([
  { label: '反馈用户', value: form.user },
  { label: '网格', value: form.grid },
  { label: '详细地址', value: form.address },
  { label: '预估等级', value: form.estimatedLevel },
  { label: '信息描述', value: form.description }
]);

const aqiLevel = computed(() => {
  const so2 = parseFloat(form.so2) || 0;
  const co = parseFloat(form.co) || 0;
  const pm25 = parseFloat(form.pm25) || 0;
  if (so2 > 150 || co > 10 || pm25 > 75) {
    return '四级 中度污染';
  } else if (so2 > 75 || co > 5 || pm25 > 35) {
    return '三级 轻度污染';
  } else {
    return '二级 良';
  }
});

const aqiClass = computed(() => {
  switch (aqiLevel.value) {
    case '四级 中度污染':
      return 'aqi-four';
    case '三级 轻度污染':
      return 'aqi-three';
    default:
      return 'aqi-two';
  }
});

const submitData = async () => {
  try {
    const response = await axiosInstance.post('/ackman/submitAck', {
      ackId: form.ackId,
      so2: parseFloat(form.so2),
      co2: parseFloat(form.co),
      pm250: parseFloat(form.pm25),
      ackGrade: aqiLevel.value
    }, {
      headers: {
        token: localStorage.getItem('token') // 从localStorage中获取token
      }
    });
    if (response.status === 200 && response.data.success) {
      ElMessage.success('数据提交成功');
    } else {
      ElMessage.error(response.data.errorMsg || '数据提交失败');
    }
  } catch (error) {
    console.error('提交错误:', error);
    ElMessage.error('提交失败，请稍后重试');
  }
};

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
  height: 60px; /* 可以根据需要调整高度 */
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
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
}

.header-text {
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-left: 20px;
}

.logout-icon {
  color: #333;
  cursor: pointer;
  position: absolute;
  left: 20px;
}

.form-container {
  margin-top: 80px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  margin-top: 100px;
}

.el-table th, .el-table td {
  text-align: center;
  background-color: transparent !important;
  border: none !important;
}

.el-table .el-table__header-wrapper {
  display: none; /* 隐藏表头 */
}

.el-form-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.el-input__inner {
  border-radius: 5px;
  background-color: transparent; 
  border: none; 
}

.icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 10px;
  font-size: 0.8rem;
}

.aqi-warning {
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
}

.aqi-four {
  color: red;
}

.aqi-three {
  color: orange;
}

.aqi-two {
  color: green;
}

.el-button {
  width: 100%;
  border-radius: 5px;
}

.el-button--primary {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

.el-button--primary:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}
</style>
