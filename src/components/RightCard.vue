<template>
  <div class="right-container">
    <!-- 营养分析模块 -->
    <div class="nutrition-box">
      <div class="nutrition-header">
        <h3>营养分析</h3>
        <div class="status-indicator"></div>
      </div>
      <div class="nutrition-icon-wrapper">
        <svg
          class="nutrition-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p class="nutrition-desc">智能分析食材营养成分</p>
      <button class="add-btn-custom" @click="openDialog">
        <span>添加食材</span>
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div class="advise-box">
      <div class="advise-header">
        <h3>推荐方案</h3>
        <div class="meal-count">3 餐</div>
      </div>

      <!-- 早餐 -->
      <div class="plan-item">
        <div class="plan-tag breakfast">早餐</div>
        <div class="plan-content">
          <div class="food-img breakfast-img">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path
                d="M12 3v3M12 18v3M3 12h3M18 12h3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <span>燕麦粥+鸡蛋</span>
        </div>
      </div>

      <!-- 午餐 -->
      <div class="plan-item">
        <div class="plan-tag lunch">午餐</div>
        <div class="plan-content">
          <div class="food-img lunch-img">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C8.5 2 6 4.5 6 8v4c0 2 1 3 2 4h8c1-1 2-2 2-4V8c0-3.5-2.5-6-6-6z"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
              />
              <path
                d="M8 16v4M12 16v5M16 16v4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <span>牛排+水果</span>
        </div>
      </div>

      <!-- 晚餐 -->
      <div class="plan-item">
        <div class="plan-tag dinner">晚餐</div>
        <div class="plan-content">
          <div class="food-img dinner-img">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
              />
              <path
                d="M8 12h8M12 8v8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <span>清蒸鱼+蔬菜</span>
        </div>
      </div>
    </div>

    <!-- 食材添加弹窗 -->
    <el-dialog v-model="dialogVisible" title="添加食材信息" width="520px" append-to-body>
      <el-form :model="formData" label-width="90px">
        <el-form-item label="食材加重量">
          <div
            v-for="(ingredient, index) in formData.ingredients"
            :key="index"
            class="ingredient-item"
          >
            <div class="ingredient-row">
              <el-input
                v-model="ingredient.name"
                placeholder="食材名称"
                style="width: 130px; margin-right: 8px"
              />
              <el-input
                v-model="ingredient.weight"
                placeholder="重量(g)"
                style="width: 90px; margin-right: 8px"
              />
              <el-button
                type="danger"
                size="small"
                :icon="Delete"
                @click="removeIngredient(index)"
                v-if="formData.ingredients.length > 1"
                circle
              />
            </div>
          </div>
          <!--添加食材按钮 -->
          <el-button type="primary" size="small" @click="addIngredient" style="margin-top: 10px">
            添加食材
          </el-button>
        </el-form-item>
        <el-form-item label="烹饪方法">
          <el-select v-model="formData.cookingMethod" placeholder="请选择烹饪方法">
            <el-option label="清蒸" value="清蒸" />
            <el-option label="煮" value="煮" />
            <el-option label="炒" value="炒" />
            <el-option label="煎" value="煎" />
            <el-option label="烤" value="烤" />
            <el-option label="炖" value="炖" />
          </el-select>
        </el-form-item>
        <el-form-item label="食用人群">
          <el-select v-model="formData.targetGroup" placeholder="请选择食用人群" multiple>
            <el-option label="儿童" value="儿童" />
            <el-option label="青少年" value="青少年" />
            <el-option label="成年人" value="成年人" />
            <el-option label="老年人" value="老年人" />
            <el-option label="孕妇" value="孕妇" />
            <el-option label="健身人群" value="健身人群" />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 开始识别按钮 -->
      <div style="text-align: center; margin: 15px 0">
        <el-button type="success" size="default" @click="submitForm" :loading="isSubmitting">
          开始识别
        </el-button>
      </div>
      <!-- 识别中动画 -->
      <div class="analyzing-animation" v-if="isSubmitting && !analysisResult">
        <div class="analyzing-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="analyzing-text">正在智能分析中...</p>
        <p class="analyzing-subtext">AI 正在计算营养成分</p>
      </div>
      <!-- 营养分析结果展示 -->
      <div class="analysis-result" v-if="analysisResult">
        <h4>营养分析结果</h4>

        <!-- 烹饪影响 -->
        <div class="result-section">
          <h5>烹饪影响</h5>
          <!-- 可选操作，analysisResult结果为null或者undefined时不报错并且不显示 -->
          <p>{{ analysisResult?.cookingImpact || '' }}</p>
        </div>

        <!-- 适用人群 -->
        <div class="result-section">
          <h5>适用人群</h5>
          <div class="group-list">
            <!-- 只有数据存在，字段存在，数组里有内容才会显示 -->
            <template
              v-if="
                analysisResult &&
                analysisResult.suitableGroups &&
                analysisResult.suitableGroups.length > 0
              "
            >
              <span
                v-for="(group, index) in analysisResult.suitableGroups"
                :key="index"
                class="group-tag suitable"
                >{{ group }}</span
              >
            </template>
            <span v-else class="placeholder"></span>
          </div>
        </div>

        <!-- 不适用人群 -->
        <div class="result-section">
          <h5>不适用人群</h5>
          <div class="group-list">
            <template
              v-if="
                analysisResult &&
                analysisResult.unsuitableGroups &&
                analysisResult.unsuitableGroups.length > 0
              "
            >
              <span
                v-for="(group, index) in analysisResult.unsuitableGroups"
                :key="index"
                class="group-tag unsuitable"
                >{{ group }}</span
              >
            </template>
            <span v-else class="placeholder"></span>
          </div>
        </div>

        <!-- 营养成分 -->
        <div class="result-section">
          <h5>营养成分</h5>
          <div class="nutrition-table">
            <div class="nutrition-row">
              <span class="nutrition-label">热量</span>
              <span class="nutrition-value"
                >{{ analysisResult?.nutrition?.calorie || '--' }} 千卡</span
              >
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">蛋白质</span>
              <span class="nutrition-value"
                >{{ analysisResult?.nutrition?.protein || '--' }} 克</span
              >
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">脂肪</span>
              <span class="nutrition-value">{{ analysisResult?.nutrition?.fat || '--' }} 克</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">碳水化合物</span>
              <span class="nutrition-value"
                >{{ analysisResult?.nutrition?.carbohydrate || '--' }} 克</span
              >
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">膳食纤维</span>
              <span class="nutrition-value">{{ analysisResult?.nutrition?.fiber || '--' }} 克</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">钠</span>
              <span class="nutrition-value"
                >{{ analysisResult?.nutrition?.sodium || '--' }} 毫克</span
              >
            </div>
          </div>

          <!-- 营养摘要 -->
          <div class="nutrition-summary" v-if="analysisResult?.nutrition?.summary">
            <p>{{ analysisResult.nutrition.summary }}</p>
          </div>

          <!-- 保存到日志按钮 -->
          <div
            class="result-actions"
            style="margin-top: 20px; display: flex; justify-content: center"
          >
            <el-button type="primary" size="default" @click="saveToLog" :icon="Calendar">
              保存到饮食日志
            </el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="restForm">重置</el-button>
          <el-button type="primary" @click="closeDialog">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'
