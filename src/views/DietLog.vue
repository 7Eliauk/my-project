<template>
  <div class="diet-log-container">
    <div class="page-header">
      <h1 class="page-title">饮食日志</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddRecord">
          <el-icon><Plus /></el-icon> 添加记录
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 200px; margin-right: 10px"
      />
      <el-select
        v-model="selectedmealTime"
        placeholder="选择餐次"
        style="width: 150px; margin-right: 10px"
      >
        <el-option label="全部" value="" />
        <el-option label="早餐" value="breakfast" />
        <el-option label="午餐" value="lunch" />
        <el-option label="晚餐" value="dinner" />
        <el-option label="加餐" value="snack" />
      </el-select>
      <el-button type="primary" @click="fetchRecords">
        <el-icon><Search /></el-icon> 查询
      </el-button>
    </div>

    <!-- 饮食记录列表 -->
    <div class="records-list">
      <div v-for="record in records" :key="record.id" class="record-card">
        <div class="record-header">
          <div class="record-date-time">
            <el-icon class="meal-icon">
              <Calendar
                v-if="
                  record.mealTime === 'breakfast' ||
                  record.mealTime === 'lunch' ||
                  record.mealTime === 'dinner'
                "
              />
              <IceCream v-else />
            </el-icon>
            <span class="meal-type">{{record.mealTime }}</span>
            <span class="record-date">{{ formatDate(record.date) }}</span>
          </div>
          <div class="record-actions">
            <el-button type="info" size="small" @click="handleViewRecord(record)">
              <el-icon><Search /></el-icon> 查看详情
            </el-button>
            <el-button type="primary" size="small" @click="handleEditRecord(record)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteRecord(record.id)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </div>
        </div>

        <!-- 食材记录 -->
        <div class="section">
          <h3 class="section-title">
            <el-icon><Goods /></el-icon> 食材记录
          </h3>
          <div class="ingredients-list">
            <div
              v-for="(ingredient, index) in record.ingredients"
              :key="index"
              class="ingredient-preview-item"
            >
              <span class="ingredient-name">{{ ingredient.name }}</span>
              <span class="ingredient-quantity"
                >{{ ingredient.quantity }} {{ ingredient.unit }}</span
              >
            </div>
            <div v-if="record.ingredients.length === 0" class="empty-state">暂无食材记录</div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="records.length === 0" class="empty-state">
        <el-empty description="暂无饮食记录" />
      </div>
    </div>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="饮食记录详情" width="70%" top="5%">
      <div class="view-detail-content">
        <!-- 基础信息 -->
        <el-divider content-position="left">基础信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">记录日期：</span>
              <span class="detail-value">{{ viewData.date }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">餐次：</span>
              <span class="detail-value">{{viewData.mealTime }}</span>
            </div>
          </el-col>
        </el-row>

        <!-- 食材记录 -->
        <el-divider content-position="left">食材记录</el-divider>
        <div class="ingredients-list">
          <div
            v-for="(ingredient, index) in viewData.ingredients"
            :key="index"
            class="ingredient-item"
          >
            <span class="ingredient-name">{{ ingredient.name }}</span>
            <span class="ingredient-details">
              分量: {{ ingredient.quantity }} {{ ingredient.unit }} | 烹饪方式:
              {{ingredient.cookingMethod }}
            </span>
          </div>
          <div v-if="viewData.ingredients.length === 0" class="empty-state">暂无食材记录</div>
        </div>

        <!-- 营养分析 -->
        <el-divider content-position="left">营养分析</el-divider>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="nutrition-label">热量</div>
            <div class="nutrition-value">{{ viewData.nutrition.calories }} kcal</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">蛋白质</div>
            <div class="nutrition-value">{{ viewData.nutrition.protein }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">脂肪</div>
            <div class="nutrition-value">{{ viewData.nutrition.fat }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">碳水化合物</div>
            <div class="nutrition-value">{{ viewData.nutrition.carbs }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">膳食纤维</div>
            <div class="nutrition-value">{{ viewData.nutrition.fiber }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">维生素</div>
            <div class="nutrition-value">{{ viewData.nutrition.vitamins }}</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">矿物质</div>
            <div class="nutrition-value">{{ viewData.nutrition.minerals }}</div>
          </div>
        </div>

        <!-- 个人备注 -->
        <el-divider content-position="left">个人备注</el-divider>
        <div class="note-content">
          {{ viewData.note || '暂无备注' }}
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑饮食记录对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="70%" top="5%">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px">
        <!-- 基础信息 -->
        <el-divider content-position="left">基础信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="记录日期" prop="date">
              <el-date-picker
                v-model="formData.date"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="餐次" prop="mealTime">
              <el-select v-model="formData.mealTime" placeholder="选择餐次" style="width: 100%">
                <el-option label="早餐" value="breakfast" />
                <el-option label="午餐" value="lunch" />
                <el-option label="晚餐" value="dinner" />
                <el-option label="加餐" value="snack" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 食材记录 -->
        <el-divider content-position="left">食材记录</el-divider>
        <el-form-item label="食材列表">
          <div class="ingredients-form">
            <div
              v-for="(ingredient, index) in formData.ingredients"
              :key="index"
              class="ingredient-form-item"
            >
              <el-row :gutter="10" align="middle">
                <el-col :span="7">
                  <el-input v-model="ingredient.name" placeholder="食材名称" style="width: 100%" />
                </el-col>
                <el-col :span="4">
                  <el-input
                    v-model="ingredient.quantity"
                    type="number"
                    placeholder="分量"
                    style="width: 100%"
                  />
                </el-col>
                <el-col :span="4">
                  <el-select v-model="ingredient.unit" placeholder="单位" style="width: 100%">
                    <el-option label="克" value="g" />
                    <el-option label="千克" value="kg" />
                    <el-option label="毫升" value="ml" />
                    <el-option label="升" value="l" />
                    <el-option label="个" value="个" />
                    <el-option label="份" value="份" />
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <el-input
                    v-model="ingredient.cookingMethod"
                    placeholder="烹饪方式"
                    style="width: 100%"
                  >
                  </el-input>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    icon="Delete"
                    circle
                    size="small"
                    @click="removeIngredient(index)"
                  />
                </el-col>
              </el-row>
            </div>
            <div class="add-ingredient">
              <el-button type="dashed" @click="addIngredient">
                <el-icon><Plus /></el-icon> 添加食材
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!-- 营养分析（自动计算，可手动调整） -->
        <el-divider content-position="left">营养分析</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="热量 (kcal)" prop="nutrition.calories">
              <el-input-number v-model="formData.nutrition.calories" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="蛋白质 (g)" prop="nutrition.protein">
              <el-input-number v-model="formData.nutrition.protein" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="脂肪 (g)" prop="nutrition.fat">
              <el-input-number v-model="formData.nutrition.fat" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="碳水化合物 (g)" prop="nutrition.carbs">
              <el-input-number v-model="formData.nutrition.carbs" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="膳食纤维 (g)" prop="nutrition.fiber">
              <el-input-number v-model="formData.nutrition.fiber" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维生素" prop="nutrition.vitamins">
              <el-input
                v-model="formData.nutrition.vitamins"
                placeholder="如:维生素A、维生素C等"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="矿物质" prop="nutrition.minerals">
              <el-input
                v-model="formData.nutrition.minerals"
                placeholder="如：钙、铁、锌等"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 个人备注 -->
        <el-divider content-position="left">个人备注</el-divider>
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="formData.note"
            type="textarea"
            placeholder="请输入用餐感受、特殊需求或备注信息"
            rows="4"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRecord">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Edit, Delete, IceCream, Goods, Calendar } from '@element-plus/icons-vue'

// 类型定义
//定义食材类型
interface Ingredient {
  name: string
  quantity: number
  unit: string
  cookingMethod: string
}
// 定义营养类型
interface Nutrition {
  calories: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  vitamins: string
  minerals: string
}
// 定义饮食记录类型
interface DietRecord {
  id: string
  date: string
  mealTime: string
  ingredients: Ingredient[]
  nutrition: Nutrition
  note: string
}
//定义表单类型
interface FormData {
  id: string
  date: string
  mealTime: string
  ingredients: Ingredient[]
  nutrition: Nutrition
  note: string
}

// 初始化为空数组，从API获取数据,<DietRecord[]>为定义records为DietRecord类型数组，并初始化为空数组
const records = ref<DietRecord[]>([])

// 搜索和筛选
const selectedDate = ref('')
const selectedmealTime = ref('')

// 对话框状态
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEditing = ref(false)
//引入Elform组件，统一管理表单数据，告诉ts formRef为Elform,ref一开始为空渲染完成后才是表单实例
const formRef = ref<typeof import('element-plus')['ElForm'] | null>(null)

// 查看详情数据
const viewData = ref<DietRecord>({
  id: '',
  date: '',
  mealTime: 'breakfast',
  ingredients: [{ name: '', quantity: 0, unit: 'g', cookingMethod: '' }],
  nutrition: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    vitamins: '',
    minerals: '',
  },
  note: '',
})

// 动态对话框标题
const dialogTitle = computed(() => {
  return isEditing.value ? '编辑饮食记录' : '添加饮食记录'
})

// 表单数据
const formData = ref<FormData>({
  id: '',
  date: new Date().toISOString().split('T')[0] as string, //获取今日日期（字符串形式）
  mealTime: 'breakfast',
  ingredients: [{ name: '', quantity: 0, unit: 'g', cookingMethod: '' }],
  nutrition: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    vitamins: '',
    minerals: '',
  },
  note: '',
})

// 表单验证规则
const formRules = ref({
  date: [{ required: true, message: '请选择记录日期', trigger: 'change' }],
  mealTime: [{ required: true, message: '请选择餐次', trigger: 'change' }],
  'nutrition.calories': [{ required: true, message: '请输入热量', trigger: 'change' }],
  'nutrition.protein': [{ required: true, message: '请输入蛋白质含量', trigger: 'change' }],
  'nutrition.fat': [{ required: true, message: '请输入脂肪含量', trigger: 'change' }],
  'nutrition.carbs': [{ required: true, message: '请输入碳水化合物含量', trigger: 'change' }],
  'nutrition.fiber': [{ required: true, message: '请输入膳食纤维含量', trigger: 'change' }],
})


// 格式化为YYYY-MM-DD
const formatDate = (dateString: string) => {
  return dateString
}

// 添加食材
const addIngredient = () => {
  formData.value.ingredients.push({
    name: '',
    quantity: 0,
    unit: 'g',
    cookingMethod: '',
  })
}

// 移除食材
const removeIngredient = (index: number) => {
  if (formData.value.ingredients.length > 1) {
    formData.value.ingredients.splice(index, 1)
  } else {
    ElMessage.warning('至少需要保留一个食材')
  }
}

// 查看详情
const handleViewRecord = (record: any) => {
  viewData.value = JSON.parse(JSON.stringify(record))
  viewDialogVisible.value = true
}

// 添加记录
const handleAddRecord = () => {
  isEditing.value = false
  formData.value = {
    id: '',
    date: new Date().toISOString().split('T')[0] as string,
    mealTime: 'breakfast',
    ingredients: [{ name: '', quantity: 0, unit: 'g', cookingMethod: '' }],
    nutrition: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      vitamins: '',
      minerals: '',
    },
    note: '',
  }
  dialogVisible.value = true
}

// 编辑记录
const handleEditRecord = (record: any) => {
  isEditing.value = true
  formData.value = JSON.parse(JSON.stringify(record))
  dialogVisible.value = true
}

// 删除记录
const handleDeleteRecord = (id: string) => {
  ElMessageBox.confirm('确定要删除这条记录吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      records.value = records.value.filter((record) => record.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消删除
    })
}

// 保存记录
const handleSaveRecord = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (isEditing.value) {
      // 更新记录
      const index = records.value.findIndex((record) => record.id === formData.value.id)
      if (index !== -1) {
        records.value[index] = { ...formData.value } as any
      }
      ElMessage.success('更新成功')
    } else {
      // 创建记录
      const newRecord = {
        ...formData.value,
        id: Date.now().toString(),
      }
      records.value.unshift(newRecord)
      ElMessage.success('添加成功')
    }

    dialogVisible.value = false
  } catch (error) {
    // 表单验证失败
  }
}

