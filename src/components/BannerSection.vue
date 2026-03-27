<template>
  <section class="banner-section">
    <el-carousel height="200px" :interval="3000" arrow="hover" indicator-position="outside">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <div class="banner-slide" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="banner-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script setup lang="ts">
// 饮食营养均衡相关的轮播图数据
const banners = [
  {
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    title: '智能膳食规划，健康生活从这里开始',
    description: '基于AI算法,为您提供个性化的膳食建议和营养分析',
  },
  {
    image:
      'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    title: '营养均衡，身体更健康',
    description: '科学搭配饮食，摄入全面营养，维持身体最佳状态',
  },
  {
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    title: '个性化饮食建议',
    description: '根据您的身体状况和需求，定制专属膳食计划',
  },
  {
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    title: '健康饮食，从智膳坊开始',
    description: '让我们一起追求更健康、更科学的饮食方式',
  },
]
</script>

<style scoped>
.banner-section {
  width: 100%;
  overflow: hidden;
  border-radius: 0 0 20px 20px;
  margin: 0 auto;
  padding: 0;
}

.banner-slide {
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.banner-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;
}

.banner-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.primary-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 调整轮播指示器样式 */
:deep(.el-carousel__indicator) {
  margin: 0 8px;
}

:deep(.el-carousel__indicator.is-active .el-carousel__indicator-btn) {
  background-color: white;
  transform: scale(1.2);
}

:deep(.el-carousel__indicator-btn) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
}

/* 调整箭头样式 */
:deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
