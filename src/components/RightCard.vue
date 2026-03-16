<template>
  <div class="right-container">
    <h3>推荐方案</h3>
    
    <!-- 早餐 -->
    <div class="plan-item">
      <div class="plan-tag">早餐</div>
      <div class="plan-content">
        <img src="@/assets/breakfast.png" alt="早餐">
        <span>燕麦粥+鸡蛋</span>
      </div>
    </div>
    
    <!-- 午餐 -->
    <div class="plan-item">
      <div class="plan-tag">午餐</div>
      <div class="plan-content">
        <img src="@/assets/lunch.png" alt="午餐">
        <span>牛排+水果</span>
      </div>
    </div>
    
    <!-- 晚餐 -->
    <div class="plan-item">
      <div class="plan-tag">晚餐</div>
      <div class="plan-content">
        <img src="@/assets/dinner.png" alt="晚餐">
        <span>清蒸鱼+蔬菜</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.right-container {
  background-color: #f6ffed;
  border-radius: 8px;
  padding: 16px;
  border: 2px solid #b7eb8f;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.right-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(189, 89, 89, 0.15);
}
.right-container h3 {
  margin: 0 0 8px 0;
  color: #52c41a;
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.plan-tag {
  background-color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
  border: 1px solid #e5e7eb;
}

.plan-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.plan-content img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
</style>