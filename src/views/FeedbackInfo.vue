<template>
  <div class="feedback-details-container">
    <el-card class="details-card">
      <el-form :model="form" ref="feedbackForm" label-width="120px" status-icon>
        <el-form-item label="反馈用户">
          <el-input v-model="form.user" readonly></el-input>
        </el-form-item>
        <el-form-item label="网格">
          <el-input v-model="form.grid" readonly></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" readonly></el-input>
        </el-form-item>
        <el-form-item label="预估等级">
          <el-input v-model="form.estimatedLevel" readonly></el-input>
        </el-form-item>
        <el-form-item label="信息描述">
          <el-input v-model="form.description" readonly></el-input>
        </el-form-item>
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
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import axios from 'axios';

const form = reactive({
  user: '诸葛亮 13659877845',
  grid: '辽宁省 沈阳市',
  address: '和平区解放路211号',
  estimatedLevel: '四级 中度污染',
  description: '空气浑浊，呼吸不畅',
  so2: '',
  co: '',
  pm25: ''
});

const aqiLevel = computed(() => {
  // This logic can be adjusted based on actual AQI calculation
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
    const response = await axios.post(' http://wftr4y.natappfree.cc/ackman/submitAck', form);
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
</script>

<style scoped>
.feedback-details-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to top, #e0f7fa, #80deea);
}

.details-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.el-form-item {
  margin-bottom: 20px;
}

.el-input__inner {
  border-radius: 5px;
}

.el-button {
  width: 100%;
  border-radius: 5px;
}

.el-button--primary {
  background-color: #009688;
  border-color: #009688;
}

.el-button--primary:hover {
  background-color: #00796b;
  border-color: #00796b;
}
</style>
