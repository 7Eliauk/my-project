<template>
  <div class="header-container">
    <div class="nav-left">
      <button class="nav-item active">首页</button>
      <button class="nav-item">数据</button>
      <button class="nav-item">建议</button>
    </div>
    <div class="nav-right">
      <el-icon style="font-size: 24px; color: #409eff; margin: 0 10px">
        <User />
      </el-icon>
      <router-link to="/Personal" class="nav-per">我的</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可扩展：添加社区Tab（在nav-left新增按钮即可）
import { User } from '@element-plus/icons-vue'
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.nav-left {
  display: flex;
  gap: 24px;
}

.nav-right {
  display: flex;
}

.nav-item {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
}

.nav-item.active {
  color: #165dff;
  font-weight: 600;
  background-color: #f0f7ff;
}
.nav-per {
  color: black;
  text-decoration: none;
  font-size: 18px;
}
</style>
