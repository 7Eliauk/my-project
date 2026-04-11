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
      <el-button type="primary" @click="fetchRecords">
        <el-icon><Search /></el-icon> 查询
      </el-button>
      <el-button @click="clearDateFilter">
        <el-icon><RefreshLeft /></el-icon> 重置
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
                  record.mealTime === '早餐' ||
                  record.mealTime === '午餐' ||
                  record.mealTime === '晚餐'
                "
              />
              <IceCream v-else />
            </el-icon>
            <span class="meal-type">{{ record.mealTime }}</span>
            <span class="record-date">{{ formatDate(record.logDate) }}</span>
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

        <!-- 食物信息 -->
        <div class="section">
          <h3 class="section-title">
            <el-icon><Goods /></el-icon> 食物信息
          </h3>
          <div class="food-info">
            <div class="food-item">
              <span class="food-label">食物名称：</span>
              <span class="food-value">{{ record.foodName }}</span>
            </div>
            <div class="food-item">
              <span class="food-label">食用量：</span>
              <span class="food-value">{{ record.quantity }} 克</span>
            </div>
            <div class="food-item">
              <span class="food-label">烹饪方式：</span>
              <span class="food-value">{{ record.cookingMethod || '未设置' }}</span>
            </div>
          </div>
        </div>

        <!-- 营养信息 -->
        <div class="section">
          <h3 class="section-title">
            <el-icon><Goods /></el-icon> 营养信息
          </h3>
          <div class="nutrition-preview">
            <div class="nutrition-item">
              <span class="nutrition-label">热量：</span>
              <span class="nutrition-value">{{ record.calories }} kcal</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">蛋白质：</span>
              <span class="nutrition-value">{{ record.protein }} g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">脂肪：</span>
              <span class="nutrition-value">{{ record.fat }} g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">碳水化合物：</span>
              <span class="nutrition-value">{{ record.carbs }} g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">膳食纤维：</span>
              <span class="nutrition-value">{{ record.fiber }} g</span>
            </div>
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
              <span class="detail-value">{{ viewData.logDate }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="detail-label">餐次：</span>
              <span class="detail-value">{{ viewData.mealTime }}</span>
            </div>
          </el-col>
        </el-row>

        <!-- 食物信息 -->
        <el-divider content-position="left">食物信息</el-divider>
        <div class="food-info-detail">
          <div class="detail-item">
            <span class="detail-label">食物名称：</span>
            <span class="detail-value">{{ viewData.foodName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">食用量：</span>
            <span class="detail-value">{{ viewData.quantity }} 克</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">烹饪方式：</span>
            <span class="detail-value">{{ viewData.cookingMethod || '未设置' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ viewData.createTime }}</span>
          </div>
        </div>

        <!-- 营养分析 -->
        <el-divider content-position="left">营养分析</el-divider>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="nutrition-label">热量</div>
            <div class="nutrition-value">{{ viewData.calories }} kcal</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">蛋白质</div>
            <div class="nutrition-value">{{ viewData.protein }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">脂肪</div>
            <div class="nutrition-value">{{ viewData.fat }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">碳水化合物</div>
            <div class="nutrition-value">{{ viewData.carbs }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">膳食纤维</div>
            <div class="nutrition-value">{{ viewData.fiber }} g</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">维生素</div>
            <div class="nutrition-value">{{ viewData.vitamins }}</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-label">矿物质</div>
            <div class="nutrition-value">{{ viewData.minerals }}</div>
          </div>
        </div>

        <!-- 个人备注 -->
        <el-divider content-position="left">个人备注</el-divider>
        <div class="remark-content">
          {{ viewData.remark || '暂无备注' }}
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
                v-model="formData.logDate"
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
                <el-option label="早餐" value="早餐" />
                <el-option label="午餐" value="午餐" />
                <el-option label="晚餐" value="晚餐" />
                <el-option label="加餐" value="加餐" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 食物信息 -->
        <el-divider content-position="left">食物信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="食物名称" prop="foodName">
              <el-input
                v-model="formData.foodName"
                placeholder="请输入食物名称"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="食用量 (克)" prop="quantity">
              <el-input-number v-model="formData.quantity" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="烹饪方式" prop="cookingMethod">
              <el-input
                v-model="formData.cookingMethod"
                placeholder="请输入烹饪方式"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 营养分析（自动计算，可手动调整） -->
        <el-divider content-position="left">营养分析</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="热量 (kcal)" prop="calories">
              <el-input-number v-model="formData.calories" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="蛋白质 (g)" prop="protein">
              <el-input-number v-model="formData.protein" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="脂肪 (g)" prop="fat">
              <el-input-number v-model="formData.fat" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="碳水化合物 (g)" prop="carbs">
              <el-input-number v-model="formData.carbs" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="膳食纤维 (g)" prop="fiber">
              <el-input-number v-model="formData.fiber" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维生素" prop="vitamins">
              <el-input
                v-model="formData.vitamins"
                placeholder="如:维生素A、维生素C等"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="矿物质" prop="minerals">
              <el-input
                v-model="formData.minerals"
                placeholder="如：钙、铁、锌等"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 个人备注 -->
        <el-divider content-position="left">个人备注</el-divider>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入用餐感受、特殊需求或备注信息"
            :rows="4"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Edit,
  Delete,
  IceCream,
  Goods,
  Calendar,
  RefreshLeft,
} from '@element-plus/icons-vue'
import {
  addMealLog,
  getMealLog,
  getMealLogList,
  updateMealLog,
  deleteMealLog,
} from '../api/mealLog'

// 类型定义
// 定义饮食记录类型
interface DietRecord {
  id: number
  userId: number
  logDate: string
  mealTime: string
  foodName: string
  quantity: number
  cookingMethod: string
  calories: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  vitamins: string
  minerals: string
  remark: string
  createTime: string
}
//定义表单类型
interface FormData {
  id: number
  logDate: string
  mealTime: string
  foodName: string
  quantity: number
  cookingMethod: string
  calories: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  vitamins: string
  minerals: string
  remark: string
}

// 初始化为空数组，从API获取数据,<DietRecord[]>为定义records为DietRecord类型数组，并初始化为空数组
const records = ref<DietRecord[]>([])

// 搜索和筛选
const selectedDate = ref('')

// 对话框状态
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEditing = ref(false)
//引入Elform组件，统一管理表单数据，告诉ts formRef为Elform,ref一开始为空渲染完成后才是表单实例
const formRef = ref<typeof import('element-plus')['ElForm'] | null>(null)

// 查看详情数据
const viewData = ref<DietRecord>({
  id: 0,
  userId: 0,
  logDate: '',
  mealTime: '早餐',
  foodName: '',
  quantity: 0,
  cookingMethod: '',
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  fiber: 0,
  vitamins: '',
  minerals: '',
  remark: '',
  createTime: '',
})

// 动态对话框标题
const dialogTitle = computed(() => {
  return isEditing.value ? '编辑饮食记录' : '添加饮食记录'
})

// 表单数据
const formData = ref<FormData>({
  id: 0,
  logDate: new Date().toISOString().split('T')[0] as string, //获取今日日期（字符串形式）
  mealTime: '早餐',
  foodName: '',
  quantity: 0,
  cookingMethod: '',
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  fiber: 0,
  vitamins: '',
  minerals: '',
  remark: '',
})

// 表单验证规则
const formRules = ref({
  logDate: [{ required: true, message: '请选择记录日期', trigger: 'change' }],
  mealTime: [{ required: true, message: '请选择餐次', trigger: 'change' }],
  foodName: [{ required: true, message: '请输入食物名称', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入食用量', trigger: 'change' }],
  calories: [{ required: true, message: '请输入热量', trigger: 'change' }],
  protein: [{ required: true, message: '请输入蛋白质含量', trigger: 'change' }],
  fat: [{ required: true, message: '请输入脂肪含量', trigger: 'change' }],
  carbs: [{ required: true, message: '请输入碳水化合物含量', trigger: 'change' }],
  fiber: [{ required: true, message: '请输入膳食纤维含量', trigger: 'change' }],
})

// 格式化为YYYY-MM-DD
const formatDate = (dateString: string) => {
  return dateString
}

// 查看详情
const handleViewRecord = (record: any) => {
  viewData.value = JSON.parse(JSON.stringify(record) || '{}')
  viewDialogVisible.value = true
}

// 添加记录
const handleAddRecord = () => {
  isEditing.value = false
  formData.value = {
    id: 0,
    logDate: new Date().toISOString().split('T')[0] as string,
    mealTime: '早餐',
    foodName: '',
    quantity: 0,
    cookingMethod: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    vitamins: '',
    minerals: '',
    remark: '',
  }
  dialogVisible.value = true
}

// 编辑记录
const handleEditRecord = (record: any) => {
  isEditing.value = true
  //深拷贝，表单和列表数据互不干扰
  formData.value = JSON.parse(JSON.stringify(record) || '{}')
  dialogVisible.value = true
}

// 删除记录
const handleDeleteRecord = (id: number) => {
  ElMessageBox.confirm('确定要删除这条记录吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await deleteMealLog(id)
      //过滤掉filter()内为false的
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
    //获取登录时的userId
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
          // 清理无效的用户信息
          localStorage.removeItem('userInfo')
        }
      }
    }


    if (!userId) {
      ElMessage.warning('请先登录')
      return
    }
    //完整数据表单
    const fullRecord = {
      ...formData.value,
      userId,
      createTime: new Date().toISOString(),
    }
    if (isEditing.value) {
      await updateMealLog(formData.value.id, fullRecord)
      //findIndex,在数组里找符合条件的，找到返回索引号，未找到返回-1
      const index = records.value.findIndex((record) => record.id === formData.value.id)
      if (index !== -1) {
        records.value[index] = fullRecord
      }
      ElMessage.success('更新成功')
    } else {
      const response = await addMealLog(fullRecord)
      const newRecord = {
        ...fullRecord,
        id: response.data,
      }
      records.value.unshift(newRecord)
      ElMessage.success('添加成功')
    }

    dialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 查询记录
const fetchRecords = async () => {
  try {
    const response = await getMealLogList(selectedDate.value)
    records.value = response.data
    ElMessage.success('查询成功')
  } catch (error) {
    console.error('查询失败:', error)
    ElMessage.error('查询失败，请重试')
  }
}

// 重置日期筛选
const clearDateFilter = () => {
  selectedDate.value = ''
  fetchRecords()
}

// 页面加载时获取数据
onMounted(() => {
  fetchRecords()
})
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
.remark-content {
  padding: 15px;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 8px;
  color: #277fff;
  line-height: 1.6;
  margin-top: 10px;
  /* 让用户鼠标在备注输入框上面依旧能正常看见鼠标 */
cursor: pointer !important;
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

/* 食物信息样式 */
.food-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
}

.food-item:last-child {
  border-bottom: none;
}

.food-label {
  font-weight: bold;
  color: #303133;
}

.food-value {
  color: #606266;
}

/* 营养预览样式 */
.nutrition-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.nutrition-preview .nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0;
  border-radius: 6px;
}

.nutrition-preview .nutrition-label {
  color: #67c23a;
  font-size: 14px;
}

.nutrition-preview .nutrition-value {
  color: #389e0d;
  font-size: 14px;
  font-weight: bold;
}

/* 详情页食物信息样式 */
.food-info-detail {
  margin-top: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
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
