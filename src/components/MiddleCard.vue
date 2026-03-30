<template>
  <div class="middle-container">
    <h3>饮食日志</h3>
    <p class="middle-tip">点击下方按钮查看饮食记录</p>
    <router-link to="/diet-logs">
      <button class="add-btn">查看日志</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
// 添加路由支持
// import { useRouter } from 'vue-router'
// 移除未使用的 router 声明，因为组件中使用了 <router-link> 进行导航
</script>

<style scoped>
.middle-container {
  grid-column: 2;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px solid #2196f3;
  height: auto;
  max-height: none;
  min-height: 300px;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.middle-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(189, 89, 89, 0.15);
}

.middle-container h3 {
  margin: 0 0 12px 0;
  color: #1565c0;
}

.middle-tip {
  color: #666;
  margin: 0 0 16px 0;
  font-size: 14px;
}

.add-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.add-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
