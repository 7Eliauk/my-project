<template>
  <div class="left-card">
    <!-- 只点击识别区域打开弹窗 -->
    <div class="identify-box" @click="openDialog">
      <div class="icon-box">
        <svg t="1775298638653" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1800" width="48" height="48"><path d="M846.525959 288.822035 733.689055 288.822035l-48.477085-116.694769c-11.257391-27.103288-37.495986-44.61615-66.845431-44.61615L408.757614 127.511115c-29.348422 0-55.587016 17.512862-66.845431 44.61615l-48.475038 116.694769L180.598194 288.822035c-62.71946 0-113.7456 51.02614-113.7456 113.7456l0 378.463658c0 62.71946 51.02614 113.7456 113.7456 113.7456l665.927765 0c62.71946 0 113.7456-51.02614 113.7456-113.7456L960.27156 402.567635C960.27156 339.847152 909.24542 288.822035 846.525959 288.822035zM918.909523 781.030269c0 39.912012-32.471552 72.383564-72.383564 72.383564L180.598194 853.413833c-39.913035 0-72.383564-32.471552-72.383564-72.383564L108.21463 402.567635c0-39.912012 32.470529-72.383564 72.383564-72.383564l126.641305 0c8.357342 0 15.892969-5.02955 19.098987-12.748349l53.770648-129.443118c4.824889-11.614525 16.070001-19.120476 28.64848-19.120476l209.608925 0c12.57848 0 23.823592 7.504928 28.646434 19.1215l53.772694 129.443118c3.207042 7.716752 10.742668 12.747325 19.10001 12.747325l126.641305 0c39.912012 0 72.383564 32.471552 72.383564 72.383564L918.910547 781.030269z" fill="#4caf50" p-id="1801"></path><path d="M513.561565 349.83769c-115.843378 0-210.089879 94.245478-210.089879 210.089879s94.245478 210.089879 210.089879 210.089879 210.089879-94.245478 210.089879-210.089879S629.405967 349.83769 513.561565 349.83769zM513.561565 728.655412c-93.036953 0-168.727843-75.691913-168.727843-168.727843s75.69089-168.727843 168.727843-168.727843c93.03593 0 168.727843 75.691913 168.727843 168.727843S606.598518 728.655412 513.561565 728.655412z" fill="#4caf50" p-id="1802"></path><path d="M456.241069 644.973524c-28.319999-19.131733-45.227064-50.924833-45.227064-85.046978 0-11.42112-9.258874-20.681018-20.681018-20.681018s-20.681018 9.259898-20.681018 20.681018c0 47.879474 23.713075 92.484368 63.433728 119.319549 3.549849 2.397606 7.574512 3.546779 11.559267 3.546779 6.638187 0 13.159718-3.190669 17.154705-9.106402C468.193285 664.222937 465.704604 651.368164 456.241069 644.973524z" fill="#4caf50" p-id="1803"></path><path d="M263.747963 381.095601l-86.860277 0c-11.422144 0-20.681018 9.258874-20.681018 20.681018s9.258874 20.681018 20.681018 20.681018l86.860277 0c11.422144 0 20.681018-9.258874 20.681018-20.681018S275.170107 381.095601 263.747963 381.095601z" fill="#4caf50" p-id="1804"></path></svg>
      </div>
      <div class="identify-text">
        <h3>AI 食物识别</h3>
        <p>拍照 / 上传图片即可识别食物营养</p>
      </div>
    </div>

    <div class="ai-suggest-box">
      <div class="ai-suggest-header">
        <h3>今日AI建议</h3>
        <div class="status-dot"></div>
      </div>
      <p>建议摄入热量：<span>1800 kcal</span></p>
      <p>蛋白质：<span>60g</span> &nbsp; 脂肪：<span>50g</span></p>
      <p>碳水化合物：<span>150g</span></p>
    </div>
    <!-- 第三方组件 （append-to-body让该弹窗仅挂载在body里面，而不是当前组件)-->
    <el-dialog
      v-model="dialogVisible"
      title="AI 食物识别"
      width="480px"
      @close="resetUpload"
      append-to-body
      custom-class="food-recognize-dialog"
    >
      <!-- 图片上传区域 -->
      <div class="upload-section">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :on-change="handleFileChange"
          accept="image/*"
          :disabled="isLoading"
          :show-file-list="false"
        >
          <div class="upload-placeholder" v-if="!imageFile">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
              </svg>
            </div>
            <div class="upload-text">点击或拖拽上传食物图片</div>
            <div class="upload-hint">支持 JPG、PNG 格式</div>
          </div>
          <div class="upload-preview" v-else>
            <img :src="previewUrl" alt="预览" />
            <div class="preview-overlay" @click.stop="imageFile = null">
              <span>更换图片</span>
            </div>
          </div>
        </el-upload>
      </div>

      <!-- 识别中动画 -->
      <div class="analyzing-section" v-if="isLoading">
        <div class="analyzing-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="analyzing-text">AI 正在识别中...</p>
        <p class="analyzing-subtext">请稍候，正在分析食物特征</p>
      </div>

      <!-- 识别结果展示（根据后端返回的结果） -->
      <div v-if="recognitionResult && !isLoading" class="recognition-result">
        <div class="result-header">
          <div class="result-icon">🍽️</div>
          <h4>识别结果</h4>
        </div>
        <div v-if="recognitionResult.data && recognitionResult.data.length > 0" class="result-list">
          <div v-for="(item, index) in recognitionResult.data" :key="index" class="result-item">
            <div class="result-item-title">{{ item.dishName }}</div>
            <div class="result-item-details">
              <div class="result-item-detail">
                <span class="label">识别置信度</span>
                <span class="value confidence">{{ (item.confidence * 100).toFixed(2) }}%</span>
              </div>
              <div class="result-item-detail">
                <span class="label">热量</span>
                <span class="value calorie">{{ item.calorie }} 千卡/100g</span>
              </div>
              <div class="result-item-detail">
                <span class="label">识别状态</span>
                <span class="value status">{{ item.recognitionStatus }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-result">
          <div class="no-result-icon">😕</div>
          <p>未识别到任何结果</p>
          <span>请尝试上传更清晰的食物图片</span>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" :disabled="isLoading" class="cancel-btn">取消</el-button>
          <el-button type="primary" @click="startRecognize" :loading="isLoading" :disabled="!imageFile" class="recognize-btn">
            开始识别
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
//加载状态
const isLoading = ref(false)

// 自动获取图片文件（第三方组件自带）
const handleFileChange = (file) => {
  imageFile.value = file.raw
  recognitionResult.value = null
}

// 图片预览URL
const previewUrl = computed(() => {
  return imageFile.value ? URL.createObjectURL(imageFile.value) : ''
})

// 开始识别
const startRecognize = async () => {
  if (!imageFile.value) {
    alert('请先选择图片')
    return
  }

  try {
    isLoading.value = true
    // 调用API进行食物识别
    const result = await recognizeDish(imageFile.value)
    // 返回结果给recognitionResult
    recognitionResult.value = result
  } catch (error) {
    // 错误已经在响应拦截器中处理
    console.error('识别出错：', error)
  } finally {
    isLoading.value = false
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
  background: linear-gradient(145deg, #f1f8f1 0%, #e0f2e0 100%);
  border: none;
  height: auto;
  max-height: none;
  min-height: 300px;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow:
    0 4px 20px rgba(76, 175, 80, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.left-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 12px 30px rgba(76, 175, 80, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.08);
}

.identify-box {
  flex: 1;
  background: linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%);
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.identify-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.identify-box:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
}

.identify-box:hover::before {
  opacity: 1;
}

.icon-box {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  margin-bottom: 16px;
  box-shadow:
    0 4px 15px rgba(76, 175, 80, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.identify-box:hover .icon-box {
  transform: scale(1.1);
  box-shadow:
    0 6px 20px rgba(76, 175, 80, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.icon-box svg {
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}

.identify-text h3 {
  margin: 0 0 8px 0;
  color: #2e7d32;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.identify-text p {
  margin: 0;
  font-size: 13px;
  color: #78909c;
  font-weight: 400;
}

/* 建议区 */
.ai-suggest-box {
  background: linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  padding: 20px;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(76, 175, 80, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.ai-suggest-box:hover {
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(76, 175, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.ai-suggest-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 14px 0;
}

.ai-suggest-header h3 {
  margin: 0;
  color: #2e7d32;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-suggest-header h3::before {
  content: '✨';
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #b0bec5;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.ai-suggest-box p {
  margin: 8px 0;
  font-size: 13px;
  color: #546e7a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(76, 175, 80, 0.15);
}

.ai-suggest-box p:last-child {
  border-bottom: none;
}

.ai-suggest-box span {
  font-weight: 600;
  color: #4caf50;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

/* 弹窗整体样式 */
:deep(.food-recognize-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

:deep(.food-recognize-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  padding: 20px 24px;
  margin: 0;
}

:deep(.food-recognize-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.5px;
}

:deep(.food-recognize-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.food-recognize-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
  transition: transform 0.3s ease;
}

:deep(.food-recognize-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: white;
  transform: rotate(90deg);
}

:deep(.food-recognize-dialog .el-dialog__body) {
  padding: 24px;
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
}

/* 上传区域样式 */
.upload-section {
  margin-bottom: 20px;
}

.avatar-uploader :deep(.el-upload) {
  width: 100%;
  height: 200px;
  border: 2px dashed #c8e6c9;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #4caf50;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.15);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #81c784;
  transition: transform 0.3s ease;
}

.avatar-uploader :deep(.el-upload:hover) .upload-icon {
  transform: scale(1.1);
}

.upload-icon svg {
  width: 100%;
  height: 100%;
}

.upload-text {
  font-size: 15px;
  font-weight: 500;
  color: #2e7d32;
}

.upload-hint {
  font-size: 12px;
  color: #9e9e9e;
}

.upload-preview {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-preview:hover .preview-overlay {
  opacity: 1;
}

.preview-overlay span {
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.9);
  border-radius: 20px;
}

/* 识别中动画 */
.analyzing-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%);
  border-radius: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.analyzing-spinner {
  position: relative;
  width: 70px;
  height: 70px;
  margin-bottom: 16px;
}

.analyzing-spinner .spinner-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #4caf50;
  border-right-color: #81c784;
}

.analyzing-spinner .spinner-ring:nth-child(1) {
  width: 70px;
  height: 70px;
  animation: spin 1.5s linear infinite;
}

.analyzing-spinner .spinner-ring:nth-child(2) {
  width: 50px;
  height: 50px;
  animation: spin 1.2s linear infinite reverse;
  border-top-color: #66bb6a;
  border-right-color: #a5d6a7;
}

.analyzing-spinner .spinner-ring:nth-child(3) {
  width: 30px;
  height: 30px;
  animation: spin 0.9s linear infinite;
  border-top-color: #43a047;
  border-right-color: #4caf50;
}

.analyzing-text {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: #2e7d32;
  letter-spacing: 0.5px;
}

.analyzing-subtext {
  margin: 0;
  font-size: 12px;
  color: #78909c;
}

/* 识别结果样式 */
.recognition-result {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(76, 175, 80, 0.15);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
}

.result-icon {
  font-size: 24px;
}

.result-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  background: linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(76, 175, 80, 0.15);
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
}

.result-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(76, 175, 80, 0.2);
}

.result-item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.result-item-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 100px;
}

.result-item-detail .label {
  font-size: 12px;
  color: #78909c;
}

.result-item-detail .value {
  font-size: 14px;
  font-weight: 600;
  color: #37474f;
}

.result-item-detail .value.confidence {
  color: #4caf50;
}

.result-item-detail .value.calorie {
  color: #ff7043;
}

.result-item-detail .value.status {
  color: #2196f3;
}

/* 无结果样式 */
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-align: center;
}

.no-result-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.no-result p {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #37474f;
}

.no-result span {
  font-size: 13px;
  color: #78909c;
}

/* 底部按钮 */
:deep(.food-recognize-dialog .el-dialog__footer) {
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 500;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #555;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #eeeeee;
  border-color: #bdbdbd;
}

.recognize-btn {
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 500;
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.recognize-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.recognize-btn:disabled {
  background: #c8e6c9;
  cursor: not-allowed;
}
</style>
