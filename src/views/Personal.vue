<template>
  <div class="personal-container">
    <h1 class="page-title">个人中心</h1>

    <!-- 个人基础信息 -->
    <div class="personal-section">
      <h2 class="section-title">个人基础信息</h2>
      <div class="section-content">
        <el-form :model="userInfo" label-width="120px" :inline="false">
          <div class="info-row">
            <el-form-item label="用户头像">
              <!-- 自定义函数处理头像而不是默认action:"#" -->
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="handleAvatarUpload"
              >
                <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="userInfo.nickname" placeholder="请输入昵称" />
            </el-form-item>
          </div>

          <div class="info-row">
            <el-form-item label="身高">
              <el-input-number
                v-model="userInfo.height"
                :min="50"
                :max="250"
                :step="1"
                placeholder="cm"
              />
            </el-form-item>

            <el-form-item label="体重">
              <el-input-number
                v-model="userInfo.weight"
                :min="20"
                :max="200"
                :step="0.1"
                placeholder="kg"
              />
            </el-form-item>

            <el-form-item label="年龄">
              <el-input-number
                v-model="userInfo.age"
                :min="0"
                :max="150"
                :step="1"
                placeholder="请输入年龄"
              />
            </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="userInfo.gender">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="form-actions">
            <el-button type="primary" @click="saveBasicInfo">保存</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 身体状况上传 -->
    <div class="personal-section">
      <h2 class="section-title">身体状况</h2>
      <div class="section-content">
        <el-form :model="healthInfo" label-width="120px" :inline="false">
          <el-form-item label="基础疾病">
            <el-select v-model="healthInfo.chronicDiseases" multiple placeholder="请选择基础疾病">
              <el-option label="糖尿病" value="糖尿病" />
              <el-option label="胃病" value="胃病" />
              <el-option label="高血压" value="高血压" />
              <el-option label="高血脂" value="高血脂" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>

          <el-form-item label="过敏食材">
            <el-input v-model="healthInfo.allergyFoods" placeholder="请输入过敏食材，用逗号分隔" />
          </el-form-item>

          <el-form-item label="肠胃功能">
            <el-select v-model="healthInfo.gutStatus" placeholder="请选择肠胃功能情况">
              <el-option label="良好" value="good" />
              <el-option label="一般" value="average" />
              <el-option label="较差" value="poor" />
              <el-option label="需特殊注意" value="special" />
            </el-select>
          </el-form-item>

          <el-form-item label="特殊身体状态">
            <el-select v-model="healthInfo.specialStatus" placeholder="请选择特殊身体状态">
              <el-option label="孕期" value="pregnancy" />
              <el-option label="哺乳期" value="lactation" />
              <el-option label="术后" value="postoperative" />
              <el-option label="减脂期" value="weightLoss" />
              <el-option label="增肌期" value="muscleGain" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否公开">
            <el-switch v-model="healthInfo.isPublic" />
          </el-form-item>

          <div class="form-actions">
            <el-button type="primary" @click="saveHealthInfo">保存</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 预期身体目标设置 -->
    <div class="personal-section">
      <h2 class="section-title">身体目标</h2>
      <div class="section-content">
        <el-form :model="goalInfo" label-width="120px" :inline="false">
          <el-form-item label="目标类型">
            <el-select v-model="goalInfo.goalType" placeholder="请选择目标类型">
              <el-option label="减脂" value="weightLoss" />
              <el-option label="增肌" value="muscleGain" />
              <el-option label="养胃" value="stomachCare" />
              <el-option label="控糖" value="sugarControl" />
              <el-option label="改善基础疾病" value="diseaseImprovement" />
              <el-option label="维持健康" value="maintainHealth" />
            </el-select>
          </el-form-item>

          <el-form-item label="目标周期">
            <el-input v-model="goalInfo.goalPeriod" placeholder="请选择目标天数"> </el-input>
          </el-form-item>

          <div class="form-actions">
            <el-button type="primary" @click="saveGoalInfo">保存</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getUserInfo,
  getUserHealthInfo,
  getUserGoalInfo,
  handleAvatarUpload as uploadAvatarApi,
} from '../api/auth'
import request from '../utils/request'

// 从localStorage获取userId，实际项目中应该从登录状态中获取
const userId = ref(localStorage.getItem('userId') || '1') //默认值为1，实际项目中应该从登录状态获取

//isUserInfoSaved用来标记用户是否已保存过信息
const isUserInfoSaved = ref(!!localStorage.getItem('isUserInfoSaved'))
// 个人基础信息
const userInfo = ref({
  avatar: '',
  nickname: '',
  height: null,
  weight: null,
  age: null,
  gender: 1,
})

// 身体状况信息
const healthInfo = ref({
  chronicDiseases: [],
  allergyFoods: '',
  gutStatus: '',
  specialStatus: '',
  isPublic: false,
})

// 身体目标信息
const goalInfo = ref({
  goalType: '',
  goalPeriod: null,
})

//页面加载时获取用户信息
onMounted(async () => {
  console.log('页面加载完成进入onMounted')
  console.log('isUserInfoSaved=', isUserInfoSaved.value)
  if (isUserInfoSaved.value) {
    try {
      // 获取个人基础,身体状况信息，目标身体状况信息
      const [userRes, healthRes, goalRes] = await Promise.all([
        getUserInfo(userId.value),
        getUserHealthInfo(userId.value),
        getUserGoalInfo(userId.value),
      ])
      console.log('接口全部成功,goleRes=', userRes)
      ;(userInfo.value = userRes.data),
        (healthInfo.value = healthRes.data),
        (goalInfo.value = goalRes.data)

      ElMessage.success('个人信息获取成功')
    } catch (error) {
      console.error('获取用户信息失败：', error)
      ElMessage.error('获取用户信息失败，请重试')
    }
  }
})

