<template>
  <div class="left-card">
    <!-- 只点击识别区域打开弹窗 -->
    <div class="identify-box" @click="openDialog">
      <div class="icon-box">📷</div>
      <div class="identify-text">
        <h3>AI 食物识别</h3>
        <p>拍照 / 上传图片即可识别食物营养</p>
      </div>
    </div>

    <div class="ai-suggest-box">
      <h3>今日AI建议</h3>
      <p>建议摄入热量：<span>1800 kcal</span></p>
      <p>蛋白质：<span>60g</span> &nbsp; 脂肪：<span>50g</span></p>
      <p>碳水化合物：<span>150g</span></p>
    </div>
    <!-- 第三方组件 （append-to-body让该弹窗仅挂载在body里面，而不是当前组件)-->
    <el-dialog
      v-model="dialogVisible"
      title="AI 食物识别"
      width="450px"
      @close="resetUpload"
      append-to-body
    >
      <!-- 图片上传组件 -->
      <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :on-change="handleFileChange"
        list-type="picture-card"
        accept="image/*"
      >
        <div class="upload-text">点击上传食物图片</div>
      </el-upload>

      <!-- 识别结果展示（根据后端返回的结果） -->
      <div v-if="recognitionResult" class="recognition-result">
        <h4>识别结果</h4>
        <div v-if="recognitionResult.data && recognitionResult.data.length > 0" class="result-list">
          <div v-for="(item, index) in recognitionResult.data" :key="index" class="result-item">
            <div class="result-item-title">{{ item.dishName }}</div>
            <div class="result-item-details">
              <div class="result-item-detail">
                <span class="label">识别置信度：</span>
                <span class="value">{{ (item.confidence * 100).toFixed(2) }}%</span>
              </div>
              <div class="result-item-detail">
                <span class="label">热量：</span>
                <span class="value">{{ item.calorie }} 千卡/100g</span>
              </div>
              <div class="result-item-detail">
                <span class="label">识别状态：</span>
                <span class="value">{{ item.recognitionStatus }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-result">未识别到任何结果</div>
      </div>

      <div style="margin-top: 20px; text-align: right">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="startRecognize"> 开始识别 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { recognizeDish } from '../api/auth'

// 控制弹窗
const dialogVisible = ref(false)

// 存储选中的图片
const imageFile = ref(null)

// 存储识别结果
const recognitionResult = ref(null)

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true
  recognitionResult.value = null
}

// 自动获取图片文件（第三方组件自带）
const handleFileChange = (file) => {
  imageFile.value = file.raw
  recognitionResult.value = null
}

// 开始识别
const startRecognize = async () => {
  if (!imageFile.value) {
    alert('请先选择图片')
    return
  }

  try {
    // 调用API进行食物识别
    const result = await recognizeDish(imageFile.value)
    // 返回结果给recognitionResult
    recognitionResult.value = result
  } catch (error) {
    // 错误已经在响应拦截器中处理
    console.error('识别出错：', error)
  }
}

// 关闭弹窗清空图片
const resetUpload = () => {
  imageFile.value = null
  recognitionResult.value = null
}
</script>

<style scoped>
.left-card {
  grid-column: 1;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border: 2px solid #4caf50;
  height: auto;
  max-height: none;
  min-height: 300px;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.left-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.identify-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #4caf50;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.identify-box:hover {
  transform: scale(1.02);
}

.icon-box {
  width: 90px;
  height: 90px;
  background: #fffefe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  margin-bottom: 12px;
}

.identify-text h3 {
  margin: 0 0 6px 0;
  color: #4caf50;
}
.identify-text p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
/* 建议区 */
.ai-suggest-box {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #4caf50;
  border-radius: 15px;
  padding: 18px;
}

.ai-suggest-box h3 {
  margin: 0 0 10px 0;
  color: #2e7d32;
  font-size: 17px;
}

.ai-suggest-box p {
  margin: 6px 0;
  font-size: 14px;
  color: #333;
}

.ai-suggest-box span {
  font-weight: bold;
  color: #2e7d32;
}

/* 上传区域样式 */
.avatar-uploader :deep(.el-uploader) {
  width: 100%;
}
.upload-text {
  padding: 20px;
  color: #666;
}
</style>