// 查询记录
const fetchRecords = () => {
  // 这里可以添加实际的API调用逻辑
  ElMessage.info('查询功能待实现')
}
</script>

<style scoped>
.diet-log-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.search-filter {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.record-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
}

.record-date-time {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meal-icon {
  color: #409eff;
  font-size: 20px;
}

.meal-type {
  font-weight: bold;
  color: #303133;
}

.record-date {
  color: #909399;
  font-size: 14px;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303133;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.empty-state {
  text-align: center;
  color: #909399;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}

/* 表单样式 */
.ingredients-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ingredient-form-item {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.add-ingredient {
  text-align: center;
}

/* 详情视图样式 - 食材列表 */
.view-detail-content .ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.view-detail-content .ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.view-detail-content .ingredient-name {
  font-weight: bold;
  color: #303133;
}

.view-detail-content .ingredient-details {
  color: #606266;
  font-size: 14px;
}

/* 详情视图样式 - 营养分析 */
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.nutrition-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0;
  border-radius: 8px;
}

.nutrition-label {
  color: #67c23a;
  font-size: 14px;
  margin-bottom: 5px;
}

.nutrition-value {
  color: #389e0d;
  font-size: 18px;
  font-weight: bold;
}

/* 详情视图样式 - 个人备注 */
.note-content {
  padding: 15px;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 8px;
  color: #277fff;
  line-height: 1.6;
  margin-top: 10px;
}

/* 列表预览样式 - 食材列表 */
.records-list .ingredients-list {
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredient-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
}

.ingredient-preview-item:last-child {
  border-bottom: none;
}

.records-list .ingredient-name {
  font-weight: 500;
  color: #303133;
}

.ingredient-quantity {
  color: #606266;
  font-size: 14px;
}

/* 详情视图样式 */
.view-detail-content {
  line-height: 1.6;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-label {
  font-weight: bold;
  color: #303133;
  margin-right: 10px;
}

.detail-value {
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .diet-log-container {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .search-filter {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .record-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .record-actions {
    align-self: flex-end;
  }
}
</style>