// 头像上传处理  规定·JPG/PNG格式，大小不能超过2MB
const beforeUpload = (file: File) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像必须是 JPG/PNG 格式')
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB')
  }
  return isImage && isLt2M
}
// 自定义头像上传处理
const handleAvatarUpload = async (uploadOptions: any) => {
  const file = uploadOptions.file
  // 浏览器生产临时地址
  const tempAvatarUrl = URL.createObjectURL(file)
  //将图片地址改为临时本地地址不用等待后端即可显示头像
  userInfo.value.avatar = tempAvatarUrl

  try {
    // 将userId和file穿给后端
    const res = await uploadAvatarApi(userId.value, file)
    // 使用后端返回的正式URL替换临时URL
    userInfo.value.avatar = res.data || tempAvatarUrl // userInfo承接后端返回的头像，如果后端没返回，依旧使用预览的头像URL
    // 释放之前的本地地址
    URL.revokeObjectURL(tempAvatarUrl)
    ElMessage.success('头像上传成功')
    uploadOptions.onSuccess(res)
  } catch (error) {
    // 上传失败时，清理临时URL
    URL.revokeObjectURL(tempAvatarUrl)
    userInfo.value.avatar = ''
    ElMessage.error('头像上传失败')
    uploadOptions.onError(error)
  }
}

//****保存个人信息--用户信息****

//保存基础信息
const saveBasicInfo = async () => {
  try {
    await request({
      url: `/api/user-center/info/${userId.value}`,
      method: 'post',
      data: userInfo.value,
    })
    isUserInfoSaved.value = true
    ElMessage.success('个人基础信息保存成功')
    localStorage.setItem('isUserInfoSaved', 'true')
  } catch (error) {
    ElMessage.error('个人基础信息保存失败')
  }
}
//保存身体状况信息
const saveHealthInfo = async () => {
  try {
    await request({
      url: `/api/user-center/health/${userId.value}`,
      method: 'post',
      data: healthInfo.value,
    })
    isUserInfoSaved.value = true
    localStorage.setItem('isUserInfoSaved', 'true')
    ElMessage.success('身体状况信息保存成功')
    console.log('healthInfo.value=', healthInfo.value)
  } catch (error) {
    ElMessage.error('身体状况信息保存失败')
    console.log('healthInfo.value=', healthInfo.value)
  }
}
//保存身体目标信息
const saveGoalInfo = async () => {
  try {
    await request({
      url: `/api/user-center/goal/${userId.value}`,
      method: 'post',
      data: goalInfo.value,
    })
    isUserInfoSaved.value = true
    localStorage.setItem('isUserInfoSaved', 'true')
    ElMessage.success('身体目标信息保存成功')
  } catch (error) {
    ElMessage.error('身体目标信息保存失败')
  }
}
</script>

<style scoped>
/* 页面整体样式 */
.personal-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 装饰元素 */
.personal-container::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), transparent);
  border-radius: 50%;
  z-index: 0;
}

.personal-container::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), transparent);
  border-radius: 50%;
  z-index: 0;
}

/* 页面标题 */
.page-title {
  text-align: center;
  color: #2e7d32;
  margin-bottom: 40px;
  font-size: 32px;
  font-weight: 700;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

.page-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  border-radius: 2px;
  margin: 12px auto 0;
}

/* 卡片样式 */
.personal-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(76, 175, 80, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.personal-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(76, 175, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* 卡片标题 */
.section-title {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  color: white;
  padding: 20px 24px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title::before {
  content: '🍃';
  font-size: 20px;
}

/* 卡片内容 */
.section-content {
  padding: 30px;
}

/* 信息行 */
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
  align-items: flex-start;
}

.info-row :deep(.el-form-item) {
  margin-bottom: 0;
  flex: 1;
  min-width: 200px;
}

/* 头像上传 */
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3);
}

.avatar-uploader-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%);
  border: 3px dashed #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #4caf50;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(135deg, transparent, rgba(76, 175, 80, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.avatar-uploader-icon:hover {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-color: #2e7d32;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.2);
}

.avatar-uploader-icon:hover::before {
  opacity: 1;
  transform: rotate(45deg) translate(50%, 50%);
}

/* 表单样式 */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #37474f;
  font-size: 14px;
  padding-right: 16px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover),
:deep(.el-input-number:hover) {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  border-color: #c8e6c9;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focus),
:deep(.el-input-number.is-focus) {
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  border-color: #4caf50;
}

/* 单选框样式 */
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #4caf50;
  border-color: #4caf50;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #4caf50;
  font-weight: 500;
}

/* 开关样式 */
:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #4caf50;
}

:deep(.el-switch__core) {
  border-radius: 20px;
}

/* 按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  border: none;
  border-radius: 12px;
  padding: 10px 32px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}

/* 按钮区域 */
.form-actions {
  text-align: right;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(76, 175, 80, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personal-container {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .section-content {
    padding: 20px;
  }

  .info-row {
    flex-direction: column;
    gap: 20px;
  }

  .info-row :deep(.el-form-item) {
    min-width: 100%;
  }

  .avatar-uploader {
    align-self: flex-start;
  }
}

/* 加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.personal-section {
  animation: fadeIn 0.5s ease-out;
}

.personal-section:nth-child(2) {
  animation-delay: 0.1s;
}

.personal-section:nth-child(3) {
  animation-delay: 0.2s;
}

.personal-section:nth-child(4) {
  animation-delay: 0.3s;
}
</style>

