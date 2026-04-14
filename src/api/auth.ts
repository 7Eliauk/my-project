import request from '../utils/request'

// 发送注册验证码
export const sendRegisterCode = (email: string) => {
  return request.post('/api/auth/send-email-code', { email })
}

// 用户注册
export const register = (data: {
  username: string
  password: string
  email: string
  code: string
}) => {
  return request.post('/api/auth/register', data)
}
// 用户登录
export const login = (data: { username?: string; email?: string; password: string }) => {
  return request.post('/api/auth/login', data)
}

// 退出登录
export const logout = () => {
  return request.post('/api/auth/logout')
}

// 发送重置密码验证码
export const sendResetPwdCode = (email: string) => {
  return request.post('/api/auth/send-reset-pwd-code', { email })
}

// 重置密码
export const resetPassword = (data: {
  email: string
  code: string
  newPassword: string
}) => {
  return request.post('/api/auth/reset-password', data)
}

//食物识别
export function recognizeDish(file: any) {
  //1、创建Formdata()
  const formData = new FormData()
  //2、把图片放进FormData
  formData.append('images', file)

  return request({
    url: '/api/dish/recognize',
    method: 'post',
    data: formData,
  })
}
//获取用户基础信息
export function getUserInfo(userId: string) {
  return request({
    url: `/api/user-center/info/${userId}`,
    method: 'get',
  })
}

//获取用户身体状况
export function getUserHealthInfo(userId: string) {
  return request({
    url: `/api/user-center/health/${userId}`,
    method: 'get',
  })
}

//获取用户身体目标
export function getUserGoalInfo(userId: string) {
  return request({
    url: `/api/user-center/goal/${userId}`,
    method: 'get',
  })
}

//保存修改用户基础信息
export function saveBasicInfo(userId: string, data: any) {
  return request({
    url: `/api/user-center/info/${userId}`,
    method: 'post',
    data,
  })
}
//保存修改用户健康信息
export function saveHealthInfo(userId: string, data: any) {
  return request({
    url: `/api/user-center/health/${userId}`,
    method: 'post',
    data,
  })
}
//保存修改用户目标信息
export function saveGoalInfo(userId: string, data: any) {
  return request({
    url: `/api/user-center/goal/${userId}`,
    method: 'post',
    data,
  })
}
//上传头像
export function handleAvatarUpload(userId: string, file: any) {
  const formData = new FormData() 
  //要求传userId和file
  formData.append('userId', userId)
  formData.append('file', file)
  
  return request({
    url: `/api/user-center/avatar/upload`,
    method: 'post',
    data: formData
  })
}