import { Delete, Calendar } from '@element-plus/icons-vue'
import { addMealLog } from '../api/mealLog'
//控制弹窗
const dialogVisible = ref(false)
// 定义营养数据类型
interface NutritionData {
  calorie: number | null
  protein: number | null
  fat: number | null
  carbohydrate: number | null
  fiber: number | null
  sodium: number | null
  description: string | null
  baikeUrl: string | null
  imageUrl: string | null
  summary: string | null
}

// 定义分析结果类型
interface AnalysisResult {
  nutrition: NutritionData
  cookingImpact: string
  suitableGroups: string[]
  unsuitableGroups: string[]
}

//存储分析结果
const analysisResult = ref<AnalysisResult | null>(null)
//控制结果显示
const showResult = ref(false)
//控制提交状态
const isSubmitting = ref(false)
//表单数据
const formData = ref({
  ingredients: [{ name: '', weight: null }] as Array<{
    name: string
    weight: number | null
  }>,
  cookingMethod: '',
  targetGroup: [],
})
//打开弹窗
const openDialog = () => {
  restForm() //打开弹窗重置信息
  dialogVisible.value = true
  analysisResult.value = null
  showResult.value = true // 打开弹窗时显示结果区域
}
//关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
  showResult.value = false // 关闭弹窗时隐藏结果区域
}
//添加食材
const addIngredient = () => {
  formData.value.ingredients.push({ name: '', weight: null })
}
//清除removeIngredients
const removeIngredient = (index: number) => {
  formData.value.ingredients.splice(index, 1)
}
//表单检验 提交表达
const submitForm = async () => {
  // 验证食材列表
  const hasValidIngredient = formData.value.ingredients.some((ingredient) => {
    return ingredient.name && ingredient.weight
  })

  if (!hasValidIngredient) {
    ElMessage.warning('请至少添加一种有效的食材')
    return
  }

  // 验证每个食材的必填项
  //循环食材列表
  for (const ingredient of formData.value.ingredients) {
    if (ingredient.name && !ingredient.weight) {
      ElMessage.warning('请完善所有食材的重量信息')
      return
    }
  }

  if (!formData.value.cookingMethod) {
    ElMessage.warning('请选择烹饪方式')
    return
  }

  if (!formData.value.targetGroup) {
    ElMessage.warning('请选择适用人群')
    return
  }

  try {
    isSubmitting.value = true
    //将数组形式的targetGroup通过.join方法转变成字符串形式
    const submitData = {
      ingredients: formData.value.ingredients,
      cookingMethod: formData.value.cookingMethod,
      targetGroup: formData.value.targetGroup.join(','),
    }
    // 调用后端API进行营养分析
    const response = await request.post('/api/nutrition/structured-analysis', submitData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 保存分析结果
    analysisResult.value = response.data
    ElMessage.success('营养分析成功')
  } catch (error) {
    console.error('营养分析失败：', error)
    ElMessage.error('营养分析失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
//保存到饮食日志
const saveToLog = async () => {
  try {
    if (!analysisResult.value) {
      ElMessage.warning('请先进行营养分析')
      return
    }

    // 获取登录时的userId
    let userId: number | null = null

    // 首先尝试从localStorage直接获取userId
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId && storedUserId !== 'undefined') {
      userId = parseInt(storedUserId, 10)
    }

    // 如果没有直接存储userId，尝试从userInfo中获取
    if (!userId) {
      const userStr = localStorage.getItem('userInfo')
      if (userStr && userStr !== 'undefined') {
        try {
          const user = JSON.parse(userStr)
          userId = user.userId ?? user.id ?? null
        } catch (error) {
          console.error('解析用户信息失败:', error)
          localStorage.removeItem('userInfo')
        }
      }
    }

    if (!userId) {
      ElMessage.warning('请先登录')
      return
    }

    // 提取食材名称
    const ingredients = formData.value.ingredients.map((item) => item.name).join('、')

    // 从分析结果中提取营养信息
    const nutrition = analysisResult.value.nutrition
    const nutritionData = {
      calories: nutrition.calorie || 0,
      protein: nutrition.protein || 0,
      fat: nutrition.fat || 0,
      carbs: nutrition.carbohydrate || 0,
      fiber: nutrition.fiber || 0,
      vitamins: '{}',
      minerals: '{}',
    }

    // 创建饮食日志记录
    const logData = {
      userId,
      logDate: new Date().toISOString().split('T')[0] || '',
      mealTime: '加餐', // 默认餐次
      foodName: `营养分析: ${ingredients}`,
      quantity: 100,
      cookingMethod: formData.value.cookingMethod || '未知',
      ...nutritionData,
      remark: analysisResult.value.nutrition.summary || '',
      createTime: new Date().toISOString(),
    }

    // 保存到后端
    await addMealLog(logData)

    ElMessage.success('已保存到饮食日志')
  } catch (error) {
    console.error('保存到日志失败:', error)
    ElMessage.error('保存到日志失败，请重试')
  }
}

//重置表单
const restForm = () => {
  formData.value = {
    ingredients: [{ name: '', weight: null }],
    cookingMethod: '',
    targetGroup: [],
  }
  //清除分析结果
  analysisResult.value = null
}
</script>

<style scoped>
.right-container {
  background: linear-gradient(145deg, #f6fff6 0%, #e8f5e8 100%);
  border: none;
  border-radius: 24px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.right-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(76, 175, 80, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* 营养分析模块 */
.nutrition-box {
  flex: 1;
  height: 40%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%);
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(76, 175, 80, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
}

.nutrition-box:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(76, 175, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.nutrition-header {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nutrition-header h3 {
  margin: 0;
  color: #2e7d32;
  font-size: 15px;
  font-weight: 600;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #81c784;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.nutrition-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.nutrition-box:hover .nutrition-icon-wrapper {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.nutrition-icon {
  width: 36px;
  height: 36px;
  color: #4caf50;
}

.nutrition-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #78909c;
}

.add-btn-custom {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-btn-custom:hover {
  background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4), 0 3px 6px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  width: 14px;
  height: 14px;
}

/* 推荐方案模块 */
.advise-box {
  height: 60%;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%);
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(76, 175, 80, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.advise-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.advise-header h3 {
  margin: 0;
  color: #2e7d32;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.advise-header h3::before {
  content: '🍽️';
  font-size: 16px;
}

.meal-count {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: #4caf50;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed rgba(76, 175, 80, 0.15);
  transition: all 0.3s ease;
}

.plan-item:last-child {
  border-bottom: none;
}

.plan-item:hover {
  background: rgba(76, 175, 80, 0.03);
  border-radius: 8px;
  padding: 12px 8px;
  margin: 0 -8px;
}

.plan-tag {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.plan-tag.breakfast {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #f57c00;
}

.plan-tag.lunch {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
}

.plan-tag.dinner {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
}

.plan-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.food-img {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.food-img svg {
  width: 24px;
  height: 24px;
}

.food-img.breakfast-img {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  color: #ffa000;
}

.food-img.lunch-img {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #388e3c;
}

.food-img.dinner-img {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  color: #c2185b;
}

.plan-item:hover .food-img {
  transform: scale(1.1);
}

.plan-content span {
  color: #37474f;
  font-size: 14px;
  font-weight: 500;
}

/* 营养分析结果样式 */
.analysis-result {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.analysis-result h4 {
  margin: 0 0 16px 0;
  color: #2e7d32;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid #c8e6c9;
  padding-bottom: 10px;
}

.result-section {
  margin-bottom: 16px;
}

.result-section h5 {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 14px;
  font-weight: 600;
}

.result-section p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 13px;
}

.group-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.group-tag {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.group-tag.suitable {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.group-tag.unsuitable {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
  border: 1px solid #ef9a9a;
}

.placeholder {
  color: #999;
  font-style: italic;
  font-size: 14px;
}

.nutrition-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.nutrition-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.nutrition-row:hover {
  border-color: #c8e6c9;
  box-shadow: 0 3px 6px rgba(76, 175, 80, 0.1);
}

.nutrition-label {
  color: #546e7a;
  font-size: 13px;
}

.nutrition-value {
  color: #2e7d32;
  font-weight: 600;
  font-size: 13px;
}

.nutrition-summary {
  margin-top: 16px;
  padding: 14px;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 12px;
  border-left: 4px solid #4caf50;
}

.nutrition-summary p {
  margin: 0;
  color: #2e7d32;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

/* 弹窗样式优化 */
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  padding: 20px 24px;
  margin: 0;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.5px;
}

:deep(.el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
  transition: transform 0.3s ease;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: white;
  transform: rotate(90deg);
}

:deep(.el-dialog__body) {
  padding: 24px;
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  color: #37474f;
  font-weight: 600;
  font-size: 14px;
  padding-right: 16px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

/* 食材列表样式 */
.ingredient-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.ingredient-row:hover {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
  transform: translateX(4px);
}

/* 按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(239, 83, 80, 0.3);
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.4);
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.35);
  transition: all 0.3s ease;
}

:deep(.el-button--success:hover) {
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.45);
}

/* 底部按钮区域 */
:deep(.el-dialog__footer) {
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

:deep(.dialog-footer .el-button) {
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.dialog-footer .el-button:first-child) {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #555;
}

:deep(.dialog-footer .el-button:first-child:hover) {
  background: #eeeeee;
  border-color: #bdbdbd;
}

/* 识别中动画样式 */
.analyzing-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%);
  border-radius: 16px;
  margin-top: 20px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.analyzing-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.spinner-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #4caf50;
  border-right-color: #81c784;
}

.spinner-ring:nth-child(1) {
  width: 80px;
  height: 80px;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 60px;
  height: 60px;
  animation: spin 1.2s linear infinite reverse;
  border-top-color: #66bb6a;
  border-right-color: #a5d6a7;
}

.spinner-ring:nth-child(3) {
  width: 40px;
  height: 40px;
  animation: spin 0.9s linear infinite;
  border-top-color: #43a047;
  border-right-color: #4caf50;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.analyzing-text {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
  letter-spacing: 0.5px;
}

.analyzing-subtext {
  margin: 0;
  font-size: 13px;
  color: #78909c;
}
</style>
