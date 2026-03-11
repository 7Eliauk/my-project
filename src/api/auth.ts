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
export const login = (data: {
  username?: string
  email?: string
  password: string
}) => {
  return request.post('/api/auth/login', data)
}

// 退出登录
export const logout = () => {
  return request.post('/api/auth/logout')
}
