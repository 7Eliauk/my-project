<template>
  <div class="middle-container">
    <div class="decoration-circle circle-1"></div>
    <div class="decoration-circle circle-2"></div>
    <div class="decoration-circle circle-3"></div>

    <div class="icon-wrapper">
      <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
        <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
        <circle cx="8" cy="18" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
      </svg>
    </div>

    <h3>饮食日志</h3>
    <p class="middle-tip">点击下方按钮查看饮食记录</p>

    <router-link to="/diet-logs" class="btn-link">
      <button class="add-btn">
        <span>查看日志</span>
        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
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
  background: linear-gradient(145deg, #f5fbff 0%, #e3f2fd 50%, #d4edfc 100%);
  border: none;
  height: auto;
  max-height: none;
  min-height: 300px;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow:
    0 4px 20px rgba(33, 150, 243, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.middle-container:hover {
  transform: translateY(-5px);
  box-shadow:
    0 12px 30px rgba(33, 150, 243, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* 装饰圆圈 */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  pointer-events: none;
}

.circle-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #2196f3, #64b5f6);
  top: -30px;
  right: -30px;
}

.circle-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  bottom: 40px;
  left: -20px;
}

.circle-3 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff9800, #ffb74d);
  bottom: -10px;
  right: 60px;
}

/* 图标容器 */
.icon-wrapper {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow:
    0 6px 20px rgba(33, 150, 243, 0.15),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.middle-container:hover .icon-wrapper {
  transform: scale(1.05) rotate(3deg);
  box-shadow:
    0 8px 25px rgba(33, 150, 243, 0.25),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.calendar-icon {
  width: 48px;
  height: 48px;
  color: #2196f3;
  filter: drop-shadow(0 2px 4px rgba(33, 150, 243, 0.2));
}

.middle-container h3 {
  margin: 0 0 10px 0;
  color: #1565c0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.middle-tip {
  color: #78909c;
  margin: 0 0 24px 0;
  font-size: 13px;
  font-weight: 400;
}

.btn-link {
  text-decoration: none;
}

.add-btn {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow:
    0 4px 15px rgba(76, 175, 80, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(76, 175, 80, 0.4),
    0 3px 6px rgba(0, 0, 0, 0.15);
}

.add-btn:active {
  transform: translateY(0);
}

.btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.add-btn:hover .btn-arrow {
  transform: translateX(3px);
}
</style>
