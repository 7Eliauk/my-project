import request from '../utils/request'

//饮食接口类型
export interface mealLog{
  userId?: number
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
  createTime?: string
}
// 新增饮食日志
export function addMealLog(data:mealLog) {
  return request({
    url: '/api/meal-log/add',
    method: 'post',
    data
  })
}

// 查询单条饮食日志
export function getMealLog(id: number) {
  return request({
    url: `/api/meal-log/${id}`,
    method: 'get'
  })
}

// 查询饮食日志列表
export function getMealLogList(logDate?: string) {
  return request({
    url: '/api/meal-log/list',
    method: 'get',
    params: { logDate }
  })
}

// 修改饮食日志
export function updateMealLog(id: number, data:mealLog) {
  return request({
    url: `/api/meal-log/${id}`,
    method: 'put',
    data
  })
}

// 删除饮食日志
export function deleteMealLog(id: number) {
  return request({
    url: `/api/meal-log/${id}`,
    method: 'delete'
  })
}
