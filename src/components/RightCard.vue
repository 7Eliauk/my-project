<template>
  <div class="right-container">
    <!-- 营养分析模块 -->
    <div class="nutrition-box">
      <h3>营养分析</h3>
      <el-button type="primary" size="small" @click="openDialog" class="add-btn"
        >添加食材</el-button
      >
    </div>
    <div class="advise-box">
      <h3>推荐方案</h3>

      <!-- 早餐 -->
      <div class="plan-item">
        <div class="plan-tag">早餐</div>
        <div class="plan-content">
          <img src="@/assets/breakfast.png" alt="早餐" />
          <span>燕麦粥+鸡蛋</span>
        </div>
      </div>

      <!-- 午餐 -->
      <div class="plan-item">
        <div class="plan-tag">午餐</div>
        <div class="plan-content">
          <img src="@/assets/lunch.png" alt="午餐" />
          <span>牛排+水果</span>
        </div>
      </div>

      <!-- 晚餐 -->
      <div class="plan-item">
        <div class="plan-tag">晚餐</div>
        <div class="plan-content">
          <img src="@/assets/dinner.png" alt="晚餐" />
          <span>清蒸鱼+蔬菜</span>
        </div>
      </div>
    </div>

    <!-- 食材添加弹窗 -->
    <el-dialog v-model="dialogVisible" title="添加食材信息" width="500px" append-to-body>
      <el-form :model="formData" label-width="100px">
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
                style="width: 150px; margin-right: 10px"
              />
              <el-input
                v-model="ingredient.weight"
                placeholder="食材重量(g)"
                style="width: 120px; margin-right: 10px"
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
      <!-- 营养分析结果展示 -->
      <div class="analysis-result" v-if="showResult || analysisResult">
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
import { Delete } from '@element-plus/icons-vue'
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

.nutrition-box {
  flex: 1;
  height: 40%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #c5cedf;
  margin: 0 auto;
}
.nutrition-box:hover {
  transform: scale(1.02);
}
.advise-box {
  height: 60%;
  width: 95%;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #c5cedf;
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

/* 营养分析结果样式 */
.analysis-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}

.analysis-result h4 {
  margin: 0 0 15px 0;
  color: #2e7d32;
  font-size: 18px;
  border-bottom: 2px solid #c8e6c9;
  padding-bottom: 8px;
}

.result-section {
  margin-bottom: 15px;
}

.result-section h5 {
  margin: 0 0 8px 0;
  color: #555;
  font-size: 14px;
  font-weight: bold;
}

.result-section p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.group-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.group-tag {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

.group-tag.suitable {
  background-color: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.group-tag.unsuitable {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
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
  padding: 8px 12px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.nutrition-label {
  color: #555;
  font-size: 14px;
}

.nutrition-value {
  color: #2e7d32;
  font-weight: bold;
  font-size: 14px;
}

.nutrition-summary {
  margin-top: 15px;
  padding: 12px;
  background-color: #e8f5e8;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.nutrition-summary p {
  margin: 0;
  color: #2e7d32;
  font-size: 14px;
  font-weight: 500;
}

.add-btn {
  margin-top: 8px;
  padding: 6px 16px;
  font-size: 12px;
}

/* 弹窗样式优化 */
:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-bottom: 2px solid #4caf50;
}

:deep(.el-dialog__title) {
  color: #2e7d32;
  font-weight: bold;
}

:deep(.el-form-item__label) {
  color: #555;
  font-weight: 500;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  border-radius: 6px;
}

:deep(.el-button--primary) {
  background-color: #4caf50;
  border-color: #4caf50;
}

:deep(.el-button--primary:hover) {
  background-color: #2e7d32;
  border-color: #2e7d32;
}
</style>
