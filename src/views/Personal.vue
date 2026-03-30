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

            <el-form-item label="生日">
              <el-date-picker
                v-model="userInfo.birthday"
                type="date"
                placeholder="选择生日"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
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
              <el-option label="糖尿病" value="diabetes" />
              <el-option label="胃病" value="stomachDisease" />
              <el-option label="高血压" value="hypertension" />
              <el-option label="高血脂" value="hyperlipidemia" />
              <el-option label="其他" value="other" />
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
  birthday: '',
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

      console.log('userInfo.value=', userInfo.value)

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
    userInfo.value.avatar = res.data.avatarUrl || tempAvatarUrl // userInfo承接后端返回的头像，如果后端没返回，依旧使用预览的头像URL
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
  } catch (error) {
    ElMessage.error('身体状况信息保存失败')
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
.personal-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  color: #2e7d32;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
}

.personal-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.section-title {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: #2e7d32;
  padding: 16px 24px;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 2px solid #4caf50;
}

.section-content {
  padding: 24px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.info-row :deep(.el-form-item) {
  margin-bottom: 0;
}

/* 头像样式 */
.avatar-uploader {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4caf50;
}

.avatar-uploader-icon {
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  border: 2px dashed #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #4caf50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-uploader-icon:hover {
  background-color: #e8f5e8;
  border-color: #2e7d32;
  transform: scale(1.05);
}

/* 表单样式 */
:deep(.el-form-item__label) {
  font-weight: bold;
  color: #555;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  border-radius: 8px;
}

:deep(.el-button--primary) {
  background-color: #4caf50;
  border-color: #4caf50;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: bold;
}

:deep(.el-button--primary:hover) {
  background-color: #2e7d32;
  border-color: #2e7d32;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}
</style>

