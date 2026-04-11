<template>
  <div class="header-container">
    <div class="logo-section">
      <div class="logo-wrapper">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </svg>
      </div>
      <div class="logo-text">
        <span class="logo-title">智膳坊</span>
        <span class="logo-subtitle">智能膳食管家</span>
      </div>
    </div>

    <div class="nav-left">
      <router-link to="/home" class="nav-item" :class="{ active: $route.path === '/home' }">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        首页
      </router-link>
      <router-link to="/diet-assistant" class="nav-item assistant" :class="{ active: $route.path === '/diet-assistant' }">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        膳食助手
      </router-link>
    </div>

    <div class="nav-right">
  <!-- 把 router-link 包裹住 整个头像 + 文字 -->
  <router-link to="/Personal" class="user-info">
    <div class="user-avatar">
      <el-icon style="font-size: 20px; color: #fff">
        <User />
      </el-icon>
    </div>
    <span class="nav-per">我的</span>
  </router-link>
</div>

  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%);
  border-radius: 16px;
  box-shadow:
    0 4px 16px rgba(76, 175, 80, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.header-container:hover {
  box-shadow:
    0 6px 24px rgba(76, 175, 80, 0.12),
    0 3px 10px rgba(0, 0, 0, 0.06);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-wrapper {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 12px rgba(76, 175, 80, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.logo-wrapper:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 16px rgba(76, 175, 80, 0.4),
    0 3px 6px rgba(0, 0, 0, 0.12);
}

.logo-icon {
  width: 26px;
  height: 26px;
  color: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  color: #2e7d32;
  letter-spacing: 0.5px;
}

.logo-subtitle {
  font-size: 11px;
  color: #78909c;
  font-weight: 400;
}

.nav-left {
  display: flex;
  gap: 8px;
}

.nav-item {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 12px;
  color: #546e7a;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-item:hover {
  color: #2e7d32;
  background: rgba(76, 175, 80, 0.05);
}

.nav-item:hover::after {
  width: 30px;
}

.nav-item.active {
  color: #2e7d32;
  font-weight: 600;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
}

.nav-item.active::after {
  width: 40px;
}

.nav-item.assistant {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.2);
}

.nav-item.assistant:hover {
  background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
  color: #e65100;
  box-shadow: 0 3px 10px rgba(245, 124, 0, 0.2);
}

.nav-item.assistant::after {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.nav-right {
  display: flex;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  border-radius: 20px;
  transition: all 0.3s ease;
  text-decoration: none !important;
}

.user-info:hover {
  background: linear-gradient(135deg, #eeeeee 0%, #e0e0e0 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
}

.nav-per {
  color: #37474f;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-per:hover {
  color: #2e7d32;
}
</style>
