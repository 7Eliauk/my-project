<template>
  <div class="home-container">
    <!-- 顶部导航 -->
    <HeaderSec />

    <!-- 栅格布局 -->
    <div class="home-grid">
      <!-- 轮播图：跨3列 -->
      <BannerSec class="banner-area" />

      <!-- 左侧区域：今日 + AI建议 -->
      <LeftCard class="left-area" />

      <!-- 中间区域：饮食日志-->
      <MiddleCard class="middle-area" />

      <!-- 右侧区域：推荐方案-->
      <RightCard class="right-area" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderSec from '@/components/HeaderSection.vue'
import BannerSec from '@/components/BannerSection.vue'
import LeftCard from '@/components/LeftCard.vue'
import MiddleCard from '@/components/MiddleCard.vue'
import RightCard from '@/components/RightCard.vue'
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 栅格核心布局 */
.home-grid {
  display: grid;
  /* 3列等宽 */
  grid-template-columns: repeat(3, 1fr);
  /* 2行自适应 */
  grid-template-rows: auto auto;
  /* 间距 */
  gap: 16px;
  margin-top: 16px;
}

/* 区域占比定义 */
.banner-area {
  grid-column: 1 / 4;
  grid-row: 1 / 2;
}
.left-area {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.middle-area {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
.right-area {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}
</style>
